const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes, ChannelType } = require('discord-api-types/v9');
const portAudio = require('naudiodon');
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  getVoiceConnection,
  NoSubscriberBehavior
} = require("@discordjs/voice");

// deviceId confirmation
console.log((portAudio.getDevices()).map(data => `id: ${data.id}, name: ${data.name}`));

if (undefined === process.env.DISCORD_TOKEN) {
  throw 'DISCORD_TOKEN is undefined.';
}

if (undefined === process.env.DISCORD_APPLICATION_ID) {
  throw 'DISCORD_APPLICATION_ID is undefined.'
}

if (undefined === process.env.DISCORD_GUILD_ID) {
  throw 'DISCORD_GUILD_ID is undefined.'
}

if (undefined === process.env.PORT_AUDIO_DEVICE_ID) {
  throw 'PORT_AUDIO_DEVICE_ID is undefined.'
}

const discordToken = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const deviceId = Number(process.env.PORT_AUDIO_DEVICE_ID);

const rest = new REST({ version: '9' }).setToken(discordToken);

let stream;

/**
 * Connect bot to voice chat
 * @param {Interaction} interaction 
 */
const join = async function (interaction) {
  await interaction.reply({
    content: 'join !',
    ephemeral: true
  })
  const channel = interaction.options.getChannel('voice_channel', true);
  const joinOption = {
    adapterCreator: channel.guild.voiceAdapterCreator,
    channelId: channel.id,
    guildId: guildId,
    selfDeaf: true,
    selfMute: false,
  };
  const conn = await joinVoiceChannel(joinOption);
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    }
  });
  conn.subscribe(player);
  stream = new portAudio.AudioIO({
    inOptions: {
      deviceId: deviceId,
      sampleRate: 44100,
      channelCount: 2,
      sampleFormat: portAudio.SampleFormat16Bit,
      maxQueue: 2,
      highwaterMark: 65536,
      framesPerBuffer: 1024,
      closeOnError: false,
    }
  });
  const resource = createAudioResource(stream, {
    inputType: StreamType.Raw
  })
  await player.play(resource);
  stream.start();
}

/**
 * Disconnect bot from voice chat
 * @param {Interaction} interaction 
 */
const leave = async function (interaction) {
  await interaction.reply({
    content: 'leave !',
    ephemeral: true
  })
  if (stream) {
    stream.quit()
  }
  const conn = getVoiceConnection(guildId)
  if (conn) {
    conn.destroy();
  }
}

/**
 * Create (/) commands
 * @returns void
 */
exports.create = async function () {
  const m = new SlashCommandBuilder()
    .setName('m')
    .setDescription('音楽Botの操作')
    .addSubcommand(subcommand => subcommand
      .setName('join')
      .setDescription('現在のVCに呼ぶ')
      .addChannelOption(option => option
        .setName('voice_channel')
        .setDescription('チャンネル')
        .addChannelTypes([ChannelType.GuildVoice, ChannelType.GuildStageVoice])
        .setRequired(true)))
    .addSubcommand(subcommand => subcommand
      .setName('leave')
      .setDescription('VCから切断する'));

  const commands = [
    m
  ];
  try {
    await rest.put(
      Routes.applicationGuildCommands(applicationId, guildId),
      { body: commands }
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (err) {
    console.log(err);
  }
}

/**
 * Interaction Controller
 * @param {Interaction} interaction 
 * @returns void 
 */
exports.interactionController = function (interaction) {
  if (!interaction.isCommand()) {
    return;
  }
  if (interaction.commandName === 'm') {
    if (interaction.options.getSubcommand() === 'join') {
      join(interaction);
      return;
    }
    if (interaction.options.getSubcommand() === 'leave') {
      leave(interaction);
      return;
    }
  }
}
