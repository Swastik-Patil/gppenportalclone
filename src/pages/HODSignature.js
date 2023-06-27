import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Signature from "../components/Signature";
import { database } from "../utils/init-firebase";
import { ref as dbref, child, get, setPriority } from "firebase/database";
import BeatLoader from "react-spinners/BeatLoader";
import { useAuth } from "../contexts/AuthContext";

function HODSignature() {
  const [CM, setCM] = useState(null);
  const [CE, setCE] = useState(null);
  const [CH, setCH] = useState(null);
  const [ME, setME] = useState(null);
  const [IC, setIC] = useState(null);
  const [PR, setPR] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  function checkAuthorization() {
    const emails = ["admin@gmail.com"];
    if (emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/profile");
    }
  }

  function getData() {
    const db = dbref(database);

    get(child(db, `/signatures/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          setCM(data.CM);
          setIC(data.IC);
          setCE(data.CE);
          setCH(data.CH);
          setME(data.ME);
          setPR(data.PR);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    checkAuthorization();
    getData();
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
        paddingTop: "60px",
      }}
    >
      {loading ? (
        <>
          <BeatLoader color="#1A2B40" size={18} margin={2} loading={loading} />
        </>
      ) : (
        <Container>
          <Header />
          <Contain>
            <div class="container">
              <div class="row">
                <div class="col">
                  <Signature path_id={"CM"} principalSign={PR.sign} data={CM} />
                </div>
                <div class="col">
                  <Signature path_id={"CE"} principalSign={PR.sign} data={CE} />
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <Signature path_id={"CH"} principalSign={PR.sign} data={CH} />
                </div>
                <div class="col">
                  <Signature path_id={"IC"} principalSign={PR.sign} data={IC} />
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <Signature path_id={"ME"} principalSign={PR.sign} data={ME} />
                </div>
                <div class="col">
                  <Signature path_id={"PR"} principalSign={PR.sign} data={PR} />
                </div>
              </div>
            </div>
          </Contain>
        </Container>
      )}
    </div>
  );
}

export default HODSignature;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: whitesmoke;
`;

const Contain = styled.div`
  padding-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  gap: 20px;
  background: white;
`;
