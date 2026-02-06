const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@e-ogaysii.com'
    const password = 'adminpassword'
    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.upsert({
        where: { email: email },
        update: {
            name: 'E-Ogaysii',
        },
        create: {
            email,
            password: hashedPassword,
            role: 'ADMIN',
            name: 'E-Ogaysii',
        },
    })
    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
