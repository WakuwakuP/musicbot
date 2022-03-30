# musicbot

A Discord bot that plays music played on the host machine.

## Install

Get Source

```shell
git clone https://github.com/wakuwakup/musicbot.git
cd musicbot
```

Package install

```shell
npm install
```

Check the PortAudio DeviceId.

```shell
node index.js
```

Set environment variables.

``` shell
export DISCORD_TOKEN={discordToken}
export DISCORD_APPLICATION_ID={discordApplicationId}
export DISCORD_GUILD_ID={discordGuildId}
export PORT_AUDIO_DEVICE_ID={portAudioDeviceId}
```

Test this bot.

```shell
node index.js
```

Run this bot.

```shell
npm install -g pm2
cp .env.sample .env
vi env
pm2 start ecosystem.config.js --env production
```

Stop this Bot

```shell
pm2 stop musicBot

or

pm2 stop ecosystem.config.js
```