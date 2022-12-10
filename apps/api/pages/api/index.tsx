import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { GraphQLError } from 'graphql';
import resolvers from '../../graphql/resolvers';
import typeDefs from '../../graphql/schema';
import { Profile } from 'db';

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

export default startServerAndCreateNextHandler(server, {
    context: async (req, _res) => {
        // get the wallet address from the headers
        const walletAddress = req.headers.authorization || '';
        const profile = Profile.findOne({
            where: {
                owner: walletAddress
            }
        })

        // optionally block the user
        // we could also check user roles/permissions here
        if (!walletAddress || !profile) {
            // throwing a `GraphQLError` here allows us to specify an HTTP status code,
            // standard `Error`s will have a 500 status code by default
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }

        // add the user to the context
        return { walletAddress, profile };
    }
});
