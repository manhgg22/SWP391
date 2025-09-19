import { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  ScheduleOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useGetMeQuery } from '@/features/auth/authSlice';

const { Sider, Content } = Layout;

const menuItems = [
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: 'Profile',
  },
  {
    key: '/schedules',
    icon: <CalendarOutlined />,
    label: 'Doctor Schedules',
  },
  {
    key: '/accounts',
    icon: <TeamOutlined />,
    label: 'Create Accounts',
  },
  {
    key: '/appointments',
    icon: <ScheduleOutlined />,
    label: 'Appointments',
  },
  {
    key: '/feedbacks',
    icon: <StarOutlined />,
    label: 'Feedbacks',
  },
];

export const ReceptionistLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user, isLoading } = useGetMeQuery();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" style={{ padding: '24px 0' }}>
        <div style={{ padding: '0 24px', marginBottom: 24 }}>
          <h1 style={{ margin: 0 }}>Clinic</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: '#fff',
            borderRadius: 4,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};