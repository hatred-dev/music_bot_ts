import {Player} from "discord-player";
import {Collection} from "discord.js";
import {SlashCommand} from "../slashcommand";

declare module "discord.js" {
    export interface Client {
        slashcommands: Collection<string, SlashCommand>;
        player: Player;
    }
}
