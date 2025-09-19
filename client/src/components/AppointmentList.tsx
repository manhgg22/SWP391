import React from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Appointment } from '@/types/appointment';

interface AppointmentListProps {
  data: Appointment[];
  loading: boolean;
  onCancel: (appointment: Appointment) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  data,
  loading,
  onCancel,
}) => {
  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      confirmed: 'green',
      canceled: 'red',
      completed: 'blue',
      no_show: 'orange',
    };
    return colors[status];
  };

  const columns = [
    {
      title: 'Patient',
      dataIndex: ['patient', 'name'],
      key: 'patient',
    },
    {
      title: 'Doctor',
      dataIndex: ['doctor', 'name'],
      key: 'doctor',
    },
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (record: Appointment) => (
        `${record.schedule.date} ${record.schedule.slots[record.slotIndex].start}`
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Appointment['status']) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Appointment) => (
        <Space>
          {record.status === 'confirmed' && (
            <Tooltip title="Cancel">
              <Button
                type="text"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => onCancel(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
    />
  );
};