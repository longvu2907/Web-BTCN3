const db = require("../db/config");

module.exports = {
  searchByName: async ({ name }) => {
    const res = await db.query(
      `
    SELECT * FROM "Cast"
    WHERE UPPER(name) LIKE UPPER('%' || $1 || '%')
    `,
      [name],
    );

    return res;
  },
  getDetail: async ({ cast_id }) => {
    const castData = await db.query(
      `
    SELECT * FROM "Cast"
    WHERE id = $1
    `,
      [cast_id],
    );
    const movieList = await db.query(
      `
    SELECT * FROM Movie 
    WHERE id IN (
      SELECT Distinct(m.id) FROM "Cast" c
      JOIN Cast_Movie_Character cmc ON cmc.cast_id = c.id
      JOIN Movie m ON m.id = cmc.movie_id
      WHERE c.id = $1
    )
    `,
      [cast_id],
    );

    return {
      ...castData[0],
      birth_date: new Date(castData[0].birth_date).toDateString(),
      movieList,
    };
  },
};
