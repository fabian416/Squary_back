import {
  Entity,
  PrimaryColumn,
  Column,
  BaseEntity,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Group } from './group.model';
import { Transaction } from './transaction.model';

@Entity('users') // Define the table asociety in PostgreSQL
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', unique: true, name: 'walletAddress' })
  walletAddress: string; //  The unique address of the wallet's user

  @Column({ type: 'varchar', unique: true })
  alias: string; //the alias/nickname of the user.

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string; // Email of th euser (optional)

  //  Relation for friends in the model User
  @ManyToMany(() => User)
  @JoinTable({ name: 'user_friends' })
  friends: User[];

  //set the relation with the groups that a user has (is the owner)
  @OneToMany(() => Group, (group) => group.owner)
  groupsOwned: Group[];

  // set the relation with the groups that a user is member
  @ManyToMany(() => Group, (group) => group.members)
  groups: Group[];

  //  Relation with transactions created by the user
  @OneToMany(() => Transaction, (transaction) => transaction.proposedby)
  transactionsProposed: Transaction[];

  // Relation with transactions signed by the user
  @ManyToMany(() => Transaction, (transaction) => transaction.signers)
  signedTransactions: Transaction[];
}
