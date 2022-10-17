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

    console.log(rows);
    return new Meme(rows[0]);
  }
};
