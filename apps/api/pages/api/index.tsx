import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import Cors from 'cors'

import resolvers from '../../graphql/resolvers';
import typeDefs from '../../graphql/schema';
import { WALLET_WHITELIST, CORS_ORIGINS } from 'data'
import { Profile } from 'db';

// Initializing the cors middleware
// You can read more about the available options here: https://github.com/expressjs/cors#configuration-options

const cors = Cors({
    origin: CORS_ORIGINS,
})

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers
});

function runMiddleware(req, res, fn) {
    return (new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    }))
}

const graphqlHandler = startServerAndCreateNextHandler(server, {
    context: async (req, _res) => {
        // get the wallet address from the headers
        const walletAddress = req.headers.authorization || '';

        return {
            walletAddress,
            walletWhitelist: WALLET_WHITELIST
        };
    }
});

async function customHandler(req, res) {
    await runMiddleware(req, res, cors);
    await graphqlHandler(req, res)
}

export default customHandler;
