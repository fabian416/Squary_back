import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    BaseEntity
} from 'typeorm';
import { Group } from './group.model';
import { User } from './user.model';

@Entity('transactions')
export class Transaction extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    amount: number;

    @Column('text')
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) 
    date: Date;

    @ManyToOne(() => Group, group => group.transactions)
    group: Group;

    @ManyToOne(() => User, user => user.transactionsCreated)
    createdBy: User;

    // Puedes añadir más campos si lo necesitas.
}
