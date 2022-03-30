require('dotenv').config()

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

const DISCORD_TOKEN_DEV = process.env.DISCORD_TOKEN_DEV;
const DISCORD_APPLICATION_ID_DEV = process.env.DISCORD_APPLICATION_ID_DEV;
const DISCORD_GUILD_ID_DEV = process.env.DISCORD_GUILD_ID_DEV;

module.exports = {
  apps: [{
    name: "musicBot",
    script: "./index.js",
    env_production: {
      NODE_ENV: "production",
      DISCORD_TOKEN: DISCORD_TOKEN,
      DISCORD_APPLICATION_ID: DISCORD_APPLICATION_ID,
      DISCORD_GUILD_ID: DISCORD_GUILD_ID
    },
    env_development: {
      NODE_ENV: "development",
      DISCORD_TOKEN: DISCORD_TOKEN_DEV,
      DISCORD_APPLICATION_ID: DISCORD_APPLICATION_ID_DEV,
      DISCORD_GUILD_ID: DISCORD_GUILD_ID_DEV
    }
  }]
}
