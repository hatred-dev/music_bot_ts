import { Player } from "discord-player";
import { Collection } from "discord.js";

declare module "discord.js" {
  export interface Client {
    slashcommands: Collection<any, any>;
    player: Player;
  }
}
