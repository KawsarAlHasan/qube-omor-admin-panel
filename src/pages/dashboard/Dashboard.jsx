import React, { useEffect, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import {
  FaUsers,
  FaMoneyBillWave, // total_earnings
  FaMoneyCheckAlt, // today_earnings
  FaShoppingCart, // today_total_orders
  FaCheckCircle, // today_completed_orders
  FaHourglassHalf, // today_pending_orders
  FaTimesCircle, // today_cancelled_orders
} from "react-icons/fa";
import { useDashboardData } from "../../api/settingsApi";
import EarningsGrowth from "../analytics/EarningsGrowth";
import { Radio } from "antd";
import SpaAnalytics from "./spaAnalytics/SpaAnalytics";

function Dashboard() {
  const [selectType, setSelectType] = useState("restaurant");

  const { dashboardData, isLoading, isError, error, refetch } =
    useDashboardData();

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div>
      <div className="bg-white w-full p-4 rounded-md">
        <p className="text-[16px] mt-2">Hi, Good Morning</p>
        <h2 className="text-[24px] font-semibold">
          {dashboardData?.admin?.name}
        </h2>
      </div>

      <Radio.Group
        defaultValue={selectType}
        buttonStyle="solid"
        onChange={(e) => setSelectType(e.target.value)}
        className="mt-8 mb-4"
      >
        <Radio.Button value="restaurant">Restaurant</Radio.Button>
        <Radio.Button value="spa">Spa Analytics</Radio.Button>
        <Radio.Button value="physio">Physio Analytics</Radio.Button>
        <Radio.Button value="classes">Classes Analytics</Radio.Button>
      </Radio.Group>

      {selectType === "restaurant" ? (
        <EarningsGrowth dashboardData={dashboardData} />
      ) : (
        <SpaAnalytics selectType={selectType} />
      )}
    </div>
  );
}

export default Dashboard;
