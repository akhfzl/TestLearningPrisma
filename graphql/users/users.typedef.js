// const { gql } = require('@apollo/server');

module.exports = `
    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type LoginField {
        token: String
        users: User
    }

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

    input ProfileField {
        bio: String
    }

    type Profile {
        user: User
        bio: String 
        userId: Int 
        id: Int
    }

    extend type Query {
        Users: [User]
    }

    extend type Mutation {
        AddUser(input: UserField): User
        AddProfile(input: ProfileField): Profile
        singleUpload(file: Upload!): File!
        Login(first_name: String, password: String): LoginField
    }
`