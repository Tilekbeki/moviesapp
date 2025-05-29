const MDBAPIService = () => {
  var apiKey =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYjg1Y2M0ZTUyOGQ5ZWZkMDlhMmUzZGFiMjJhZWY0NyIsIm5iZiI6MTc0NjcwMjcyMy4wMiwic3ViIjoiNjgxYzkxODNiMWY2MzMxNjQzYzFkYWUzIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.klA2cj5vplGHJ_7HpaRM2PWujRASLknjwt6oa6rhnSI'; // Замените на ключ из настроек TMDb

  const getResource = async (url) => {
    try {
      const urlWay = `https://api.themoviedb.org/3${url}`;
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      };

      const response = await fetch(urlWay, options)
        .then((res) => res.json())
        .catch((err) => console.error(err));
      return response;
    } catch (error) {
      console.error('Ошибка при получении фильмов:', error);
      throw error;
    }
  };

  const createGuestSession = async () => {
    const url = '/authentication/guest_session/new';
    const response = await getResource(url);
    if (response.success) {
      const sessionData = {
        id: response.guest_session_id,
        success: true,
        created_at: Date.now(),
      };
      localStorage.setItem('guest_session', JSON.stringify(sessionData));
      return sessionData;
    } else {
      console.error('Ошибка при создании гостевой сессии:', response.status_message);
      return { success: false, error: response.status_message };
    }
  };

  const checkGuestSession = async () => {
    const sessionStr = localStorage.getItem('guest_session');
    const oneDay = 24 * 60 * 60 * 1000;

    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        const age = Date.now() - session.created_at;
        if (age < oneDay) {
          return session.id;
        } else {
          console.log('Сессия устарела, создаю новую...');
        }
      } catch (e) {
        console.warn('Ошибка парсинга гостевой сессии:', e);
      }
    }

    const newSession = await createGuestSession();
    return newSession.success ? newSession.id : null;
  };
  const getGenres = async () => {
    const url = '/genre/movie/list?language=en';
    const response = await getResource(url);
    if (response && response.genres) {
      return response.genres;
    } else {
      console.error('Ошибка при получении списка жанров:', response);
      return [];
    }
  };
  const getAllMovies = async (page = 1) => {
    const url = `/movie/popular?language=en-US&page=${page}`;
    const response = await getResource(url);

    return response;
  };

  const searchMovies = async (text, page = 1) => {
    const title = encodeURIComponent(text);
    const url = `/search/movie?query=${title}&include_adult=false&language=en-US&page=${page}`;
    const response = await getResource(url);
    console.log(response.results);
    return response;
  };
  const rateMovie = async (movieId, rating) => {
    const sessionId = await checkGuestSession();
    if (!sessionId) {
      console.error('Не удалось получить гостевую сессию для рейтинга фильма');
      return;
    }
    try {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${sessionId}`;
      const options = {
        method: 'POST',
        body: JSON.stringify({ value: rating }),
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: `Bearer ${apiKey}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data, 'rate response');
      return data;
    } catch (error) {
      console.error('Ошибка при отправке рейтинга фильма:', error);
      throw error;
    }
  };

  const getRatedMovies = async (page) => {
    const sessionId = await checkGuestSession();
    if (!sessionId) {
      console.error('Не удалось получить гостевую сессию для получения рейтингов');
      return [];
    }

    const url = `/guest_session/${sessionId}/rated/movies?language=en-US&page=${page}`;
    const response = await getResource(url);
    if (response && response.results) {
      return response.results;
    } else {
      console.error('Ошибка при получении рейтингов фильмов:', response);
      return [];
    }
  };

  return {
    getAllMovies,
    checkGuestSession,
    searchMovies,
    getGenres,
    rateMovie,
    getRatedMovies,
  };
};

export default MDBAPIService;
