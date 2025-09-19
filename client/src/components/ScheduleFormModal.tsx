import React from 'react';
import { Modal, Form, Select, DatePicker, TimePicker, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Doctor } from '@/types';
import dayjs from 'dayjs';

interface ScheduleFormModalProps {
  visible: boolean;
  onCancel: () => void;
  schedule?: any;
  doctors: Doctor[];
}

interface FormValues {
  doctorId: string;
  date: dayjs.Dayjs;
  slots: Array<{
    start: dayjs.Dayjs;
    end: dayjs.Dayjs;
    capacity: number;
  }>;
}

export const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({
  visible,
  onCancel,
  schedule,
  doctors,
}) => {
  const [form] = Form.useForm();

  const onFinish = (values: FormValues) => {
    // Handle form submission
  };

  React.useEffect(() => {
    if (visible && schedule) {
      form.setFieldsValue({
        doctorId: schedule.doctorId,
        date: dayjs(schedule.date),
        slots: schedule.slots.map((slot: any) => ({
          start: dayjs(slot.start, 'HH:mm'),
          end: dayjs(slot.end, 'HH:mm'),
          capacity: slot.capacity,
        })),
      });
    } else {
      form.resetFields();
    }
  }, [visible, schedule, form]);

  return (
    <Modal
      title={schedule ? 'Edit Schedule' : 'Add Schedule'}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="doctorId"
          label="Doctor"
          rules={[{ required: true, message: 'Please select a doctor' }]}
        >
          <Select placeholder="Select doctor">
            {doctors.map((doctor) => (
              <Select.Option key={doctor._id} value={doctor._id}>
                {doctor.userId.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please select a date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.List
          name="slots"
          rules={[
            {
              validator: async (_, slots) => {
                if (!slots || slots.length < 1) {
                  return Promise.reject(new Error('At least one time slot is required'));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'start']}
                    rules={[{ required: true, message: 'Start time required' }]}
                  >
                    <TimePicker format="HH:mm" placeholder="Start time" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'end']}
                    rules={[{ required: true, message: 'End time required' }]}
                  >
                    <TimePicker format="HH:mm" placeholder="End time" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, 'capacity']}
                    rules={[{ required: true, message: 'Capacity required' }]}
                  >
                    <Select style={{ width: 100 }} placeholder="Capacity">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <Select.Option key={num} value={num}>
                          {num}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add Time Slot
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};