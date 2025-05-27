import { Layout } from 'antd';
import { useEffect, useState } from 'react';

import Filter from '../filter/Filter';
import MoviesList from '../movies-list/MoviesList';
import SearchPanel from '../search-panel/searchPanel';
import MDBAPIService from '../../services/MDBAPIService';

import './App.scss';

function App() {
  const [currentFilter, setCurrentFilter] = useState('Search');
  const { Header, Content } = Layout;
  const { checkGuestSession } = MDBAPIService();
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

  return (
    <Layout style={layoutStyle}>
      <Header className="header">
        <Filter onFilterChange={onFilterChange} />
        <SearchPanel />
      </Header>
      <Content className="main-content">
        <MoviesList currentFilter={currentFilter} />
      </Content>
    </Layout>
  );
}

export default App;
