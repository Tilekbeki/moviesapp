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
  const [currentFilter, setCurrentFilter] = useState('Search');
  const { Header, Content } = Layout;
  const { checkGuestSession } = MDBAPIService();
  const [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    checkGuestSession().then((response) => console.log(response));
  }, []);
  const layoutStyle = {
    minHeight: '100vh',
    background: '#F7F7F7',
  };

  const onFilterChange = (value) => {
    setCurrentFilter(value);
  };

  const handleClick = debounce((text) => {
    console.log('click happened!', text);
    setSearchValue(text);
  }, 500);

  return (
    <Layout style={layoutStyle}>
      <Header className="header">
        <Filter onFilterChange={onFilterChange} />
        {currentFilter === 'Search' ? <SearchPanel handleClick={handleClick} /> : null}
      </Header>
      <Content className="main-content">
        <GenresProvider>
          <MoviesList currentFilter={currentFilter} value={searchValue} page={1} />
        </GenresProvider>
      </Content>
    </Layout>
  );
}

export default App;
