const db = require("./config");
const fs = require("fs");

module.exports = async function initDB() {
  try {
    const castFile = fs.readFileSync("db/casts.json", "utf-8");
    const movieFile = fs.readFileSync("db/movies.json", "utf-8");

    const castData = JSON.parse(castFile);
    const movieData = JSON.parse(movieFile);

    castData.forEach(async cast => {
      try {
        await db.query(
          `
          INSERT INTO "Cast" VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
          [
            cast.id,
            cast.image,
            cast.legacyNameText,
            cast.name,
            cast.birthDate,
            cast.birthPlace,
            cast.gender,
            cast.heightCentimeters,
            cast.realName,
          ],
        );
      } catch (error) {}

      cast.nicknames?.forEach(async nickname => {
        try {
          await db.query(
            `
              INSERT INTO Cast_Nickname VALUES ($1, $2)
            `,
            [cast.id, nickname],
          );
        } catch (error) {}
      });
    });

    movieData.forEach(async movie => {
      try {
        await db.query(
          `
          INSERT INTO Movie VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [
            movie.id,
            movie.img,
            movie.title,
            movie.year,
            movie.topRank,
            movie.rating,
            movie.ratingCount,
          ],
        );

        if (movie.synopses) {
          try {
            const synopses = movie.synopses;
            await db.query(
              `
              INSERT INTO Synopses VALUES ($1, $2, $3, $4)
            `,
              [
                movie.id,
                synopses.hasProfanity,
                synopses.language,
                synopses.text,
              ],
            );
          } catch (error) {}
        }

        await movie.genres?.forEach(async genre => {
          try {
            await db.query(
              `
              INSERT INTO Movie_Genre VALUES ($1, $2)
            `,
              [movie.id, genre],
            );
          } catch (error) {}
        });

        await movie.reviews?.forEach(async review => {
          const reviewID = await db.query(
            `
            INSERT INTO Review (movie_id, author, author_rating, helpfulness_score, language_code, review_text, review_title, submission_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `,
            [
              movie.id,
              review.author,
              review.authorRating,
              review.helpfulnessScore,
              review.languageCode,
              review.reviewText,
              review.reviewTitle,
              review.submissionDate,
            ],
          );

          if (review.interestingVote) {
            const interestingVote = review.interestingVote;

            await db.query(
              `
                INSERT INTO InterestingVote VALUES ($1, $2, $3)
              `,
              [reviewID, interestingVote.down, interestingVote.up],
            );
          }
        });

        await movie.casts?.forEach(cast => {
          cast.characters?.forEach(async character => {
            try {
              await db.query(
                `
                INSERT INTO Cast_Movie_Character VALUES ($1, $2, $3)
              `,
                [cast.id, movie.id, character],
              );
            } catch (error) {}
          });
        });
      } catch (error) {}
    });
  } catch (error) {
    console.log(error);
  }
};
