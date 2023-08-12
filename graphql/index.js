const { gql } = require('apollo-server-express');
const { merge } = require('lodash');

const users = require('./users');

const typedef = gql`
    type Query 
    type Mutation
`

const typedefs = [
    typedef,
    users.typedef
];

let resolvers = {}
resolvers = merge(
    resolvers,
    users.resolver
);

module.exports = {
    typedefs,
    resolvers
};