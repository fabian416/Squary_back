
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
import { Group } from './group.model'; 

@Entity('pending_invitations')
export class PendingInvitation extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Group, group => group.pendingInvitations)
    group: Group;

    @Column('varchar')
    walletAddress: string;

    @Column('varchar', { nullable: true })
    email: string;
}
