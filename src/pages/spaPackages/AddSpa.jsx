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
  Switch,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { API } from "../../api/api";
import { useUsersList } from "../../api/userApi";
import userIcon from "../../assets/icons/userIcon.png";

const { TextArea } = Input;
const { Option } = Select;

function AddSpa({ capitalized = "Spa", refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch instructors list
  const { usersList, isLoading: isInstructorLoading } = useUsersList({
    role: "Instructor",
    status: "Active",
    page: 1,
    limit: 2000,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Create FormData for multipart/form-data
      const formData = new FormData();

      // Add text fields
      formData.append("service_name", values.service_name);
      formData.append("description", values.description);
      formData.append("credit", values.credit.toString());
      formData.append("room_type", values.room_type);
      formData.append("date", values.date.format("YYYY-MM-DD"));
      formData.append("time", values.time);
      formData.append("time_slote", values.time_slote);
      formData.append("class_capacity", values.class_capacity.toString());
      formData.append(
        "waiting_list_capacity",
        (values.waiting_list_capacity || 0).toString()
      );
      formData.append("instructor", values.instructor);
      formData.append("is_every_day", values.is_every_day ? "true" : "false");
      formData.append("type", capitalized);

      // Add image if uploaded
      if (imageList.length > 0) {
        formData.append("images", imageList[0].originFileObj);
      }

      await API.post(`/spa/create`, formData);

      message.success(`${capitalized} class added successfully`);
      form.resetFields();
      setImageList([]);
      setIsModalOpen(false);
      refetch?.();
    } catch (error) {
      console.error("Error:", error);
      message.error(
        error.response?.data?.message ||
          "Failed to add class. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setImageList([]);
    setIsModalOpen(false);
  };

  // Handle image upload
  const handleUpload = ({ fileList }) => {
    // Limit to one file as per API
    setImageList(fileList.slice(-1));
  };

  // Custom upload props
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      return false; // Prevent automatic upload
    },
    maxCount: 1,
  };

  // Get instructors array from API response
  const instructors = usersList?.data?.users || [];

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
        width={800}
        confirmLoading={loading}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleOk}
            loading={loading}
            className="my-main-button"
          >
            Add Class
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="spa_class_form"
          initialValues={{
            is_every_day: false,
            credit: 3,
            time: "1 Hour",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="service_name"
                label="Service Name"
                rules={[
                  {
                    required: true,
                    message: "Please input the service name!",
                  },
                ]}
              >
                <Input placeholder="e.g., Relax & Rejuvenate Spa" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="instructor"
                label="Instructor"
                rules={[
                  {
                    required: true,
                    message: "Please select an instructor!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select an instructor"
                  style={{ width: "100%" }}
                  filterOption={(input, option) => {
                    const instructor = instructors.find(
                      (inst) => inst._id === option.value
                    );
                    return (
                      instructor?.name
                        ?.toLowerCase()
                        .includes(input.toLowerCase()) || false
                    );
                  }}
                  loading={isInstructorLoading}
                  notFoundContent={
                    isInstructorLoading ? "Loading..." : "No instructors found"
                  }
                >
                  {instructors?.map((instructor) => (
                    <Option key={instructor?._id} value={instructor?._id}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <img
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                          src={instructor?.profile_image || userIcon}
                          alt={instructor?.name}
                          onError={(e) => {
                            e.target.src = userIcon;
                          }}
                        />
                        <span>{instructor?.name}</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
              rows={3}
              placeholder="e.g., Enjoy a full body massage and a soothing spa treat"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="credit"
                label="Credits"
                rules={[
                  { required: true, message: "Please input the credits!" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="e.g., 3"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="time"
                label="Duration"
                rules={[
                  {
                    required: true,
                    message: "Please select the duration!",
                  },
                ]}
              >
                <Select placeholder="Select duration">
                  <Option value="30 Minutes">30 Minutes</Option>
                  <Option value="45 Minutes">45 Minutes</Option>
                  <Option value="1 Hour">1 Hour</Option>
                  <Option value="1.5 Hours">1.5 Hours</Option>
                  <Option value="2 Hours">2 Hours</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="room_type"
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: "Please select the date!" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="time_slote"
                label="Time Slot"
                rules={[
                  {
                    required: true,
                    message: "Please select the time slot!",
                  },
                ]}
              >
                <Select placeholder="Select time slot">
                  <Option value="9 AM">9 AM</Option>
                  <Option value="10 AM">10 AM</Option>
                  <Option value="11 AM">11 AM</Option>
                  <Option value="12 PM">12 PM</Option>
                  <Option value="1 PM">1 PM</Option>
                  <Option value="2 PM">2 PM</Option>
                  <Option value="3 PM">3 PM</Option>
                  <Option value="4 PM">4 PM</Option>
                  <Option value="5 PM">5 PM</Option>
                  <Option value="6 PM">6 PM</Option>
                  <Option value="7 PM">7 PM</Option>
                  <Option value="8 PM">8 PM</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="is_every_day"
                label="Repeat Daily"
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
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
                  placeholder="e.g., 30"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="waiting_list_capacity"
                label="Waiting List Capacity"
              >
                <InputNumber
                  min={0}
                  max={50}
                  style={{ width: "100%" }}
                  placeholder="e.g., 10"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="images" label="Service Image">
            <Upload
              listType="picture-card"
              fileList={imageList}
              onChange={handleUpload}
              {...uploadProps}
            >
              {imageList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            <span style={{ fontSize: "12px", color: "#888" }}>
              Max 1 image, less than 5MB
            </span>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddSpa;
