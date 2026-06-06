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
              colorPrimary: '#5b5cf0',
              colorSuccess: '#10b981',
              colorWarning: '#f59e0b',
              colorError: '#ef4444',
              colorInfo: '#3b82f6',
              borderRadius: 6,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: 14,
              colorBgContainer: '#1e1e1e',
              colorBgElevated: '#1f1f1f',
            },
            components: {
              Layout: {
                siderBg: '#0f0f0f',
                triggerBg: '#1a1a1a',
                bodyBg: '#141414',
                headerBg: '#0f0f0f',
              },
              Menu: {
                darkItemBg: '#0f0f0f',
                darkItemSelectedBg: 'rgba(91, 92, 240,0.14)',
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
