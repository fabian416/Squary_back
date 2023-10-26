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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const group_model_1 = require("./group.model");
const transaction_model_1 = require("./transaction.model");
let User = class User extends typeorm_1.BaseEntity {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'varchar', unique: true, name: "walletAddress" }),
    __metadata("design:type", String)
], User.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], User.prototype, "alias", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', unique: true, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User),
    (0, typeorm_1.JoinTable)({ name: "user_friends" }),
    __metadata("design:type", Array)
], User.prototype, "friends", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => group_model_1.Group, group => group.owner),
    __metadata("design:type", Array)
], User.prototype, "groupsOwned", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => group_model_1.Group, group => group.members),
    __metadata("design:type", Array)
], User.prototype, "groups", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_model_1.Transaction, transaction => transaction.proposedby),
    __metadata("design:type", Array)
], User.prototype, "transactionsProposed", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => transaction_model_1.Transaction, transaction => transaction.signers),
    __metadata("design:type", Array)
], User.prototype, "signedTransactions", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users') // Define the table asociety in PostgreSQL
], User);
