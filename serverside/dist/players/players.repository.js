"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersRepository = void 0;
const typeorm_1 = require("typeorm");
const player_entity_1 = require("./player.entity");
const bcrypt = require("bcrypt");
let PlayersRepository = class PlayersRepository extends typeorm_1.Repository {
    async createPlayer(createPlayerDto) {
        const { name, password, ftUser, imgUrl } = createPlayerDto;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        const player = this.create({
            name,
            password: hashPassword,
            ftUser,
            imgUrl,
            win: 0,
            lose: 0,
            level: 1,
            exp: 0,
        });
        await this.save(player);
        return player;
    }
};
PlayersRepository = __decorate([
    (0, typeorm_1.EntityRepository)(player_entity_1.Player)
], PlayersRepository);
exports.PlayersRepository = PlayersRepository;
//# sourceMappingURL=players.repository.js.map