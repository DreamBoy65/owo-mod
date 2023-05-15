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

let isOkay = true;

client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  console.log("starting auto bot....");

  await setupBot();
});

client.on("messageCreate", (msg) => {
  if (msg.author.id !== "408785106942164992") return;

  if (msg.content.includes("verified")) {
    console.log("Verified! continuing work....");
    isOkay = true;
  }

  if (
    msg.content.includes("verify") &&
    msg.content.includes(client.user.username)
  ) {
    console.log("Verification Detected.");
    client.channels.cache
      .get(config.channel)
      .send("Bot stopped!, Verification detected!");
    isOkay = false;
  }
});

async function setupBot() {
  let channel = client.channels.cache.get(config.channel);
  const send = (msg) => channel.send(msg);
  const log = (msg) => console.log(msg);

  for (let i = 0; i < Infinity; i++) {
    if (isOkay) {
      send("owo hunt");
      log("sent owo hunt.");

      await sleep(5);

      send("owo battle");
      log("sent owo battle.");

      await sleep(5);

      send("owo sell all");
      log("sent sell all");

      await sleep(20);
    }
  }
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

client.login(config.token);
