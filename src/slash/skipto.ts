import {ChatInputCommandInteraction, Client} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to certain track.")
        .addNumberOption((option) =>
            option
                .setName("tracknumber")
                .setDescription("The track to skip to")
                .setMinValue(1)
                .setRequired(true)
        ),
    run: async ({
                    client,
                    interaction,
                }: {
        client: Client;
        interaction: ChatInputCommandInteraction;
    }) => {
        const queue = client.player.getQueue(interaction.guildId!);
        if (!queue) return await interaction.editReply("Queue is empty");
        const trackNum = interaction.options.getNumber("tracknumber");
        if (trackNum > queue.tracks.length) {
            return await interaction.editReply("Invalid track number");
        }
        queue.skipTo(trackNum - 1);
        await interaction.editReply(`Skipped ahead to track number ${trackNum}`);
    },
};
