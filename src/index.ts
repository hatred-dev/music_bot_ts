import {Routes} from "discord-api-types/v10";
import {Player} from "discord-player";
import Discord from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {REST} from "@discordjs/rest";
import {SlashCommand} from "../types/slashcommand";

dotenv.config();
const TOKEN = process.env.TOKEN!;

const LOAD_SLASH = process.argv[2] == "load";

const CLIENT_ID = process.env.CLIENT_ID!;
const GUILD_ID = process.env.GUILD_ID!;

const client = new Discord.Client({
    intents: ["Guilds", "GuildVoiceStates"],
});

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25,
    },
});

let commands: Discord.RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

const slashFiles = fs
    .readdirSync(path.join(__dirname, "./slash"))
    .filter((file) => file.endsWith(".js"));

for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`) as SlashCommand;
    client.slashcommands.set(slashcmd.data.name, slashcmd);
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON());
}

client.on("ready", () => {
    console.log(`Logged in as ${client.user!!.tag}`);
});
client.on("interactionCreate", (interaction) => {
    async function handleCommand() {
        if (!interaction.isCommand()) return;
        if (!interaction.isChatInputCommand()) return;
        const slashcmd = client.slashcommands.get(interaction.commandName);
        if (!slashcmd) interaction.reply("Not a valid slash command");
        await interaction.deferReply();
        await slashcmd.run({client, interaction});
    }

    handleCommand().then();
});
client.login(TOKEN).then(() => {
    if (LOAD_SLASH) {
        const rest = new REST({version: "10"}).setToken(TOKEN);
        console.log("deploying slash commands");
        client.guilds.fetch().then(result => {
            result.map(guild => {
                rest
                    .put(Routes.applicationGuildCommands(client.application.id, guild.id), {
                        body: commands,
                    })
                    .then(() => {
                        console.log(`Successfully loaded into ${guild.id}`);
                    })
                    .catch((err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
            })
        })
    }
});
