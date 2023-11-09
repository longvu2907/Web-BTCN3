const db = require("../db/config");

module.exports = {
  getByUsername: async ({ username }) => {
    const res = await db.query(
      `
    SELECT * FROM Account a
    WHERE a.username = $1
    `,
      [username],
    );

    return res[0];
  },
  add: async ({ username, password }) => {
    const res = await db.query(
      `
    INSERT INTO Account (username, password) VALUES ($1, $2) RETURNING *
    `,
      [username, password],
    );

    return res;
  },
};
