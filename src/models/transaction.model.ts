import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    JoinTable,
    JoinColumn,
    ManyToMany,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm';
import { User } from './user.model';
import { Group } from './group.model';
import { Debt } from './debt.model'; 

@Entity('transactions')
export class Transaction extends BaseEntity {
    @ManyToOne(() => Group, group => group.transactions)
    @JoinColumn({ name: 'togroupid' })
    toGroup: Group;

    @Column({ nullable: false }) 
    togroupid: number;

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar', { nullable: true })
    hash: string; // tx hash identifier

    @Column('varchar', { length: 255 })
    proposedby: string; // wallet address of the user who proposed the transaction

    @ManyToMany(() => User, user => user.signedTransactions)
    @JoinTable({ name: "transaction_signers" }) 
    signers: User[]; // relation with the signers

    @Column('float')
    amount: number;

    @Column('text')
    description: string;

    @CreateDateColumn({ name: 'date' })
    createdAt: Date;

    @UpdateDateColumn()
    updatedat: Date;

    @Column('varchar', { default: 'PENDING' }) 
    status: string; // PENDING, APPROVED, REJECTED, EXECUTED, FAILED

    @Column({ type: 'varchar', default: 'USDC', name: 'tokentype' })
    tokenType: string; // Defaulting to USDC for the prototype

    @Column('varchar', { name: 'sharedwith', array: true, nullable: true })
    sharedWith: string[];// Direcciones de billetera o alias de los miembros con los que se comparte el gasto.

    @Column('varchar', { nullable: true })
    type: 'EXPENSE' | 'SETTLEMENT'; // Tipo de transacción

    @Column({ name:'includedinsettlement',default: false })
    includedInSettlement: boolean;

    @OneToMany(() => Debt, debt => debt.transaction)
    debts: Debt[];

}


