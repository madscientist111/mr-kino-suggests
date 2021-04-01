const Discord = require("discord.js");
const fs = require("fs");
const http = require("https");
require("dotenv").config();

const prefix = "mr.kino ";
const token = process.env.DISCORD_TOKEN;

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
        client.commands.get("ping").execute(message, args);
    } else if (command === "beep") {
        client.commands.get("beep").execute(message, args);
    } else if (command === "server") {
        client.commands.get("server").execute(message, args);
    } else if (command === "suggest") {
        client.commands.get("suggest").execute(message, args);
    } else if (command === "tv") {
        client.commands.get("tv").execute(message, args);
    }
});

client.login(token);
