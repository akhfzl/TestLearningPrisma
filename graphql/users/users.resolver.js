const prisma = require('../../db/prisma');
const fs = require('fs');
const finished = require("stream-promise");

const Users = async(parent, args, ctx) => {
    const data = await prisma.user.findMany();
    return data
}

const AddUser = async(parent, { input }, ctx) => {
    const adding = await prisma.user.create({
        data: {
            first_name: input.first_name,
            last_name: input.last_name,
            password: input.password 
        }
    })

    return adding
}

const AddProfile = async(parent, { input }, ctx) => {
    // const adding = await prisma.profile.create({
    //     data: {   
    //         bio: input.bio,
    //         userId: 1
    //     }
    // })
    // console.log(adding)
    const gets = await prisma.profile.findFirst({
        where: {
            userId: 2
        },
        include: {
            user:true
        }
    })
    console.log(gets)
    return gets
}

const singleUpload = async(parent, { file }, args) => {
    const { createReadStream, filename, mimetype, encoding } = file.file
    const stream = createReadStream();
    const out = require("fs").createWriteStream(`./public/${filename}`);
    stream.pipe(out);
    await finished(out);

    return { filename, mimetype, encoding };
}

module.exports = {
    Query: {
        Users
    },
    Mutation: {
        AddUser,
        AddProfile,
        singleUpload
    }
}