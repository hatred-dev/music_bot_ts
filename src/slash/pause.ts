import {ChatInputCommandInteraction, Client} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses current song."),
    run: async ({
                    client,
                    interaction,
                }: {
        client: Client;
        interaction: ChatInputCommandInteraction;
    }) => {
        const queue = client.player.getQueue(interaction.guildId!);
        if (!queue) return await interaction.editReply("Queue is empty");
        queue.setPaused(true);
        return await interaction.editReply("Music has been paused!");
    },
};
