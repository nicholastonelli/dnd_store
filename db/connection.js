
require('dotenv').config()
const mongoose = require('mongoose')

const MONGODB_URI =
//check if the node environment is production
process.env.NODE_ENV === "production"
  ? //if so, use DB_URL as the database location
    process.env.DB_URL
  : //if not, use the items_shop-app db on the MongoDB's local server
    "mongodb://localhost:27017/items_shop";

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

.then((instance) =>
    console.log(`Connected to db: ${instance.connections[0].name}`)
  )
  .catch((error) => console.log('Connection failed!', error))

  module.exports = mongoose;