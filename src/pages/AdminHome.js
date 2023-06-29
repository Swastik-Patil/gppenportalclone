import React, { useEffect } from "react";
import { updateDashbaordDetails } from "../utils/Info-funtions";
import BeatLoader from "react-spinners/BeatLoader";

function AdminHome() {
  useEffect(() => {
    window.localStorage.setItem("dashboardHead", "Over All Statistics");
    updateDashbaordDetails("all");
    window.location.href = "/dashboard";
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      {" "}
      <BeatLoader color="#1A2B40" size={18} margin={2} loading={true} />
    </div>
  );
}

export default AdminHome;
