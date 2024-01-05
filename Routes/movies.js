import { Router } from 'express'
import { validateMovie, validatePartialMovie } from './Schemas/movies.js'
import { readJSON } from '../Utils/readJSON'
import { MovieModel } from '../Models/movie.js'

const moviesJSON = readJSON('../movies.json')
export const moviesRouter = Router()

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query
  const movies = await MovieModel.getAll({ genre })
  res.json(movies)
})

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const movie = await MovieModel.getById({ id })

  if (movie) return res.json(movie)
  res.status(404).json({ error: 'Movie not found' })
})

moviesRouter.post('/', async (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ errors: JSON.parse(result.error.message) })
  }

  const newMovie = await MovieModel.create({ input: result.data })

  res.status(201).json(newMovie)
})

moviesRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = moviesJSON.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  moviesJSON.splice(movieIndex, 1)
  return res.status(204).end()
})

moviesRouter.patch('/:id', (req, res) => {
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
