const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  title: {
    type: String,
  },
});

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
