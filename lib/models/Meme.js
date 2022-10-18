const pool = require('../utils/pool');

module.exports = class Meme {
  id;
  url;

  constructor(row) {
    this.id = row.id;
    this.url = row.url;
  }

  static async insert(url) {
    const { rows } = await pool.query(
      `
        INSERT INTO memes (url)
        VALUES ($1)
        RETURNING *
        `,
      [url]
    );

    return new Meme(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
        SELECT memes.url,
    COALESCE (
      json_agg(to_jsonb(meme_tags))
      FILTER (WHERE meme_tags.id IS NOT NULL), '[]'
      ) 
      AS meme_tags
      FROM memes
      LEFT JOIN meme_tags
      ON meme_tags.meme_id = memes.id
      GROUP BY memes.id
        `
    );
    return rows;
  }
};
