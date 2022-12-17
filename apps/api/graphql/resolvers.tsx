import {
  Collect,
  Comment,
  Follow,
  Mirror,
  Post,
  Profile,
} from 'db';
import { QueryTypes, Op } from 'sequelize';

import sequelize from '../../../packages/db/connection';
import summary30DaysSql from '../queries/summary30Days';

const resolvers = {
  Query: {
    CurrentUser: async (_, { profileId }, { profile, isInWhiteList }) => {
      //const currentUserId = '104814'; //TODO: Currently hard coded
      if (isInWhiteList && profileId) return await Profile.findByPk(profileId);
      return profile;
    },
    Profiles: () => {
      return Profile.findAll();
    },
    Profile: (_, { id }) => {
      return Profile.findByPk(id);
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

    Summary30Days: (_, { profileId }, { profile, isInWhiteList }) => {
      //profileId = '29617';  //TODO: Use parameter value, with correct data type

      if (isInWhiteList && profileId) {
        return sequelize.query(
            summary30DaysSql,
            {
              replacements: { profile_id: profileId },
              type: QueryTypes.SELECT,
              raw: true,
              plain: true
            }
        );
      }

      if (profile) {
        return sequelize.query(
            summary30DaysSql,
            {
              replacements: { profile_id: profile.profileId },
              type: QueryTypes.SELECT,
              raw: true,
              plain: true
            }
        );
      }
    },

  }
}

export default resolvers
