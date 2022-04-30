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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const players_repository_1 = require("./players.repository");
const bcrypt = require("bcrypt");
let PlayersService = class PlayersService {
    constructor(playersRepository) {
        this.playersRepository = playersRepository;
    }
    async findAll() {
        return await this.playersRepository.find();
    }
    async findByName(name) {
        const found = await this.playersRepository.findOne(name);
        if (!found) {
            throw new common_1.NotFoundException();
        }
        return found;
    }
    async createPlayer(createPlayerDto) {
        const found = await this.playersRepository.findOne({
            name: createPlayerDto.name,
        });
        if (found) {
            throw new common_1.ForbiddenException(`Player with name ${createPlayerDto.name}" is already exist`);
        }
        return this.playersRepository.createPlayer(createPlayerDto);
    }
    async deletePlayer(name) {
        const result = await this.playersRepository.delete({ name });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Player with name "${name}" not found`);
        }
    }
    async signIn(credentialDto) {
        const { name, password } = credentialDto;
        const player = await this.playersRepository.findOne(name);
        if (player && (await bcrypt.compare(password, player.password))) {
            return player;
        }
        else {
            throw new common_1.UnauthorizedException();
        }
    }
};
PlayersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(players_repository_1.PlayersRepository)),
    __metadata("design:paramtypes", [players_repository_1.PlayersRepository])
], PlayersService);
exports.PlayersService = PlayersService;
//# sourceMappingURL=players.service.js.map