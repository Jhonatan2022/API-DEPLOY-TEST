import { Router } from 'express'
import { readJSON } from '../Utils/readJSON'

const moviesJSON = readJSON('../movies.json')
const router = Router()

router.get('/', (req, res) => {
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

router.get('/:id', (req, res) => {
  const { id } = req.params
  const movie = moviesJSON.find((movie) => movie.id === id)

  if (movie) return res.json(movie)
  res.status(404).json({ error: 'Movie not found' })
})
