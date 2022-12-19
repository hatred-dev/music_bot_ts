import {ChatInputCommandInteraction, Client, EmbedBuilder} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song."),
    run: async ({
                    client,
                    interaction,
                }: {
        client: Client;
        interaction: ChatInputCommandInteraction;
    }) => {
        const queue = client.player.getQueue(interaction.guildId!);
        if (!queue) return await interaction.editReply("Queue is empty");
        const currentSong = queue.current;
        queue.skip();
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**${currentSong.title}** has been skipped.`)
                    .setThumbnail(currentSong.thumbnail),
            ],
        });
    },
};
