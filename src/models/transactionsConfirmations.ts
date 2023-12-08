import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity,
    JoinColumn
} from 'typeorm';

import { User } from './user.model';
import { Group } from './group.model';

@Entity('transaction_confirmations') 
export class TransactionConfirmation extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    confirmed: boolean;

    @ManyToOne(() => User, user => user.walletAddress)
    @JoinColumn({ name: 'user_wallet_address' })
    user: User;

    @ManyToOne(() => Group, group => group.confirmations)
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'user_wallet_address' })
    userWalletAddress: string;


}
