import { createApp } from '../app'
import { MovieModel } from '../Models/MySQL/movie'

createApp({ movieModel: MovieModel })
