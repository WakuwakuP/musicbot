const portAudio = require('naudiodon');
const Discord = require('discord.js');
const command = require('./command');

if (undefined === process.env.DISCORD_TOKEN) {
  throw 'DISCORD_TOKEN is undefined.';
}

const discordToken = process.env.DISCORD_TOKEN;

var ai = new portAudio.AudioIO({
  inOptions: {
    channelCount: 2,
    sampleFormat: portAudio.SampleFormat16Bit,
    sampleRate: 44100,
    deviceId: 2,
    closeOnError: false,
  }
});
ai.pipe();
ai.start();

const discordClient = new Discord.Client({
  restTimeOffset: 100,
  intents: Discord.Intents.FLAGS.GUILDS | Discord.Intents.FLAGS.GUILD_MESSAGES | Discord.Intents.FLAGS.GUILD_VOICE_STATES,
  partials: ['MESSAGE'],
});

discordClient.login(discordToken);

discordClient.on('interactionCreate', async interaction => {
  command.interactionController(interaction);
});

discordClient.on('ready', client => {
  console.log('Discord ready!');
});