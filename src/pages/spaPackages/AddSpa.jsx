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
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";

const { TextArea } = Input;
const { Option } = Select;

function AddSpa({capitalized}) {
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
        message.success(`${capitalized} class added successfully`);
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

 

  return (
    <div>
      <Button onClick={showModal} className="my-main-button" type="primary">
        + Add {capitalized} Class
      </Button>

      <Modal
        title={`Add ${capitalized} Class`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={700}
        footer={[
        //   <Button key="back" onClick={handleCancel}>
        //     Cancel
        //   </Button>,
          <Button block className="my-main-button" key="submit" type="primary" onClick={handleOk}>
            Add Class
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="spa_class_form"
          initialValues={{
            status: "Available",
          }}
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
            //   rows={4}
              placeholder={`Describe the ${capitalized} treatment and experience`}
            />
          </Form.Item>

          {/* <Form.Item
            name="time"
            label="Duration"
            rules={[
              {
                required: true,
                message: "Please input the service duration!",
              },
            ]}
          >
            <Input placeholder="e.g., 50 minutes" />
          </Form.Item> */}

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
              {
                required: true,
                message: "Please input the class capacity!",
              },
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
              {
                required: true,
                message: "Please input the instructor name!",
              },
            ]}
          >
            <Input placeholder="e.g., Jessica Davis" />
          </Form.Item>

          <Form.Item name="images" label="Service Images">
            <Upload
              listType="picture"
              fileList={imageList}
              onChange={handleUpload}
              beforeUpload={() => false} // Prevent automatic upload
            >
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddSpa;
