import React, { useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import styled from "styled-components";
import { database } from "../utils/init-firebase";
import Header from "../components/Header";
import { Table, Tbody, Tr, Td, Button } from "@chakra-ui/react";
import { confirmAlert } from "react-confirm-alert";
import { useAuth } from "../contexts/AuthContext";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../styles/lcdetails.css";
import { ref as dbref, child, get, update } from "firebase/database";

function Details({ showActionPanel }) {
  const { currentUser } = useAuth();

  function checkAuthorization() {
    const emails = ["gppoffice@gmail.com", "studentsection@gmail.com"];
    if (emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/profile");
    }
  }

  function getDateOfLeaving() {
    const db = dbref(database);
    get(child(db, `/dateOfLeaving/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const std_data = snapshot.val();
          setDateOfLeaving(std_data.dateOfLeaving);
        } else {
          alert("No data found");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    checkAuthorization();
    getDateOfLeaving();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const [loading, setLoading] = useState(true);
  const [generalRegNo, setGeneralRegNo] = useState("");
  const [enroll, setEnroll] = useState("");
  const [fullName, setFullName] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [subCaste, setSubCast] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirthInWords, setDateOfBirthInWords] = useState("");
  const [lastInstituteAttended, setLastInstituteAttended] = useState("");
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [courseYear, setCourseYear] = useState("");
  const [conduct, setConduct] = useState("");
  const [dateOfLeaving, setDateOfLeaving] = useState("");
  const [since, setSince] = useState("");
  const [reason, setReason] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    const db = dbref(database);
    get(child(db, `/dateOfLeaving/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const std_data = snapshot.val();
          setDateOfLeaving(std_data.dateOfLeaving);
        } else {
          alert("No data found");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const handleEnroll = (event) => {
    setEnroll(event.target.value);
  };
  const handleGeneralRegNo = (event) => {
    setGeneralRegNo(event.target.value);
  };
  const handleFullName = (event) => {
    setFullName(event.target.value);
  };
  const handleAadhar = (event) => {
    setAadharNo(event.target.value);
  };
  const handleNationality = (event) => {
    setNationality(event.target.value);
  };
  const handleReligion = (event) => {
    setReligion(event.target.value);
  };
  const handleCaste = (event) => {
    setCaste(event.target.value);
  };
  const handleSubCast = (event) => {
    setSubCast(event.target.value);
  };
  const handlePlaceOfBirth = (event) => {
    setPlaceOfBirth(event.target.value);
  };
  const handleDateOfBirth = (event) => {
    // console.log(event.target.value);
    setDateOfBirth(event.target.value);
  };
  const handleDateOfBirthInWords = (event) => {
    setDateOfBirthInWords(event.target.value);
  };
  const handleLastInstituteAttended = (event) => {
    setLastInstituteAttended(event.target.value);
  };
  const handleDateOfAdmission = (event) => {
    setDateOfAdmission(event.target.value);
  };
  const handleCourseYear = (event) => {
    setCourseYear(event.target.value);
  };
  const handleConduct = (event) => {
    setConduct(event.target.value);
  };
  const handleDateOfLeaving = (event) => {
    setDateOfLeaving(event.target.value);
  };
  const handleSince = (event) => {
    setSince(event.target.value);
  };
  const handleReason = (event) => {
    setReason(event.target.value);
  };
  const handleRemark = (event) => {
    setRemark(event.target.value);
  };

  function redirectToLCPreview() {
    let date = new Date(dateOfBirth);
    let day = date.getDate();
    let mon = parseInt(date.getMonth() + 1);
    let year = date.getFullYear();
    if (String(day).length == 1) day = "0" + day;
    if (String(mon).length == 1) mon = "0" + mon;
    let finalDateOfBirth = day + "/" + mon + "/" + year;
    window.localStorage.setItem("LC_Conduct", conduct);
    window.localStorage.setItem("LC_DateOfLeaving", dateOfLeaving);
    window.localStorage.setItem("LC_Reason", reason);
    window.localStorage.setItem("LC_Remark", remark);
    window.localStorage.setItem("LC_GeneralRegNo", generalRegNo);
    window.localStorage.setItem("LC_Enroll", enroll);
    window.localStorage.setItem("LC_FullName", fullName);
    window.localStorage.setItem("LC_AadharNo", aadharNo);
    window.localStorage.setItem("LC_Religion", religion);
    window.localStorage.setItem("LC_Caste", caste);
    window.localStorage.setItem("LC_SubCaste", subCaste);
    window.localStorage.setItem("LC_PlaceOfBirth", placeOfBirth);
    window.localStorage.setItem("LC_DateOfBirth", finalDateOfBirth);
    window.localStorage.setItem("LC_DateOfBirthInWords", dateOfBirthInWords);
    window.localStorage.setItem(
      "LC_LastInstituteAttended",
      lastInstituteAttended
    );
    window.localStorage.setItem("LC_DateOfAdmission", dateOfAdmission);
    window.localStorage.setItem("LC_CourseYear", courseYear);
    window.localStorage.setItem("LC_Since", since);

    window.location.href = "/LcPreview";
  }

  function handleGenerate() {
    if (
      conduct === "" ||
      dateOfLeaving === "" ||
      reason === "" ||
      remark === ""
    ) {
      alert("Please fill all the fields");
      return;
    } else {
      confirmAlert({
        title: "Confirm to submit",
        message: "Are you sure to do this.",
        buttons: [
          {
            label: "Yes",
            onClick: () => redirectToLCPreview(),
          },
          {
            label: "No",
            onClick: () => null,
          },
        ],
      });
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
      {loading ? (
        <>
          <BeatLoader color="#1A2B40" size={18} margin={2} loading={loading} />
        </>
      ) : (
        <Contain>
          <Header />

          <Content>
            <Title>Student Details</Title>
            <Holder>
              <TableHodler className="Table">
                <Table
                  variant="simple"
                  colorScheme="gray"
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
                  <Tbody>
                    <Tr>
                      <Td fontWeight={"bold"}>GR Number :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={generalRegNo}
                          onChange={handleGeneralRegNo}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Enrollment Number :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={enroll}
                          onChange={handleEnroll}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>UID Number :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={aadharNo}
                          min={12}
                          max={12}
                          onChange={handleAadhar}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Full Name :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={fullName}
                          onChange={handleFullName}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Nationality :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={nationality}
                          onChange={handleNationality}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Religion :</Td>

                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={religion}
                          onChange={handleReligion}
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableHodler>
              <TableHodler>
                <Table
                  variant="simple"
                  colorScheme="gray"
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
                  <Tbody>
                    <Tr>
                      <Td fontWeight={"bold"}>Caste :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={caste}
                          onChange={handleCaste}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>SubCaste :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={subCaste}
                          onChange={handleSubCast}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Place of Birth :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={placeOfBirth}
                          onChange={handlePlaceOfBirth}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Date of Birth :</Td>
                      <Td className="data ">
                        <input
                          type="date"
                          className="input"
                          value={dateOfBirth}
                          onChange={handleDateOfBirth}
                          min={"01-01-1900"}
                          max={new Date().toISOString().split("T")[0]}
                        />
                        <input
                          type="text"
                          className="input"
                          value={dateOfBirthInWords}
                          onChange={handleDateOfBirthInWords}
                          placeholder="Date of Birth in Words"
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Last Institute Attended :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={lastInstituteAttended}
                          onChange={handleLastInstituteAttended}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Date of Addmission :</Td>
                      <Td className="data rel">
                        <input
                          type="text"
                          className="input hintme"
                          value={dateOfAdmission}
                          onChange={handleDateOfAdmission}
                        />
                        <span className="hint">DD/MM/YYYY ex:05/04/2003</span>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Progress :</Td>
                      <Td id="editable">Good</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableHodler>
              <TableHodler>
                <Table
                  variant="simple"
                  colorScheme="gray"
                  size="md"
                  maxW={{ base: "400px", lg: "1300px" }}
                  borderRadius={{ lg: "20px" }}
                  background="white"
                  margin={{
                    lg: "30px",
                    md: "50px auto",
                    base: "20px auto",
                  }}
                >
                  <Tbody>
                    <Tr>
                      <Td fontWeight={"bold"}>Conduct :</Td>
                      <Td>
                        <input
                          type="text"
                          id="conduct"
                          placeholder="Enter Conduct Here"
                          value={conduct}
                          onChange={handleConduct}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Date of Leaving :</Td>
                      <Td>
                        <input
                          type="text"
                          id="dateOfLeaving"
                          value={dateOfLeaving}
                          onChange={handleDateOfLeaving}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Course and Year :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={courseYear}
                          onChange={handleCourseYear}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>since :</Td>
                      <Td className="data">
                        <input
                          type="text"
                          className="input"
                          value={since}
                          onChange={handleSince}
                          placeholder="Since"
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Reason for leaving :</Td>
                      <Td>
                        <textarea
                          type="text"
                          id="reason"
                          placeholder="Enter Reason Here"
                          value={reason}
                          onChange={handleReason}
                        />
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight={"bold"}>Remark :</Td>
                      <Td>
                        <textarea
                          type="text"
                          id="remark"
                          placeholder="Enter Remark Here"
                          value={remark}
                          onChange={handleRemark}
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableHodler>
            </Holder>

            <ActionPanelHolder>
              {!showActionPanel ? (
                <>
                  <a href="/studentSectionPortal">
                    <Button colorScheme={"red"} float="right" margin={"10px"}>
                      Back
                    </Button>
                  </a>
                  <Button
                    colorScheme={"green"}
                    float="right"
                    margin={"10px"}
                    onClick={handleGenerate}
                  >
                    Generate
                  </Button>
                </>
              ) : null}
            </ActionPanelHolder>
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
    width: 100%;
  }
`;
const Content = styled.div`
  color: black;
  margin-top: 80px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  background-color: white;
  height: 700px;
  width: 100%;
  boder: 1px solid white;
  border-radius: 12px;
  box-shadow: 2px 3px 3px black;
  @media (max-width: 650px) {
    flex-direction: column;
    height: 600px;
    gap: 0px;
    font-size: 12px;
  }
`;
const Holder = styled.div`
  display: flex;
  overflow: scroll;
  ::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: just make scrollbar invisible */
  }
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  height: auto;
  width: 100%;
  @media (max-width: 650px) {
    flex-direction: column;
    justify-content: initial;
    height: 600px;
    padding: 0px 0px;
  }
`;
const BarStyling = styled.input`
width: 20rem,
height: 2.5rem,
background: #F2F1F9,
border: none,
padding: 0.5rem,
`;
const Title = styled.div`
  width: 95%;
  height: 40px;
  margin-top: 22px;
  border-bottom: 4px solid #147af2;
  font-size: 30px;
  padding-bottom: 12px;
  display: flex;
  align-items: center;
`;
const TableHodler = styled.div`
  margin: 5px 12px;
  @media (max-width: 650px) {
    margin: 0px 0px;
    width: 300px;
  }
`;

const ActionPanelHolder = styled.div`
  height: 55px;
  width: 95%;
  border-top: 4px solid #147af2;
`;

export default Details;
