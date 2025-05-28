// src/context/GenresProvider.js
import { useEffect, useState } from 'react';

import MDBAPIService from '../../services/MDBAPIService';

import GenresContext from './GenresContext';

const GenresProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const { getGenres } = MDBAPIService(); // предполагается, что у тебя есть такой метод
    const fetchGenres = async () => {
      try {
        const response = await getGenres();
        if (response) {
          const genresDict = response.reduce((acc, genre) => {
            acc[genre.id] = genre.name;
            return acc;
          }, {});
          setGenres(genresDict);
        } else {
          console.error('Ошибка получения жанров:', response);
        }
      } catch (err) {
        console.error('Ошибка при загрузке жанров:', err);
      }
    };

    fetchGenres();
  }, []);

  return <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>;
};

export default GenresProvider;
