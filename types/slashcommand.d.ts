import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

type SlashCommand = {
    data: SlashCommandBuilder
    run: function({
        client: Client,
        interaction: ChatInputCommandInteraction,
    }): Promise<Message<BooleanCache<CacheType>>>
}

