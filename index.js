const express = require('express');
const mongoose = require('mongoose');


const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  director: String,
  year: Number
});


const Movie = mongoose.model('Movie', movieSchema);


const app = express();
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/movies', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Error connecting to MongoDB', error));


app.post('/movies', (req, res) => {
  const { title, genre, director, year } = req.body;
  const movie = new Movie({ title, genre, director, year });

  movie.save()
    .then(savedMovie => res.json(savedMovie))
    .catch(error => res.status(500).json({ error: error.message }));
});


app.get('/movies', (req, res) => {
  Movie.find()
    .then(movies => res.json(movies))
    .catch(error => res.status(500).json({ error: error.message }));
});


app.get('/movies/:id', (req, res) => {
  const movieId = req.params.id;
  Movie.findById(movieId)
    .then(movie => {
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(movie);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});


app.put('/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const { title, genre, director, year } = req.body;
  Movie.findByIdAndUpdate(movieId, { title, genre, director, year }, { new: true })
    .then(updatedMovie => {
      if (!updatedMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(updatedMovie);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});


app.delete('/movies/:id', (req, res) => {
  const movieId = req.params.id;
  Movie.findByIdAndRemove(movieId)
    .then(deletedMovie => {
      if (!deletedMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      res.json(deletedMovie);
    })
    .catch(error => res.status(500).json({ error: error.message }));
});


app.get('/movies/suggestions/:genre', (req, res) => {
  const genre = req.params.genre;
  Movie.find({ genre })
    .then(movies => res.json(movies))
    .catch(error => res.status(500).json({ error: error.message }));
});


const port = 3000;
app.listen(port)
