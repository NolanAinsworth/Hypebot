// Cheong Bot 1.0.1
// Created by: Nolan Ainsworth
// Private use only


const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');

var NUM_OF_AUDIOS = 7 //number of possible audio files, plus 1
var prefix = "!";
var random = getRandom(NUM_OF_AUDIOS);
if(random == 0)
  random++;

client.on('ready', () => {
  console.log(`Successfully logged in as ${client.user.tag} `);
  client.user.setActivity('inting botlane');
});

client.on('message', message => {

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  console.log(`Command \'${command}\' received`);

  if(command === 'ping'){
    message.reply("pong!");
  }

  else if(command === 'quit'){
    console.log("terminated");
    client.destroy();
    process.exit(1);
  }

  else if(command === 'test') {
    let testVar = args[0];
    message.channel.send(`test: ${testVar}`);
  }

  else if(command === 'help') {
    message.reply(`Here are my functions:
    !join: joins voice channel and plays a sound
    !bubba: he's coming
    !dice: rolls a dice
    !ping: pong!
    !quit: disables me :( `);
  }

  else if(command === 'dice') {
    message.channel.send(`You rolled a ${getRandom(7)}`);
  }

  else if(command === 'bubba') {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {
          const dispatcher = connection.playFile(`./audio/bubba.mp3`);

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

  else if(command === 'join') {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {
          console.log(random);
          const dispatcher = connection.playFile(`./audio/clip${random}.mp3`);

          dispatcher.on('end', () => {
              if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
                random = getRandom(NUM_OF_AUDIOS);
                if(random === 0)
                  random++;
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
