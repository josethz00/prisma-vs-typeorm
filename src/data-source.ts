import { DataSource } from "typeorm";
import { UserAddressModel } from "./typeorm/user-address.model";
import { UserModel } from "./typeorm/user.model";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 9122,
  username: "benchmark-api-db-typeorm",
  password: "benchmark-api-db-typeorm",
  database: "benchmark-api-db-typeorm",
  synchronize: true,
  logging: false,
  entities: [UserModel, UserAddressModel],
  subscribers: [],
  migrations: [],
})