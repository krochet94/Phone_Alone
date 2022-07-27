const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  brand: {
    type: String,
    required: [true, "Please enter product brand"],
    enum: {
      values: [
        "Samsung",
        "Apple",
        "Huawei",
        "Xiaomi",
        "Oppo",
        "Vivo",
        "Motorola",
        "Lenovo",
        "LG",
        "Asus",
        "Realme",
        "Sony",
        "ZTE",
        "Nokia",
        "Poco",
        "Infinix",
        "Others",
      ],
      message: "Please select brand name",
    },
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [6, "Product price cannot exceed 999,999"],
    default: 0.0,
  },
  specs: {
    processor: {
      type: String,
      required: [true, "Please enter processor details"],
    },
    memory: {
      type: Number,
      required: [true, "Please enter ram size in GB"],
      default: 0,
    },
    storage: {
      type: Number,
      required: [true, "Please enter storage size in GB"],
      default: 0,
    },
    display: {
      type: Number,
      required: [true, "Please enter display size in inches"],
      default: 0,
    },
    camera: {
      front: {
        type: Number,
        required: [true, "Please enter front camera specs in MP(megapixels)"],
      },
      rear: {
        type: Number,
        required: [true, "Please enter rear camera specs in MP(megapixels)"],
      },
    },
    os: {
      type: String,
      required: [true, "Please enter operating system details"],
    },
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  rating: {
    type: Number,
    default: 0.0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [5, "Product price cannot exceed 99,999 units"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
    },
  ],
  createAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
