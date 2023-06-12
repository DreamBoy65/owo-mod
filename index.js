const {
  Client,
  CustomStatus,
  WebhookClient,
  Collection,
} = require("discord.js-selfbot-v13");
const config = require("./config.js");
const client = new Client({
  checkUpdate: false,
});
require("@colors/colors");
const {
  readFile,
  writeFile,
  readdir,
  lstat,
  access,
  constants,
} = require("fs/promises");
let data = {
  commandsUsed: 0,
  cashEarned: 0,
  zoo: {},
  lost: 0,
  won: 0,
};

let dat = {
  commandsUsed: 0,
  cashEarned: 0,
  zoo: {},
  lost: 0,
  won: 0,
};

let isOkay = true;

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  console.log("starting auto bot....".blue);

  let Data = await readFile("./file.json").catch((e) => null);

  if (!Data) {
    await writeFile("./file.json", JSON.stringify(data));
  } else if (Data) {
    data = JSON.parse(Data);
  }

  console.log("Loaded data..".blue);

  await setupBot();
});

client.on("messageCreate", async (msg) => {
  if (msg.author.id === client.user.id) {
    if (msg.content === "owo selfstat") {
      msg.reply({
        content: `=====*STATS*=====\n**CashEarned:** ${
          data.cashEarned
        }\n**CommandsUsed:** ${
          data.commandsUsed
        }\n\n=====*ZOO*=====\n${Object.keys(data.zoo)
          .map((e) => {
            return `${e}x${data.zoo[e]}`;
          })
          .join(", ")}`,
      });

      msg.reply({
        content: `~~~~~*Current Porcess*~~~~~\n\n=====*STATS*=====\n**CashEarned:** ${
          dat.cashEarned
        }\n**CommandsUsed:** ${
          dat.commandsUsed
        }\n\n=====*ZOO*=====\n${Object.keys(dat.zoo)
          .map((e) => {
            return `${e}x${dat.zoo[e]}`;
          })
          .join(", ")}`,
      });
    }
  }
  if (msg.author.id !== "408785106942164992") return;

  if (msg.content.includes("verified")) {
    console.log("Verified! continuing work....".green);
    client.channels.cache
      .get(config.channel)
      .send("Bot continuing!, Verified!");
    isOkay = true;
  }

  if (msg.content.includes(client.user.username)) {
    if (msg.content.includes("sold")) {
      let cash = msg.content
        .split(" ")
        [msg.content.split(" ").length - 1].replace("**", "");
      data["cashEarned"] += Number(cash);
      dat["cashEarned"] += Number(cash);
    }

    if (msg.content.includes("found")) {
      let zoos = msg.content
        .split("found:")[1]
        ?.split("<")[0]
        ?.trim()
        .split(" ");

      zoos?.forEach((e) => {
        if (e.includes("<") && e.includes(">")) {
          let i = e.match(/(?<=:)([^:\s]+)(?=:)/g);
          if (data["zoo"][i[0]]) {
            data["zoo"][i[0]] += 1;
          } else {
            data["zoo"][i[0]] = 1;
          }

          if (dat["zoo"][i[0]]) {
            dat["zoo"][i[0]] += 1;
          } else {
            dat["zoo"][i[0]] = 1;
          }
        } else {
          if (data["zoo"][e]) {
            data["zoo"][e] += 1;
          } else {
            data["zoo"][e] = 1;
          }

          if (dat["zoo"][e]) {
            dat["zoo"][e] += 1;
          } else {
            dat["zoo"][e] = 1;
          }
        }
      });
    }

    if (msg.content.includes("verify")) {
      console.log("Verification Detected.".red);
      client.channels.cache
        .get(config.channel)
        .send("Bot stopped!, Verification detected!");
      isOkay = false;
    }

    await save();
  }
});

client.on("messageUpdate", async (message) => {
  let channel = client.channels.cache.get(message.channelId);
  let msg = await channel.messages.fetch(message.id);
  if (!msg) return;

  if (msg.author.id !== "408785106942164992") return;

  if (
    msg.embeds.length > 0 &&
    msg.embeds[0]?.author?.name?.includes(client.user.username) &&
    msg.embeds[0]?.author?.name?.includes("battle")
  ) {
    prev = msg.embeds[0].footer.text;
    if (msg.embeds[0].footer.text.includes("won")) {
      data["won"] += 1;
      dat["won"] += 1;
    } else if (msg.embeds[0].footer.text.includes("lost")) {
      data["lost"] += 1;
      dat["lost"] += 1;
    }
  }

  await save();
});
async function setupBot() {
  let channel = client.channels.cache.get(config.channel);
  const send = (msg) => channel.send(msg);
  const log = (msg) => console.log(msg.yellow);

  for (let i = 0; i < Infinity; i++) {
    if (isOkay) {
      send("owo hunt");
      log("sent owo hunt.");
      data["commandsUsed"] += 1;
      dat["commandsUsed"] += 1;

      await sleep(5);

      send("owo battle");
      log("sent owo battle.");
      data["commandsUsed"] += 1;
      dat["commandsUsed"] += 1;

      await sleep(5);

      send("owo sell all");
      log("sent sell all");
      data["commandsUsed"] += 1;
      dat["commandsUsed"] += 1;

      await save();
      await sleep(5);
      await sleep(Math.floor(Math.random() * 15));
    }
  }
}

async function save() {
  return await writeFile(config.data, JSON.stringify(data));
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

client.login(config.token);
