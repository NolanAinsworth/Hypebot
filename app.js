// Cheong Bot 0.0.1
// Created by: Nolan Ainsworth
// Private use only


const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

var NUM_OF_AUDIOS = 2 //number of possible audio files, plus 1
var prefix = "!";
var random = getRandom(NUM_OF_AUDIOS);
if(random == 0)
  random++;

client.on('ready', () => {
  console.log(`Successfully logged in as ${client.user.tag} `);
});

client.on('message', message => {
  if(message.content === 'ping'){
    message.reply("pong!");
  }

  else if(message.content === '!quit'){ // repeat? check later
    console.log("terminated");
    client.destroy();
    process.exit(1);
  }

  else if(message.content === '!help') {
    message.reply(`Here are my functions:
    !join: joins voice channel and plays a sound -- temporary
    ping: pong!
    !quit: disables me :( `);
  }

  else if(message.content === '!join') {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {

          const dispatcher = connection.playFile(`./audio/clip${1}.mp3`);

          dispatcher.on('end', () => {
              if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
                random = getRandom(NUM_OF_AUDIOS);
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

client.login(settings.token);

// Functions that don't interact with Discord

function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function waiter() {
  console.log("waiting");
}
