const Product = require("../models/productModel");

const updateProductStock = ({ itemsArr, addStock }) => {
  const bulkOperations = itemsArr.map((item) => ({
    updateOne: {
      filter: { _id: item.product.id },
      update: {
        $inc: {
          "variants.$[variant].stock": addStock
            ? item.quantity
            : -item.quantity,
        },
      },
      arrayFilters: [{ "variant._id": item.variant.id }],
    },
  }));

  return Product.bulkWrite(bulkOperations);
};

module.exports = updateProductStock;
