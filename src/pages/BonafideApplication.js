import React, { useState, useEffect, useRef } from "react";
import { storage, database } from "../utils/init-firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { set, ref as dbref, get, child } from "firebase/database";
import "font-awesome/css/font-awesome.min.css";
import "../style.css";
import { useAuth } from "../contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import Header from "../components/Header";
import { updatePending } from "../utils/Info-funtions";

export default function BonafideApplication() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const { currentUser } = useAuth();
  const [isSubmitted, setSubmittedStatus] = useState(false);
  const onSumbitClose = () => {
    updatePending(branch);
    setSubmittedStatus(false);
  };
  const BC = "BIRTH_CERTIFICATE";
  const ID = "IDENTITY_CARD";
  const [email, setEmail] = useState("");
  const [EnrollNo, setEnrollNo] = useState("");
  const [RollNo, setRollNo] = useState("");
  const [phone, setPhone] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [cacyear, setCacYear] = useState("");
  const [gender, setGender] = useState("");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };
  const handleRollNoChange = (event) => {
    setRollNo(event.target.value);
  };
  const handleYearChange = (event) => {
    setYear(event.target.value);
  };
  const handleCACYearChange = (event) => {
    setCacYear(event.target.value);
  };
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      for (let i = 0; i <= e.target.files.length - 1; i++) {
        let fsize = e.target.files.item(i).size;
        let file = Math.round(fsize / 1024);
        // The size of the file.
        if (file >= 250) {
          alert("File too Big, please select a file less than 250kb");
        } else {
          setFile(e.target.files[0]);
        }
      }
    }
  };

  const handleFileChange2 = (e) => {
    if (e.target.files[0]) {
      for (let i = 0; i <= e.target.files.length - 1; i++) {
        let fsize = e.target.files.item(i).size;
        let file = Math.round(fsize / 1024);
        // The size of the file.
        if (file >= 250) {
          alert("File too Big, please select a file less than 250kb");
        } else {
          setFile2(e.target.files[0]);
        }
      }
    }
  };

  function validatePhone() {
    var phone = document.getElementById("phone").value;
    var re = /^[0-9][0-9]{9}$/;

    if (re.test(phone)) {
      document.getElementById("phone").style.border = "1px solid grey";
      return true;
    } else {
      document.getElementById("phone").style.border = "2px solid red";
      return false;
    }
  }

  function writeUserData(student) {
    const location = currentUser.uid;

    const db = database;
    set(dbref(db, "/users/" + location), {
      uid: location,
      enroll: student.enroll,
      year: student.year,
      rollNo: student.roll_no,
      branch: student.branch,
      gender: student.gender,
      phone_no: student.phone_no,
      email: student.email,
      birthCerti: student.downloadURL,
      idCard: student.downloadURLID,
      cacyear: student.cacyear,
      reason: student.reason,
      appliedDate: new Date(Date.now()).toString(),
      //internal
      isPending: true,
      isApproved: false,
      isRejected: false,
      //logs
      IPAddress: null,
    });
    setSubmittedStatus(true);
  }

  const handleSubmit = (downloadURLBC, downloadURLID) => {
    // e.preventDefault();
    document.getElementById("UploadButton").innerHTML = `Finishing Up`;
    const student = {
      enroll: EnrollNo,
      year: document.getElementById("year").value,
      roll_no: document.getElementById("RollNo").value,
      branch: branch,
      gender: document.getElementById("gender").value,
      phone_no: document.getElementById("phone").value,
      email: email,
      cacyear: cacyear,
      reason: reason,
      downloadURL: downloadURLBC,
      downloadURLID: downloadURLID,
    };
    writeUserData(student);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (
      !phone ||
      !RollNo ||
      document.getElementById("gender").value === "Select" ||
      document.getElementById("cacyear").value === "Select" ||
      document.getElementById("year").value === "Select" ||
      !validatePhone() ||
      !file ||
      !file2
    ) {
      setIsOpen(true);
    } else {
      document.getElementById("UploadButton").innerHTML = "Uploading...";
      document.getElementById("UploadButton").disabled = true;
      let typeRef = BC;
      const pathRef = currentUser.uid;
      let storageRef = ref(storage, `${pathRef}/${typeRef}/${file.name}`);
      let uploadTask = uploadBytesResumable(storageRef, file);
      console.log(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          progress.toPrecision(2);
          document.getElementById(
            "UploadButton"
          ).innerHTML = `Uploading... ${parseInt(progress)}%`;
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          alert("Some error occured ! Please try again");
        }
      );
      typeRef = ID;
      storageRef = ref(storage, `${pathRef}/${typeRef}/${file2.name}`);
      // console.log(typeRef);
      let uploadTask2 = uploadBytesResumable(storageRef, file2);
      // console.log("Uploaded");
      let URL;
      uploadTask2.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload is " + progress + "% done");
          progress.toPrecision(2);
          document.getElementById(
            "UploadButton"
          ).innerHTML = `Uploading... ${parseInt(progress)}%`;
          switch (snapshot.state) {
            case "paused":
              // console.log("Upload is paused");
              break;
            case "running":
              // console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          alert("Some error occured ! Please try again");
        },
        () => {
          document.getElementById("UploadButton").innerHTML = `Submitting...`;
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURLBC) => {
            URL = downloadURLBC;
            getDownloadURL(uploadTask2.snapshot.ref).then((downloadURLID) => {
              handleSubmit(URL, downloadURLID);
            });
          });
        }
      );
    }
  };

  function setBranchAbbrev(branch) {
    if (branch.includes("computer")) {
      setBranch("CM");
    } else if (branch.includes("mechanical")) {
      setBranch("ME");
    } else if (branch.includes("civil")) {
      setBranch("CE");
    } else if (branch.includes("chemical")) {
      setBranch("CH");
    } else {
      setBranch("IC");
    }
  }

  function checkIfEligible() {
    const db = dbref(database);
    get(child(db, "/users/" + currentUser.uid)).then((snapshot) => {
      if (snapshot.exists()) {
        let val = snapshot.val();
        if (val.isPending) window.location.href = "/notEligible";
      }
    });
    if (window.sessionStorage.getItem("eligibleToApply") === "false") {
      window.location.href = "/notEligible";
    }
  }

  useEffect(() => {
    checkIfEligible();
    const db = dbref(database);
    get(child(db, `/mapToEnroll/${currentUser.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          setEnrollNo(data.enrollNo);
          setEmail(currentUser.email);
          get(child(dbref(database), `/orgData/${data.enrollNo}`)).then(
            (snapshot) => {
              if (snapshot.exists()) {
                let d = snapshot.val();
                setBranchAbbrev(String(d.course).toLowerCase());
              }
            }
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {};
  });

  return (
    <>
      <Header />
      <div className="Body">
        <div className="parentContainer">
          <div className="container">
            <div className="wrapper">
              <div className="company-info">
                <h3 style={{ fontSize: "1.17em", fontWeight: "bold" }}>
                  Goverment Polytecnic Pen
                </h3>
                <ul>
                  <li>
                    <i className="fa fa-road"></i>{" "}
                    <span>Shivaji Nagar, Ramwadi, Pen</span>{" "}
                  </li>
                  <li>
                    <i className="fa fa-phone"></i>{" "}
                    <span>(+91) 9405691405</span>
                  </li>
                  <li>
                    <i className="fa fa-envelope"></i>{" "}
                    <span>gpraigad1@sancharnet.com</span>
                  </li>
                </ul>
                <ul>
                  {" "}
                  Steps to Follow :
                  <li>1. Fill Up all the details carefully.</li>
                  <li>2. Enter Email which created for college.</li>
                  <li> i.e., Which includes Enrollment No.</li>
                  <li>3. * means Compulsory Field</li>
                </ul>
              </div>
              <div className="contact">
                <h3
                  style={{
                    fontSize: "1.17em",
                    fontWeight: "bold",
                    marginBlockEnd: "1em",
                  }}
                >
                  Bonafide Certificate
                </h3>
                <form id="contactForm">
                  <p>
                    <label>
                      Roll Number<span className="required-field"></span>
                    </label>
                    <input
                      type="text"
                      name="RollNo"
                      id="RollNo"
                      value={RollNo}
                      onChange={handleRollNoChange}
                    />
                  </p>
                  <p>
                    <label>
                      Phone Number<span className="required-field"></span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                  </p>

                  <p>
                    <label>
                      Year<span className="required-field"></span>
                    </label>
                    <select
                      type="text"
                      name="year"
                      id="year"
                      value={year}
                      onChange={handleYearChange}
                    >
                      <option>Select</option>
                      <option value="1st">First</option>
                      <option value="2nd">Second</option>
                      <option value="3rd">Third</option>
                    </select>
                  </p>
                  <p>
                    <label>
                      Gender<span className="required-field"></span>
                    </label>
                    <select
                      type="text"
                      name="gender"
                      id="gender"
                      value={gender}
                      onChange={handleGenderChange}
                    >
                      <option>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </p>
                  <p>
                    <label>
                      Current Academic Year
                      <span className="required-field"></span>
                    </label>
                    <select
                      type="text"
                      name="cacyear"
                      id="cacyear"
                      value={cacyear}
                      onChange={handleCACYearChange}
                    >
                      <option>Select</option>
                      <option value={new Date().getFullYear() - 1}>
                        {new Date().getFullYear() - 1} -{" "}
                        {new Date().getFullYear()}
                      </option>
                      <option value={new Date().getFullYear()}>
                        {new Date().getFullYear()} -
                        {new Date().getFullYear() + 1}
                      </option>
                    </select>
                  </p>
                  <p>
                    <label>
                      Reason for Applying
                      <span className="required-field"></span>
                      <span id="expDesc">max-limit [35 chars]</span>
                    </label>
                    <input
                      type="text"
                      name="reason"
                      id="reason"
                      maxLength={35}
                      value={reason}
                      onChange={handleReasonChange}
                    />
                  </p>
                  <p>
                    <label>
                      Birth Certificate
                      <span className="required-field"></span>
                      <span id="expDesc">
                        File type [jpg,jpeg,png,pdf] limit [250kb]
                      </span>
                    </label>
                    <input
                      type="file"
                      name="fileName"
                      id="myFile"
                      onChange={handleFileChange}
                    />
                  </p>
                  <p>
                    <label>
                      College ID Card
                      <span className="required-field"></span>
                      <span id="expDesc">
                        File type [jpg,jpeg,png,pdf] limit [250kb]
                      </span>
                    </label>
                    <input
                      type="file"
                      name="fileName"
                      id="myFile2"
                      onChange={handleFileChange2}
                    />
                  </p>
                  <p className="full">
                    <button
                      type="submit"
                      id="UploadButton"
                      onClick={handleUpload}
                    >
                      Submit
                    </button>
                  </p>
                </form>
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Data Missing or Invalid
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Please fill valid data.Empty or Invalid data found
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button colorScheme="red" onClick={onClose} ml={3}>
                          Okay
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>

                <AlertDialog isOpen={isSubmitted} onClose={onSumbitClose}>
                  <AlertDialogOverlay>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Success
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Form submitted successfully. Thank you
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <div style={{ color: "transparent" }}>
                          <Link to="/home">
                            <Button
                              color="white"
                              colorScheme="green"
                              onClick={onSumbitClose}
                              ml={3}
                            >
                              Okay
                            </Button>
                          </Link>
                        </div>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
