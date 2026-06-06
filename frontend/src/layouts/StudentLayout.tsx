import { useState, useEffect } from 'react';
import { Dropdown, Popover, List, Spin } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useGetUnreadCountQuery, useGetNotificationsQuery, useMarkReadMutation } from '@/store/api/notificationApi';
import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, WarningFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: unreadData } = useGetUnreadCountQuery(undefined, { pollingInterval: 30000 });
  const { data: notificationsRes, isLoading: isNotifLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkReadMutation();

  const handleNotifClick = async (id: number) => {
    try {
      await markRead(id).unwrap();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'APPROVED':
        return <CheckCircleFilled className="text-emerald-500 text-lg" />;
      case 'REJECTED':
        return <CloseCircleFilled className="text-rose-500 text-lg" />;
      case 'RETURN_REMINDER':
        return <InfoCircleFilled className="text-amber-500 text-lg" />;
      case 'OVERDUE_WARNING':
        return <WarningFilled className="text-red-500 text-lg" />;
      default:
        return <InfoCircleFilled className="text-blue-500 text-lg" />;
    }
  };

  const notificationContent = (
    <div className="w-80 md:w-96 max-h-[400px] overflow-y-auto netflix-scroll">
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#0d111d]">
        <span className="font-bold text-white text-sm">Thông báo của bạn</span>
        {unreadData?.data?.count ? (
          <span className="text-xs text-indigo-400 font-semibold">
            {unreadData.data.count} chưa đọc
          </span>
        ) : null}
      </div>
      {isNotifLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="small" />
        </div>
      ) : !notificationsRes?.data || notificationsRes.data.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-xs">
          Không có thông báo nào
        </div>
      ) : (
        <List
          dataSource={notificationsRes.data}
          renderItem={(item) => (
            <List.Item
              onClick={() => !item.isRead && handleNotifClick(item.id)}
              className={`p-3 border-b border-white/5 cursor-pointer transition flex items-start gap-3 hover:bg-white/5 ${
                !item.isRead ? 'bg-white/[0.02]' : ''
              }`}
            >
              <div className="mt-0.5">{getNotifIcon(item.type)}</div>
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold ${!item.isRead ? 'text-white' : 'text-gray-400'}`}>
                  {item.title}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed break-words">
                  {item.message}
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  {dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}
                </div>
              </div>
              {!item.isRead && (
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
              )}
            </List.Item>
          )}
        />
      )}
    </div>
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenu = {
    items: [
      {
        key: 'info',
        label: (
          <div className="py-1">
            <div className="font-bold text-white">{user?.name}</div>
            <div className="text-xs text-gray-400">{user?.studentId}</div>
          </div>
        ),
      },
      { type: 'divider' as const, style: { borderColor: 'rgba(255,255,255,0.1)' } },
      { key: 'logout', label: <span className="text-red-500 font-bold">Đăng xuất</span>, onClick: handleLogout },
    ],
  };

  const navLinks = [
    { path: '/student/equipment', label: 'Trang chủ' },
    { path: '/student/borrow', label: 'Mượn thiết bị' },
    { path: '/student/history', label: 'Lịch sử mượn' },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ background: '#080b11' }}>
      {/* Premium Navbar (Glassmorphism) */}
      <nav style={{ background: 'rgba(8,11,17,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,102,241,0.12)' }} className="px-6 md:px-12 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-10">
          <div 
            onClick={() => navigate('/student/equipment')}
            className="font-black tracking-tighter cursor-pointer select-none" 
            style={{ fontSize: '1.5rem', letterSpacing: '-1px', background: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            CLB BORROW
          </div>
          <div className="hidden lg:flex gap-6 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {navLinks.map((link) => (
              <a 
                key={link.path}
                onClick={(e) => { e.preventDefault(); navigate(link.path); }}
                href={link.path}
                className={`transition ${location.pathname === link.path ? 'text-white border-b-2 border-indigo-500 pb-1' : 'hover:text-indigo-200'}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Notification Icon */}
          <Popover
            content={notificationContent}
            title={null}
            trigger="click"
            placement="bottomRight"
            overlayClassName="netflix-notif-popover"
          >
          <div className="relative text-slate-400 hover:text-indigo-300 cursor-pointer transition">
              <i className="fa-solid fa-bell text-lg"></i>
              {unreadData?.data?.count ? (
                <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] font-bold px-1.5 rounded-full">
                  {unreadData.data.count}
                </span>
              ) : null}
            </div>
          </Popover>

          <div className="flex items-center gap-2 border-l border-indigo-500/10 pl-4">
            <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']} dropdownRender={(menu) => (
              <div style={{ background: '#0d111d', border: '1px solid rgba(99,102,241,0.15)' }} className="rounded-xl shadow-2xl min-w-[150px]">
                {menu}
              </div>
            )}>
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-700 to-violet-500 text-white font-bold flex items-center justify-center text-xs shadow group-hover:scale-105 transition">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-300 group-hover:text-white transition">
                  {user?.name || 'Student'}
                </span>
              </div>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
