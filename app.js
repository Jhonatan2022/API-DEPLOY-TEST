import express, { json } from 'express'
import { createMovieRouter } from './Routes/movies.js'
import { corsMiddleware } from './Middlewares/cors.js'

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(json())
  app.use(corsMiddleware())
  app.disable('x-powered-by')

  // Metodos normales: GET/HEAD/POST
  // Metodos complejos: PUT/DELETE/PATCH
  app.use('/movies', createMovieRouter({ movieModel }))

  const PORT = process.env.PORT ?? 1234

  app.listen(PORT, () => {
    console.log(`Listening on port http://localhost:${PORT}`)
  })
}
