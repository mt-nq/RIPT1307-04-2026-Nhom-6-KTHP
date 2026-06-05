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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <img
              src="https://tse3.mm.bing.net/th/id/OIP.RjZcMPjW1gO4lp8xOM66IgHaHa?cb=thfvnextfalcon&rs=1&pid=ImgDetMain&o=7&rm=3"
              alt="Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '50%',
              }}
            />
          </div>
          <h1>CLB Borrow</h1>
          <p>Hệ thống quản lý mượn đồ dùng</p>
        </div>

        {isRegister ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>Đăng Ký Sinh Viên</h2>
              <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                Tạo tài khoản để đăng ký mượn thiết bị CLB
              </p>
            </div>

            <Form
              layout="vertical"
              onFinish={handleRegister}
              size="large"
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#6366f1' }} />}
                  placeholder="Nhập họ và tên sinh viên"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item
                name="studentId"
                label="Mã số sinh viên (MSSV)"
                rules={[{ required: true, message: 'Vui lòng nhập mã số sinh viên' }]}
              >
                <Input
                  prefix={<IdcardOutlined style={{ color: '#6366f1' }} />}
                  placeholder="Nhập mã số sinh viên"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#6366f1' }} />}
                  placeholder="Nhập email sinh viên"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu' },
                  { min: 6, message: 'Mật khẩu phải chứa ít nhất 6 ký tự' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#6366f1' }} />}
                  placeholder="Nhập mật khẩu"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={isRegisterLoading}
                block
                size="large"
                style={{ height: 50, borderRadius: 12, fontSize: 16, fontWeight: 700, marginTop: 8 }}
              >
                Đăng Ký
              </Button>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => setIsRegister(false)}
                style={{ color: '#6366f1', fontWeight: 600 }}
              >
                Quay lại Đăng nhập
              </Button>
            </div>
          </>
        ) : (
          <>
            <Tabs
              centered
              activeKey={activeRole}
              onChange={(key) => setActiveRole(key as 'student' | 'admin')}
              items={[
                { key: 'student', label: '👨‍🎓 Sinh Viên' },
                { key: 'admin', label: '🛠️ Quản Trị Viên' },
              ]}
              style={{ marginBottom: 8 }}
            />

            <Form
              layout="vertical"
              onFinish={handleLogin}
              size="large"
              key={activeRole}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#6366f1' }} />}
                  placeholder="Nhập email của bạn"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#6366f1' }} />}
                  placeholder="Nhập mật khẩu"
                  style={{ borderRadius: 10 }}
                />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                style={{ height: 50, borderRadius: 12, fontSize: 16, fontWeight: 700, marginTop: 8 }}
              >
                Đăng Nhập
              </Button>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <span style={{ color: '#6b7280', fontSize: 14 }}>Chưa có tài khoản sinh viên? </span>
              <Button
                type="link"
                onClick={() => setIsRegister(true)}
                style={{ color: '#6366f1', padding: 0, fontWeight: 600, fontSize: 14 }}
              >
                Đăng ký ngay
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
