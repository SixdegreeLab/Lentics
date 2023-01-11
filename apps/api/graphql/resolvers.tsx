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
} from 'db';
import { QueryTypes, Op } from 'sequelize';

import sequelize from '../../../packages/db/connection';

const resolvers = {
  Query: {
    Profile: async (_, { address }, { walletWhitelist }) => {
      const profile: any = await Profile.findOne({
        where: {
          owner: address
        }
      });
      return {
        profile,
        isInWhiteList: true, //walletWhitelist.includes(address), 20230109: 暂时屏蔽白名单的检查
        whitelist: walletWhitelist
      };
    },
    Profiles: async (_, { addresses }) => {
      return Profile.findAll({
        where: {
          owner: addresses
        }
      });
    },
    ProfileCount: async (_, { address, startDate, endDate }) => {
      const profile: any = await Profile.findOne({
        where: {
          owner: address
        }
      });
      
      if (profile) {
        return {
          owner: address,
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
    Posts: (_, { profileId, startDate, endDate }) => {
      return Post.findAll({
        where: {
          profileId,
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        }
      });
    },
    Post: (_, { profileId, pubId }) => {
      return Post.findOne({ where: { profileId: profileId, pubId: pubId } }); //TODO: remove type convertion here once db is updated.
    },
    Follows: (_, { profileIds, startDate, endDate }) => {
      //return Follow.findAll();
      //return Follow.findAll({ where: { profileIds: '80959' } }); //TODO: add paging
      return Follow.findAll({
        where: {
          profileIds: {
            [Op.overlap]: profileIds
          },
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        }
      })
    },
    Follow: (_, { profileId, follower }) => {
      return Follow.findOne({
        where: {
          profileIds: {
            [Op.overlap]: [profileId]
          },
          follower: follower
        } });
    },
    Comments: (_, { profileId, startDate, endDate }) => {
      return Comment.findAll({
        where: {
          [Op.or]: [
            { profileId },
            { profileIdPointed: profileId }
          ],
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        }
      }); //TODO: add paging
    },
    Comment: (_, { profileId, pubId }) => {
      return Comment.findOne({ where: { profileId: profileId + '', pubId: pubId + '' } }); //TODO: remove type convertion here once db is updated.
    },
    Mirrors: (_, { profileId, startDate, endDate }) => {
      return Mirror.findAll({
        where: {
          [Op.or]: [
            { profileId },
            { profileIdPointed: profileId }
          ],
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        }
      }); //TODO: add paging
    },
    Mirror: (_, { profileId, pubId }) => {
      return Mirror.findOne({ where: { profileId: profileId + '', pubId: pubId + '' } }); //TODO: remove type convertion here once db is updated.
    },
    Collects: (_, { profileId, startDate, endDate }) => {
      return Collect.findAll({
        where: {
          [Op.or]: [
            { profileId },
            { rootProfileId: profileId }
          ],
          blockTime: {
            [Op.between]: [(new Date(startDate)), (new Date(endDate))]
          }
        }
      }); //TODO: add paging
    },
    Collect: (_, { profileId, pubId }) => {
      return Collect.findOne({ where: { profileId: profileId + '', pubId: pubId + '' } }); //TODO: remove type convertion here once db is updated.
    },

    Summary30Days: async (_, { address, date }) => {
      const profile: any = await Profile.findOne({
        where: {
          owner: address
        }
      });
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
    DailyChange: async (_, { address, date }) => {
      const profile: any = await Profile.findOne({
        where: {
          owner: address
        }
      });
      if (profile) {
        return sequelize.query(
          engagementChangeSql,
          {
            replacements: { profile_id: profile.profileId, current_date: date },
            type: QueryTypes.SELECT,
            raw: true,
            plain: false
          }
        );
      }
    },
    DailyStatistics: async (_, { address }) => {
      const profile: any = await Profile.findOne({
        where: {
          owner: address
        }
      });
      if (profile) {
        return sequelize.query(
          engagementDailySql,
          {
            replacements: { profile_id: profile.profileId },
            type: QueryTypes.SELECT,
            raw: true,
            plain: false
          }
        );
      }
    },
    MonthlyStatistics: async (_, { address, date }) => {
      const profile: any = await Profile.findOne({
        where: {
          owner: address
        }
      });
      if (profile) {
        return sequelize.query(
          engagementMonthlySql,
          {
            replacements: { profile_id: profile.profileId, date_of_month: date },
            type: QueryTypes.SELECT,
            raw: true,
            plain: true
          }
        );
      }
    },
    ProfileTopFollower: async (_, { address, date }) => {
      const profile: any = await Profile.findOne({
        where: {
          owner: address
        }
      });
      if (profile) {
        return sequelize.query(
          profileTopFollowerSql,
          {
            replacements: { profile_id: profile.profileId, date_of_month: date },
            type: QueryTypes.SELECT,
            raw: true,
            plain: true
          }
        );
      }
    }

  }
}

export default resolvers
