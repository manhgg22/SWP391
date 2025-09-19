import React, { useState } from 'react';
import { Card, Row, Col, Form, Select, DatePicker, Rate, Button, Drawer } from 'antd';
import { Table, Space } from 'antd';
import dayjs from 'dayjs';
import { useGetFeedbacksQuery } from '@/features/receptionist/apiSlice';
import { useGetDoctorsQuery } from '@/features/receptionist/receptionistApiSlice';

const { RangePicker } = DatePicker;

interface FilterValues {
  doctorId?: string;
  rating?: number;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
}

const FeedbacksPage = () => {
  const [filters, setFilters] = useState<FilterValues>({});
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [form] = Form.useForm();

  const { data: doctors } = useGetDoctorsQuery({});

  const { data: feedbacks, isLoading } = useGetFeedbacksQuery({
    doctorId: filters.doctorId,
    rating: filters.rating,
    from: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
    to: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
  });

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
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => setSelectedFeedback(record)}>
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  const handleFilter = (values: FilterValues) => {
    setFilters(values);
  };

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFilter}
        >
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item name="dateRange" label="Date Range">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="doctorId" label="Doctor">
                <Select
                  allowClear
                  placeholder="Select doctor"
                  style={{ width: '100%' }}
                >
                  {doctors?.map((doctor: any) => (
                    <Select.Option key={doctor._id} value={doctor._id}>
                      {doctor.userId.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="rating" label="Rating">
                <Select allowClear placeholder="Select rating">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <Select.Option key={rating} value={rating}>
                      {rating} Stars
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">
                Filter
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  form.resetFields();
                  setFilters({});
                }}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={feedbacks || []}
        loading={isLoading}
        rowKey="_id"
      />

      <Drawer
        title="Feedback Details"
        placement="right"
        onClose={() => setSelectedFeedback(null)}
        open={!!selectedFeedback}
        width={480}
      >
        {selectedFeedback && (
          <div>
            <p><strong>Patient:</strong> {selectedFeedback.patient.name}</p>
            <p><strong>Doctor:</strong> {selectedFeedback.doctor.name}</p>
            <p><strong>Appointment Date:</strong> {dayjs(selectedFeedback.appointment.date).format('YYYY-MM-DD')}</p>
            <p><strong>Rating:</strong></p>
            <Rate disabled defaultValue={selectedFeedback.rating} />
            <p style={{ marginTop: 16 }}><strong>Comment:</strong></p>
            <p>{selectedFeedback.comment}</p>
            <p><strong>Submitted on:</strong> {dayjs(selectedFeedback.createdAt).format('YYYY-MM-DD HH:mm')}</p>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default FeedbacksPage;