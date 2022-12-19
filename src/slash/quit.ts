import {ChatInputCommandInteraction, Client} from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quit")
    .setDescription("Stops the bot and clears queue"),
  run: async ({
    client,
    interaction,
  }: {
    client: Client;
    interaction: ChatInputCommandInteraction;
  }) => {
    const queue = client.player.getQueue(interaction.guildId!);
    if (!queue) return await interaction.editReply("Queue is empty");
    queue.destroy();
    return await interaction.editReply("Bye!");
  },
};
