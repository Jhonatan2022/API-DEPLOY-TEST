import { createApp } from '../app.js'
import { MovieModel } from '../Models/Mongodb/movie.js'

createApp({ movieModel: MovieModel })
