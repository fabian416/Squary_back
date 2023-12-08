import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    BaseEntity,
    OneToMany,
    JoinColumn
} from 'typeorm';
import { User } from './user.model';
import { Transaction } from './transaction.model';
import { Debt } from './debt.model';
import { PendingInvitation } from './pendingInvitation.model';
import { TransactionConfirmation } from './transactionsConfirmations';

@Entity('groups')
export class Group extends BaseEntity {
    
    @OneToMany(() => Debt, debt => debt.group)
    debts: Debt[];

    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    name: string;

    @Column('varchar', { nullable: true })
    description: string;

    @ManyToOne(() => User, user => user.groupsOwned)
    @JoinColumn({ name: 'owner_wallet_address' })
    owner: User;

    @ManyToMany(() => User, user => user.groups)
    @JoinTable({ name: "group_members" })
    members: User[];

    @OneToMany(() => Transaction, transaction => transaction.toGroup)
    transactions: Transaction[];

    @Column('varchar', { name: "gnosissafeaddress", unique: true, nullable: true })
    gnosissafeaddress: string | null;

    @Column('varchar', { default: 'pending' }) // Statuses can be 'pending', 'active', 'closed', etc.
    status: string;
    
    @OneToMany(() => PendingInvitation, invitation => invitation.group)
    pendingInvitations: PendingInvitation[];

    @Column('varchar', { name: "signing_method", default: 'majority' }) // 'majority', 'all', 'custom'
    signingMethod: string;
    
    @Column('text', {name: "selected_signers", nullable: true, array: true }) // Save addresses 
    selectedSigners: string[];


    @Column('int', { name: 'signature_threshold', nullable: true })
    signatureThreshold: number;

    @OneToMany(() => TransactionConfirmation, confirmation => confirmation.group)
    confirmations: TransactionConfirmation[];

    @Column({ name: 'settlecompleted', default: false })
    settleCompleted: boolean;
}
