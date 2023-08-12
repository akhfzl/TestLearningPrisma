const { gql } = require('apollo-server-express');

module.exports = gql`
    input UserField {
        first_name: String 
        last_name: String 
        password: String 
    }

    type User {
        id: ID 
        first_name: String 
        last_name: String 
        password: String 
    }

    extend type Query {
        Users: [User]
    }

    extend type Mutation {
        AddUser(input: UserField): User
    }
`