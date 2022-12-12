import {
  Collect,
  Comment,
  Follow,
  Mirror,
  Post,
  Profile,
} from 'db';
import { QueryTypes } from 'sequelize';

import sequelize from '../../../packages/db/connection';
import summary30DaysSql from '../queries/summary30Days';

const resolvers = {
  Query: {
    // CurrentUser: (_, __, { profile }) => {
    //   return profile;
      CurrentUser: () => {
        const currentUserId = '104814'; //TODO: Currently hard coded
        return Profile.findByPk(currentUserId);
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
      return Follow.findAll({ where: { profileId: '80959' } }); //TODO: add paging
    },
    Follow: (_, { profileId, follower }) => {
      return Follow.findOne({ where: { profileId: profileId + '', follower: follower + '' } });
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

    Summary30Days: (_, { profileId }) => {
      profileId = '29617';  //TODO: Use parameter value, with correct data type

      const summary_30_days = sequelize.query(
        summary30DaysSql,
        {
          replacements: { profile_id: profileId },
          type: QueryTypes.SELECT,
          raw: true,
          plain: true 
        }
      );
      return summary_30_days;
    },

  }
}

export default resolvers
