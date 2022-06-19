import { QueryType } from "discord-player";
import {
  Client,
  CommandInteraction,
  GuildMember,
  MessageEmbed
} from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("plays youtube songs")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("song")
        .setDescription("loads one song from url")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("the song's url")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("playlist")
        .setDescription("Loads playlist of songs from a url")
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("the playlist's url")
            .setRequired(true)
        )
    ),
  run: async ({
    client,
    interaction,
  }: {
    client: Client;
    interaction: CommandInteraction;
  }) => {
    if (!(interaction.member! as GuildMember).voice.channel)
      return interaction.editReply("You are not in vc");
    const queue = client.player.createQueue(interaction.guildId!);
    if (!queue.connection)
      await queue.connect((interaction.member! as GuildMember).voice.channel!);
    let embed = new MessageEmbed();
    if (interaction.options.getSubcommand() === "song") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url!, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply("No results");
      }
      const song = result.tracks[0];
      queue.addTrack(song);
      embed
        .setDescription(
          `**${song.title}|${song.url}** has been added to the Queue`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({
          text: `Duration: ${
            song.duration === "0:00" ? "Stream" : song.duration
          }`,
        });
    } else if (interaction.options.getSubcommand() === "playlist") {
      let url = interaction.options.getString("url");
      const result = await client.player.search(url!, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST,
      });
      if (result.tracks.length === 0) {
        return interaction.editReply("No results");
      }
      const playlist = result.playlist;
      queue.addTracks(result.tracks);
      embed
        .setDescription(
          `**${playlist!.title}|${playlist.url}** with **${
            playlist.tracks.length
          } songs** has been added to the Queue`
        )
        .setThumbnail(playlist!.thumbnail);
    }
    if (!queue.playing) await queue.play();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
