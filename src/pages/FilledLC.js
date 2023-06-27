import React, { useEffect, useState } from "react";
import { ref as dbref, child, get } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../utils/init-firebase";
import BeatLoader from "react-spinners/BeatLoader";
import styled from "styled-components";
import Header from "../components/Header";
import BG from "../res/BonafideFormBG.jpg";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Button,
} from "@chakra-ui/react";

function FilledLC() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allData, setallData] = useState([]);
  let keyIndex = 0;
  const [input, setInput] = useState("");

  function checkAuthorization() {
    const emails = ["studentsection@gmail.com", "gppoffice@gmail.com"];
    if (emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/profile");
    }
  }

  function readUserPastData() {
    const db = dbref(database);

    get(child(db, `/filledLC/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          let values = Object.values(data);
          setallData(values);
          // console.log(allData);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }

  function redirectToLCPreview(ele) {
    window.localStorage.setItem("LC_Enroll", ele.enroll);
    window.localStorage.setItem("LC_Conduct", ele.conduct);
    window.localStorage.setItem("LC_DateOfLeaving", ele.dateOfLeaving);
    window.localStorage.setItem("LC_Reason", ele.reason);
    window.localStorage.setItem("LC_Progress", ele.progress);
    window.localStorage.setItem("LC_Remark", ele.remark);
    window.localStorage.setItem("LC_GeneralRegNo", ele.generalRegNo);
    window.localStorage.setItem("LC_FullName", formatFullName(ele.fullName));
    window.localStorage.setItem("LC_AadharNo", ele.aadharNo);
    window.localStorage.setItem("LC_Religion", ele.religion);
    window.localStorage.setItem("LC_Caste", ele.caste);
    window.localStorage.setItem("LC_SubCaste", ele.subCaste);
    window.localStorage.setItem("LC_PlaceOfBirth", ele.placeOfBirth);
    window.localStorage.setItem("LC_DateOfBirth", ele.dateOfBirth);
    window.localStorage.setItem(
      "LC_DateOfBirthInWords",
      ele.dateOfBirthInWords
    );
    window.localStorage.setItem(
      "LC_LastInstituteAttended",
      ele.lastInstituteAttended
    );
    window.localStorage.setItem("LC_DateOfAdmission", ele.dateOfAdmission);
    window.localStorage.setItem("LC_CourseYear", ele.courseYear);
    window.localStorage.setItem("LC_Since", ele.since);
    window.localStorage.setItem("LC_Nationality", ele.nationality);
    window.location.href = "/lcPreview";
  }

  function formatFullName(fullname) {
    let str = fullname.replace(/\s\s+/g, " ");
    // let l = String(str).split(" ");
    // let fullNameFormatted = l[0] + " " + l[1] + " " + l[2];
    return str;
  }

  useEffect(() => {
    checkAuthorization();
    readUserPastData();
    return () => {};
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
    match();
  };

  const match = () => {
    var table, tr, td, i, txtValue;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.indexOf(input) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  };

  function showApplicationDetails(enroll) {
    window.sessionStorage.setItem("selectedStudent", String(enroll));
    window.sessionStorage.setItem("path", "/history/lcApproved");
    window.location.href = "/PreviousLcPreview";
  }

  const BarStyling = {
    width: "20rem",
    background: "#F2F1F9",
    border: "none",
    padding: "0.5rem",
  };
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
            {allData.length === 0 ? (
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
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBlock: "1rem",
                  }}
                >
                  <input
                    style={BarStyling}
                    key="random1"
                    value={input}
                    placeholder={"Search"}
                    onChange={handleInputChange}
                  />
                  <button
                    style={{
                      background: "skyblue",
                      width: "5rem",
                      height: "2.5em",
                    }}
                    onClick={match}
                  >
                    Search
                  </button>
                </div>
                <Table
                  id="myTable"
                  colorScheme="facebook"
                  variant="simple"
                  size="md"
                  maxW={{ base: "400px", lg: "1300px" }}
                  borderRadius={{ lg: "20px" }}
                  background="white"
                  margin={{
                    lg: "50px auto",
                    md: "50px auto",
                    base: "20px auto",
                  }}
                >
                  <TableCaption>Previous Leaving Certificates</TableCaption>
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
                        Enrollment No.
                      </Th>
                      <Th
                        fontSize={{ lg: "lg", md: "lg", base: "12px" }}
                        color={"black"}
                        fontFamily={"calibri"}
                      >
                        Full Name
                      </Th>
                      <Th
                        fontSize={{ lg: "lg", md: "lg", base: "12px" }}
                        color={"black"}
                        fontFamily={"calibri"}
                      >
                        Details
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody textAlign="center">
                    {allData.map((ele) => {
                      return (
                        <Tr key={keyIndex} className={"center"}>
                          <Td>{++keyIndex}</Td>
                          <Td>{ele.enroll}</Td>
                          <Td>{formatFullName(ele.fullName)}</Td>
                          <Td>
                            <Button
                              colorScheme="blue"
                              variant="solid"
                              onClick={() => {
                                redirectToLCPreview(ele);
                              }}
                            >
                              Print
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </>
            )}
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
  boder: 1px solid white;
  border-radius: 12px;
  box-shadow: 2px 3px 3px black;
  @media (max-width: 650px) {
    flex-direction: column;
    height: 560px;
    font-size: 12px;
    margin-top: 5px;
  }
`;

export default FilledLC;
