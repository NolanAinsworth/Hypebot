// Cheong Bot 1.1.7
// Created by: Nolan Ainsworth
// Private use only

const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const fs = require('fs');

var NUM_OF_AUDIOS = 6; // number of possible audio files
var NUM_OF_KOREAN = 4; // number of possible "korean" phrases
var prefix = "!";
var random = getRandomAudio(NUM_OF_AUDIOS);
var randomKorean = getRandomAudio(NUM_OF_KOREAN);

client.on('ready', () => {
  console.log(`Successfully logged in as ${client.user.tag} `);
  //console.log(client.channels); // returns list of channels bot is in
  //let channel = client.channels.get('193225167671918592');
  //channel.send("message on login -- commented for reference");
  client.user.setActivity('!help for cmds: v1.1.7');
});

client.on('error', (e) => console.error(e));

client.on('message', message => {

  if (message.content.indexOf(prefix) !== 0) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  console.log(`Command \'${command}\' received`);

  if(command === 'help') {
    message.member.send(`Here are my functions:
    !cheong: joins voice channel and plays a cheong sound
    !bubba: he's coming
    !korean: Gives you a korean phrase of the day
    !acquired: acquired
    !dice: rolls a dice
    !say: repeats back what you put after the command
    !ping: pong!
    !quit: disables me :(
    I'm currently version 1.1.7!`);
  }

  else if(command === 'ping') {
    message.reply("pong!");
  }

  else if(command === 'say') {
    message.channel.send(message.content.replace('!say ',''));
  }

  else if(command === 'hehe') {
    message.channel.send("hehe");
  }

  else if(command === 'pipe') {
    message.channel.send("pipes aren't funny Rose.");
  }

  else if(command === 'acquired') {
    message.channel.send("Acquired", {files: ["./acquired.jpg"]});
  }

  // commented out as reference to how to use args (roughly)
  // else if(command === 'test') {
  //   let testVar = args[0];
  //   message.channel.send(`test: ${testVar}`);
  // }

  else if(command === 'dice') {
    message.channel.send(`You rolled a ${getRandom(7)}`);
  }

  else if(command === 'cheong') {
    if(message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => {
          console.log(random);
          const dispatcher = connection.playFile(`./audio/clip${random}.mp3`);

          dispatcher.on('end', () => {
              if(message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
                random = getRandomAudio(NUM_OF_AUDIOS);
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

  else if(command === 'korean') {
    //let w = window.open(`${randomKorean}.txt`);
    //message.channel.send(w.print());
    randomKorean = getRandom(NUM_OF_KOREAN + 1);
    if(randomKorean === 0)
      randomKorean++;

    var korean = fs.readFileSync(`./korean/${randomKorean}.txt`, {"encoding": "utf-8"});
    message.channel.send(korean);
  }

  else if(command === 'quit') {
    console.log("terminated");
    client.destroy();
    process.exit(1);
  }

});

client.login(settings.token);

// Functions that don't interact with Discord API

function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomAudio(max) {
  max++;
  let result = Math.floor(Math.random() * Math.floor(max));
  if(result === 0) {
    max--;
    getRandomAudio(max);
  }
  return result;
}
