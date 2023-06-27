import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DashBoardInfo from "../components/DashBoardInfo";
import DashBoardSideBar from "../components/DashBoardSideBar";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import BeatLoader from "react-spinners/BeatLoader";

function DashBoard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  function checkAuthorization() {
    const std_emails = ["principalGPP@gmail.com", "admin@gmail.com"];
    if (std_emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/UnAuthorize");
    }
  }

  useEffect(() => {
    checkAuthorization();
    setTimeout(() => {
      setLoading(false);
    }, 1500);
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
      {loading ? (
        <>
          <BeatLoader color="#1A2B40" size={18} margin={2} loading={loading} />
        </>
      ) : (
        <Container>
          <Header />
          <DashBoardSideBar />
          <DashBoardInfo />
        </Container>
      )}
    </div>
  );
}

export default DashBoard;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  @media (max-width: 650px) {
    flex-direction: column;
    align-items: center;
    justif-content: center;
  }
`;
