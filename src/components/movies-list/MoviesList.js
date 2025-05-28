import './MoviesList.scss';
import { useEffect, useState } from 'react';
import { Pagination } from 'antd';

import Spinner from '../spinner/Spinner';
import MovieCard from '../movie-card/MovieCard';
import MDBAPIService from '../../services/MDBAPIService';

const MoviesList = ({ currentFilter, value }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(0);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };
  const changeTotalPage = (total) => {
    setTotalPages(total);
  };
  useEffect(() => {
    const { searchMovies, getRatedMovies } = MDBAPIService();
    const fetchMovies = async () => {
      try {
        const response = await searchMovies('return', currentPage);
        const ratedMoviesResponse = await getRatedMovies();
        if (response && response.results) {
          console.log('Rated movies response:', ratedMoviesResponse);
          setMovies(response.results);
          console.log('Полученные фильмы:', response.results);
          changeTotalPage(response.total_results);
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
  }, [currentPage]);

  useEffect(() => {
    const fetchMoviesBySearch = async () => {
      if (value.trim() === '') {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { searchMovies } = MDBAPIService();
      try {
        const response = await searchMovies(value, currentPage); // ✅ теперь передаётся и page
        if (response && response.results) {
          setMovies(response.results);
          changeTotalPage(response.total_results); // ✅ не забудь обновить общее число страниц
          console.log('Полученные фильмы по поиску:', response.total_results);
        } else {
          console.error('Некорректный ответ от API при поиске:', response);
        }
      } catch (error) {
        console.error('Ошибка при поиске фильмов:', error);
      } finally {
        setLoading(false);
      }
    };

    if (value && currentFilter === 'Search') {
      fetchMoviesBySearch();
      console.log('Поисковый запрос:', value);
    }
  }, [value, currentFilter, currentPage]); // ✅ добавлен page в зависимости

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
  let content = null;
  if (currentFilter === 'Rated') {
    console.log('Rated movies:', ratedElements);
    content = ratedElements;
  } else {
    content = Allelements;
  }

  return (
    <div className="movies-list">
      {loading && <Spinner />}

      {!loading && movies.length === 0 && <div className="no-movies">Фильмы не найдены</div>}

      {!loading && movies.length > 0 && content}
      {currentFilter === 'Search' && (
        <Pagination
          className="pagination"
          current={currentPage}
          total={totalPages} // Умножаем на 10, так как API возвращает 10 элементов на страницу
          onChange={handlePageChange}
          pageSize={10} // Количество элементов на странице
        />
      )}
    </div>
  );
};

export default MoviesList;
