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

  static async getById({ id }) {
    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);',
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create({ input }) {
    const {
      // genre: genreInput,
      title,
      year,
      director,
      duration,
      poster,
      rate
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() AS uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        'INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);',
        [uuid, title, year, director, duration, poster, rate]
      )
    } catch (error) {
      throw new Error('Error creating movie')
    }

    const [newMovie] = await connection.query(
      'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);',
      [uuid]
    )

    return newMovie[0]
  }

  static async delete({ id }) {}

  static async update({ id, input }) {}
}
