import React from 'react';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { AppRouter } from './routes/AppRouter';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <ConfigProvider locale={viVN}>
        <AppRouter />
      </ConfigProvider>
    </Provider>
  );
}

export default App;
