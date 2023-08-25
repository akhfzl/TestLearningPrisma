const prisma = require('../../db/prisma');
const finished = require("stream-promise");
const { UploadToDropBox } = require('./users.utilities');
const { hash, compare } = require('bcrypt');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

const Users = async(parent, args, ctx) => {
    const data = await prisma.user.findMany();
    return data
}

const AddUser = async(parent, { input }, ctx) => {
    const psw = await hash(input.password, 10);
    const adding = await prisma.user.create({
        data: {
            first_name: input.first_name,
            last_name: input.last_name,
            password: psw
        }
    })

    return adding
}

const Login = async(parent, { first_name, password }, ctx) => {
    const users = await prisma.user.findFirst({
        where: {
            first_name: first_name
        },
    })
    if (!users) {
        throw new GraphQLError('User not found', { extensions: { code: 'NOT FOUND' } })
    }

    const is_password = await compare(password, users.password);
    
    if (!is_password) {
        throw new GraphQLError('Password is incorrect', { extensions: { code: 'AUTHENTICATION' } })
    }

    const token = jwt.sign(
        {
            id: users.id,
        },
        process.env.SECRET_TOKEN,
        {
            expiresIn: '1d'
        }
    )

    return {
        token,
        users
    }
}

const AddProfile = async(parent, { input }, ctx) => {
    console.log('res', ctx)
    const profile_add = await prisma.profile.create({
        data: {   
            bio: input.bio,
            userId: ctx.user.id
        }
    })

    return profile_add
}

const singleUpload = async(parent, { file }, args) => {
    const { createReadStream, filename, mimetype, encoding } = file.file
    const stream = createReadStream();
    const out = require("fs").createWriteStream(`./public/${filename}`);
    stream.pipe(out);
    await finished(out);

    await UploadToDropBox(process.env.TOKEN, filename);

    return { filename, mimetype, encoding };
}

module.exports = {
    Query: {
        Users
    },
    Mutation: {
        AddUser,
        AddProfile,
        singleUpload,
        Login
    }
}