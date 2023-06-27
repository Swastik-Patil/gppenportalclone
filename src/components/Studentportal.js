import React, { useState, useEffect } from "react";
import styled from "styled-components";
import newform from "../res/newfomlogo.png";
import myapplication from "../res/myApplication.png";
import pointer from "../res/pointer.png";
import Footer from "./Footer";
import BeatLoader from "react-spinners/BeatLoader";
import Header from "./Header";
import certificate from "../res/certificate.png";
import { ref as dbref, child, get } from "firebase/database";
import { database } from "../utils/init-firebase";
import { useAuth } from "../contexts/AuthContext";

function Studentportal() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuth();

  function readUserPastData() {
    const db = dbref(database);
    get(child(db, `/history/approved/${currentUser.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          setUserData(data);
          setLoading(false);
          checkIsApproved(data);
        } else {
          checkIsApproved(null);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function monthDiff(appliedDate) {
    var months;
    let d1 = new Date(appliedDate);
    let d2 = new Date();
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  function checkIsApproved(data) {
    if (data) {
      let diff = monthDiff(data.appliedDate);
      // console.log(diff);
      if (diff < 3) {
        window.sessionStorage.setItem("eligibleToApply", "false");
      } else {
        window.sessionStorage.setItem("eligibleToApply", "true");
      }
    } else {
      window.sessionStorage.setItem("eligibleToApply", "true");
    }
  }

  useEffect(() => {
    readUserPastData();
    setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => {};
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
        <Contain>
          <Header />
          <Content>
            <a href="/bonafideApplication">
              <Wrap>
                <img src={newform} alt="newForm_Icon" />
                <p>New Application</p>
              </Wrap>
            </a>
            <a href="/trackApplication">
              <Wrap>
                <img src={pointer} alt="track_Icon" />
                <p>Track Application</p>
              </Wrap>
            </a>
            <a href="/myApplications">
              <Wrap>
                <img src={myapplication} alt="application_Icon" />
                <p>My Applications</p>
              </Wrap>
            </a>
            {userData ? (
              <a href="/bonafidepreview">
                <Wrap>
                  <img src={certificate} alt="certificate_Icon" />
                  <p>Collect Certificate</p>
                </Wrap>
              </a>
            ) : (
              ""
            )}
          </Content>
          <Footer />
        </Contain>
      )}
    </div>
  );
}

export default Studentportal;

const Contain = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;

  background: #e8f9fd;
  @media (max-width: 650px) {
    position: absolute;
    width: auto;
  }
`;
const Content = styled.div`
  position: relative;
  display: flex;
  color: transparent;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 100vh;
  @media (max-width: 650px) {
    display: flex;
    flex-direction: column;
    a {
      width: auto;
      height: 120px;
    }
  }
`;
const Wrap = styled.div`
  display: flex;
  margin: 20px;
  padding: 10px;
  width: 13.3rem;
  height: 12.3rem;
  color: black;
  background-color: white;
  flex-direction: column;
  border: 1px solid white;
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 2px double #2155cd;
  border-radius: 39px;
  align-items: center;
  justify-content: center;
  transition: all 250ms ease-in-out;
  cursor: pointer;
  img {
    margin-top: 30px;
    height: 4.5rem;
    width: 4.5rem;
  }
  p {
    font-weight: bold;
    color: #0aa1dd;
    margin-top: 20px;
    font-size: 1rem;
  }

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px,
      rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px,
      rgba(0, 0, 0, 0.09) 0px 32px 16px;
  }
  @media (max-width: 650px) {
    display: flex;
    width: 18.3rem;
    height: 5.4rem;
    border: 1px solid rgba(78, 75, 75, 0.6);
    box-sizing: border-box;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 12px;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    transition: all 250ms ease-in-out;
    cursor: pointer;
    img {
      margin-top: 10px;
      height: 3.2rem;
      width: 3.2rem;
    }
    p {
      font-weight: bold;
      color: black;
      margin-top: 5px;
      font-size: 0.9rem;
    }
  }
`;
