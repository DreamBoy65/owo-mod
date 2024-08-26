module.exports = async msg => {
    const { client, channel, guild, author, content } = msg;
    if (author.id !== "408785106942164992") return;
    if (content.toLowerCase().includes("verify")) {
        client.help.isOkay = false;
        return client.help.log("Verify");
    }

    if (!content.includes(client.user.displayName)) return;

    // hunt
    if (content.includes("hunt")) {
        let gemRegex = new RegExp("\\b\\w*gem\\w*\\b", "gi");
        let gems = content.match(gemRegex) || [];
        await client.help.save("gem", gems);
        if (gems.length < 3) {
            await client.help.warn("Gems required, will try to use if found");
        }

        // zoo
        let zoo = await client.help.getZoo(content);
        let Zoo = client.help.oldDb.zoo;
        for (const a of zoo) {
            if (Zoo[a]) {
                Zoo[a] += 1;
            } else {
                Zoo[a] = 1;
            }
        }
        await client.help.save("zoo", Zoo);
    }

    // inv
    if (content.includes("Inventory")) {
        const inv = await client.help.extractEmoji(content);
        if (!inv || inv.length < 1) return;

        // gems
        let inUseGem = client.help.oldDb.gem;
        let gems = inv.filter(c => c.name.includes("gem"));
        if (inUseGem.length < 3) {
            let rankGems = await client.help.listByRank(gems);

            for (const e of ["1", "3", "4"]) {
                if (inUseGem.find(c => c.includes(e))) continue;
                let gem = rankGems.list.filter(c => c.name.includes(e))[0];
                if (!gem) continue;
                await client.send(`owo use ${gem.id}`);
                await client.help.log(`Gem used ${gem.name}:${gem.id}`);
            }
        }

        // crates and box
        if (inv.find(c => c.name === "box")) {
            await client.send("owo lootbox all");
            await client.help.log("Opened all lootboxes");
        }

        if (inv.find(c => c.name === "crate")) {
            await client.send("owo crate all");
            await client.help.log("Opened all crates");
        }
    }

    // sold
    if (content.includes("sold")) {
        let s = content.split("cowoncy");
        if (s[1]) {
            let cash = s[1].split(">")[1].replaceAll("*", "").trim();
            cash = Number(cash);
            if (typeof cash === "number") {
                await client.help.save("cash", cash, true);
            }
        }
    }
};
