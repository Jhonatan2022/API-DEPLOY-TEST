import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'root',
  database: 'moviesdb'
}

const connection = await mysql.createPool(config)

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE name = ?',
        [lowerCaseGenre]
      )

      if (genres.length === 0) return []

      const [{ id }] = genres

      const [movies] = await connection.query(
        'SELECT BIN_TO_UUID(movie.id) AS id, title, year, director, duration, poster, rate, genre.name FROM movie INNER JOIN movie_genre ON movie.id = movie_genre.movie_id JOIN genre ON genre.id = movie_genre.genre_id WHERE movie_genre.genre_id = ?',
        [id]
      )

      return movies
    }

    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie'
    )

    return movies
  }

  static async getById({ id }) {}

  static async create({ input }) {}

  static async delete({ id }) {}

  static async update({ id, input }) {}
}
