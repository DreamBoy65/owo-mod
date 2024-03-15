const config = require("./config.js");
const {
  readFile,
  writeFile,
  readdir,
  lstat,
  access,
  constants,
} = require("fs/promises");

class Help {
  constructor() {
    this.isOkay = true;
  }

  async setup() {
    this.oldDb = await this.getDB();
    this.currentDb = this.getConfig();
    console.log(">>> DB Loaded".green);
  }

  wait(seconds) {
    let time = this.getRand(seconds, seconds + 5);
    return new Promise((resolve) => setTimeout(resolve, time * 1000));
  }

  log(msg) {
    return console.log(`>>> [${new Date().toLocaleString()}] : ${msg}.`.yellow);
  }

  warn(msg) {
    return console.log(`>>> [${new Date().toLocaleString()}] : ${msg}.`.red);
  }

  async getZoo(str) {
    let zoo = [];
    let s1 = str.split("found:")[1];
    if (!s1) return zoo;

    let s2 = s1.split("\n")[0].split(" ");
    if (!s2) return zoo;
    zoo.push(...s2);

    let s3 = s1.split("\n")[1].split("<");
    if (!s3) return zoo;

    /* for (const e of s3) {
      let i = e.match(/(?<=:)([^:\s]+)(?=:)/g);
      console.log(i);
      /*if (i[0] && i[0]?.trim()) {
        zoo.push(i[0].trim());
      }
    }*/

    return zoo;
  }

  async save(key, value, add = false) {
    if (key === "cash") {
      if (!this.oldDb.cash || !this.currentDb.cash) {
        this.oldDb.cash = 0;
        this.currentDb.cash = 0;
      }
    }

    if (add) {
      this.oldDb[key] += value;
      this.currentDb[key] += value;
    } else {
      this.oldDb[key] = value;
      this.currentDb[key] = value;
    }
    await this.write();

    return {
      old: this.oldDb,
      current: this.currentDb,
    };
  }

  async write(db) {
    return await writeFile(config.data, JSON.stringify(db ?? this.oldDb)).catch(
      (e) => null
    );
  }

  async getDB() {
    let db = await readFile(config.data).catch((e) => null);
    if (!db) {
      db = await writeFile(config.data, JSON.stringify(this.getConfig())).catch(
        (e) => null
      );
      db = this.getConfig();
    } else {
      db = db.toString();
    }

    return typeof db === "object" ? db : JSON.parse(db);
  }

  extractEmoji(str) {
    let s = str.split(" ");
    let res = [];
    for (const e of s) {
      res.push({
        name: e.split(":")[1],
        id: e.split("`")[1],
      });
    }
    return res.filter((c) => c.name && c.id);
  }

  listByRank(list) {
    let res = [];
    let ress = [];
    let ranks = ["c", "u", "r", "e", "m", "l", "g", "f"].reverse();

    for (const rank of ranks) {
      let items = list.filter((c) => c.name.split("")[0] === rank);
      if (items.length > 0) {
        ress.push(...items);
        res.push({
          rank,
          items,
        });
      }
    }
    return {
      items: res,
      list: ress,
    };
  }

  getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getConfig() {
    return {
      cmds: 0,
      cash: 0,
      zoo: {},
      gem: [],
      daily: 0,
    };
  }
}
module.exports = Help;
