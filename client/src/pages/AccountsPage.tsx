import React from 'react';
import { Tabs, Card } from 'antd';
import { CreateDoctorForm } from '@/components/CreateDoctorForm';
import { CreatePatientForm } from '@/components/CreatePatientForm';

const AccountsPage = () => {
  return (
    <Card>
      <Tabs
        defaultActiveKey="doctor"
        items={[
          {
            key: 'doctor',
            label: 'Create Doctor Account',
            children: <CreateDoctorForm />,
          },
          {
            key: 'patient',
            label: 'Create Patient Account',
            children: <CreatePatientForm />,
          },
        ]}
      />
    </Card>
  );
};

export default AccountsPage;