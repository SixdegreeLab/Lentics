import {
  Collect,
  Comment,
  Follow,
  Mirror,
  Post,
  Profile,
  engagementCounterSql,
  engagementChangeSql,
  engagementDailySql,
  engagementMonthlySql,
  profileTopFollowerSql,
  RevenueSupportersSql,
  RevenueSummarySql,
  RevenueAmountByTokenSql,
  RevenuePublicationSql,
  topEngagementPostsSql,
  topCollectedPostsSql
} from 'db';
import { QueryTypes, Op } from 'sequelize';

import sequelize from '../../../packages/db/connection';

const profileFilter = (addressOrHandle: string) => {
  if (addressOrHandle.toLowerCase().startsWith('0x')) {
    return { owner: addressOrHandle }
  } else if (addressOrHandle.toLowerCase().endsWith('.lens')) {
    return  { handle: addressOrHandle }
  } else {
    return { handle: `${addressOrHandle}.lens` }
  }
}

const getObjectWithProfileId = async ({ addressOrHandle, profileId }) => {
  if (!addressOrHandle && !profileId) {
    return null
  }
  
  if (profileId) {
    return { profileId }
  }
  
  return await Profile.findOne({
    where: profileFilter(addressOrHandle),
    order: [
      ['default', 'desc']
    ]
  })
}

const resolvers = {
  Query: {
    Profile: async (_, { addressOrHandle }, { walletWhitelist }) => {
      const profile: any = await Profile.findOne({
        where: profileFilter(addressOrHandle),
        order: [
          ['default', 'desc']
        ]
      });
      return {
        profile,
        isInWhiteList: true, //walletWhitelist.includes(addressOrHandle), 20230109: 暂时屏蔽白名单的检查
        whitelist: walletWhitelist
      };
    },
    Profiles: async (_, { addresses, paginate={ offset: 0, limit: 30 } }) => {
      return Profile.findAll({
        where: {
          owner: addresses
        },
        order: [
          ['default', 'desc']
        ],
        ...paginate
      });
    },
    ProfileCount: async (_, { addressOrHandle, startDate, endDate }) => {
      const profile: any = await Profile.findOne({
        where: profileFilter(addressOrHandle),
        order: [
          ['default', 'desc']
        ]
      });
      
      if (profile) {
        return {
          owner: addressOrHandle,
          profileId: profile.profileId,
          postCount: Post.count({
            where: {
              profileId: profile.profileId,
              blockTime: {
                [Op.between]: [(new Date(startDate)), (new Date(endDate))]
              }
            }
          }),
          followCount: Follow.count({
            where: {
              profileIds: {
                [Op.overlap]: [profile.profileId]
              },
              blockTime: {
                [Op.between]: [(new Date(startDate)), (new Date(endDate))]
              }
            }
          }),
          commentCount: Comment.count({
            where: {
              [Op.or]: [
                { profileId: profile.profileId },
                { profileIdPointed: profile.profileId }
              ],
              blockTime: {
                [Op.between]: [(new Date(startDate)), (new Date(endDate))]
              }
            }
          }),
          mirrorCount: Mirror.count({
            where: {
              [Op.or]: [
                { profileId: profile.profileId },
                { profileIdPointed: profile.profileId }
              ],
              blockTime: {
                [Op.between]: [(new Date(startDate)), (new Date(endDate))]
              }
            }
          }),
          collectCount: Collect.count({
            where: {
              [Op.or]: [
                { profileId: profile.profileId },
                { rootProfileId: profile.profileId }
              ],
              blockTime: {
                [Op.between]: [(new Date(startDate)), (new Date(endDate))]
              }
            }
          })
        }
      }
    },
    Posts: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 30 } }) => {
      return Post.findAll({
        where: {
          profileId,
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        },
        order: [
          ['blockTime', 'desc']
        ],
        ...paginate
      });
    },
    Followers: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 30 } }) => {
      return Follow.findAll({
        where: {
          profileId,
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        },
        order: [
          ['blockTime', 'desc']
        ],
        ...paginate
      })
    },
    Comments: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 30 } }) => {
      return Comment.findAll({
        where: {
          profileId,
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        },
        order: [
          ['blockTime', 'desc']
        ],
        ...paginate
      });
    },
    Commented: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 30 } }) => {
      return Comment.findAll({
        where: {
          profileIdPointed: profileId,
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        },
        order: [
          ['blockTime', 'desc']
        ],
        ...paginate
      });
    },
    Mirrored: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 30 } }) => {
      return Mirror.findAll({
        where: {
          profileIdPointed: profileId,
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        },
        order: [
          ['blockTime', 'desc']
        ],
        ...paginate
      });
    },
    Mirrors: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 30 } }) => {
      return Mirror.findAll({
        where: {
          profileId,
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        },
        order: [
          ['blockTime', 'desc']
        ],
        ...paginate
      });
    },
    Collected: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 30 } }) => {
      return Collect.findAll({
        where: {
          [Op.or]: [
            { profileId },
            { rootProfileId: profileId }
          ],
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        },
        order: [
          ['blockTime', 'desc']
        ],
        ...paginate
      });
    },
    Collects: async (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 30 } }) => {
      const profile: any = await Profile.findOne({
        where: {
          profileId
        },
        order: [
          ['default', 'desc']
        ]
      });
      return Collect.findAll({
        where: {
          collector: profile.owner,
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        },
        order: [
          ['blockTime', 'desc']
        ],
        ...paginate
      });
    },

    Summary30Days: async (_, { addressOrHandle, profileId, date }) => {
      const profile: any = await getObjectWithProfileId({ addressOrHandle, profileId });
      if (profile) {
        return sequelize.query(
          engagementCounterSql,
          {
            replacements: { profile_id: profile.profileId, current_date: date },
            type: QueryTypes.SELECT,
            raw: true,
            plain: true
          }
        );
      }
    },
    DailyChange: async (_, { addressOrHandle, profileId, startDate, endDate }) => {
      const profile: any = await getObjectWithProfileId({ addressOrHandle, profileId });
      if (profile) {
        return sequelize.query(
          engagementChangeSql,
          {
            replacements: { profile_id: profile.profileId, startDate, endDate },
            type: QueryTypes.SELECT,
            raw: true,
            plain: false
          }
        );
      }
    },
    MonthlyStatistics: async (_, { addressOrHandle, profileId, startDate, endDate }) => {
      const profile: any = await getObjectWithProfileId({ addressOrHandle, profileId });
      if (profile) {
        return sequelize.query(
          engagementMonthlySql,
          {
            replacements: { profile_id: profile.profileId, startDate, endDate },
            type: QueryTypes.SELECT,
            raw: true,
            plain: true
          }
        );
      }
    },
    ProfileTopFollower: async (_, { addressOrHandle, profileId, startDate, endDate }) => {
      const profile: any = await getObjectWithProfileId({ addressOrHandle, profileId });
      if (profile) {
        return sequelize.query(
          profileTopFollowerSql,
          {
            replacements: { profile_id: profile.profileId, startDate, endDate },
            type: QueryTypes.SELECT,
            raw: true,
            plain: true
          }
        );
      }
    },
    RevenueSupporters: async (_, { addressOrHandle, profileId, startDate, endDate, paginate={ offset: 0, limit: 50 } }) => {
      const profile: any = await getObjectWithProfileId({ addressOrHandle, profileId });
      if (profile) {
        return sequelize.query(
          RevenueSupportersSql,
          {
            replacements: { profile_id: profile.profileId, startDate, endDate, ...paginate },
            type: QueryTypes.SELECT,
            raw: true,
            plain: false
          }
        );
      }
    },
    RevenueSummary: async (_, { addressOrHandle, profileId, startDate, endDate }) => {
      const profile: any = await getObjectWithProfileId({ addressOrHandle, profileId });
      if (profile) {
        const revenueSummary = await sequelize.query(
          RevenueSummarySql,
          {
            replacements: { profile_id: profile.profileId, startDate, endDate },
            type: QueryTypes.SELECT,
            raw: true,
            plain: true
          }
        );
        const revenueAmountByToken = await sequelize.query(
          RevenueAmountByTokenSql,
          {
            replacements: { profile_id: profile.profileId, startDate, endDate },
            type: QueryTypes.SELECT,
            raw: true,
            plain: false
          }
        );
        return {
          ...revenueSummary,
          revenueAmountByToken
        }
      }
    },

    RevenuePublications: async (_, { addressOrHandle, profileId, startDate, endDate, paginate={ offset: 0, limit: 50 } }) => {
      const profile: any = await getObjectWithProfileId({ addressOrHandle, profileId });
      if (profile) {
        return sequelize.query(
          RevenuePublicationSql,
          {
            replacements: { profile_id: profile.profileId, startDate, endDate, ...paginate },
            type: QueryTypes.SELECT,
            raw: true,
            plain: false
          }
        );
      }
    },
    TopEngagementPosts: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 10 } }) => {
      return sequelize.query(
        topEngagementPostsSql,
        {
          replacements: { profile_id: profileId, startDate, endDate, ...paginate },
          type: QueryTypes.SELECT,
          raw: true,
          plain: false
        }
      );
    },
    TopCollectedPosts: (_, { profileId, startDate, endDate, paginate={ offset: 0, limit: 10 } }) => {
      return sequelize.query(
        topCollectedPostsSql,
        {
          replacements: { profile_id: profileId, startDate, endDate, ...paginate },
          type: QueryTypes.SELECT,
          raw: true,
          plain: false
        }
      );
    },

  }
}

export default resolvers
