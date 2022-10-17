const pool = require('../utils/pool');

module.exports = class Meme {
  id;
  url;

  constructor(row) {
    this.id = row.id;
    this.url = row.url;
  }

  static async insert({ url }) {
    const { rows } = await pool.query(
      `
        INSERT INTO memes (url)
        VALUE ($1)
        RETURNING *
        `,
      [url]
    );

    return new Meme(rows[0]);
  }
};
