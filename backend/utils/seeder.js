const Product = require("../models/product");
const connectDatabase = require("../config/database");
const loadEnv = require("../config/loadEnv");

const products = require("../data/products");

loadEnv();

const seedProducts = async () => {
  try {
    await connectDatabase();

    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("All products are added");

    process.exit();
  } catch (e) {
    console.log(e.message);
    process.exit();
  }
};

seedProducts();
