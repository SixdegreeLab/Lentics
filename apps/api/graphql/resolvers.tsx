import {
  Collect,
  Comment,
  Follow,
  Mirror,
  Post,
  Profile,
} from 'db';

const resolvers = {
  Query: {
    CurrentUser: (_, __, { profile }) => {
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
  }
}

export default resolvers
