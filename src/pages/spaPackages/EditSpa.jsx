import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Upload,
  message,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

function EditSpa({capitalized, record }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        // Format the date properly
        const formattedValues = {
          ...values,
          date: values.date.format("D MMMM YYYY"),
        };

        console.log("Form values:", formattedValues);
        message.success(`${capitalized} class updated successfully`);
        form.resetFields();
        setImageList([]);
        setIsModalOpen(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setImageList([]);
    setIsModalOpen(false);
  };

  // Handle image upload
  const handleUpload = ({ fileList }) => {
    setImageList(fileList);
  };

  // Set default values based on the provided data
  const setDefaultValues = () => {};

  return (
    <div>
   

       <EditOutlined className="text-blue-500 text-xl" onClick={showModal} />

      <Modal
        title={`Update ${capitalized} Class`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
          <div className="grid grid-cols-2 gap-2">
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              className="my-main-button"
              key="submit"
              type="primary"
              onClick={handleOk}
            >
              Update Class
            </Button>
          </div>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="spa_class_form"
          initialValues={form.setFieldsValue({
            service_name: record.service_name,
            description: record.description,
            time: record.time,
            price: record.price,
            room: record.room,
            class_capacity: record.class_capacity,
            waitinglist: record.waitinglist,
            instructor: "Jonh Doe",
            status: record.status,
          })}
        >
          <Form.Item
            name="service_name"
            label="Service Name"
            rules={[
              { required: true, message: "Please input the service name!" },
            ]}
          >
            <Input placeholder="e.g., Relax & Rejuvenate" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: "Please input the service description!",
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={`Describe the ${capitalized} treatment and experience`}
            />
          </Form.Item>

          <Form.Item
            name="time"
            label="Duration"
            rules={[
              { required: true, message: "Please input the service duration!" },
            ]}
          >
            <Input placeholder="e.g., 50 minutes" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price ($)"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
              placeholder="e.g., 70.99"
            />
          </Form.Item>

          <Form.Item
            name="room"
            label="Room Type"
            rules={[
              { required: true, message: "Please select the room type!" },
            ]}
          >
            <Select placeholder="Select room type">
              <Option value="Private Room">Private Room</Option>
              <Option value="Shared Room">Shared Room</Option>
              <Option value="VIP Suite">VIP Suite</Option>
              <Option value="Outdoor Area">Outdoor Area</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="class_capacity"
            label="Class Capacity"
            rules={[
              { required: true, message: "Please input the class capacity!" },
            ]}
          >
            <InputNumber
              min={1}
              max={100}
              style={{ width: "100%" }}
              placeholder="e.g., 18"
            />
          </Form.Item>

          <Form.Item
            name="waitinglist"
            label="Waiting List Capacity"
            rules={[
              {
                required: true,
                message: "Please input the waiting list capacity!",
              },
            ]}
          >
            <InputNumber
              min={0}
              max={50}
              style={{ width: "100%" }}
              placeholder="e.g., 10"
            />
          </Form.Item>

          <Form.Item
            name="instructor"
            label="Instructor"
            rules={[
              { required: true, message: "Please input the instructor name!" },
            ]}
          >
            <Input placeholder="e.g., Jessica Davis" />
          </Form.Item>

          {/* <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              <Option value="Available">Available</Option>
              <Option value="Full">Full</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item> */}

          {/* <Form.Item name="images" label="Service Images">
            <Upload
              listType="picture"
              fileList={imageList}
              onChange={handleUpload}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item> */}
        </Form>
      </Modal>
    </div>
  );
}

export default EditSpa;
