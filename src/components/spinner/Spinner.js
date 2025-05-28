import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Spinner = () => {
  const spinnerStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
  };
  return (
    <div className="spinner" style={spinnerStyles}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      <div className="loading-text">Загружаем данные...</div>
    </div>
  );
};

export default Spinner;
