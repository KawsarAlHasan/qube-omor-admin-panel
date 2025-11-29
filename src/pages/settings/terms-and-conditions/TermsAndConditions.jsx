import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button, Modal, message } from "antd";
import { useTermsPrivacy } from "../../../api/settingsApi";
import IsLoading from "../../../components/IsLoading";
import IsError from "../../../components/IsError";
import { API } from "../../../api/api";
import { MdModeEditOutline } from "react-icons/md";

function TermsAndConditions() {
  const filter = "terms";
  const { termsPrivacy, isLoading, isError, error, refetch } =
    useTermsPrivacy(filter);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    setContent(termsPrivacy?.data?.content || "");
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { data } = await API.put("/settings/terms", { content });
      message.success(
        data?.message || "Terms & Conditions updated successfully!"
      );
      setIsModalOpen(false);
      refetch(); // refresh data
    } catch (err) {
      console.error(err);
      message.error("Failed to update Terms & Conditions.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <IsLoading />;
  if (isError) return <IsError error={error} refetch={refetch} />;

  return (
    <div className="p-6 bg-white rounded-md shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          {termsPrivacy?.data?.name || "Terms & Conditions"}
        </h2>
        <Button
          icon={<MdModeEditOutline />}
          type="primary"
          onClick={handleEdit}
        >
          Edit
        </Button>
      </div>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: termsPrivacy?.data?.content }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Terms & Conditions"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
        confirmLoading={loading}
        width={1200}
        okText="Update"
      >
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          style={{ height: "550px", marginBottom: "50px" }}
        />
      </Modal>
    </div>
  );
}

export default TermsAndConditions;
