import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FaSackDollar } from "react-icons/fa6";
// import { useAdminProfile } from "../../api/api";
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

function Dashboard() {
  const { dashboardData, isLoading, isError, error, refetch } =
    useDashboardData();

  const adminDashboard = {
    admin_profile: {
      name: "Shah Rukh Khan",
    },
    total_users: 100500,
    todays_new_users: 1930,
    total_earnings: 13490,
    today_total_earnings: 300,

    restaurant: {
      total_earnings: 5000,
      today_earnings: 300,
      today_total_orders: 200,
      today_completed_orders: 200,
      today_pending_orders: 200,
      today_cancelled_orders: 200,
    },
    spa: {
      total_earnings: 5000,
      today_earnings: 300,
      today_total_orders: 200,
      today_completed_orders: 200,
      today_pending_orders: 200,
      today_cancelled_orders: 200,
    },
    physio: {
      total_earnings: 5000,
      today_earnings: 300,
      today_total_orders: 200,
      today_completed_orders: 200,
      today_pending_orders: 200,
      today_cancelled_orders: 200,
    },
  };

  const restaurant = adminDashboard?.restaurant;
  const spa = adminDashboard?.spa;
  const physio = adminDashboard?.physio;

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  console.log("restaurant", dashboardData.restaurant);
  console.log("spa", dashboardData.spa);
  console.log("physio", dashboardData.physio);

  return (
    <div>
      <div className="bg-white w-full p-4 rounded-md">
        <p className="text-[16px] mt-2">Hi, Good Morning</p>
        <h2 className="text-[24px] font-semibold">
          {dashboardData?.admin?.name}
        </h2>
      </div>

      <div className="mt-8">
        <EarningsGrowth />
      </div>

      {/* spa */}
      <div>
        <h1 className="text-[24px] lg:text-[30px] font-semibold mt-4">
          Spa Overview
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-6">
          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaMoneyBillWave className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {spa?.total_earnings || 0}
              </h2>
              <p className="text-[16px]">Total Earnings</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaMoneyCheckAlt className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {spa?.today_earnings || 0}
              </h2>
              <p className="text-[16px]">Today Earnings</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaShoppingCart className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {spa?.today_total_orders || 0}
              </h2>
              <p className="text-[16px]">Today Total Orders</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaCheckCircle className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {spa?.today_completed_orders || 0}
              </h2>
              <p className="text-[16px]">Today Completed Orders</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaHourglassHalf className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {spa?.today_pending_orders || 0}
              </h2>
              <p className="text-[16px]">Today Pending Orders</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaTimesCircle className="bg-red-700 text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {spa?.today_cancelled_orders || 0}
              </h2>
              <p className="text-[16px]">Today Cancelled Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* physio */}
      <div>
        <h1 className="text-[24px] lg:text-[30px] font-semibold mt-4">
          Physio Overview
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-6">
          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaMoneyBillWave className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {physio?.total_earnings || 0}
              </h2>
              <p className="text-[16px]">Total Earnings</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaMoneyCheckAlt className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {physio?.today_earnings || 0}
              </h2>
              <p className="text-[16px]">Today Earnings</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaShoppingCart className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {physio?.today_total_orders || 0}
              </h2>
              <p className="text-[16px]">Today Total Orders</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaCheckCircle className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {physio?.today_completed_orders || 0}
              </h2>
              <p className="text-[16px]">Today Completed Orders</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaHourglassHalf className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {physio?.today_pending_orders || 0}
              </h2>
              <p className="text-[16px]">Today Pending Orders</p>
            </div>
          </div>

          <div className="bg-white p-4 w-full">
            <div className="bg-[#e6f0f5] w-full rounded-md p-4 flex flex-col items-center">
              <FaTimesCircle className="bg-red-700 text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {physio?.today_cancelled_orders || 0}
              </h2>
              <p className="text-[16px]">Today Cancelled Orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
