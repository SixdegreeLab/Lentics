import {
  Collect,
  Comment,
  Follow,
  Mirror,
  Post,
  Profile,
  engagementCounterSql,
  engagementChangeSql,
  engagementDailySql
} from 'db';
import { QueryTypes, Op } from 'sequelize';

import sequelize from '../../../packages/db/connection';

const resolvers = {
  Query: {
    Profile: async (_, { address }, { walletWhitelist }) => {
      const profile = await Profile.findOne({
        where: {
          owner: address
        }
      });
      return {
        profile,
        isInWhiteList: walletWhitelist.includes(profile?.owner),
        whitelist: walletWhitelist
      };
    },
    Posts: () => {
      return Post.findAll();
    },
    Post: (_, { profileId, pubId }) => {
      return Post.findOne({ where: { profileId: profileId + '', pubId: pubId + '' } }); //TODO: remove type convertion here once db is updated.
    },
    Follows: () => {
      //return Follow.findAll();
      //return Follow.findAll({ where: { profileIds: '80959' } }); //TODO: add paging
      return Follow.findAll({
        where: {
          profileIds: {
            [Op.overlap]: [101051]
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
    Comments: () => {
      return Comment.findAll({ where: { profileIdPointed: '57662' } }); //TODO: add paging
    },
    Comment: (_, { profileId, pubId }) => {
      return Comment.findOne({ where: { profileId: profileId + '', pubId: pubId + '' } }); //TODO: remove type convertion here once db is updated.
    },
    Mirrors: () => {
      return Mirror.findAll({ where: { profileIdPointed: '57662' } }); //TODO: add paging
    },
    Mirror: (_, { profileId, pubId }) => {
      return Mirror.findOne({ where: { profileId: profileId + '', pubId: pubId + '' } }); //TODO: remove type convertion here once db is updated.
    },
    Collects: () => {
      return Collect.findAll({ where: { profileId: '57662' } }); //TODO: add paging
    },
    Collect: (_, { profileId, pubId }) => {
      return Collect.findOne({ where: { profileId: profileId + '', pubId: pubId + '' } }); //TODO: remove type convertion here once db is updated.
    },

    Summary30Days: async (_, { address }) => {
      const profile = await Profile.findOne({
        where: {
          owner: address
        }
      });
      if (profile) {
        return sequelize.query(
          engagementCounterSql,
          {
            replacements: { profile_id: profile.profileId },
            type: QueryTypes.SELECT,
            raw: true,
            plain: true
          }
        );
      }
    },
    DailyChange: async (_, { address }) => {
      const profile = await Profile.findOne({
        where: {
          owner: address
        }
      });
      if (profile) {
        return sequelize.query(
          engagementChangeSql,
          {
            replacements: { profile_id: profile.profileId },
            type: QueryTypes.SELECT,
            raw: true,
            plain: false
          }
        );
      }
    },
    DailyStatistics: async (_, { address }) => {
      const profile = await Profile.findOne({
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
    }

  }
}

export default resolvers
