import { Tabs } from 'antd';

const Filter = ({ onFilterChange }) => {
  const items = [
    {
      key: '1',
      label: 'Search',
    },
    {
      key: '2',
      label: 'Rated',
    },
  ];

  const filterStyle = {
    width: '146px',
    margin: '0 auto',
  };

  const onChange = (key) => {
    const filterValue = key === '1' ? 'Search' : 'Rated';
    console.log(filterValue);
    onFilterChange(filterValue);
  };

  return <Tabs style={filterStyle} defaultActiveKey="1" items={items} onChange={onChange} />;
};

export default Filter;
