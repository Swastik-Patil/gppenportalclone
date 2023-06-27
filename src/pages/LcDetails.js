import React, { useEffect, useState } from "react";
import { ref as dbref, update, child, get } from "firebase/database";
import { database } from "../utils/init-firebase";
import BeatLoader from "react-spinners/BeatLoader";
import styled from "styled-components";
import Header from "../components/Header";
import { Table, Tbody, Tr, Td, Button } from "@chakra-ui/react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../styles/lcdetails.css";
import { dateInWords, formatDate } from "../utils/helper";
import edit from "../res/edit.svg";
import { useAuth } from "../contexts/AuthContext";
import $ from "jquery";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

function LcDetails() {
  const { currentUser } = useAuth();

  function checkAuthorization() {
    const emails = ["gppoffice@gmail.com", "studentsection@gmail.com"];
    if (emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/profile");
    }
  }

  function checkIsGenerated() {
    const db = dbref(database);
    get(child(db, `/history/lcApproved/${input}`)).then((snap) => {
      if (snap.exists()) {
        setIsAlreadyGenerated(true);
      } else {
        setIsAlreadyGenerated(false);
      }
    });
  }

  useEffect(() => {
    checkAuthorization();
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const [loading, setLoading] = useState(true);
  const [isAlreadyGenerated, setIsAlreadyGenerated] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const [orgData, setOrgData] = useState(null);
  const [input, setInput] = useState("");
  const [generalRegNo, setGeneralRegNo] = useState("");
  const [enroll, setEnroll] = useState("");
  const [fullName, setFullName] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [religion, setReligion] = useState("");
  const [caste, setCaste] = useState("");
  const [subCaste, setSubCaste] = useState("");
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
  const [progress, setProgress] = useState("");
  const [data, setData] = useState(false);

  function formatFullName(fullname) {
    let str = fullname.replace(/\s\s+/g, " ");
    // let l = String(str).split(" ");
    // let fullNameFormatted = l[0] + " " + l[1] + " " + l[2];
    return str;
  }

  function dataSetter(data) {
    let dobinWords = dateInWords(formatDate(data.dateOfBirth));
    let dobinNum = formatDate(data.dateOfBirth);
    let doa = String(data.dateOfAdmission);
    setGeneralRegNo(data.generalRegNo);
    setEnroll(data.enroll);
    setAadharNo(data.aadharNo);
    setFullName(formatFullName(data.fullName));
    setNationality(data.nationality);
    setReligion(data.religion);
    setCaste(data.caste);
    setSubCaste(data.subCaste);
    setPlaceOfBirth(data.placeOfBirth);
    setDateOfBirth(dobinNum);
    setDateOfBirthInWords(dobinWords);
    setLastInstituteAttended(data.lastInstituteAttended);
    setDateOfAdmission(doa.replaceAll(".", "/"));
    setCourseYear((data.year ? data.year : "TY") + " " + data.course);
    setSince(doa.slice(6, 10) + "-" + (Number(doa.slice(8, 10)) + 1));

    // New Setters for LC Details
    setConduct(data.conduct ? data.conduct : "");
    setDateOfLeaving(data.dateOfLeaving ? data.dateOfLeaving : "");
    setReason(data.reason ? data.reason : "");
    setRemark(data.remark ? data.remark : "");
    setProgress(data.progress ? data.progress : "");

    setData(true);
  }
  const handleInputChange = (event) => {
    setInput(event.target.value);
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
    setSubCaste(event.target.value);
  };
  const handlePlaceOfBirth = (event) => {
    setPlaceOfBirth(event.target.value);
  };
  const handleDateOfBirth = (event) => {
    setDateOfBirth(event.target.value);
    setDateOfBirthInWords(dateInWords(formatDate(event.target.value)));
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

  const handleProgress = (event) => {
    setProgress(event.target.value);
  };

  // function redirectToLCPreview() {
  //   let dobinNum = formatDate(dateOfBirth);
  //   let doainNum = formatDate(dateOfAdmission);
  //   window.localStorage.setItem("LC_Conduct", conduct);
  //   window.localStorage.setItem("LC_DateOfLeaving", dateOfLeaving);
  //   window.localStorage.setItem("LC_Reason", reason);
  //   window.localStorage.setItem("LC_Remark", remark);
  //   window.localStorage.setItem("LC_GeneralRegNo", generalRegNo);
  //   window.localStorage.setItem("LC_FullName", fullName);
  //   window.localStorage.setItem("LC_AadharNo", aadharNo);
  //   window.localStorage.setItem("LC_Religion", religion);
  //   window.localStorage.setItem("LC_Caste", caste);
  //   window.localStorage.setItem("LC_SubCaste", subCaste);
  //   window.localStorage.setItem("LC_PlaceOfBirth", placeOfBirth);
  //   window.localStorage.setItem("LC_DateOfBirth", dobinNum);
  //   window.localStorage.setItem("LC_DateOfBirthInWords", dateOfBirthInWords);
  //   window.localStorage.setItem(
  //     "LC_LastInstituteAttended",
  //     lastInstituteAttended
  //   );
  //   window.localStorage.setItem("LC_DateOfAdmission", doainNum);
  //   window.localStorage.setItem("LC_CourseYear", courseYear);
  //   window.localStorage.setItem("LC_Since", since);
  //   window.localStorage.setItem("LC_Nationality", nationality);
  //   window.location.href = "/lcPreview";
  // }

  function handleGenerate() {
    if (
      input === "" ||
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
            onClick: () => saveData(),
            // onClick: () => redirectToLCPreview(),
          },
          {
            label: "No",
            onClick: () => null,
          },
        ],
      });
    }
  }

  function search() {
    if (input.length === 0) {
      alert("Please enter the enrollment number");
      return;
    }
    let searchBar = document.getElementById("searchBar");
    window.localStorage.setItem("LC_Enroll", input);
    checkIsGenerated();
    const db = dbref(database);
    get(child(db, `/orgData/${input}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const std_data = snapshot.val();
          setOrgData(std_data);
          dataSetter(std_data);
        } else {
          alert("No data found");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    get(child(db, `/dateOfLeaving/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const std_data = snapshot.val();
          setDateOfLeaving(formatDate(std_data.dateOfLeaving));
          if (orgData) {
            searchBar.style.display = "none";
          }
        } else {
          alert("No data found");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function editDetails(e) {
    const Edit = e.target.parentElement.childNodes[0];
    Edit.readOnly = false;
    Edit.value = "";
    Edit.contentEditable = true;
    Edit.style.backgroundColor = "#c1f3c0";
  }

  function handleBack() {
    window.location.href = "/studentsectionportal";
  }

  // Function to save data to firebase
  const [LcNo, setLcNo] = useState(null);
  const [ip, setIP] = useState("");

  function saveData() {
    const db = database;
    let data = 0;
    let enroll = window.localStorage.getItem("LC_Enroll");
    get(child(dbref(db), `/info/LC`)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();

        update(dbref(db, "/filledLC/" + enroll), {
          lcNo: LcNo,
          generalRegNo: generalRegNo,
          fullName: fullName,
          aadharNo: aadharNo,
          nationality: nationality,
          religion: religion,
          caste: caste,
          subCaste: subCaste ? subCaste : "",
          placeOfBirth: placeOfBirth,
          dateOfBirth: dateOfBirth,
          dateOfBirthInWords: dateOfBirthInWords,
          lastInstituteAttended: lastInstituteAttended,
          dateOfAdmission: dateOfAdmission,
          courseYear: courseYear,
          since: since,
          conduct: conduct,
          dateOfLeaving: dateOfLeaving,
          reason: reason,
          remark: remark,
          progress: progress,
          enroll: enroll,
          IP: ip,
        }).then(() => {
          alert("Data Successfully Saved");
          setOrgData(null);
          let searchBar = document.getElementById("searchBar");
          searchBar.style.display = "block";
          searchBar.value = "";

          // setSubmittedStatus(true);
          // var Btns = document.getElementById("Actions");
          // Btns.style.visibility = "hidden";
          // window.print();
          // handleBack();
        });
      }
    });
  }

  const getIP = async () => {
    $.getJSON("https://api.ipify.org/?format=json", function (e) {
      // console.log(e.ip);
      setIP(e.ip);
    });
  };
  function getLcNo() {
    const db = database;
    let data = 0;

    //reducing pending and increasing accepted
    get(child(dbref(db), `/info/LC`)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        setLcNo(parseInt(data.accepted) + 1);
        setLoading(false);
      }
    });
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
            <SearchBar id="searchBar">
              <BarStyling
                key="random1"
                value={input}
                placeholder={"Enter Enrollment Number"}
                onChange={handleInputChange}
              />
              <Button
                color={"#ffffff"}
                bgColor={"#87ceeb"}
                onClick={search}
                _hover={""}
              >
                Search
              </Button>
            </SearchBar>
            {orgData && data ? (
              <>
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
                              readOnly={true}
                              onChange={handleGeneralRegNo}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
                            />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight={"bold"}>Enrollment Number :</Td>
                          <Td className="data">
                            <input
                              type="text"
                              className="input"
                              value={input}
                              readOnly={true}
                              onChange={handleInputChange}
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
                              readOnly={true}
                              onChange={handleAadhar}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                              readOnly={true}
                              onChange={handleFullName}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                              readOnly={true}
                              onChange={handleNationality}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                              readOnly={true}
                              onChange={handleReligion}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                              id="caste"
                              className="input"
                              value={caste}
                              readOnly={true}
                              onChange={handleCaste}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                              readOnly={true}
                              onChange={handleSubCast}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                              readOnly={true}
                              onChange={handlePlaceOfBirth}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
                            />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight={"bold"}>Date of Birth :</Td>
                          <Td className="data">
                            <input
                              type="text"
                              className="input"
                              value={dateOfBirth}
                              readOnly={true}
                              onChange={handleDateOfBirth}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit "
                              onClick={editDetails}
                            />
                            <span className="hint">
                              DD/MM/YYYY ex:05/04/2003
                            </span>
                          </Td>
                          <Td className="data">
                            <input
                              type="text"
                              className="input"
                              value={dateOfBirthInWords}
                              readOnly={true}
                              onChange={handleDateOfBirthInWords}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                              readOnly={true}
                              onChange={handleLastInstituteAttended}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
                            />
                          </Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight={"bold"}>Date of Addmission :</Td>
                          <Td className="data rel">
                            <input
                              type="text"
                              className="input"
                              value={dateOfAdmission}
                              readOnly={true}
                              onChange={handleDateOfAdmission}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
                            />
                            <span className="hint">
                              DD/MM/YYYY ex:05/04/2003
                            </span>
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
                        lg: "30px",
                        md: "50px auto",
                        base: "20px auto",
                      }}
                    >
                      <Tbody>
                        <Tr>
                          <Td fontWeight={"bold"}>Progress :</Td>
                          <Td>
                            <input
                              type="text"
                              id="progress"
                              value={progress}
                              placeholder={"Enter Progress Here"}
                              onChange={handleProgress}
                            />
                          </Td>
                        </Tr>
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
                          <Td className="data rel">
                            <input
                              type="text"
                              id="dateOfLeaving"
                              readOnly={true}
                              value={dateOfLeaving}
                              onChange={handleDateOfLeaving}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
                            />
                            <span className="hint">
                              DD/MM/YYYY ex:05/04/2003
                            </span>
                          </Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight={"bold"}>Course and Year :</Td>
                          <Td className="data">
                            <input
                              type="text"
                              className="input"
                              value={courseYear}
                              readOnly={true}
                              onChange={handleCourseYear}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                              readOnly={true}
                              onChange={handleSince}
                            />
                            <img
                              src={edit}
                              alt=""
                              id="editable"
                              className="edit"
                              onClick={editDetails}
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
                  {isAlreadyGenerated ? (
                    <Alert status="warning">
                      <AlertIcon />
                      Leaving Certificate is already generated for this student
                      !
                    </Alert>
                  ) : (
                    ""
                  )}

                  <Button
                    colorScheme={"green"}
                    float="right"
                    margin={"10px"}
                    onClick={handleGenerate}
                  >
                    Save
                  </Button>
                  <Button
                    colorScheme={"red"}
                    float="right"
                    margin={"10px"}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                </ActionPanelHolder>
              </>
            ) : null}
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
  position: relative;
  color: black;
  margin-top: 90px;
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

  align-items: center;
  overflow: hidden;
  justify-content: center;
  padding: 10px 10px;
  height: auto;
  width: 100%;
  @media (max-width: 650px) {
    flex-direction: column;
    justify-content: initial;
    height: 600px;
    padding: 0px 0px;
    overflow: scroll;
  }
`;
const SearchBar = styled.div`
  position: absolute;
  top: 4.2rem;
  right: 50%;
  left: 50%;
  width: max-content;
  transform: translate(-50%, 0%);

  @media (max-width: 650px) {
    top: 0px;
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
  display: flex;
  height: 55px;
  justify-content: end;
  width: 95%;
  border-top: 4px solid #147af2;
`;

export default LcDetails;
