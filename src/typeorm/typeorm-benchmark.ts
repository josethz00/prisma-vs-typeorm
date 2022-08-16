import { faker } from '@faker-js/faker'
import { AppDataSource } from '../data-source'
import { Repository } from 'typeorm';
import { UserModel } from './user.model'
import { userGroups } from '../userGroups';

const createManyUsers = async (count: number) => {
  const fCount = count.toLocaleString('en-US')

  const fakeUsers = Array.from({ length: count }, () => ({
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    group: userGroups[Math.floor(Math.random() * userGroups.length)]
  }))

  console.time(`Create(many) ${fCount} users - TYPEORM`)
  await userRepository.save(fakeUsers)
  console.timeEnd(`Create(many) ${fCount} users - TYPEORM`)
}

const findUsers = async () => {
  console.time('Find users - TYPEORM')
  await userRepository.find()
  console.timeEnd('Find users - TYPEORM')
}

const findByGroup = async () => {
  console.time('Find users by group - TYPEORM')
  await userRepository.find({
    where: {
      group: 'guest'
    },
  })
  console.timeEnd('Find users by group - TYPEORM')
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

  console.time(`Create users intensive - TYPEORM`)
  for (const user of fakeUsers) {
    await userRepository.save({
      ...user,
      userAddresses: user.userAddresses,
    })
  }
  console.timeEnd(`Create users intensive - TYPEORM`)
}

async function main() {
  await createManyUsers(Number(process.argv[2]) || 100)
  await createUsersIntensive(Number(process.argv[2]) || 100)
  await findUsers()
  await findByGroup()
}

let userRepository: Repository<UserModel>;
AppDataSource.initialize().then(() => {
  userRepository = AppDataSource.getRepository(UserModel);
  main();
}).catch(err => {
  console.log(err);
})
