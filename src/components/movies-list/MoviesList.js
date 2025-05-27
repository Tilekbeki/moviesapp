import './MoviesList.scss';
import { useEffect, useState } from 'react';

import MovieCard from '../movie-card/MovieCard';
import MDBAPIService from '../../services/MDBAPIService';

const MoviesList = ({ currentFilter }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { getAllMovies } = MDBAPIService();
    const fetchMovies = async () => {
      try {
        const response = await getAllMovies();
        if (response && response.results) {
          setMovies(response.results);
          console.log('Полученные фильмы:', response.results);
        } else {
          console.error('Некорректный ответ от API:', response);
        }
      } catch (error) {
        console.error('Ошибка при получении фильмов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentFilter]);

  const Allelements = movies.map((movie) => (
    <MovieCard
      key={movie.id}
      id={movie.id}
      img={movie.poster_path}
      title={movie.title}
      description={movie.overview}
      gengres={movie.genre_ids} // Пока genre_ids — это массив id. Позже можно будет мапить их в названия.
      datePublished={movie.release_date}
      rate={movie.vote_average}
    />
  ));
  const ratedMovies = JSON.parse(localStorage.getItem('rated-movies')) || [];
  const ratedElements = ratedMovies.map((movie) => (
    <MovieCard
      key={movie.id}
      id={movie.id}
      img={movie.poster_path}
      title={movie.title}
      description={movie.overview}
      gengres={movie.genre_ids}
      datePublished={movie.release_date}
      rate={movie.vote_average} // Передаем пользовательский рейтинг, если он есть
    />
  ));

  const content = currentFilter === 'Search' ? Allelements : ratedElements;
  return (
    <div className="movies-list">
      {loading && <div className="loading">Загрузка фильмов...</div>}

      {!loading && movies.length === 0 && <div className="no-movies">Фильмы не найдены</div>}

      {!loading && movies.length > 0 && content}
    </div>
  );
};

export default MoviesList;
