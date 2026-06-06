import { Layout, Menu, Dropdown, Avatar, Popover, List, Spin } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  DashboardOutlined,
  FileTextOutlined,
  InboxOutlined,
  BarChartOutlined,
  LogoutOutlined,
  UserOutlined,
  ClockCircleFilled,
} from '@ant-design/icons';
import { logout } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { useGetAllBorrowsQuery } from '@/store/api/borrowApi';
import dayjs from 'dayjs';

const { Sider, Content } = Layout;

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
  { key: '/admin/requests', icon: <FileTextOutlined />, label: 'Quản lý yêu cầu' },
  { key: '/admin/equipment', icon: <InboxOutlined />, label: 'Quản lý kho' },
  { key: '/admin/statistics', icon: <BarChartOutlined />, label: 'Thống kê' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: borrowsRes, isLoading: isBorrowsLoading } = useGetAllBorrowsQuery();
  const pendingBorrows = borrowsRes?.data?.filter((b) => b.status === 'PENDING') || [];
  const pendingCount = pendingBorrows.length;

  const adminNotificationContent = (
    <div className="w-80 md:w-96 max-h-[400px] overflow-y-auto netflix-scroll">
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-[#0d111d]">
        <span className="font-bold text-white text-sm">Yêu cầu mượn mới</span>
        {pendingCount ? (
          <span className="text-xs text-indigo-400 font-semibold animate-pulse">
            {pendingCount} đang chờ duyệt
          </span>
        ) : null}
      </div>
      {isBorrowsLoading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="small" />
        </div>
      ) : pendingCount === 0 ? (
        <div className="text-center py-8 text-gray-500 text-xs">
          Không có yêu cầu nào đang chờ duyệt
        </div>
      ) : (
        <List
          dataSource={pendingBorrows}
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate('/admin/requests')}
              className="p-3 border-b border-white/5 cursor-pointer transition flex items-start gap-3 hover:bg-white/5 bg-white/[0.02]"
            >
              <div className="mt-0.5"><ClockCircleFilled className="text-amber-500 text-lg" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">
                  Yêu cầu mượn mới từ {item.userName}
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5 leading-relaxed break-words">
                  Mượn {item.quantity}x {item.equipmentName} ({item.userStudentId || 'N/A'})
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  Yêu cầu lúc: {dayjs(item.createdAt).format('HH:mm DD/MM/YYYY')}
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
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
        icon: <UserOutlined style={{ color: '#fff' }} />,
        label: <div className="font-bold text-white">{user?.name}</div>,
      },
      { type: 'divider' as const, style: { borderColor: 'rgba(255,255,255,0.1)' } },
      { key: 'logout', icon: <LogoutOutlined className="text-red-500" />, label: <span className="text-red-500 font-bold">Đăng xuất</span>, onClick: handleLogout },
    ],
  };

  return (
    <Layout className="min-h-screen" style={{ background: '#080b11' }}>
      <Sider 
        width={260} 
        breakpoint="lg" 
        collapsedWidth={0}
        style={{ background: '#0d111d', borderRight: '1px solid rgba(99,102,241,0.12)' }}
      >
        <div className="flex items-center gap-4 px-6 py-8 border-b border-indigo-500/10">
          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center bg-indigo-600">
            <i className="fa-solid fa-boxes-stacked text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight m-0" style={{ background: 'linear-gradient(135deg,#a5b4fc,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CLB BORROW</h2>
            <p className="text-xs text-indigo-400/70 font-bold uppercase tracking-wider m-0 mt-1">Admin Panel</p>
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            marginTop: 16, 
            padding: '0 12px' 
          }}
          className="admin-dark-menu"
        />
        
        <style>{`
          .admin-dark-menu .ant-menu-item {
            color: #94a3b8 !important;
            border-radius: 10px !important;
            margin-bottom: 6px !important;
            transition: all 0.25s;
          }
          .admin-dark-menu .ant-menu-item:hover {
            color: #e0e7ff !important;
            background-color: rgba(99,102,241,0.08) !important;
          }
          .admin-dark-menu .ant-menu-item-selected {
            color: #c7d2fe !important;
            background-color: rgba(99,102,241,0.15) !important;
            border-left: 3px solid #6366f1 !important;
            box-shadow: inset 0 0 20px rgba(99,102,241,0.05);
          }
          .admin-dark-menu .ant-menu-item .anticon {
            font-size: 16px !important;
          }
        `}</style>
      </Sider>

      <Layout style={{ background: '#080b11' }}>
        {/* Glassmorphism Header */}
        <div style={{ background: 'rgba(13,17,28,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,102,241,0.12)' }} className="px-8 py-4 flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="font-black tracking-wide" style={{ fontSize: '15px', background: 'linear-gradient(90deg,#c7d2fe,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TRUNG TÂM QUẢN TRỊ</div>
          </div>
          
          <div className="flex items-center gap-6">
            <Popover
              content={adminNotificationContent}
              title={null}
              trigger="click"
              placement="bottomRight"
              overlayClassName="netflix-notif-popover"
            >
              <div className="relative text-slate-400 hover:text-indigo-300 cursor-pointer transition">
                <i className="fa-solid fa-bell text-lg"></i>
                {pendingCount ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-indigo-500 text-white text-[9px] font-bold px-1.5 rounded-full animate-pulse">
                    {pendingCount}
                  </span>
                ) : null}
              </div>
            </Popover>

            <div className="flex items-center gap-2 border-l border-indigo-500/10 pl-4">
              <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']} dropdownRender={(menu) => (
                <div style={{ background: '#0d111d', border: '1px solid rgba(99,102,241,0.15)' }} className="rounded-xl shadow-2xl min-w-[160px]">
                  {menu}
                </div>
              )}>
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-slate-200 group-hover:text-white transition">{user?.name}</div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Quản Trị Viên</div>
                  </div>
                  <Avatar style={{ background: 'linear-gradient(135deg, #4338ca, #6366f1)', border: '2px solid rgba(99,102,241,0.3)' }} className="shadow-lg">
                    {user?.name?.charAt(0) || 'A'}
                  </Avatar>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>

        <Content className="p-4 md:p-8 overflow-y-auto netflix-scroll">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
