module.exports = async (msg, newMsg) => {
  const { client, channel, guild, author, content } = newMsg;

  if (!author || author?.id !== "408785106942164992") return;
  if (!content.includes(client.user.displayName)) return;

  if (content.includes("coin spins") && content.includes("you won")) {
    let s = content.split("cowoncy");
    if (!s[s.length - 1]) return;
    let cash = s[s.length - 1]
      .split(">")[1]
      .replaceAll("*", "")
      .replaceAll("!", "");
    cash = Number(cash);
    if (typeof cash === "number") {
      await client.help.save("cash", cash, true);
      await client.help.log("Won CF " + cash);
    }
  }
};
