import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Group } from './group.model';
import { Transaction } from './transaction.model';

@Entity('debts')
export class Debt extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Dirección de la billetera del deudor
  @Column('varchar', { length: 255 })
  debtor: string;

  // Dirección de la billetera del acreedor
  @Column('varchar', { length: 255 })
  creditor: string;

  @Column('int', { name: 'groupid' })
  groupId: number;

  @ManyToOne(() => Group, (group) => group.debts)
  @JoinColumn({ name: 'groupid' })
  group: Group;

  // Relation between the debts and the transactions
  @ManyToOne(() => Transaction, (transaction) => transaction.debts)
  @JoinColumn({ name: 'transactionid' })
  transaction: Transaction;

  // amount of the debt
  @Column('float')
  amount: number;

  // Date creation of de debt
  @CreateDateColumn({ name: 'createdat' })
  createdAt: Date;

  @Column('varchar', { default: 'pending' })
  status: string;

  // Constructor agregado para permitir la creación de un objeto Debt con un objeto de configuración
  constructor(init?: Partial<Debt>) {
    super();
    Object.assign(this, init);
  }
}
