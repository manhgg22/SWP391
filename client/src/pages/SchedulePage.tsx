import React, { useState } from 'react';
import {
  Card,
  DatePicker,
  Select,
  Form,
  Button,
  Row,
  Col,
  Popconfirm,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { ScheduleTable } from '@/components/ScheduleTable';
import { ScheduleFormModal } from '@/components/ScheduleFormModal';
import {
  useGetDoctorsQuery,
  useGetSpecialtiesQuery,
} from '@/features/receptionist/receptionistApiSlice';
import {
  useGetSchedulesQuery,
  useDeleteScheduleMutation,
} from '@/features/receptionist/apiSlice';

export const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const { data: doctors, isLoading: loadingDoctors } = useGetDoctorsQuery({
    specialtyId: selectedSpecialty || undefined,
  });

  const { data: specialties, isLoading: loadingSpecialties } =
    useGetSpecialtiesQuery();

  const { data: schedules, isLoading: loadingSchedules } = useGetSchedulesQuery({
    doctorId: selectedDoctor || undefined,
    date: selectedDate?.format('YYYY-MM-DD'),
    specialtyId: selectedSpecialty || undefined,
  });

  const [deleteSchedule] = useDeleteScheduleMutation();

  const handleEdit = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsModalVisible(true);
  };

  const handleDelete = async (schedule: any) => {
    try {
      await deleteSchedule(schedule._id).unwrap();
      message.success('Schedule deleted successfully');
    } catch (error) {
      message.error('Failed to delete schedule');
    }
  };

  // Map lại dữ liệu để đảm bảo có trường doctor
  const mappedSchedules = (schedules || []).map((item: any) => ({
    ...item,
    doctor: item.doctor ?? doctors?.find((d: any) => d._id === item.doctorId) ?? {},
  }));

  // Map lại danh sách doctors để đảm bảo đủ type
  const mappedDoctors = (doctors || []).map((doctor: any) => ({
    ...doctor,
    createdAt: doctor.createdAt ?? '',
    updatedAt: doctor.updatedAt ?? '',
    // Thêm các trường khác nếu type yêu cầu
  }));

  return (
    <div>
      <Card style={{ marginBottom: 24 }}>
        <Form layout="inline">
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Date" style={{ width: '100%' }}>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Specialty" style={{ width: '100%' }}>
                <Select
                  value={selectedSpecialty}
                  onChange={setSelectedSpecialty}
                  loading={loadingSpecialties}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {specialties?.map((specialty) => (
                    <Select.Option key={specialty._id} value={specialty._id}>
                      {specialty.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="Doctor" style={{ width: '100%' }}>
                <Select
                  value={selectedDoctor}
                  onChange={setSelectedDoctor}
                  loading={loadingDoctors}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {doctors?.map((doctor) => (
                    <Select.Option key={doctor._id} value={doctor._id}>
                      {doctor.userId.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Button
                type="primary"
                onClick={() => {
                  setSelectedSchedule(null);
                  setIsModalVisible(true);
                }}
                style={{ width: '100%' }}
              >
                Add Schedule
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <ScheduleTable
        data={mappedSchedules}
        loading={loadingSchedules}
        onEdit={handleEdit}
        onDelete={(schedule) => {
          if (schedule.slots.some((s: any) => s.bookedCount > 0)) {
            message.error('Cannot delete schedule with booked appointments');
            return;
          }
          handleDelete(schedule);
        }}
      />

      <ScheduleFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        schedule={selectedSchedule}
        doctors={mappedDoctors}
      />
    </div>
  );
};

export default SchedulePage;