import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    BaseEntity,
    OneToMany  
} from 'typeorm';

import { User } from './user.model';
import { Transaction } from './transaction.model';

@Entity('groups')
export class Group extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('varchar', { nullable: true })  // If you decide to add 'description'
    description: string;

    @ManyToOne(() => User, user => user.groupsOwned)
    owner: User;

    @ManyToMany(() => User, user => user.groups)
    @JoinTable({ name: "group_members" })
    members: User[];

    @OneToMany(() => Transaction, transaction => transaction.group)
    transactions: Transaction[];
}

