const db = require("../dbConfig/init");

const User = require("./Users");

class StocksBought {
  constructor(data) {
    this.buy_id = data.buy_id;
    this.ticker = data.ticker;
    this.fee = data.fee;
    this.buy_level = data.buy_level;
    this.num_shares = data.num_shares;
    this.stored_price = data.stored_price;
    this.date_of_purchase = data.date_of_purchase;
    this.user = {
      name: data.name,
      path: `/users/${data.user_id}`,
    };
  }

  static get all() {
    return new Promise(async (resolve, reject) => {
      try {
        let buyData = await db.query("SELECT * FROM buys");
        let buys = buyData.rows.map((b) => new StocksBought(b));
        resolve(buys);
      } catch (err) {
        reject("Your stocks cannot be found");
      }
    });
  }

  static findById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        let buyData = await db.query(
          `SELECT buys.*, users.name as user_name
          FROM buys JOIN users
          ON buys.user_id = users.id
          WHERE buys.buy_id = $1;`,
          [id]
        );
        let buy = new StocksBought(buyData.rows[0]);
        resolve(buy);
      } catch (err) {
        reject("Stock not found");
      }
    });
  }

  static async create(buyData) {
    return new Promise(async (resolve, reject) => {
      console.log(buyData);
      
      try {
        if(!buyData.date_of_purchase){
          console.log(buyData)
          let result = await db.query(
            `INSERT INTO buys (ticker,name, sector, fee, buy_level, num_shares, stored_price,user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING buy_id`,
            [
              buyData.ticker,
              buyData.name,
              buyData.sector,
              buyData.fee,
              buyData.buy_level,
              buyData.num_shares,
              buyData.buy_level,
              buyData.user_id
            ]
          );
          console.log(result)
          resolve(result.rows[0]);
        }
        else{
          console.log(buyData);
            let result = await db.query(
              `INSERT INTO buys (ticker,name, sector, fee, buy_level, num_shares, stored_price, user_id, date_of_purchase) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::timestamp) RETURNING buy_id`,
              [
                buyData.ticker,
                buyData.name,
                buyData.sector,
                buyData.fee,
                buyData.buy_level,
                buyData.num_shares,
                buyData.buy_level,
                buyData.user_id,
                buyData.date_of_purchase
              ]
            );
            console.log(result)
            resolve(result.rows[0]);
        }
      } catch (err) {
        reject("Stock could not be bought");
      }
    });
  }
  destroy() {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await db.query(
          "DELETE FROM buys WHERE buy_id = $1 RETURNING buy_id",
          [this.buy_id]
        );
      
        resolve("Stock bought was deleted "+result);
      } catch (err) {
        reject("Stock bought could not be deleted");
      }
    });
  }
  update() {
    return new Promise (async (resolve, reject) => {
        try {
            let updatedbuyData = await db.query(`UPDATE buys SET num_shares = $1 WHERE buy_id = $2 RETURNING *;`, [ this.num_shares, this.buy_id ]);
            let updatedBuy = new StocksBought(updatedbuyData.rows[0]);
            resolve (updatedBuy);
        } catch (err) {
            reject('Error updating stock bought');
        }
    });
  }
}
module.exports = StocksBought;
