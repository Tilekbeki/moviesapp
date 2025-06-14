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

  const formattedDate =
    !datePublished || isNaN(new Date(datePublished).getTime())
      ? 'не указано'
      : format(new Date(datePublished), 'dd.MM.yyyy');
  const changedImg = img
    ? `https://image.tmdb.org/t/p/w500${img}`
    : 'https://rwvt.ru/wp-content/uploads/b/9/6/b9691e76ab1607dc87c48e7ba611f8ed.jpeg';
  const [userRating, setUserRating] = useState(0);
  useEffect(() => {
    const userSavedRating = localStorage.getItem(`rated-movie-${id}`);
    if (userSavedRating) {
      setUserRating(Number(userSavedRating));
    }
  }, []);

  const handleRatingChange = async (value, id) => {
    const rateMovieResponse = await rateMovie(id, value);
    if (rateMovieResponse.success) {
      localStorage.setItem(`rated-movie-${id}`, value);
    }
    setUserRating(value);
  };

  const gengresList = gengres.map((genre) => {
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

  const raitingColor = (value) => {
    if (value >= 0 && value < 3) return '#E90000';
    if (value >= 3 && value < 5) return '#E97E00';
    if (value >= 5 && value < 7) return '#E9D100';
    return '#66E900';
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
        className="movie-rate  my-component-rate my-component-rate"
        count={10}
        value={userRating}
        onChange={(value) => handleRatingChange(value, id, title, description, gengres, datePublished, rate)}
      />
      <div className="movie-raiting" style={{ borderColor: raitingColor(Math.round(rate * 10) / 10) }}>
        {Math.round(rate * 10) / 10}
      </div>
    </div>
  );
};

export default MovieCard;
