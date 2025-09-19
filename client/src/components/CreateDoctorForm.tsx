import { Form, Input, Select, Button, message } from 'antd';
import { useCreateDoctorMutation } from '@/features/receptionist/receptionistApiSlice';
import { SPECIALTIES, Specialty } from '@/constants/specialties';

interface CreateDoctorFormValues {
  email: string;
  password: string;
  name: string;
  phone: string;
  specialties: string[];
  bio: string;
  room: string;
}

export const CreateDoctorForm = () => {
  const [form] = Form.useForm<CreateDoctorFormValues>();
  const [createDoctor] = useCreateDoctorMutation();

  const onFinish = async (values: CreateDoctorFormValues) => {
    try {
      await createDoctor(values).unwrap();
      message.success('Doctor account created successfully');
      form.resetFields();
    } catch (error) {
      message.error('Failed to create doctor account');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please input password!' },
          { min: 6, message: 'Password must be at least 6 characters!' },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[{ required: true, message: 'Please input phone number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="specialties"
        label="Specialties"
        rules={[{ required: true, message: 'Please select at least one specialty!' }]}
      >
        <Select mode="multiple" placeholder="Select specialties">
          {SPECIALTIES.map((specialty: Specialty) => (
            <Select.Option key={specialty._id} value={specialty._id}>
              {specialty.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="bio"
        label="Bio"
        rules={[{ required: true, message: 'Please input bio!' }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        name="room"
        label="Room"
        rules={[{ required: true, message: 'Please input room number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Doctor Account
        </Button>
      </Form.Item>
    </Form>
  );
};