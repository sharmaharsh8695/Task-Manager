const db = require("../config/db");

const createUser = async (email, password) => {
  const [result] = await db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, password]
  );
  return result;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  console.log(rows[0])
  return rows[0];
};

module.exports = { createUser, findUserByEmail };