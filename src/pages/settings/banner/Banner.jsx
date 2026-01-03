import React, { useState } from "react";
import {
  Card,
  Button,
  Upload,
  Input,
  Modal,
  Form,
  message,
  Image,
  Typography,
} from "antd";
import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { useBannerData } from "../../../api/settingsApi";
import IsLoading from "../../../components/IsLoading";
import IsError from "../../../components/IsError";
import { API } from "../../../api/api";
import { usePermission } from "../../../hooks/usePermission";

const { Title } = Typography;

function Banner() {
  const { canEdit } = usePermission();
  const { control, handleSubmit, reset, setValue, watch } = useForm();
  const { bannerData, isLoading, isError, error, refetch } = useBannerData();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [loading, setLoading] = useState(false);

  // Watch the image field to track changes
  const imageField = watch("image");

  const handleEdit = (banner) => {
    setCurrentBanner(banner);
    reset({
      title: banner.title || "",
      image: banner.image || "", // Store current image URL
    });
    setIsModalVisible(true);
  };

  const handlePreview = (banner) => {
    setCurrentBanner(banner);
    setPreviewVisible(true);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);

    // Check if there's a new image file uploaded
    if (
      data.uploadedFile &&
      Array.isArray(data.uploadedFile) &&
      data.uploadedFile.length > 0
    ) {
      const file = data.uploadedFile[0];
      if (file.originFileObj) {
        formData.append("image", file.originFileObj);
      }
    } else if (data.image) {
      // Keep existing image URL if no new file is uploaded
      formData.append("image", data.image);
    } else {
      // No image at all (image was removed)
      formData.append("image", "");
    }

    try {
      const response = await API.put(
        `/settings/banner/${currentBanner._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        message.success("Banner updated successfully!");
        setIsModalVisible(false);
        reset();
        setCurrentBanner(null);
        refetch();
      } else {
        message.error(response.data.message || "Failed to update banner");
      }
    } catch (error) {
      console.error("Update error:", error);
      message.error(
        error?.response?.data?.message || "Failed to update banner"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    reset();
    setCurrentBanner(null);
  };

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div className=" p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Banner Management
          </h1>
          <p className="text-gray-600">Manage and edit your banners</p>
        </div>

        {/* Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bannerData?.map((banner) => (
            <Card
              key={banner?._id || banner?.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-0"
              bodyStyle={{ padding: 0 }}
            >
              {/* Banner Image */}
              <div className="relative h-[20rem] overflow-hidden">
                <img
                  src={banner?.image}
                  alt={banner?.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-1">{banner?.title}</h2>
                </div>
              </div>

              {/* Banner Info */}
              <div className="p-6 bg-white">
                <h2 className="text-2xl line-clamp-2 font-bold mb-4 text-gray-600">
                  {banner?.typeTitle}
                </h2>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {canEdit("legal-and-banner") && (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(banner)}
                      className="flex-1 my-main-button"
                    >
                      Update
                    </Button>
                  )}

                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handlePreview(banner)}
                    className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Edit Modal */}
        <Modal
          title={<Title level={3}>Edit Banner - {currentBanner?.title}</Title>}
          open={isModalVisible}
          onCancel={handleModalCancel}
          footer={null}
          centered
          width={700}
        >
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
            {/* Hidden field for image URL */}
            <Controller
              name="image"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />

            {/* Banner Title */}
            <Form.Item label="Banner Title" required>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Banner title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Title must not exceed 100 characters",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <Input
                      {...field}
                      placeholder="Enter banner title..."
                      size="large"
                      className="rounded-lg"
                    />
                    {error && (
                      <div className="text-red-500 text-sm mt-1">
                        {error.message}
                      </div>
                    )}
                  </div>
                )}
              />
            </Form.Item>

            {/* Current Image Preview */}
            {currentBanner?.image && (
              <div className="mb-4">
                <span className="font-semibold text-gray-700 block mb-2">
                  Current Image
                </span>
                <Image
                  src={currentBanner?.image}
                  alt="Current banner"
                  className="rounded-lg border-2 border-gray-200"
                  style={{ maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Upload New Image */}
            <Form.Item label="Upload New Image">
              <Controller
                name="uploadedFile"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => {
                  const fileList = Array.isArray(value) ? value : [];

                  return (
                    <div>
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        accept="image/*"
                        fileList={fileList}
                        beforeUpload={(file) => {
                          // Validate file type
                          const isImage = file.type.startsWith("image/");
                          if (!isImage) {
                            message.error("You can only upload image files!");
                            return Upload.LIST_IGNORE;
                          }

                          // Validate file size (5MB)
                          const isLessThan5M = file.size / 1024 / 1024 < 5;
                          if (!isLessThan5M) {
                            message.error("Image must be smaller than 5MB!");
                            return Upload.LIST_IGNORE;
                          }

                          // Add to file list
                          const newFileList = [
                            ...fileList,
                            {
                              uid: file.uid,
                              name: file.name,
                              status: "done",
                              originFileObj: file,
                            },
                          ];
                          onChange(newFileList);
                          return false; // Prevent auto upload
                        }}
                        onRemove={() => {
                          onChange([]);
                        }}
                        onPreview={(file) => {
                          const src =
                            file.url || URL.createObjectURL(file.originFileObj);
                          const imgWindow = window.open(src);
                          imgWindow?.document.write(
                            `<img src="${src}" style="width: 100%;" />`
                          );
                        }}
                      >
                        {fileList.length >= 1 ? null : (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload Image</div>
                          </div>
                        )}
                      </Upload>
                    </div>
                  );
                }}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full my-main-button h-10 text-lg"
              >
                Update Banner
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Preview Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <EyeOutlined className="text-blue-500 text-2xl" />
              <span className="text-2xl font-bold text-gray-800">
                Banner Preview
              </span>
            </div>
          }
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={900}
        >
          {currentBanner && (
            <div className="mt-4">
              <div className="relative h-[30rem] rounded-lg overflow-hidden shadow-xl">
                <img
                  src={currentBanner?.image}
                  alt={currentBanner?.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-5xl font-bold mb-12">
                    {currentBanner?.title}
                  </h2>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default Banner;
