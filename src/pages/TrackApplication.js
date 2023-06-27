import React, { useState, useEffect } from "react";
import { ref as dbref, child, get, remove } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../utils/init-firebase";
import styled from "styled-components";
import BeatLoader from "react-spinners/BeatLoader";
import Header from "../components/Header";
import { Button } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { reducePending } from "../utils/Info-funtions";

export default function TrackApplication() {
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  let index = 2;

  function deleteUserData() {
    let ele = userData;
    onClose();
    if (ele) {
      const IDRef = ele.uid;
      const db = database;
      reducePending(userData.branch);
      remove(dbref(db, "/users/" + IDRef))
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          // console.log("unsuccessful, error " + error);
        });
    }
  }

  function readUserCurrentData() {
    const db = dbref(database);
    const IDRef = currentUser.uid;
    get(child(db, `/users/${IDRef}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
        } else {
          index = 1;
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  function changeIndex() {
    userData && userData.isRejected === true ? (index = 3) : (index = 2);
  }

  function redirectToDetails() {
    window.sessionStorage.setItem("selectedStudent", String(userData.uid));
    window.sessionStorage.setItem("path", "/users");
    window.location.href = "/Details";
  }

  useEffect(() => {
    readUserCurrentData();
    return () => {};
  }, []);

  return (
    <Parent>
      <Header />
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
          <BeatLoader color="#1A2B40" size={18} margin={2} loading={loading} />
        ) : (
          <Container onLoad={changeIndex()}>
            <Holder>
              {!userData ? (
                <h2>No Application Found Pending !</h2>
              ) : (
                <>
                  <ProgressBar>
                    <LI className="li active">
                      <TXT className="txt">
                        Application Submitted <br />(
                        {new Date(userData.appliedDate).getDate() +
                          "/" +
                          parseInt(
                            new Date(userData.appliedDate).getMonth() + 1
                          ) +
                          "/" +
                          new Date(userData.appliedDate).getFullYear()}
                        )
                      </TXT>
                    </LI>
                    <LI className="li active">
                      <TXT>Under Review</TXT>
                    </LI>
                    <LI className={index === 3 ? "li active" : ""}>
                      <TXT>
                        {index === 3
                          ? "Rejected on " + userData.actionDate
                          : "Status Pending"}
                      </TXT>
                    </LI>
                  </ProgressBar>
                  <Btncon>
                    <Buton onClick={redirectToDetails}>
                      Review Application
                    </Buton>
                    <Buton onClick={() => setIsOpen(true)}>
                      {userData.isRejected === true
                        ? "Show Remark"
                        : "Cancel Application"}
                    </Buton>
                  </Btncon>

                  <AlertDialog
                    isOpen={isOpen}
                    leastDestructiveRef={cancelRef}
                    onClose={onClose}
                  >
                    <AlertDialogOverlay>
                      <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                          {userData.isRejected === true
                            ? "Show Remark"
                            : "Cancel Application"}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                          {userData.isRejected === true
                            ? userData.remark
                            : "Are you sure? You can't undo this action afterwards."}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                          <Button ref={cancelRef} onClick={onClose}>
                            {userData.isRejected === true ? "Okay" : "No"}
                          </Button>

                          <Button
                            hidden={userData.isRejected}
                            colorScheme="red"
                            onClick={deleteUserData}
                            ml={3}
                          >
                            Yes
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialogOverlay>
                  </AlertDialog>
                </>
              )}
            </Holder>
          </Container>
        )}
      </div>
    </Parent>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: auto;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #e8f9fd;
  bottom: 0;
  right: 0;
  width: 100%;
`;
const Parent = styled.div``;

const Holder = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid grey;
  border-radius: 12px;
  justify-content: center;
  height: 350px;
  background-color: whitesmoke;
  z-index: 0;

  @media (max-width: 650px) {
    height: 520px;
  }
`;
const ProgressBar = styled.ul`
  display: flex;
  width: 100%;
  counter-reset: step;
  align-item: center;
  justify-content: center;
  @media (max-width: 650px) {
    transform: rotate(90deg);
  }
`;
const LI = styled.li`
  display: inline-block;
  width: 100%;
  position: relative;
  text-align: center;
  top: 30%;
  cursor: pointer;
  font-weight: bold;

  &:before {
    content: counter(step);
    counter-increment: step;
    width: 50px;
    height: 50px;
    line-height: 50px;
    box-shadow: 2px 2px 5px grey;
    border-radius: 100%;
    display: block;
    text-align: center;
    margin: 0 auto 10px auto;
    background-color: white;
  }
  &:after {
    content: "";
    font-weight: bold;
    position: absolute;
    width: 90%;
    height: 5px;
    top: 23px;
    left: -45%;
    z-index: -1;
    background: grey;
    box-shadow: 1px 1px 1px grey;
    border: 1px;
  }
  &:first-child:after {
    content: none;
  }
  &.active {
    color: black;
  }

  &.active:before {
    background-color: #79dae8;
  }
  &.active:after {
    background-color: #79dae8;
  }

  @media (max-width: 650px) {
    font-size: 14px;

    &:before {
      content: counter(step);
      counter-increment: step;
      width: 50px;
      height: 50px;
      line-height: 50px;
      box-shadow: 2px 2px 5px grey;
      border-radius: 100%;
      display: block;
      background-color: white;
      text-align: center;
      margin: 0 auto 10px auto;
      transform: rotate(270deg);
    }

    &:after {
      content: "";
      font-weight: bold;
      position: absolute;
      width: 90%;
      z-index: -1;
      height: 6px;
      top: 23px;
      left: -45%;
      background: grey;
      box-shadow: 1px 1px 1px grey;
      border: 1px;
    }
  }
`;
const TXT = styled.div`
  @media (max-width: 650px) {
    padding: 1.5rem;
    transform: rotate(270deg);
  }
`;
const Btncon = styled.div`
  margin-top: 50px;
  display: flex;
  width: 100%;
  z-index: 40;
  justify-content: center;
  @media (max-width: 650px) {
    position: absolute;
    margin-top: 450px;
  }
`;
const Buton = styled.button`
  color: #0aa1dd;
  font-size: 1em;
  display: block;
  margin-top: 2em;
  margin: 1em;
  width: 50%;
  height: 50px;
  padding: 0.25em 1em;
  border: 2px solid #0aa1dd;
  box-shadow: 1px 1px 2px grey;
  font-weight: bold;
  border-radius: 3px;
  transition: all 0.5s;
  :hover {
    color: whitesmoke;
    background: #0aa1dd;
    border: 2px solid #0aa1dd;
  }
  @media (max-width: 650px) {
    width: 40%;
    height: 50px;
    font-size: 14px;
    margin: 10px 5px;
  }
`;
