import { Input } from 'antd';
import { useState } from 'react';

const SearchPanel = ({ handleClick }) => {
  const [searchMovie, setSearchMovie] = useState('');
  const handleSearchChange = (e) => {
    setSearchMovie(e.target.value);
    handleClick(e.target.value);
    console.log('Поиск:', e.target.value);
  };
  return <Input placeholder="Type to search..." value={searchMovie} onInput={(e) => handleSearchChange(e)} />;
};

export default SearchPanel;
