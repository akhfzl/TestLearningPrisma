const { GraphQLError } = require("graphql");
const prisma = require('../db/prisma');
const jwt = require('jsonwebtoken');

const Auth = async (res ,parent, args, ctx) => {
    const header = ctx.token
    if (!header) {
        throw new GraphQLError('This schema need bearer token', { extensions: { code: 'AUTHORIZATION' } });
    }

    const token = header.replace('Bearer ', '');
    const verification = jwt.verify(token, process.env.SECRET_TOKEN);

    if (!verification){
        throw new GraphQLError('Bearer token is not recognize for user', { extensions: { code: 'AUTHORIZATION' } });
    }

    ctx.user = await prisma.user.findFirst({ where: { id: verification.id } });
    ctx.token = token
    return res()
}

module.exports = {
    Query: {},
    Mutation: {
        AddProfile: Auth
    }
}