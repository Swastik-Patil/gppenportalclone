import React, { useEffect, useState } from "react";
import { ref as dbref, set } from "firebase/database";
import { database } from "../utils/init-firebase";
import styled from "styled-components";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import newLc from "../res/newLc.png";
import blankLc from "../res/lcBlank.png";
import previousLC from "../res/previous.png";
import dateOfLeaving from "../res/dateOfLeaving.png";
import checkLC from "../res/check.png";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

function StudentSection() {
  const { currentUser } = useAuth();
  const [isSubmitted, setSubmittedStatus] = useState(false);
  const onSumbitClose = () => {
    //set date in database
    let date = document.getElementById("DOL").value;
    date = new Date(date);
    if (date) {
      set(dbref(database, `/dateOfLeaving/`), {
        dateOfLeaving:
          date.getDate() +
          "/" +
          parseInt(date.getMonth() + 1) +
          "/" +
          date.getFullYear(),
      });
      setSubmittedStatus(false);
    } else {
      alert("Empty date not allowed");
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  function checkAuthorization() {
    const emails = ["studentsection@gmail.com", "gppoffice@gmail.com"];
    if (emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/profile");
    }
  }

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
      <Header />
      <Container>
        <Content>
          <a href="/lcDetails">
            <Wrap>
              <img src={newLc} alt="Certificate_Icon" />
              <p>Generate LC</p>
            </Wrap>
          </a>
          <a href="/newlcDetails">
            <Wrap>
              <img src={blankLc} alt="Certificate_Icon" />
              <p>Generate Blank LC</p>
            </Wrap>
          </a>
          <a href="/previousLc">
            <Wrap>
              <img src={previousLC} alt="Certificate_Icon" />
              <p>Previous LC's</p>
            </Wrap>
          </a>
          <a href="/filledLC">
            <Wrap>
              <img src={checkLC} alt="Certificate_Icon" />
              <p>Print Ready LC's</p>
            </Wrap>
          </a>
          <Wrap
            onClick={() => {
              setSubmittedStatus(true);
            }}
          >
            <img src={dateOfLeaving} alt="Calendar_Icon" />
            <p>Upload Leaving Date</p>
          </Wrap>
        </Content>

        <AlertDialog isOpen={isSubmitted} onClose={onSumbitClose}>
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Set Leaving Date
              </AlertDialogHeader>

              <AlertDialogBody>
                Select Date of Leaving to appear on LC :
                <input type="date" id="DOL" />
              </AlertDialogBody>

              <AlertDialogFooter>
                <div style={{ color: "transparent" }}>
                  <Button
                    color="white"
                    colorScheme="green"
                    onClick={onSumbitClose}
                    ml={3}
                  >
                    Okay
                  </Button>
                </div>
                <div style={{ color: "transparent" }}>
                  <Button
                    color="white"
                    colorScheme="red"
                    onClick={() => {
                      setSubmittedStatus(false);
                    }}
                    ml={3}
                  >
                    Close
                  </Button>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </div>
  );
}

const Container = styled.div`
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

export default StudentSection;
