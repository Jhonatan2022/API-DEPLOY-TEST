import express, { json } from 'express'
import { moviesRouter } from './Routes/movies.js'
import { corsMiddleware } from './Middlewares/cors.js'

// Leer json ESModules
// import fs from 'node:fs'
// const moviesJSON = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

const app = express()
app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

// Metodos normales: GET/HEAD/POST
// Metodos complejos: PUT/DELETE/PATCH
app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`)
})
