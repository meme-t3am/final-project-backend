const pool = require('../utils/pool');

module.exports = class Tag {
  id;
  tag;
  confidence;
  meme_id;

  constructor(row) {
    this.id = row.id;
    this.tag = row.tag;
    this.confidence = row.confidence;
    this.meme_id = row.meme_id;
  }

  static async insertMeme({ tag, confidence, meme_id }) {
    const { rows } = await pool.query(
      `
        INSERT INTO meme_tags (tag, confidence, meme_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [tag, confidence, meme_id]
    );
    return new Tag(rows[0]);
  }
};
