import React from 'react';
import { Card, Row, Col, Avatar, Typography, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface UserProfileCardProps {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: string;
  extraInfo?: React.ReactNode;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  name,
  email,
  phone,
  avatarUrl,
  role,
  extraInfo,
}) => {
  return (
    <Card>
      <Row gutter={[24, 24]} align="middle">
        <Col>
          <Avatar
            size={64}
            src={avatarUrl}
            icon={!avatarUrl && <UserOutlined />}
          />
        </Col>
        <Col flex="1">
          <Space direction="vertical" size="small">
            <Title level={4} style={{ margin: 0 }}>
              {name}
            </Title>
            <Text type="secondary" style={{ textTransform: 'capitalize' }}>
              {role}
            </Text>
            <Space split="•">
              <Text>{email}</Text>
              <Text>{phone}</Text>
            </Space>
          </Space>
        </Col>
      </Row>
      {extraInfo && (
        <div style={{ marginTop: 24 }}>
          {extraInfo}
        </div>
      )}
    </Card>
  );
};