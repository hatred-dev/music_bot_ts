import { Client, CommandInteraction, MessageEmbed } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Displays info about the current song."),
  run: async ({
    client,
    interaction,
  }: {
    client: Client;
    interaction: CommandInteraction;
  }) => {
    const queue = client.player.getQueue(interaction.guildId!);
    if (!queue) return await interaction.editReply("Queue is empty");
    let bar = queue.createProgressBar({
      length: 19,
    });
    const song = queue.current;
    await interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setThumbnail(song.thumbnail)
          .setDescription(
            `Currently playing **${song.title}|${song.url}**\n\n` +
              `\`0:00\`${bar}\`${song.duration}\``
          ),
      ],
    });
  },
};
