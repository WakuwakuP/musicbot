const Discord = require('discord.js');
const command = require('./command');

if (undefined === process.env.DISCORD_TOKEN) {
  throw 'DISCORD_TOKEN is undefined.';
}

const discordToken = process.env.DISCORD_TOKEN;

const discordClient = new Discord.Client({
  restTimeOffset: 100,
  intents: Discord.Intents.FLAGS.GUILDS | Discord.Intents.FLAGS.GUILD_MESSAGES | Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  partials: ['MESSAGE'],
});

discordClient.login(discordToken);

discordClient.on('interactionCreate', async interaction => {
  command.interactionController(interaction);
});

discordClient.on('ready', () => {
  command.create();
  console.log('Discord ready!');
});
