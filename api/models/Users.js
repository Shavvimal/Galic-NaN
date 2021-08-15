const db = require("../dbConfig/init");
const Stocks = require("./StocksBought");

module.exports = class Users {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }

  // returns all user stocks

  static get all() {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log(db);
        const result = await db.query("SELECT * FROM users;");
        const users = result.rows.map((u) => ({ id: u.id, name: u.name }));
        resolve(users);
      } catch (err) {
        reject("Error retrieving users");
      }
    });
  }

  static usersStocks(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.query(
          "SELECT buy_id, name, sector, ticker, fee, buy_level, num_shares, stored_price, date_of_purchase FROM buys WHERE user_id = $1",
          [id]
        );
        const buys = result.rows.map((s) => ({
          id: s.buy_id,
          ticker: s.ticker,
          name: s.name,
          sector: s.sector,
          fee: s.fee,
          buy_level: s.buy_level,
          num_shares: s.num_shares,
          stored_price: s.stored_price,
          date_of_purchase: s.date_of_purchase
        }));
        const result2 = await db.query(
          "SELECT id, name, sector, ticker, fee, buy_level, num_shares, stored_price, date_of_purchase FROM sells WHERE user_id = $1",
          [id]
        );
        const sells = result2.rows.map((s) => ({
          id: s.id,
          ticker: s.ticker,
          name: s.name,
          sector: s.sector,
          fee: s.fee,
          buy_level: s.buy_level,
          num_shares: s.num_shares,
          stored_price: s.stored_price,
          date_of_purchase: s.date_of_purchase
        }));
        resolve({buys,sells});
      } catch (err) {
        reject("Users stocks could not be found");
      }
    });
  }

  // create a user

  static create(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let userData = await db.query(
          "INSERT INTO users (name, password, email) VALUES ($1,$2,$3) RETURNING *;",
          [data.name,data.password,data.email]
        );
        let user = new Users(userData.rows[0]);
        resolve(user);
      } catch (err) {
        reject("User could not be created");
      }
    });
  }

  // create a function findbyEmail

  static findByEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        let userEmail = await db.query(
          "SELECT * FROM users WHERE email = $1;",
          [email]
        );
        let user = new Users(userEmail.rows[0]);
        resolve(user);
      } catch (err) {
        reject("User Email not found");
      }
    });
  }

  static findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let userData = await db.query("SELECT * FROM users WHERE id = $1;", [
          id,
        ]);
        let user = new Users(userData.rows[0]);
        resolve(user);
      } catch (err) {
        reject("User not found");
      }
    });
  }

  // delete user

  destroy() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.query(
          "DELETE FROM users WHERE id = $1 RETURNING id",
          [this.id]
        );
        resolve(`User ${result.id} was deleted`);
      } catch (err) {
        reject("User could not be deleted");
      }
    });
  }
};
