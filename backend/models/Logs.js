const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["in", "out", "adjustment", "transfer"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    transferDetails: {
      fromLocationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
      toLocationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);