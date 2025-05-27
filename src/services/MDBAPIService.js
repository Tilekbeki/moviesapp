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
          return `${session.id} сессия создана!`;
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

  const getAllMovies = async (page = 1) => {
    const url = `/movie/popular?language=en-US&page=${page}`;
    const response = await getResource(url);
    const gengres = {
      28: 'Action',
      12: 'Adventure',
      16: 'Animation',
      35: 'Comedy',
      80: 'Crime',
      99: 'Documentary',
      18: 'Drama',
      10751: 'Family',
      14: 'Fantasy',
      36: 'History',
      27: 'Horror',
      10402: 'Music',
      9648: 'Mystery',
      10749: 'Romance',
      878: 'Science Fiction',
      10770: 'TV Movie',
      53: 'Thriller',
      10752: 'War',
      37: 'Western',
    };

    response.results.forEach((movie) => {
      movie.genre_ids = movie.genre_ids.map((id) => gengres[id] || 'Unknown');
    });
    return response;
  };
  const getMoviesByKeyword = async () => {
    const url = '/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc';
    const response = await getResource(url);
    return response;
  };

  return {
    getMoviesByKeyword,
    getResource,
    getAllMovies,
    createGuestSession,
    checkGuestSession,
  };
};

export default MDBAPIService;
