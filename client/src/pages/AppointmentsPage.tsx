import { useState } from 'react';
import { Card, Row, Col, Form, DatePicker, Select, Button, message } from 'antd';
import { AppointmentList } from '@/components/AppointmentList';
import { useGetAppointmentsQuery, useCancelAppointmentMutation } from '@/features/receptionist/apiSlice';
import { useGetDoctorsQuery } from '@/features/receptionist/receptionistApiSlice';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Completed', value: 'completed' },
  { label: 'No Show', value: 'no_show' },
];

interface FilterValues {
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
  doctorId?: string;
  status?: string;
}

export const AppointmentsPage = () => {
  const [filters, setFilters] = useState<FilterValues>({});
  const [form] = Form.useForm();

  const { data: doctors } = useGetDoctorsQuery({});

  const { data: appointments, isLoading } = useGetAppointmentsQuery({
    doctorId: filters.doctorId,
    dateFrom: filters.dateRange?.[0]?.format('YYYY-MM-DD'),
    dateTo: filters.dateRange?.[1]?.format('YYYY-MM-DD'),
    status: filters.status,
  });

  const [cancelAppointment] = useCancelAppointmentMutation();

  const handleCancel = async (appointment: any) => {
    try {
      await cancelAppointment(appointment._id).unwrap();
      message.success('Appointment canceled successfully');
    } catch (error) {
      message.error('Failed to cancel appointment');
    }
  };

  const handleFilter = (values: FilterValues) => {
    setFilters(values);
  };

  // Chuyển đổi dữ liệu sang đúng kiểu nếu cần
  const mappedAppointments = (appointments || []).map((item: any) => ({
    ...item,
    patient: item.patient ?? {},   // hoặc lấy từ item.patientId nếu cần
    doctor: item.doctor ?? {},     // hoặc lấy từ item.doctorId nếu cần
    schedule: item.schedule ?? {}, // hoặc lấy từ item.scheduleId nếu cần
  }));

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
              <Form.Item name="status" label="Status">
                <Select
                  allowClear
                  placeholder="Select status"
                  options={statusOptions}
                  style={{ width: '100%' }}
                />
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
              <Button 
                type="primary"
                style={{ marginLeft: 8 }}
                onClick={() => {
                  // Navigate to create appointment page
                }}
              >
                Create Appointment
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <AppointmentList
        data={mappedAppointments}
        loading={isLoading}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AppointmentsPage;