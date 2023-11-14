const express = require('express');
const app = express();
const axios = require('axios');
const path = require('path');

const TMDB_API_KEY = '6ec79fa402d8b1367d8e8255e043cacf';

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

app.get('/movies', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'movies.html'));
});

app.get('/movies/:id', async (req, res) => {
  const tmdbId = req.params.id;

  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });

    const movieDetails = tmdbResponse.data;

    // Render a page displaying the movie details and a button to watch
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${movieDetails.title}</title>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <h1>${movieDetails.title}</h1>
        <p>${movieDetails.overview}</p>
        <img src="https://image.tmdb.org/t/p/w500${movieDetails.poster_path}" alt="${movieDetails.title} poster">
        <button onclick="watchMovie('${movieDetails.id}')">Watch Now</button>
        <script>
          const watchMovie = (tmdbId) => {
            window.location.href = \`https://vidsrc.to/embed/movie/\${tmdbId}\`;
          };
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/tv', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tv.html'));
});

app.get('/search', async (req, res) => {
  const query = req.query.query;

  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
      },
    });

    const movies = tmdbResponse.data.results;

    res.json(movies);
  } catch (error) {
    console.error('Error searching TMDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/search-tv', async (req, res) => {
  const query = req.query.query;

  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
      },
    });

    const tvSeries = tmdbResponse.data.results;

    res.json(tvSeries);
  } catch (error) {
    console.error('Error searching TMDB for TV Series:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, '192.168.1.2', () => {
  console.log('Server is running on port 3000');
});
