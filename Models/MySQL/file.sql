DROP DATABASE IF EXISTS moviesdb;
CREATE DATABASE moviesdb;

USE moviesdb;

CREATE TABLE movie (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    title VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    director VARCHAR(255) NOT NULL,
    duration INT NOT NULL,
    poster TEXT,
    rate DECIMAL (2,1) UNSIGNED NOT NULL
);

CREATE TABLE genre (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE movie_genre (
    movie_id BINARY(16) REFERENCES movie(id),
    genre_id INT REFERENCES genre(id),
    PRIMARY KEY (movie_id, genre_id)
);

INSERT INTO genre (name) VALUES 
('Action'), ('Drama'), ('Crime'), ('Adventure'), ('Sci-Fi'), ('Romance'), ('Thriller'), ('Comedy'), ('Fantasy'), ('Family'), ('Mystery'), ('Horror'), ('Animation'), ('Biography'), ('History'), ('War'), ('Music'), ('Western'), ('Sport'), ('Musical'), ('Documentary');

INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES
(UUID_TO_BIN(UUID()), 'The Shawshank Redemption', 1994, 'Frank Darabont', 142, 'https://pics.filmaffinity.com/The_Shawshank_Redemption-757173190-large.jpg', 9.3),
(UUID_TO_BIN(UUID()), 'The Godfather', 1972, 'Francis Ford Coppola', 175, 'https://pics.filmaffinity.com/The_Godfather-879810099-large.jpg', 9.2),
(UUID_TO_BIN(UUID()), 'The Godfather: Part II', 1974, 'Francis Ford Coppola', 202, 'https://pics.filmaffinity.com/The_Godfather_Part_II-105932069-large.jpg', 9.0),
(UUID_TO_BIN(UUID()), 'The Dark Knight', 2008, 'Christopher Nolan', 152, 'https://pics.filmaffinity.com/The_Dark_Knight-107992866-large.jpg', 9.0);

INSERT INTO movie_genre (movie_id, genre_id) VALUES
((SELECT id FROM movie WHERE title = 'The Shawshank Redemption'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'The Godfather'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'The Godfather'), (SELECT id FROM genre WHERE name = 'Crime')),
((SELECT id FROM movie WHERE title = 'The Godfather: Part II'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'The Godfather: Part II'), (SELECT id FROM genre WHERE name = 'Crime')),
((SELECT id FROM movie WHERE title = 'The Dark Knight'), (SELECT id FROM genre WHERE name = 'Action')),
((SELECT id FROM movie WHERE title = 'The Dark Knight'), (SELECT id FROM genre WHERE name = 'Crime')),
((SELECT id FROM movie WHERE title = 'The Dark Knight'), (SELECT id FROM genre WHERE name = 'Drama')),
((SELECT id FROM movie WHERE title = 'The Dark Knight'), (SELECT id FROM genre WHERE name = 'Thriller'));

SELECT * FROM movie;