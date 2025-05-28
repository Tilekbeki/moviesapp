import './MovieCard.scss';
import { Rate, Typography, Tag } from 'antd';
import { format } from 'date-fns/format';
import { useEffect, useState, useContext } from 'react';

import MDBAPIService from '../../services/MDBAPIService'; // Предполагается, что этот метод уже реализован в MDBAPIService.js
const { Paragraph } = Typography;
import GenresContext from '../context/GenresContext';
const MovieCard = (props) => {
  const { id, title, description, gengres, datePublished = 'не указано', rate, img } = props;
  const genresContext = useContext(GenresContext);
  const { rateMovie } = MDBAPIService();
  useEffect(() => {
    console.log(genresContext, 'genresContext');
  }, [genresContext]);
  const formattedDate =
    !datePublished || isNaN(new Date(datePublished).getTime())
      ? 'не указано'
      : format(new Date(datePublished), 'dd.MM.yyyy');
  const changedImg = img
    ? `https://image.tmdb.org/t/p/w500${img}`
    : 'https://rwvt.ru/wp-content/uploads/b/9/6/b9691e76ab1607dc87c48e7ba611f8ed.jpeg';
  const [userRating, setUserRating] = useState(0);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('rated-movies')) || [];
    const storedRating = saved.find((movie) => movie.id === id)?.user_rating;
    if (storedRating) {
      console.log(true);
      setUserRating(Number(storedRating));
    }
  }, []);

  const handleRatingChange = async (value, id, title, gengres, description, datePublished, rate) => {
    const response = await rateMovie(id, value);
    console.log(response, 'response from rateMovie');
    const ratedMovie = {
      id,
      title,
      poster_path: img,
      overview: description,
      genre_ids: gengres,
      release_date: datePublished,
      vote_average: rate,
      user_rating: value,
    };
    const existing = JSON.parse(localStorage.getItem('rated-movies')) || [];

    // Обновляем или добавляем фильм
    const updated = [...existing.filter((m) => m.id !== id), ratedMovie];
    localStorage.setItem('rated-movies', JSON.stringify(updated));
    setUserRating(value);
    console.log(value, id);
  };

  const gengresList = gengres.map((genre) => {
    console.log(genre, 'genre');
    return (
      <Tag key={genre} className="movie-gengres-tag">
        {genresContext[genre]}
      </Tag>
    );
  });
  const truncateByWords = (text, maxWords) => {
    const words = text.split(' ');
    if (words.length <= maxWords) return text;
    if (words.length == 0) return 'У данного фильма отсутствует описание';
    return words.slice(0, maxWords).join(' ') + ' ...';
  };

  return (
    <div className="movie-card">
      <img className="movie-cover" src={changedImg} />
      <div className="movie-header">
        <h2 className="movie-title">{title}</h2>
        <span className="movie-date">{formattedDate}</span>
        <div className="movie-gengres">{gengresList}</div>
      </div>
      <Paragraph className="movie-description">{truncateByWords(description, 20)}</Paragraph>

      <Rate
        className="movie-rate"
        count={10}
        value={userRating}
        onChange={(value) => handleRatingChange(value, id, title, description, gengres, datePublished, rate)}
      />
      <div className="movie-raiting">{Math.round(rate * 10) / 10}</div>
    </div>
  );
};

export default MovieCard;
