'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Debt = void 0;
const typeorm_1 = require('typeorm');
const group_model_1 = require('./group.model');
const transaction_model_1 = require('./transaction.model');
let Debt = class Debt extends typeorm_1.BaseEntity {
  // Constructor agregado para permitir la creación de un objeto Debt con un objeto de configuración
  constructor(init) {
    super();
    Object.assign(this, init);
  }
};
exports.Debt = Debt;
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  Debt.prototype,
  'id',
  void 0
);
__decorate(
  [
    (0, typeorm_1.Column)('varchar', { length: 255 }),
    __metadata('design:type', String),
  ],
  Debt.prototype,
  'debtor',
  void 0
);
__decorate(
  [
    (0, typeorm_1.Column)('varchar', { length: 255 }),
    __metadata('design:type', String),
  ],
  Debt.prototype,
  'creditor',
  void 0
);
__decorate(
  [
    (0, typeorm_1.Column)({ name: 'groupid' }),
    __metadata('design:type', Number),
  ],
  Debt.prototype,
  'groupId',
  void 0
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => group_model_1.Group,
      (group) => group.debts
    ),
    (0, typeorm_1.JoinColumn)({ name: 'groupid' }),
    __metadata('design:type', group_model_1.Group),
  ],
  Debt.prototype,
  'group',
  void 0
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => transaction_model_1.Transaction,
      (transaction) => transaction.debts
    ),
    (0, typeorm_1.JoinColumn)({ name: 'transactionid' }),
    __metadata('design:type', transaction_model_1.Transaction),
  ],
  Debt.prototype,
  'transaction',
  void 0
);
__decorate(
  [(0, typeorm_1.Column)('float'), __metadata('design:type', Number)],
  Debt.prototype,
  'amount',
  void 0
);
__decorate(
  [
    (0, typeorm_1.CreateDateColumn)({ name: 'createdat' }),
    __metadata('design:type', Date),
  ],
  Debt.prototype,
  'createdAt',
  void 0
);
__decorate(
  [
    (0, typeorm_1.Column)('varchar', { default: 'pending' }),
    __metadata('design:type', String),
  ],
  Debt.prototype,
  'status',
  void 0
);
exports.Debt = Debt = __decorate(
  [(0, typeorm_1.Entity)('debts'), __metadata('design:paramtypes', [Object])],
  Debt
);
