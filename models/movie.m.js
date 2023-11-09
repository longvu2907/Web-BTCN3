const db = require("../db/config");

module.exports = {
  getTopRating: async () => {
    const res = await db.query(`
    SELECT * FROM Movie m
    WHERE m.rating IS NOT NULL
    ORDER BY m.rating DESC
    LIMIT 10
    `);

    return res;
  },

  getTopPopular: async () => {
    const res = await db.query(`
    SELECT * FROM Movie m
    WHERE m.rating_count IS NOT NULL
    ORDER BY m.rating_count DESC
    LIMIT 10
    `);

    return res;
  },

  searchByTitle: async ({ title }) => {
    const res = await db.query(
      `
    SELECT * FROM Movie m
    WHERE UPPER(m.title) LIKE UPPER('%' || $1 || '%')
    `,
      [title],
    );

    return res;
  },

  getMovieFilter: async () => {
    const res = await db.query(`
    SELECT DISTINCT(genre) FROM Movie_Genre
    `);

    return res;
  },

  getDetail: async id => {
    const movie = await db.query(
      `
    SELECT * FROM Movie m
    WHERE m.id = $1
    `,
      [id],
    );

    const genres = await db.query(
      `
    SELECT Genre FROM Movie_Genre g
    WHERE g.movie_id = $1
    `,
      [id],
    );

    return { ...movie[0], genres: genres.map(genre => genre.genre) };
  },

  getReview: async id => {
    const reviews = await db.query(
      `
    SELECT author, review_text, review_title, submission_date FROM Review r
    WHERE r.movie_id = $1
    `,
      [id],
    );

    return reviews;
  },
  addFavoriteMovie: async ({ movie_id, account_id }) => {
    const res = await db.query(
      `
    INSERT INTO Favorite_Movie VALUES ($1, $2)
    `,
      [movie_id, account_id],
    );

    return res;
  },
  getFavoriteMovie: async ({ account_id }) => {
    const res = await db.query(
      `
    SELECT * FROM Favorite_Movie fm
    JOIN Movie m ON fm.movie_id = m.id
    WHERE fm.account_id = $1
    `,
      [account_id],
    );

    return res;
  },
};
