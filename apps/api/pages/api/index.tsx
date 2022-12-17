import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import resolvers from '../../graphql/resolvers';
import typeDefs from '../../graphql/schema';
import { WALLET_WHITELIST } from 'data'
import { Profile } from 'db';

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers
});

export default startServerAndCreateNextHandler(server, {
    context: async (req) => {
        // get the wallet address from the headers
        const walletAddress = req.headers.authorization || '';
        const profile = await Profile.findOne({
            where: {
                owner: walletAddress
            }
        });

        return {
            walletAddress,
            profile,
            isInWhiteList: WALLET_WHITELIST.includes(walletAddress) // 白名单钱包优先使用传过来的profileId
        };
    }
});
