import { useState, useEffect } from 'react';
import { Dropdown, Popover, List, Spin, Input } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useGetUnreadCountQuery, useGetNotificationsQuery, useMarkReadMutation } from '@/store/api/notificationApi';
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, WarningFilled, SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: unreadData } = useGetUnreadCountQuery(undefined, { pollingInterval: 30000 });
  const { data: notificationsRes, isLoading: isNotifLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkReadMutation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNotifClick = async (id: number) => {
    try { await markRead(id).unwrap(); } catch {}
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'APPROVED': return <CheckCircleFilled style={{ color: '#10b981', fontSize: 15 }} />;
      case 'REJECTED': return <CloseCircleFilled style={{ color: '#ef4444', fontSize: 15 }} />;
      case 'RETURN_REMINDER': return <InfoCircleFilled style={{ color: '#f59e0b', fontSize: 15 }} />;
      case 'OVERDUE_WARNING': return <WarningFilled style={{ color: '#ef4444', fontSize: 15 }} />;
      default: return <InfoCircleFilled style={{ color: '#3b82f6', fontSize: 15 }} />;
    }
  };

  const notificationContent = (
    <div style={{ width: 340, maxHeight: 420, overflowY: 'auto' }} className="netflix-scroll">
      <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 800, color: '#fff', fontSize: 13 }}>Thông báo</span>
        {unreadData?.data?.count ? <span style={{ fontSize: 11, color: '#5b5cf0', fontWeight: 700 }}>{unreadData.data.count} chưa đọc</span> : null}
      </div>
      {isNotifLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><Spin size="small" /></div>
      ) : !notificationsRes?.data?.length ? (
        <div style={{ textAlign: 'center', padding: '32px 16px', color: '#555', fontSize: 12 }}>Không có thông báo nào</div>
      ) : (
        <List dataSource={notificationsRes.data} renderItem={(item) => (
          <List.Item onClick={() => !item.isRead && handleNotifClick(item.id)}
            style={{ padding: '12px 16px', cursor: 'pointer', background: !item.isRead ? 'rgba(91, 92, 240,0.05)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ marginTop: 2 }}>{getNotifIcon(item.type)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: !item.isRead ? '#fff' : '#9ca3af' }}>{item.title}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2, lineHeight: 1.5 }}>{item.message}</div>
              <div style={{ fontSize: 10, color: '#4b5563', marginTop: 4 }}>{dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}</div>
            </div>
            {!item.isRead && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#5b5cf0', flexShrink: 0, marginTop: 4 }} />}
          </List.Item>
        )} />
      )}
    </div>
  );

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const userMenu = {
    items: [
      { key: 'info', label: <div style={{ padding: '4px 0' }}><div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{user?.name}</div><div style={{ fontSize: 11, color: '#6b7280' }}>{user?.studentId}</div></div> },
      { type: 'divider' as const, style: { borderColor: 'rgba(255,255,255,0.08)' } },
      { key: 'logout', label: <span style={{ color: '#ef4444', fontWeight: 700, fontSize: 13 }}>Đăng xuất</span>, onClick: handleLogout },
    ],
  };

  const navLinks = [
    { path: '/student/equipment', label: 'Trang Chủ' },
    { path: '/student/borrow',    label: 'Mượn Thiết Bị' },
    { path: '/student/history',   label: 'Lịch Sử Mượn' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#141414' }}>
      {/* ══════ NAVBAR ══════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 64, padding: '0 28px',
        display: 'flex', alignItems: 'center', gap: 28,
        background: scrolled ? 'rgba(15,15,15,0.98)' : 'rgba(20,20,20,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        transition: 'background 0.35s',
      }}>

        {/* Logo */}
        <div onClick={() => navigate('/student/equipment')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: 'linear-gradient(135deg,#5b5cf0,#4338ca)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(91, 92, 240,0.4)',
          }}>
            <i className="fa-solid fa-boxes-stacked" style={{ color: '#fff', fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#fff', lineHeight: 1, letterSpacing: '-0.3px' }}>CLB BORROW</div>
            <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, marginTop: 1 }}>Kết nối & Sẻ chia</div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4 }}>
          {navLinks.map(link => {
            const active = location.pathname === link.path;
            return (
              <a key={link.path} href={link.path}
                onClick={e => { e.preventDefault(); navigate(link.path); }}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600,
                  color: active ? '#5b5cf0' : '#9ca3af',
                  background: active ? 'rgba(91, 92, 240,0.12)' : 'transparent',
                  textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  border: active ? '1px solid rgba(91, 92, 240,0.25)' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#e5e7eb'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; } }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Search removed as per user request */}

        {/* Bell */}
        <Popover content={notificationContent} title={null} trigger="click" placement="bottomRight" overlayClassName="netflix-notif-popover">
          <div style={{ position: 'relative', cursor: 'pointer', color: '#9ca3af', flexShrink: 0 }}>
            <i className="fa-solid fa-bell" style={{ fontSize: 18 }} />
            {unreadData?.data?.count ? (
              <span style={{ position: 'absolute', top: -6, right: -6, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 10, lineHeight: 1.5 }}>
                {unreadData.data.count}
              </span>
            ) : null}
          </div>
        </Popover>

        {/* Avatar */}
        <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}
          dropdownRender={menu => (
            <div style={{ background: '#1f1f1f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, minWidth: 160, boxShadow: '0 20px 40px rgba(0,0,0,0.8)' }}>
              {menu}
            </div>
          )}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#5b5cf0,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <i className="fa-solid fa-caret-down" style={{ color: '#6b7280', fontSize: 11 }} />
          </div>
        </Dropdown>
      </nav>

      {/* Page content */}
      <div style={{ paddingTop: 64 }}>
        <Outlet />
      </div>
    </div>
  );
}
