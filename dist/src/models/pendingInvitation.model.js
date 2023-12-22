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
exports.PendingInvitation = void 0;
const typeorm_1 = require("typeorm");
const group_model_1 = require("./group.model");
let PendingInvitation = class PendingInvitation extends typeorm_1.BaseEntity {
};
exports.PendingInvitation = PendingInvitation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PendingInvitation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => group_model_1.Group, (group) => group.pendingInvitations),
    (0, typeorm_1.JoinColumn)({ name: 'group_id' }),
    __metadata("design:type", group_model_1.Group)
], PendingInvitation.prototype, "group", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'walletaddress' }),
    __metadata("design:type", String)
], PendingInvitation.prototype, "walletAddress", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], PendingInvitation.prototype, "email", void 0);
exports.PendingInvitation = PendingInvitation = __decorate([
    (0, typeorm_1.Entity)('pending_invitations')
], PendingInvitation);
