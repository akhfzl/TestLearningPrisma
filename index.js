const { graphqlUploadExpress } = require('graphql-upload-minimal');
const { expressMiddleware } =  require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { ApolloServer } = require('@apollo/server');
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema } = require('graphql-tools');
const { ApolloServerErrorCode } = require('@apollo/server/errors');
const { typedefs, resolvers, auth } = require('./graphql');
const express = require('express');
const bodyParser = require('body-parser')
const http = require('http');
require('dotenv').config()

const startServer = async() => {
    const app = express();
    app.use(graphqlUploadExpress());
    app.use(express.static('public'));

    const httpServer = http.createServer(app);

    const makeExecutable = makeExecutableSchema({ typeDefs: typedefs, resolvers: resolvers })
    const protectedAuth = applyMiddleware(makeExecutable, auth)

    const server = new ApolloServer({ 
        schema: protectedAuth,
        // resolvers: resolvers,
        // typeDefs: typedefs,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        csrfPrevention: false,
        formatError: (formattedError, error) => {
            // Return a different error message
            if (
              formattedError.extensions.code ===
              ApolloServerErrorCode.GRAPHQL_VALIDATION_FAILED
            ) {
              return {
                ...formattedError,
                message: "Your query doesn't match the schema. Try double-checking it!",
              };
            }
            if (error) {
                return {
                    ...error
                }
            }
        }
    })
    
    await server.start();

    app.use(
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                return { token: req.headers.authorization }
            }
        }),
    )
    
    await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
}

startServer();