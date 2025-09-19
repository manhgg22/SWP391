import React from 'react';
import { Table, Tooltip, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Schedule } from '@/types/schedule';

interface ScheduleTableProps {
  data: Schedule[];
  loading: boolean;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  data,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      title: 'Doctor',
      dataIndex: ['doctor', 'name'],
      key: 'doctor',
      width: 200,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Slots',
      dataIndex: 'slots',
      key: 'slots',
      render: (slots: Schedule['slots']) => (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {slots.map((slot, index) => (
            <li key={index}>
              {slot.start} - {slot.end} ({slot.bookedCount}/{slot.capacity})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Schedule) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
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
      pagination={false}
    />
  );
};