// Cheong Bot 0.0.1
// Created by: Nolan Ainsworth
// Private use only


const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

var prefix = "!";

client.on('ready', () => {
  console.log(`Successfully logged in as ${client.user.tag} `);
});

client.on('message', message => {
  if(message.content === 'ping'){
    message.reply("dont ping me idiot, wheres my jungler");
  }

  else if(message.content === '!kys'){
    console.log("terminated");
    client.destroy();
    process.exit(1);
  }

  else if(message.content === '!join') {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {
          const dispatcher = connection.playFile("./bell.mp3");

          dispatcher.on('end', () => {
              if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
              } else {
                console.log("error");
              }
          });
        }).catch(console.log);
    } else {
      message.reply("You aren't in a voice channel");
    }
  }
});

client.on('message', message => {
  if(message.content === '!kys'){
    console.log("terminated");
    client.destroy();
    process.exit(1);
  }
});

client.login(settings.token);
