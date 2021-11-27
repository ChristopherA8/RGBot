const { Client, Intents } = require("discord.js");
const client = new Client({ intents: Object.values(Intents.FLAGS) });
const fs = require("fs");
const dotenv = require("dotenv");
const mongo = require("./mongo/Mongo");
dotenv.config();

client.on("ready", () => {
  console.log("[BOT] Logged in as " + client.user.tag);

  client.user.setActivity("/help", { type: "PLAYING" });
  setInterval(() => {
    client.user.setActivity("/help", { type: "PLAYING" });
  }, 60 * 60 * 1000); // 1hr

  // Setup mongo client
  mongo.init();

  // Run setup
  const files = fs
    .readdirSync(`./src/setup`)
    .filter((file) => file.endsWith(".js"));
  for (const file of files) {
    // import { setup } from (`../src/setup/${file}`);
    const { setup } = require(`../src/setup/${file}`);
    setup(client);
  }

  // Run events
  const eventfiles = fs
    .readdirSync(`./src/events`)
    .filter((file) => file.endsWith(".js"));
  for (const file of eventfiles) {
    const { event } = require(`../src/events/${file}`);
    event(client);
  }
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;

  // Message Listeners
  const files = fs
    .readdirSync(`./src/listeners`)
    .filter((file) => file.endsWith(".js"));
  for (const file of files) {
    const { listen } = require(`../src/listeners/${file}`);
    await listen(msg);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const { slashHandler } = require("./handlers/slash.js");
    slashHandler(interaction, client);
  }
});

client.login(process.env.TOKEN);
