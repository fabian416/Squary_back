"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Group = void 0;
const typeorm_1 = require("typeorm");
const user_model_1 = require("./user.model");
const transaction_model_1 = require("./transaction.model");
let Group = class Group extends typeorm_1.BaseEntity {
};
exports.Group = Group;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Group.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar')
], Group.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }) // If you decide to add 'description'
], Group.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_model_1.User, user => user.groupsOwned)
], Group.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_model_1.User, user => user.groups),
    (0, typeorm_1.JoinTable)({ name: "group_members" })
], Group.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => transaction_model_1.Transaction, transaction => transaction.group)
], Group.prototype, "transactions", void 0);
exports.Group = Group = __decorate([
    (0, typeorm_1.Entity)('groups')
], Group);
