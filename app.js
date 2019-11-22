// Cheong Bot
// Created by: Nolan Ainsworth
// Private use only

// TODO
// Implement lintr
// Rework stuff, clean it up (broad)

const Discord = require("discord.js");
const client = new Discord.Client();
const settings = require("./settings.json");
const fs = require("fs");

let VERSION = "1.4.2";
let NUM_OF_AUDIOS = 6; // number of possible audio files
let NUM_OF_ROSE = 1;
let NUM_OF_KOREAN = 4; // number of possible "korean" phrases
let commandPrefix = "!";
let randomCheongAudio = getRandomAudio(NUM_OF_AUDIOS);
let randomKorean = getRandomAudio(NUM_OF_KOREAN);

// Notifies console upon successful login
client.on("ready", () => {
  console.log(`Successfully logged in as ${client.user.tag} `);
  client.user.setActivity(`!help for cmds: v${VERSION}`);
});

// Prints error stacktrace if the bot crashes
client.on("error", e => console.error(e));

client.on("message", message => {
  // this is awful code, clean up
  // let it work with I'm, and handle periods, and words that start with "im"
  if (
    message.content.indexOf("Im") === 0 ||
    message.content.indexOf("im") === 0 ||
    message.content.indexOf("I'm") === 0 ||
    message.content.indexOf("i'm") === 0
  ) {
    console.log("Executing dad command");
    let content = message.content.split(",");
    let finalWord = content[0].slice(3, content[0].length);
    message.reply(`Hi ${finalWord}, I'm CheongBot!`);
  }

  if (message.content.indexOf(commandPrefix) !== 0) {
    return;
  }

  const args = message.content
    .slice(commandPrefix.length)
    .trim()
    .split(/ +/g)
  const command = args.shift().toLowerCase()

  console.log(`Command \'${command}\' received`)

  if (command === "help") {
    message.member.send(`Here are my functions:
    !cheong: joins voice channel and plays a cheong sound
    !hs [card]: tells you info about a given hearthstone card
    !bubba: he's coming
    !korean: Gives you a korean phrase of the day
    !acquired: acquired
    !dice [number]: rolls a dice with specified number of spaces, 6 if left blank
    !say: repeats back what you put after the command
    !ping: pong!
    !quit: disables me :( (if you're authorized to)
    I'm currently version ${VERSION}!`)

  } else if (command === "dev") {
    message.member.send(`Here are the dev commands:
    !dev-getuser: gives your discord user ID
    !dev-channels: logs the channel info to the console
    !ping: latency check`)

  } else if (command === "dev-getuser") {
    message.member.send(`Your user ID is: ${message.author.id}`)

  } else if (command === "dev-channels") {
    console.log(client.channels)

  } else if (command === "ping") {
    message.reply("pong!")

  } else if (command === "say") {
    message.channel.send(message.content.replace("!say ", ""))

  } else if (command === "hehe") {
    message.channel.send("hehe")
    
  } else if (command === "pipe") {
    message.channel.send("pipes aren't funny Rose.")

  } else if (command === "hello") {
    message.channel.send("jello")

  } else if (command === "acquired") {
    message.channel.send("Acquired", { files: ["./acquired.jpg"] })
  }

  // commented out as reference to how to use args (roughly)
  // else if(command === 'test') {
  //   let testArgs = args[0];
  //   message.channel.send(`test: ${testArgs}`);
  // }
  else if (command === "dice") {
    let faces = args[0]
    if (isNaN(faces)) message.channel.send(`You rolled a ${getRandom(6) + 1}`)
    else message.channel.send(`You rolled a ${getRandom(faces) + 1}`)
  } else if (command === "hs") {
    let cards = require("./hearthstone/cards.json")

    let targetCard = args.join(" ").toUpperCase()
    targetCard = checkNickname(targetCard)
    checkCard(targetCard, message, message.channel, cards)
  } else if (command === "cheong") {
    if (message.member.voiceChannel) {
      message.member.voiceChannel
        .join()
        .then(connection => {
          console.log(randomCheongAudio)
          const dispatcher = connection.playFile(`./audio/clip${randomCheongAudio}.mp3`)

          dispatcher.on("end", () => {
            if (message.guild.voiceConnection) {
              message.guild.voiceConnection.disconnect()
              randomCheongAudio = getRandomAudio(NUM_OF_AUDIOS)
              if (randomCheongAudio === 0) randomCheongAudio++
            } else {
              console.log("error")
            }
          })
        })
        .catch(console.log)
    } else {
      message.reply("You aren't in a voice channel")
    }
  } else if (command === "rose") {
    if (message.member.voiceChannel) {
      message.member.voiceChannel
        .join()
        .then(connection => {
          randomCheongAudio = getRandomAudio(NUM_OF_ROSE)
          if (randomCheongAudio === 0) randomCheongAudio = 1
          console.log(randomCheongAudio)
          const dispatcher = connection.playFile(`./audio/rose${randomCheongAudio}.mp3`)

          dispatcher.on("end", () => {
            if (message.guild.voiceConnection) {
              message.guild.voiceConnection.disconnect();
              randomCheongAudio = getRandomAudio(NUM_OF_ROSE);
              if (randomCheongAudio === 0) randomCheongAudio++
            } else {
              console.log("error");
            }
          })
        })
        .catch(console.log);
    } else {
      message.reply("You aren't in a voice channel");
    }
  } else if (command === "bubba") {
    if (message.member.voiceChannel) {
      message.member.voiceChannel
        .join()
        .then(connection => {
          const dispatcher = connection.playFile(`./audio/bubba.mp3`);

          dispatcher.on("end", () => {
            if (message.guild.voiceConnection) {
              message.guild.voiceConnection.disconnect();
            } else {
              console.log("error")
            }
          });
        })
        .catch(console.log);
    } else {
      message.reply("You aren't in a voice channel");
    }
  } else if (command === "korean") {
    randomKorean = getRandom(NUM_OF_KOREAN + 1);
    if (randomKorean === 0) {
      randomKorean++;
    }

    let korean = fs.readFileSync(`./korean/${randomKorean}.txt`, {
      encoding: "utf-8",
    });
    message.channel.send(korean);
  } else if (command === "olivia") {
    message.reply("hai ahm Ohliveeah");

  // TODO: add the id's to a seperate file, check if in
  } else if (command === "quit") {
    if (
      message.author.id === "126539294549606400" ||
      message.author.id === "162286234176061440"
    ) {
      console.log("terminated");
      client.destroy();
      process.exit(1);
    } else {
      message.channel.send("Sorry, you aren't approved to disconnect me");
    }
  }
});

client.login(settings.token)

// Functions that don't interact with Discord API
// Almost all of these need to get gutted and reworked
// like some of these are real dumpster fires. oof

function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomAudio(max) {
  max++;
  let result = Math.floor(Math.random() * Math.floor(max));
  if (result === 0) {
    max--;
    getRandomAudio(max);
  }
  return result;
}

// How can this be done better?
// is this not the same thing as the other string cleaning function?
function stripEffect(line) {
  i = 0;
  while (i < line.length) {
    line = line.replace("\n", " ");
    line = line.replace("<b>", "**");
    line = line.replace("</b>", "**");
    line = line.replace("<b>", "**");
    line = line.replace("</b>", "**");
    line = line.replace("\n", "");
    line = line.replace("<i>", "_");
    line = line.replace("</i>", "_");
    line = line.replace("#", "");
    line = line.replace("$", "");
    line = line.replace("[x]", ""); // Why does this show up on cards?
    i++;
  }
  return line;
}

function checkNickname(targetCard) {
  oldTargetCard = targetCard;
  cards = require("./hearthstone/nicknames.json");
  for (let i = 0; i < cards.length; i++) {
    curr = cards[i].name;
    if (curr === undefined) {
      console.log("no nickname found");
    } else if (curr.toUpperCase() === targetCard) {
      targetCard = cards[i].realname;
      console.log(`nickname found, real name: ${targetCard}`);
      break;
    }
  }

  if (targetCard === oldTargetCard) {
    console.log("no nickname found");
  }
  return targetCard;
}

// This also needs a rework
function constructResult(result) {
  emoji = ":no_entry:";
  if (result.set === "CORE") {
    result.set = "BASIC";
    emoji = ":dragon:";
  } else if (result.set === "EXPERT1") {
    result.set = "CLASSIC";
    emoji = ":dragon:";
  } else if (result.set === "GILNEAS") {
    result.set = "WITCHWOOD";
    emoji = ":dragon:";
  } else if (result.set === "BOOMSDAY") {
    emoji = ":dragon:";
  } else if (result.set === "TROLL") {
    result.set = "RASTAKHAN'S RUMBLE";
    emoji = ":dragon:";
  } else if (result.set === "LOOTAPALOOZA") {
    result.set = "K&C";
  }

  if (result.rarity === "FREE") {
    result.rarity = "BASIC";
  }

  if (result.type === "MINION") {
    if (result.rarity === undefined) {
      result.rarity = "token";
    }
    resultString = `${result.name}: ${emoji}
    ${toProperCase(
      result.rarity
    )} ${result.cardClass.toLowerCase()} ${result.type.toLowerCase()} from ${result.set.toLowerCase()}
    ${result.cost}/${result.attack}/${result.health} | ${result.text}`;
  } else if (result.type === "SPELL") {
    resultString = `${result.name}: ${emoji}
    ${toProperCase(
      result.rarity
    )} ${result.cardClass.toLowerCase()} ${result.type.toLowerCase()} from ${result.set.toLowerCase()}
    ${result.cost} mana | ${result.text}`;
  } else if (result.type === "HERO") {
    resultString = `${result.name}: ${emoji}
    ${toProperCase(
      result.rarity
    )} ${result.cardClass.toLowerCase()} ${result.type.toLowerCase()} from ${result.set.toLowerCase()}
    ${result.cost} mana / ${result.armor} armor | ${result.text}`;
  } else if (result.type === "WEAPON") {
    resultString = `${result.name}: ${emoji}
    ${toProperCase(
      result.rarity
    )} ${result.cardClass.toLowerCase()} ${result.type.toLowerCase()} from ${result.set.toLowerCase()}
    ${result.cost}/${result.attack}/${result.durability} | ${result.text}`;
  }
  return resultString;
}

// This needs to be reworked, might be able to remove with lodash
function toProperCase(string) {
  let correctdString = string.toLowerCase();
  return correctedString.charAt(0).toUpperCase() + correctedString.slice(1);
}

// This needs to be reworked, might be able to remove with lodash
function cleanString(string) {
  string = string.toUpperCase();
  string.replace(",", "");
  string.replace("-", "");
  string.replace("!", "");
  string.replace("#", "");
  string.replace("/", "");
  string.replace(".", "");
  return string;
}

function checkCard(targetCard, message, channel, cards) {
  console.log(targetCard);

  // Search through the cardbase to find the card, or fail
  let result = 0;
  for (let i = 0; i < cards.length; i++) {
    currentCard = cards[i].name;
    if (currentCard === undefined) {
      console.log("card failed to be found");
    } else if (currentCard.toUpperCase() === targetCard) {
      result = cards[i];
      break;
    }
  }

  // With the retrieved card, construct the string to send to user
  let resultString = "Card not found";
  if (result != 0) {
    if (result.text === undefined) { 
      result.text = "";
    }    
    result.text = stripEffect(result.text);
    resultString = constructResult(result);
  }
  console.log(result);
  if (result != 0) {
    message.channel.send(resultString);
  } else {
    message.channel.send(`Card not found`);
  }
}
