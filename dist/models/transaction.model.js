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
exports.TransactionConfirmation = exports.Transaction = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const group_model_1 = require("./group.model");
let Transaction = class Transaction extends typeorm_1.BaseEntity {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "hash", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Transaction.prototype, "proposedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, { nullable: true }),
    __metadata("design:type", user_model_1.User)
], Transaction.prototype, "toUser", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_model_1.Group, { nullable: true }),
    __metadata("design:type", group_model_1.Group)
], Transaction.prototype, "toGroup", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_model_1.User, user => user.signedTransactions),
    (0, typeorm_1.JoinTable)({ name: "transaction_signers" }),
    __metadata("design:type", Array)
], Transaction.prototype, "signers", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, user => user.transactionsReceived),
    __metadata("design:type", user_model_1.User)
], Transaction.prototype, "receiver", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { default: 'PENDING' }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Transaction.prototype, "tokenType", void 0);
__decorate([
    (0, typeorm_1.Column)('integer', { nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Transaction.prototype, "numberOfConfirmations", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions')
], Transaction);
let TransactionConfirmation = class TransactionConfirmation extends typeorm_1.BaseEntity {
};
exports.TransactionConfirmation = TransactionConfirmation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TransactionConfirmation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Transaction, transaction => transaction.id),
    __metadata("design:type", Transaction)
], TransactionConfirmation.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, user => user.walletAddress),
    __metadata("design:type", user_model_1.User)
], TransactionConfirmation.prototype, "confirmedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TransactionConfirmation.prototype, "confirmedAt", void 0);
exports.TransactionConfirmation = TransactionConfirmation = __decorate([
    (0, typeorm_1.Entity)('transaction_confirmations')
], TransactionConfirmation);
