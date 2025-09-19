import React from 'react';
import { Form, Input, Button, Row, Col, Card, Typography, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '@/features/auth/authSlice';

const { Title } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await login(values).unwrap();
      navigate('/schedules');
    } catch (err) {
      message.error('Đăng nhập thất bại!');
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={22} sm={16} md={12} lg={8} xl={6}>
        <Card>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
            Clinic Login
          </Title>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ tôi</Checkbox>
              </Form.Item>
              <Link
                to="/forgot-password"
                style={{ float: 'right' }}
              >
                Quên mật khẩu?
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
            <Form.Item>
              <div style={{ textAlign: 'center' }}>
                Bạn chưa có tài khoản?{' '}
                <Link to="/register">
                  Đăng ký ngay
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};