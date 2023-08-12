const prisma = require('../../db/prisma');

const Users = async(parent, args, ctx) => {
    const data = await prisma.user.findMany();
    return data
}

const AddUser = async(parent, {input}, ctx) => {
    const adding = await prisma.user.create({
        data: {
            first_name: input.first_name,
            last_name: input.last_name,
            password: input.password 
        }
    })

    return adding
}

module.exports = {
    Query: {
        Users
    },
    Mutation: {
        AddUser
    }
}