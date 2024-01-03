import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import cors from 'cors'
import { validateMovie, validatePartialMovie } from './Schemas/movies.js'

// Leer json ESModules
// import fs from 'node:fs'
// const moviesJSON = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// Leer json recomendada por ahora
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const moviesJSON = require('./movies.json')

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:1234',
        'http://localhost:4321',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
      ]

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  })
)

// Metodos normales: GET/HEAD/POST
// Metodos complejos: PUT/DELETE/PATCH

app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = moviesJSON.filter((movie) =>
      movie.genre.some(
        (g) => g.toLocaleLowerCase() === genre.toLocaleLowerCase()
      )
    )
    return res.json(filteredMovies)
  }
  res.json(moviesJSON)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find((movie) => movie.id === id)

  if (movie) return res.json(movie)
  res.status(404).json({ error: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ errors: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: randomUUID(),
    ...result.data
  }

  moviesJSON.push(newMovie)
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  moviesJSON.splice(movieIndex, 1)
  return res.status(204).end()
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ errors: JSON.parse(result.error.message) })
  }

  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  const updatedMovie = {
    ...moviesJSON[movieIndex],
    ...result.data
  }

  moviesJSON[movieIndex] = updatedMovie
  return res.json(updatedMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`)
})
