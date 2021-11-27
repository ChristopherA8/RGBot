const { MongoClient } = require("mongodb");
const Points = require("./Points");
const Filter = require("./Filter");

class Mongo {
  constructor() {
    const url = "mongodb://localhost:27017/";

    this.client = new MongoClient(url);
  }
  async init() {
    await this.client.connect();
    console.log("[BOT] Connected to MongoDB rebel");

    this.db = this.client.db("rebel");
    this.Points = new Points(this.db);
    this.Filter = new Filter(this.db);
  }
}

module.exports = new Mongo();
