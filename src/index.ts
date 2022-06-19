import Discord from "discord.js"
import dotenv from "dotenv"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v10"
import { Player } from "discord-player"
import path from "path"
import fs from "fs"



dotenv.config()
const TOKEN = process.env.TOKEN!

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "645722449236852739"
const GUILD_ID = "645732312813797393"


const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync(path.join(__dirname, "./slash")).filter(file => file.endsWith(".js"))

for (const file of slashFiles) {
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "10" }).setToken(TOKEN)
    console.log("deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
        .then(() => {
            console.log("Successfully loaded")
            process.exit(0)
        })
        .catch((err) => {
            if (err) {
                console.log(err)
                process.exit(1)
            }
        })
} else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user!!.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return
            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")
            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
            interaction.options.getSubcommand
        }
        handleCommand()
    })
    client.login(TOKEN)
}