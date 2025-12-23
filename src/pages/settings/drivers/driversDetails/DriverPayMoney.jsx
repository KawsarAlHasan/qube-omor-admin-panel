import { Button } from "antd";
import { PayCircleOutlined } from "@ant-design/icons";

function DriverPayMoney() {
  return (
    <div>
      <Button
        type="primary"
        size="large"
        icon={<PayCircleOutlined />}
        //   onClick={openPaidModal}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 border-0 shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all rounded-xl h-12 px-6"
      >
        Driver Paid
      </Button>
    </div>
  );
}

export default DriverPayMoney;
