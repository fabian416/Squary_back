import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    JoinTable,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { User } from './user.model';
import { Group } from './group.model';

@Entity('transactions')
export class Transaction extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true })
    hash: string; // tx hash identifier

    @ManyToOne(() => User)
    proposedBy: User; // who proposed the tx?

    @ManyToOne(() => User, { nullable: true })
    toUser: User; // In case the tx is 1 to 1

    @ManyToOne(() => Group, { nullable: true })
    toGroup: Group; // In case the tx is for a group

    @ManyToMany(() => User, user => user.signedTransactions)
    @JoinTable({ name: "transaction_signers" }) 
    signers: User[]; // relation with the signers

    @ManyToOne(() => User, user => user.transactionsReceived)
    receiver: User; // relation with the receiver 

    @Column('float')
    amount: number;

    @Column('text')
    description: string;

    @CreateDateColumn() 
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('varchar', { default: 'PENDING' }) 
    status: string; // PENDING, APPROVED, REJECTED, EXECUTED, FAILED

    @Column('varchar', { nullable: true })
    tokenType: string; // Type of token (e.g., ETH, DAI, etc.)

    @Column('integer', { nullable: true, default: 0 })
    numberOfConfirmations: number; // Number of Confirmations

    // Maybe consider a separate table for Confirmations.
    // This will allow you to track when each confirmation was made and by whom.
}

@Entity('transaction_confirmations')
export class TransactionConfirmation extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Transaction, transaction => transaction.id)
    transaction: Transaction;

    @ManyToOne(() => User, user => user.walletAddress)
    confirmedBy: User;

    @CreateDateColumn() 
    confirmedAt: Date;
}
