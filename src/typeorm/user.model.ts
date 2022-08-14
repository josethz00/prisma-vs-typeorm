import { Column, CreateDateColumn, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserAddressModel } from "./user-address.model";

@Entity('User')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;
  
  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  group: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserAddressModel, (userAddress) => userAddress.user)
  @JoinTable({ name: 'UserAddresses' })
  userAddresses: UserAddressModel[];
}