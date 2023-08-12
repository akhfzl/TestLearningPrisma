const app = require('express')();
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const graphql = require('./graphql');

const server = new ApolloServer({ typeDefs: graphql.typedefs, resolvers: graphql.resolvers})

app.listen(8000, () => console.log('run it'));

server.start().then(res => {
    server.applyMiddleware({ app })
})