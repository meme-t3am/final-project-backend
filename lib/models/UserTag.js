const pool = require('../utils/pool');

module.exports = class UserTag {
  id;
  user_image_id;
  tag;
  confidence;

  constructor(row) {
    this.id = row.id;
    this.user_image_id = row.user_image_id;
    this.tag = row.tag;
    this.confidence = row.confidence;
  }

  static async insertTag(tag, user_image_id, confidence) {
    const { rows } = await pool.query(
      `
        INSERT INTO user_tags (tag, user_image_id, confidence)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
      [tag, user_image_id, confidence]
    );

    return new UserTag(rows[0]);
  }
};
