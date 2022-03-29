const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes, ChannelType } = require('discord-api-types/v9');
const portAudio = require('naudiodon');

const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  getVoiceConnection
} = require("@discordjs/voice");

if (undefined === process.env.DISCORD_TOKEN) {
  throw 'DISCORD_TOKEN is undefined.';
}

if (undefined === process.env.DISCORD_APPLICATION_ID) {
  throw 'DISCORD_APPLICATION_ID is undefined.'
}

if (undefined === process.env.DISCORD_GUILD_ID) {
  throw 'DISCORD_GUILD_ID is undefined.'
}

const discordToken = process.env.DISCORD_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.DISCORD_GUILD_ID;

const rest = new REST({ version: '9' }).setToken(discordToken);

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

const join = async function (interaction) {
  await interaction.reply({
    content: 'join!',
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
  const player = createAudioPlayer();
  conn.subscribe(player);

  const stream = new portAudio.AudioIO({
    inOptions: {
      channelCount: 2,
      sampleFormat: portAudio.SampleFormat16Bit,
      sampleRate: 44100,
      deviceId: 2,
      closeOnError: false,
    }
  });
  const resource = createAudioResource(
    stream,
    { inputType: StreamType.Raw }
  );
  player.play(resource);
}

const leave = async function (interaction) {
  await interaction.reply({
    content: 'leave!',
    ephemeral: true
  })
  const conn = getVoiceConnection(guildId)
  if (conn) {
    const vcChannelId = conn.joinConfig.channelId
    if (discordClient.channels.cache.get(vcChannelId).members.size < 2) {
      conn.destroy();
    }
  }
}

exports.create = async function () {
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

exports.interactionController = function (interaction) {
  if (interaction.isCommand()) {
    if (interaction.connamdName === 'm') {
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
}
