import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { store } from './store';
import App from './App';
import './index.css';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { theme } from 'antd';

dayjs.locale('vi');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider
          locale={viVN}
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#6366f1',
              colorSuccess: '#10b981',
              colorWarning: '#f59e0b',
              colorError: '#f43f5e',
              colorInfo: '#6366f1',
              borderRadius: 10,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 14,
            },
            components: {
              Layout: {
                siderBg: '#0d111d',
                triggerBg: '#161b2b',
                bodyBg: 'transparent',
                headerBg: 'transparent',
              },
              Menu: {
                darkItemBg: '#0d111d',
                darkItemSelectedBg: 'rgba(99,102,241,0.15)',
                darkItemHoverBg: 'rgba(255,255,255,0.05)',
              },
            },
          }}
        >
          <AntApp>
            <App />
          </AntApp>
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
