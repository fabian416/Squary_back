
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
import { Group } from './group.model'; 

@Entity('pending_invitations')
export class PendingInvitation extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Group, group => group.pendingInvitations)
    @JoinColumn({ name: 'group_id' }) 
    group: Group;

    @Column('varchar', { name: 'walletaddress' })
    walletAddress: string;


    @Column('varchar', { nullable: true })
    email: string;
}
