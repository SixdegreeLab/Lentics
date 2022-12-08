import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import resolvers from '../../graphql/resolvers';
import typeDefs from '../../graphql/schema';

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

export default startServerAndCreateNextHandler(server);
