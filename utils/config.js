require("dotenv").config();

const PORT = process.env.PORT || 3003;
const MONGODB_URI = process.env.MONGODB_URL;

module.exports = {
  PORT,
  MONGODB_URI,
};
