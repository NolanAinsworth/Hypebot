// Cheong Bot
// Created by: Nolan Ainsworth
// Private use only

const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const fs = require('fs');

let VERSION = "1.2.3"
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
  client.user.setActivity(`!help for cmds: v${VERSION}`);
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
    !hs [card]: tells you info about a given hearthstone card
    !bubba: he's coming
    !korean: Gives you a korean phrase of the day
    !acquired: acquired
    !dice [number]: rolls a dice with specified number of spaces, 6 if left blank
    !say: repeats back what you put after the command
    !ping: pong!
    !quit: disables me :(
    I'm currently version ${VERSION}!`);
  }

  else if(command === 'dev') {
    message.member.send(`Here are the dev commands:
    !dev-getuser: gives your discord user ID
    !dev-channels: logs the channel info to the console
    !ping: latency check`);
  }

  else if(command === 'dev-getuser') {
    message.member.send(`Your user ID is: ${message.author.id}`);
  }

  else if(command === 'dev-channels') {
    console.log(client.channels);
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

  else if(command === 'hello') {
    message.channel.send("jello");
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
    let faces = args[0];
    if(isNaN(faces))
      message.channel.send(`You rolled a ${getRandom(6) + 1}`)
    else
      message.channel.send(`You rolled a ${getRandom(faces) + 1}`);
  }

  else if(command === 'hs') {
    let cards = require('./hearthstone/cards.json');
    let targetCard = args.join(' ').toUpperCase();
    targetCard = checkNickname(targetCard);
    console.log(targetCard);
    var result = 0;
    for(var i = 0; i < cards.length; i++) {
      curr = cards[i].name;
      if(curr === undefined) {
        console.log("card failed to be found");
      }
      else if(curr.toUpperCase() === targetCard) {
        result = cards[i];
        console.log(result);
        break;
      }
    }
    resultString = "Card not found";
    if(result != 0) {
      if(result.text === undefined)
        result.text = "";
      result.text = stripEffect(result.text);
      resultString = constructResult(result)
    }
    // if(result.type === "MINION") {
    //   resultString = `${result.name}:
    //   ${result.cost} mana
    //   ${result.attack} attack
    //   ${result.health} health
    //   Effect: ${result.text}`
    // } else if(result.type === "SPELL") {
    //   resultString = `${result.name}:
    //   ${result.cost} mana
    //   Effect: ${result.text}`
    // } else if (result.type === "HERO") {
    //   resultString = `${result.name}:
    //   ${result.cost} mana
    //   ${result.armor} armor
    //   Effect: ${result.text}`
    // } else if (result.type === "WEAPON") {
    //   resultString = `${result.name}:
    //   ${result.cost} mana
    //   ${result.attack} attack
    //   ${result.durability} durability
    //   Effect: ${result.text}`
    // }

    console.log(result);
    if(result != 0)
      message.channel.send(resultString);
    else {
      message.channel.send(`Card not found`);
    }

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
    if(message.author.id === "126539294549606400" ||
       message.author.id === "162286234176061440") { // CHECK IF THIS WORKS
      message.channel.send("Disconnecting, bye!"); // fix this
      console.log("terminated");
      client.destroy();
      process.exit(1);
    }
    else {
      message.channel.send("Sorry, you aren't approved to disconnect me");
    }
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

function stripEffect(line) {
  line = line.replace("<b>", '**');
  line = line.replace("</b>", '**');
  line = line.replace("\n", '');
  line = line.replace("<i>", '_');
  line = line.replace("</i>", '_');
  line = line.replace("#", '');
  line = line.replace("$", '');
  return line;
}

function checkNickname(targetCard) {
  oldTargetCard = targetCard;
  cards = require('./hearthstone/nicknames.json');
  for(var i = 0; i < cards.length; i++) {
    curr = cards[i].name;
    if(curr === undefined) {
      console.log("no nickname found");
    }
    else if(curr.toUpperCase() === targetCard) {
      targetCard = cards[i].realname;
      console.log(`nickname found, real name: ${targetCard}`);
      break;
    }
  }

  if(targetCard === oldTargetCard)
    console.log("no nickname found");
  return targetCard;
}

function constructResult(result) {
  emoji = ":no_entry:";
  if(result.set === "CORE") {
    result.set = "BASIC";
    emoji = ":dragon:";
  } else if(result.set === "EXPERT1") {
    result.set = "CLASSIC";
    emoji = ":dragon:";
  } else if(result.set === "GILNEAS") {
    result.set = "WITCHWOOD";
    emoji = ":dragon:";
  } else if(result.set === "BOOMSDAY") {
    emoji = ":dragon:";
  } else if(result.set === "TROLL") {
    result.set = "RASTAKHAN'S RUMBLE";
    emoji = ":dragon:";
  }

  if(result.rarity === "FREE") {
    result.rarity = "BASIC";
  }

  if(result.type === "MINION") {
    resultString = `${result.name}: ${emoji}
    ${toProperCase(result.rarity)} ${result.cardClass.toLowerCase()} ${result.type.toLowerCase()} from ${result.set.toLowerCase()}
    ${result.cost}/${result.attack}/${result.health} | ${result.text}`
  } else if(result.type === "SPELL") {
    resultString = `${result.name}: ${emoji}
    ${toProperCase(result.rarity)} ${result.cardClass.toLowerCase()} ${result.type.toLowerCase()} from ${result.set.toLowerCase()}
    ${result.cost} mana | ${result.text}`
  } else if (result.type === "HERO") {
    resultString = `${result.name}: ${emoji}
    ${toProperCase(result.rarity)} ${result.cardClass.toLowerCase()} ${result.type.toLowerCase()} from ${result.set.toLowerCase()}
    ${result.cost} mana / ${result.armor} armor | ${result.text}`
  } else if (result.type === "WEAPON") {
    resultString = `${result.name}: ${emoji}
    ${toProperCase(result.rarity)} ${result.cardClass.toLowerCase()} ${result.type.toLowerCase()} from ${result.set.toLowerCase()}
    ${result.cost}/${result.attack}/${result.durability} | ${result.text}`
  }

  return resultString;
}

function toProperCase(string) {
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
}
