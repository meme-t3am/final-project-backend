const pool = require('../utils/pool');

module.exports = class UserImage {
  id;
  url;
  user_id;

  constructor(row) {
    this.id = row.id;
    this.url = row.url;
    this.user_id = row.user_id;
  }

  static async insert(url, user_id) {
    const { rows } = await pool.query(
      `
        INSERT INTO user_image (url, user_id)
        VALUES ($1, $2)
        RETURNING *
        `,
      [url, user_id]
    );

    return new UserImage(rows[0]);
  }
};
