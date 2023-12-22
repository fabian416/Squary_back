"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const group_model_1 = require("./group.model");
const debt_model_1 = require("./debt.model");
let Transaction = class Transaction extends typeorm_1.BaseEntity {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_model_1.Group, (group) => group.transactions),
    (0, typeorm_1.JoinColumn)({ name: 'togroupid' }),
    __metadata("design:type", group_model_1.Group)
], Transaction.prototype, "toGroup", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Transaction.prototype, "togroupid", void 0);
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 255 }),
    __metadata("design:type", String)
], Transaction.prototype, "proposedby", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_model_1.User, (user) => user.signedTransactions),
    (0, typeorm_1.JoinTable)({ name: 'transaction_signers' }),
    __metadata("design:type", Array)
], Transaction.prototype, "signers", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date' }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedat", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { default: 'PENDING' }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', default: 'USDC', name: 'tokentype' }),
    __metadata("design:type", String)
], Transaction.prototype, "tokenType", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'sharedwith', array: true, nullable: true }),
    __metadata("design:type", Array)
], Transaction.prototype, "sharedWith", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'includedinsettlement', default: false }),
    __metadata("design:type", Boolean)
], Transaction.prototype, "includedInSettlement", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => debt_model_1.Debt, (debt) => debt.transaction),
    __metadata("design:type", Array)
], Transaction.prototype, "debts", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions')
], Transaction);
