import React from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '@/features/auth/authSlice';

const { Title } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values: any) => {
    try {
      await register(values).unwrap();
      message.success('Đăng ký thành công!');
      navigate('/login');
    } catch (err: any) {
      message.error(err?.data?.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '40px auto' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        Đăng ký tài khoản
      </Title>
      <Form name="register" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Nhập tên!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Tên" size="large" />
        </Form.Item>
        <Form.Item
          name="phone"
          rules={[{ required: true, message: 'Nhập số điện thoại!' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={isLoading}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
