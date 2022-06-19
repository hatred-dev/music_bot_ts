import { SlashCommandBuilder } from "@discordjs/builders"
import { Client, CommandInteraction } from "discord.js"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Stops the bot and clears queue"),
    run: async ({ client, interaction }: { client: Client, interaction: CommandInteraction }) => {
        const queue = client.player.getQueue(interaction.guildId!)
        if (!queue) return await interaction.editReply("Queue is empty")
        queue.destroy()
        return await interaction.editReply("Bye!")
    }
}