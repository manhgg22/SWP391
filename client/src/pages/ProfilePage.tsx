import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserProfileCard } from '@/components/UserProfileCard';
import { useGetMeQuery, useUpdateProfileMutation } from '@/features/auth/authSlice';

interface ProfileFormValues {
  name: string;
  phone: string;
  avatarUrl?: string;
}

export const ProfilePage = () => {
  const { data: user, isLoading } = useGetMeQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [form] = Form.useForm<ProfileFormValues>();

  const onFinish = async (values: ProfileFormValues) => {
    try {
      await updateProfile(values).unwrap();
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  if (isLoading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UserProfileCard
        name={user.name}
        email={user.email}
        phone={user.phone}
        avatarUrl={user.avatarUrl}
        role={user.role}
      />

      <Card title="Edit Profile" style={{ marginTop: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: user.name,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please input your phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="avatarUrl" label="Avatar URL">
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;