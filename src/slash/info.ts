import {ChatInputCommandInteraction, Client, EmbedBuilder} from "discord.js";
import {SlashCommandBuilder} from "@discordjs/builders";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays info about the current song."),
    run: async ({
                    client,
                    interaction,
                }: {
        client: Client;
        interaction: ChatInputCommandInteraction;
    }) => {
        const queue = client.player.getQueue(interaction.guildId!);
        if (!queue) return await interaction.editReply("Queue is empty");
        let bar = queue.createProgressBar({
            length: 19,
        });
        const song = queue.current;
        const timestamp = queue.getPlayerTimestamp();
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setThumbnail(song.thumbnail)
                    .setDescription(
                        `Currently playing **${song.title}|${song.url}**\n\n` +
                        (song.duration === "0:00"
                            ? `\`Infinite\``
                            : `\`${timestamp.current}\`${bar}\`${song.duration}\``)
                    ),
            ],
        });
    },
};
