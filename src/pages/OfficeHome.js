import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

function OfficeHome() {
  const { currentUser } = useAuth();

  function redirectToDetails() {
    let enroll = document.getElementById("enroll").value;
    if (String(enroll).length == 0) alert("Empty Data Not Allowed !");
    else {
      window.localStorage.setItem("LC_Enroll", enroll);
      window.location.href = "/lcDetails";
    }
  }

  function checkAuthorization() {
    const emails = ["gppoffice@gmail.com", "studentsection@gmail.com"];
    if (emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/profile");
    }
  }

  useEffect(() => {
    checkAuthorization();
    return () => {};
  }, []);

  return (
    <Container>
      <Header />
      <Content>
        <Input placeholder="ENTER ENROLL NO" id="enroll" />
        <Submit onClick={redirectToDetails}>Submit</Submit>
      </Content>
    </Container>
  );
}

export default OfficeHome;
const Container = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: #8e2de2;
  background: -webkit-linear-gradient(to right, #8e2de2, #4a00e0);
  background: linear-gradient(to right, #8e2de2, #4a00e0);
`;
const Content = styled.div`
  display: flex;
  gap: 30px;
  height: 10vh;
  align-text: center;
  align-items: center;
  flex-direction: column;
`;

const Input = styled.input`
  width: 900px;
  border-radius: 10px;
  font-size: 30px;
  text-align: center;
  border: 3px solid #ffff;
  @media (max-width: 650px) {
    width: 360px;
  }
`;
const Submit = styled.button`
  font-size: 30px;
  border: 3px solid white;
  width: 150px;
  border-radius: 10px;
  transition: all 250ms ease-in-out;
  :hover {
    background: #654ea3;
  }
`;
