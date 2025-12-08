import React from "react";
import { useParams } from "react-router-dom";
import { useAssignFoodOrders } from "../../../../api/userApi";

function DriversDetails() {
  const { driverId } = useParams();

  const { assignOrder, isLoading, isError, error, refetch } =
    useAssignFoodOrders({ userID: driverId }, { enabled: true });

  console.log("assignOrder", assignOrder);

  return <div>DriversDetails: {driverId}</div>;
}

export default DriversDetails;
