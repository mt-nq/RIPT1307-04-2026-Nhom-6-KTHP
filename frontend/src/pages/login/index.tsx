import { useState } from 'react';
import { Form, Input, Button, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '@/store/api/authApi';
import { loginSuccess } from '@/store/slices/authSlice';
import { LoginRequest, RegisterRequest } from '@/types';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [activeRole, setActiveRole] = useState<'student' | 'admin'>('student');
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = async (values: LoginRequest) => {
    try {
      const res = await login(values).unwrap();
      if (res.success) {
        dispatch(loginSuccess({ token: res.data.token, user: res.data }));
        message.success(`Chào mừng, ${res.data.name}! 🎉`);
        if (res.data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else {
          navigate('/student/equipment');
        }
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      message.error(error?.data?.message || 'Email hoặc mật khẩu không đúng');
    }
  };

  const handleRegister = async (values: RegisterRequest) => {
    try {
      const res = await register(values).unwrap();
      if (res.success) {
        message.success('Đăng ký tài khoản sinh viên thành công! 🎉');
        setIsRegister(false);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      message.error(error?.data?.message || 'Đăng ký thất bại, vui lòng thử lại');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundImage: 'linear-gradient(to top, rgba(3, 7, 18, 0.9) 0%, rgba(3, 7, 18, 0.4) 60%, rgba(3, 7, 18, 0.9) 100%), url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <style>{`
        .premium-card {
          background: rgba(13, 17, 28, 0.7) !important;
          backdrop-filter: blur(20px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
          border: 1px solid rgba(99, 102, 241, 0.15) !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.08) !important;
          transition: all 0.4s ease;
        }
        .premium-card:hover {
          border-color: rgba(99, 102, 241, 0.3) !important;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 50px rgba(99, 102, 241, 0.18) !important;
        }
        .premium-input {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
        .premium-input:hover, .premium-input-focused, .premium-input:focus-within {
          border-color: #6366f1 !important;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.35) !important;
          background: rgba(255, 255, 255, 0.06) !important;
        }
        .premium-input input {
          color: white !important;
          background: transparent !important;
        }
        .premium-input input::placeholder {
          color: #6b7280 !important;
        }
        .premium-btn {
          height: 52px !important;
          font-size: 16px !important;
          font-weight: 800 !important;
          letter-spacing: 0.5px !important;
          background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .premium-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.55) !important;
          filter: brightness(1.1) !important;
        }
        .premium-btn:active {
          transform: translateY(0) !important;
        }
        .role-tabs .ant-tabs-nav {
          margin-bottom: 28px !important;
        }
        .role-tabs .ant-tabs-nav-list {
          width: 100% !important;
          justify-content: space-around !important;
        }
        .role-tabs .ant-tabs-tab {
          font-weight: 700 !important;
          font-size: 15px !important;
          padding: 8px 0 !important;
          margin: 0 !important;
          transition: all 0.3s !important;
        }
        .role-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white !important;
          text-shadow: 0 0 10px rgba(99, 102, 241, 0.3) !important;
        }
        .role-tabs .ant-tabs-ink-bar {
          background: #6366f1 !important;
          height: 3px !important;
          border-radius: 2px !important;
          box-shadow: 0 0 8px #6366f1 !important;
        }
        .logo-text {
          font-family: 'Montserrat', 'Inter', sans-serif;
          background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 4px 20px rgba(99, 102, 241, 0.25);
          user-select: none;
        }
        .sub-link {
          color: #6b7280;
          font-size: 15px;
          transition: color 0.2s ease;
        }
        .sub-link span:hover {
          color: white;
          text-decoration: underline;
        }
      `}</style>

      <header style={{ padding: '24px 5%' }}>
        <h1 className="logo-text" style={{ fontSize: '2.4rem', fontWeight: 950, margin: 0, letterSpacing: '-1px' }}>
          CLB BORROW
        </h1>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', pb: '40px' }}>
        <div className="premium-card" style={{
          padding: '50px 55px 40px',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          minHeight: '520px',
        }}>
          {isRegister ? (
            <>
              <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 800, marginBottom: '28px', letterSpacing: '-0.5px' }}>
                Đăng Ký
              </h2>
              <Form layout="vertical" onFinish={handleRegister} size="large">
                <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
                  <Input prefix={<UserOutlined style={{ color: '#8c8c8c' }} />} placeholder="Họ và tên" className="premium-input" style={{ height: '50px' }} />
                </Form.Item>
                <Form.Item name="studentId" rules={[{ required: true, message: 'Vui lòng nhập MSSV' }]}>
                  <Input prefix={<IdcardOutlined style={{ color: '#8c8c8c' }} />} placeholder="Mã số sinh viên" className="premium-input" style={{ height: '50px' }} />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
                  <Input prefix={<MailOutlined style={{ color: '#8c8c8c' }} />} placeholder="Email" className="premium-input" style={{ height: '50px' }} />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }, { min: 6, message: 'Mật khẩu phải chứa ít nhất 6 ký tự' }]}>
                  <Input.Password prefix={<LockOutlined style={{ color: '#8c8c8c' }} />} placeholder="Mật khẩu" className="premium-input" style={{ height: '50px' }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={isRegisterLoading} block className="premium-btn" style={{ marginTop: '16px' }}>
                  Đăng Ký
                </Button>
              </Form>
              <div className="sub-link" style={{ marginTop: '30px' }}>
                Đã có tài khoản?{' '}
                <span onClick={() => setIsRegister(false)} style={{ color: '#b3b3b3', cursor: 'pointer', fontWeight: 600 }}>Đăng nhập ngay.</span>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.5px' }}>
                Đăng Nhập
              </h2>
              
              <Tabs
                activeKey={activeRole}
                onChange={(key) => setActiveRole(key as 'student' | 'admin')}
                items={[
                  { key: 'student', label: <span style={{ color: activeRole === 'student' ? 'white' : '#8c8c8c' }}>Sinh Viên</span> },
                  { key: 'admin', label: <span style={{ color: activeRole === 'admin' ? 'white' : '#8c8c8c' }}>Quản Trị</span> },
                ]}
                tabBarStyle={{ borderBottom: 'none' }}
                className="role-tabs"
              />

              <Form layout="vertical" onFinish={handleLogin} size="large" key={activeRole}>
                <Form.Item name="email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
                  <Input prefix={<UserOutlined style={{ color: '#8c8c8c' }} />} placeholder="Email" className="premium-input" style={{ height: '50px' }} />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                  <Input.Password prefix={<LockOutlined style={{ color: '#8c8c8c' }} />} placeholder="Mật khẩu" className="premium-input" style={{ height: '50px' }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading} block className="premium-btn" style={{ marginTop: '16px' }}>
                  Đăng Nhập
                </Button>
              </Form>
              
              {activeRole === 'student' && (
                <div className="sub-link" style={{ marginTop: '40px' }}>
                  Bạn mới tham gia CLB?{' '}
                  <span onClick={() => setIsRegister(true)} style={{ color: '#b3b3b3', cursor: 'pointer', fontWeight: 600 }}>Đăng ký ngay.</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
