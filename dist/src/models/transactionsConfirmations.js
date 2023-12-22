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
exports.TransactionConfirmation = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const group_model_1 = require("./group.model");
let TransactionConfirmation = class TransactionConfirmation extends typeorm_1.BaseEntity {
};
exports.TransactionConfirmation = TransactionConfirmation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TransactionConfirmation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TransactionConfirmation.prototype, "confirmed", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, (user) => user.walletAddress),
    (0, typeorm_1.JoinColumn)({ name: 'user_wallet_address' }),
    __metadata("design:type", user_model_1.User)
], TransactionConfirmation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_model_1.Group, (group) => group.confirmations),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", group_model_1.Group)
], TransactionConfirmation.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], TransactionConfirmation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'timestamp',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
    }),
    __metadata("design:type", Date)
], TransactionConfirmation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_wallet_address' }),
    __metadata("design:type", String)
], TransactionConfirmation.prototype, "userWalletAddress", void 0);
exports.TransactionConfirmation = TransactionConfirmation = __decorate([
    (0, typeorm_1.Entity)('transaction_confirmations')
], TransactionConfirmation);
