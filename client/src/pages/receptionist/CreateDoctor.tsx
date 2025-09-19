import { Card, Typography } from 'antd';
import { CreateDoctorForm } from '@/components/CreateDoctorForm';

const { Title } = Typography;

export const CreateDoctorPage = () => {
  return (
    <Card>
      <Title level={2}>Create Doctor Account</Title>
      <CreateDoctorForm />
    </Card>
  );
};