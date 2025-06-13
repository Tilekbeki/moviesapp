import { useEffect, useState } from 'react';
import './MoviesList.scss';
import { Pagination } from 'antd';

import Spinner from '../spinner/Spinner';
import MovieCard from '../movie-card/MovieCard';
import MDBAPIService from '../../services/MDBAPIService';

const MoviesList = ({ currentFilter, value, currentPage, handlePageChange }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const { searchMovies, getRatedMovies } = MDBAPIService();

  // // Обнуление страницы при смене фильтра или поискового запроса
  // useEffect(() => {
  //   handlePageChange(1);
  // }, [currentFilter, value]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (currentFilter === 'All') {
          const response = await searchMovies('return', currentPage);
          if (response && response.results) {
            setMovies(response.results);
            setTotalPages(response.total_results);
          } else {
            setMovies([]);
          }
        } else if (currentFilter === 'Search') {
          if (value.trim() === '') {
            setMovies([]);
            setTotalPages(0);
            return;
          }
          const response = await searchMovies(value, currentPage);
          if (response && response.results) {
            setMovies(response.results);
            setTotalPages(response.total_results);
          } else {
            setMovies([]);
          }
        } else if (currentFilter === 'Rated') {
          const response = await getRatedMovies(currentPage);
          if (response && response.length > 0) {
            setMovies(response); // Устанавливаем movies для отрисовки
            setTotalPages(response.length);
          } else {
            setMovies([]);
            setTotalPages(0);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке фильмов:', error);
        setMovies([]);
        if (!navigator.onLine) {
          setError('Отсутствует подключение к интернету');
        } else {
          setError('Не удалось загрузить данные. Попробуйте позже.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentFilter, value, currentPage]);

  const content = movies.map((movie) => (
    <MovieCard
      key={movie.id}
      id={movie.id}
      img={movie.poster_path}
      title={movie.title}
      description={movie.overview}
      gengres={movie.genre_ids}
      datePublished={movie.release_date}
      rate={movie.vote_average}
    />
  ));

  return (
    <>
      <div className="movies-list">
        {loading && <Spinner />}
        {!loading && movies.length === 0 && !error && <div className="no-movies">Фильмы не найдены</div>}
        {!loading && movies.length > 0 && content}
      </div>
      {totalPages > 0 && (
        <Pagination className="pagination" current={currentPage} total={totalPages} onChange={handlePageChange} />
      )}
    </>
  );
};

export default MoviesList;
