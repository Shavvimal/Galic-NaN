const StocksBought = require("../models/StocksBought");

async function index(req, res) {
  try {
    const stockBought = await StocksBought.all;
    res.status(200).json(stockBought);
  } catch (err) {
    res.status(500).json({ err });
  }
}

async function show(req, res) {
  try {
    const stockBought = await StocksBought.findById(req.params.buy_id);
    res.status(200).json(stockBought);
  } catch (err) {
    res.status(404).json({ err });
  }
}

async function create(req, res) {
  try {
    console.log(req.body)
    const stockBought = await StocksBought.create(req.body);
    res.status(201).json(stockBought);
  } catch (err) {
    res.status(422).json({ err });
  }
}

async function destroy(req, res) {
  try {
    const stockBought = await StocksBought.findById(req.params.buy_id);
    const resp = await stockBought.destroy();
    console.log(resp)
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ err });
  }
}
async function update(req, res) {
  try {
    const stockBought = new StocksBought(req.body);
    const resp = await stockBought.update();
    console.log(resp)
    res.status(204).end();
  } catch (err) {
    res.status(404).json({ err });
  }
}


module.exports = { index, show, create, destroy, update };
