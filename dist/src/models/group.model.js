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
exports.Group = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const transaction_model_1 = require("./transaction.model");
const debt_model_1 = require("./debt.model");
const pendingInvitation_model_1 = require("./pendingInvitation.model");
const transactionsConfirmations_1 = require("./transactionsConfirmations");
let Group = class Group extends typeorm_1.BaseEntity {
};
exports.Group = Group;
__decorate([
    (0, typeorm_1.OneToMany)(() => debt_model_1.Debt, (debt) => debt.group),
    __metadata("design:type", Array)
], Group.prototype, "debts", void 0);
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Group.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar'),
    __metadata("design:type", String)
], Group.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Group.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, (user) => user.groupsOwned),
    (0, typeorm_1.JoinColumn)({ name: 'owner_wallet_address' }),
    __metadata("design:type", user_model_1.User)
], Group.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_model_1.User, (user) => user.groups),
    (0, typeorm_1.JoinTable)({ name: 'group_members' }),
    __metadata("design:type", Array)
], Group.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_model_1.Transaction, (transaction) => transaction.toGroup),
    __metadata("design:type", Array)
], Group.prototype, "transactions", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', {
        name: 'gnosissafeaddress',
        unique: true,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Group.prototype, "gnosissafeaddress", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { default: 'pending' }) // Statuses can be 'pending', 'active', 'closed', etc.
    ,
    __metadata("design:type", String)
], Group.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pendingInvitation_model_1.PendingInvitation, (invitation) => invitation.group),
    __metadata("design:type", Array)
], Group.prototype, "pendingInvitations", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'signing_method', default: 'majority' }) // 'majority', 'all', 'custom'
    ,
    __metadata("design:type", String)
], Group.prototype, "signingMethod", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'selected_signers', nullable: true, array: true }) // Save addresses
    ,
    __metadata("design:type", Array)
], Group.prototype, "selectedSigners", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'signature_threshold', nullable: true }),
    __metadata("design:type", Number)
], Group.prototype, "signatureThreshold", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transactionsConfirmations_1.TransactionConfirmation, (confirmation) => confirmation.group),
    __metadata("design:type", Array)
], Group.prototype, "confirmations", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'settlecompleted', default: false }),
    __metadata("design:type", Boolean)
], Group.prototype, "settleCompleted", void 0);
exports.Group = Group = __decorate([
    (0, typeorm_1.Entity)('groups')
], Group);
