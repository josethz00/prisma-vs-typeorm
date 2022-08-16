import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { userGroups } from '../userGroups'

const prisma = new PrismaClient()

const createManyUsers = async (count: number) => {
  const fCount = count.toLocaleString('en-US')

  const fakeUsers = Array.from({ length: count }, () => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    group: userGroups[Math.floor(Math.random() * userGroups.length)]
  }))

  console.time(`Create(many) ${fCount} users - PRISMA`)
  await prisma.user.createMany({
    data: fakeUsers,
  })
  console.timeEnd(`Create(many) ${fCount} users - PRISMA`)
}

const findUsers = async () => {
  console.time('Find users - PRISMA')
  await prisma.user.findMany()
  console.timeEnd('Find users - PRISMA')
}

const findByGroup = async () => {
  console.time('Find users by group - PRISMA')
  await prisma.user.findMany({
    where: {
      group: 'guest'
    },
  })
  console.timeEnd('Find users by group - PRISMA')
}

const createUsersIntensive = async (count: number) => {
  const fakeUserAddresses = Array.from({ length: count }, () => ({
    address: faker.address.streetAddress(),
    city: faker.address.city(),
    state: faker.address.state(),
    zip: faker.address.zipCode(),
    country: faker.address.country(),
  }))

  const fakeUsers = Array.from({ length: count }, () => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    group: userGroups[Math.floor(Math.random() * userGroups.length)],
    userAddresses: fakeUserAddresses
  }))

  console.time(`Create users intensive - PRISMA`)
  for (const user of fakeUsers) {
    await prisma.user.create({
      data: {
        ...user,
        userAddresses: {
          create: user.userAddresses
        }
      },
    })
  }
  console.timeEnd(`Create users intensive - PRISMA`)
}

async function main() {
  await prisma.$connect()

  await createManyUsers(Number(process.argv[2]) || 100)
  await createUsersIntensive(Number(process.argv[2]) || 100)
  await findUsers()
  await findByGroup()

  await prisma.$disconnect()
}

main()