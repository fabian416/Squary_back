"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const typeorm_1 = require("typeorm");
const group_model_1 = require("./group.model");
const user_model_1 = require("./user.model");
let Transaction = class Transaction extends typeorm_1.BaseEntity {
};
exports.Transaction = Transaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Transaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('float')
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)('text')
], Transaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
], Transaction.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_model_1.Group, group => group.transactions)
], Transaction.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, user => user.transactionsCreated)
], Transaction.prototype, "createdBy", void 0);
exports.Transaction = Transaction = __decorate([
    (0, typeorm_1.Entity)('transactions')
], Transaction);
