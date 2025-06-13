import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

import Filter from '../filter/Filter';
import MoviesList from '../movies-list/MoviesList';
import SearchPanel from '../search-panel/searchPanel';
import MDBAPIService from '../../services/MDBAPIService';
import GenresProvider from '../context/GenresProvider';
import './App.scss';

function App() {
  const [currentFilter, setCurrentFilter] = useState('All');
  const { Header, Content } = Layout;
  const { checkGuestSession } = MDBAPIService();
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    checkGuestSession()
      .then((response) => console.log(response))
      .catch(() => setErrorMessage('Ошибка соединения'));
  }, []);
  const layoutStyle = {
    minHeight: '100vh',
    background: '#F7F7F7',
  };
  const onFilterChange = (value) => {
    handlePageChange(1); //Сбросил страницу наконец-то
    if (value === 'Search' && searchValue.trim() === '') {
      setSearchValue('');

      setCurrentFilter('All');
      setSearchValue('');
    } else {
      setCurrentFilter(value);
      setSearchValue('');
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleClick = debounce((text) => {
    if (text.trim() === '') {
      setCurrentFilter('All');
    } else {
      setCurrentFilter('Search');
    }
    setSearchValue(text);
  }, 500);
  return (
    <Layout style={layoutStyle}>
      <Header className="header" style={{ minHeight: '64px' }}>
        <Filter onFilterChange={onFilterChange} />
        {currentFilter === 'Search' || currentFilter === 'All' ? <SearchPanel handleClick={handleClick} /> : null}
      </Header>
      <Content className="main-content">
        <GenresProvider>
          {!errorMessage ? (
            <MoviesList
              currentFilter={currentFilter}
              value={searchValue}
              currentPage={currentPage}
              handlePageChange={handlePageChange}
            />
          ) : (
            errorMessage
          )}
        </GenresProvider>
      </Content>
    </Layout>
  );
}

export default App;
