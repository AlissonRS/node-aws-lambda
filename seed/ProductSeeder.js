const mongoose = require('mongoose');
const ProductSchema = mongoose.model('Product');

module.exports = function() {
  const items = [
    {
      title: "Sneakers",
      description: "Very cool sneakers",
    },
    {
      title: "QLED TV",
      description: "Wonderful high quality screen",
    }
  ];
  
  for (let index = 0; index < items.length; index++) {
      let item = items[index];
      var query = { 'title': item.title };
      ProductSchema.findOneAndUpdate(query, item, { upsert: true }, function(err, doc){
        if (err)
        console.log(err);
      });
  }
}
