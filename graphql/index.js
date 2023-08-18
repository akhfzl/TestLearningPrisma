const { gql } = require('apollo-server-express');
const { merge } = require('lodash');
const GraphQLUpload = require('graphql-upload-minimal');

const users = require('./users');

const typedef = gql`
    scalar Upload
    type Query 
    type Mutation
`

const typedefs = [
    typedef,
    users.typedef
];

let resolvers = {
    Upload: GraphQLUpload
}
resolvers = merge(
    resolvers,
    users.resolver
);

module.exports = {
    typedefs,
    resolvers
};