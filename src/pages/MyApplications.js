import React, { useEffect, useState } from "react";
import { ref as dbref, child, get } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../utils/init-firebase";
import BeatLoader from "react-spinners/BeatLoader";
import styled from "styled-components";
import Header from "../components/Header";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
} from "@chakra-ui/react";

function MyApplications() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const userData = [];
  const [myData, setMyData] = useState([]);
  const [pendingData, setPendingData] = useState(null);
  let keyIndex = 0;
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const [remarkMessage, setRemarkMessage] = useState(null);

  function readUserCurrentData() {
    const db = dbref(database);
    const IDRef = currentUser.uid;
    get(child(db, `/users/${IDRef}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.isPending) setPendingData(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function readUserPastData() {
    const db = dbref(database);
    const IDRef = currentUser.uid;
    get(child(db, `/history/rejected/${IDRef}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          Object.keys(data).forEach((key) => {
            userData.push(data[key]);
          });
          setMyData(userData);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  function showRemark(remark) {
    setRemarkMessage(remark);
    setIsOpen(true);
  }

  useEffect(() => {
    readUserCurrentData();
    readUserPastData();
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
            {myData.length === 0 && !pendingData ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "650px",
                  fontWeight: "bold",
                  overflow: "hidden",
                }}
              >
                <h2>No Previous Applications</h2>
              </div>
            ) : (
              <Table
                colorScheme="facebook"
                variant="simple"
                size="md"
                maxW={{ base: "400px", lg: "1300px" }}
                borderRadius={{ lg: "20px" }}
                background="white"
                margin={{ lg: "50px auto", md: "50px auto", base: "20px auto" }}
              >
                <TableCaption>Previous Applications</TableCaption>
                <Thead textAlign="center">
                  <Tr className={"center"}>
                    <Th
                      fontSize={{ lg: "lg", md: "lg", base: "12px" }}
                      color={"black"}
                      fontFamily={"calibri"}
                    >
                      Sr. No.
                    </Th>
                    <Th
                      fontSize={{ lg: "lg", md: "lg", base: "12px" }}
                      color={"black"}
                      fontFamily={"calibri"}
                    >
                      Applied Date
                    </Th>
                    <Th
                      fontSize={{ lg: "lg", md: "lg", base: "12px" }}
                      color={"black"}
                      fontFamily={"calibri"}
                    >
                      Status
                    </Th>
                    <Th
                      fontSize={{ lg: "lg", md: "lg", base: "12px" }}
                      color={"black"}
                      fontFamily={"calibri"}
                    >
                      Action Date
                    </Th>
                    <Th
                      fontSize={{ lg: "lg", md: "lg", base: "12px" }}
                      color={"black"}
                      fontFamily={"calibri"}
                    >
                      Remark
                    </Th>
                  </Tr>
                </Thead>
                <Tbody textAlign="center">
                  {pendingData ? (
                    <Tr key={keyIndex} className={"center"}>
                      <Td>{++keyIndex}</Td>
                      <Td>
                        {new Date(pendingData.appliedDate).getDate() +
                          "/" +
                          parseInt(
                            new Date(pendingData.appliedDate).getMonth() + 1
                          ) +
                          "/" +
                          new Date(pendingData.appliedDate).getFullYear()}
                      </Td>
                      <Td style={{ color: "gold", fontWeight: "bold" }}>
                        Pending
                      </Td>
                      <Td>{"Under review"}</Td>
                      <Td>
                        <Button
                          disabled={true}
                          bgColor="#0AA1DD"
                          variant="solid"
                        >
                          View
                        </Button>
                      </Td>
                    </Tr>
                  ) : null}

                  {myData.map((ele) => {
                    return (
                      <Tr key={keyIndex} className="center">
                        <Td>{++keyIndex}</Td>
                        <Td>
                          {new Date(ele.appliedDate).getDate() +
                            "/" +
                            parseInt(new Date(ele.appliedDate).getMonth() + 1) +
                            "/" +
                            new Date(ele.appliedDate).getFullYear()}
                        </Td>
                        <Td style={{ color: "red", fontWeight: "bold" }}>
                          Rejected
                        </Td>
                        <Td>{ele.actionDate}</Td>
                        <Td>
                          <Button
                            bgColor="#0AA1DD"
                            color="white"
                            variant="solid"
                            onClick={() => {
                              showRemark(ele.remark);
                            }}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Remark for Application
                  </AlertDialogHeader>

                  <AlertDialogBody>{remarkMessage}</AlertDialogBody>

                  <AlertDialogFooter>
                    <Button colorScheme="red" onClick={onClose} ml={3}>
                      Okay
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </Content>
        </Contain>
      )}
    </div>
  );
}
const Contain = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  background-color: #e8f9fd;
  @media (max-width: 650px) {
    position: absolute;
    height: 100%;
    width: auto;
  }
`;
const Content = styled.div`
  color: black;
  margin-top: 80px;
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }

  background-color: white;
  height: 550px;
  width: 90%;
  boder: 1px solid gray;
  border-radius: 12px;
  box-shadow: 2px 3px 3px black;
  @media (max-width: 650px) {
    flex-direction: column;
    height: 560px;
    font-size: 12px;
    margin-top: 5px;
  }
`;

export default MyApplications;
