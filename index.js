const { graphqlUploadExpress } = require('graphql-upload-minimal');
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const graphql = require('./graphql');
const express = require('express');

const startServer = async() => {
    const server = new ApolloServer({ 
        typeDefs: graphql.typedefs, 
        resolvers: graphql.resolvers,
        plugins: [ApolloServerPluginLandingPageLocalDefault({ embed:true })],
        // csrfPrevention: true,
        // cache: 'bounded',
    })

    await server.start()
    
    const app = express();
    app.use(graphqlUploadExpress());
    app.use(express.static('public'));

    server.applyMiddleware({ app })
    
    app.listen(8000, () => {
        console.log(`🚀 Server running at http://localhost:8000${server.graphqlPath}`)
    })
}

startServer();