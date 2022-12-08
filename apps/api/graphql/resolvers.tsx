import { Profile } from 'db';

const resolvers = {
  Query: {
    Profiles: () => {
      return Profile.findAll();
    },
    Profile: (_, { id }) => {
      return Profile.findByPk(id);
    }
  }
}

export default resolvers
