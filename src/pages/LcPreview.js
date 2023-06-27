import React, { useState, useEffect } from "react";
import logo from "../res/logo1.png";
import duplicate from "../res/duplicate.webp";
import "../styles/LcPreview.css";
import {
  ref as dbref,
  child,
  get,
  set,
  update,
  remove,
} from "firebase/database";
import { database } from "../utils/init-firebase";
import BeatLoader from "react-spinners/BeatLoader";
import { useAuth } from "../contexts/AuthContext";
import $ from "jquery";

function LcPreview() {
  const [loading, setLoading] = useState(true);
  const [LcNo, setLcNo] = useState(null);
  const [isSubmitted, setSubmittedStatus] = useState(false);
  const [isAlreadyGenerated, setIsAlreadyGenerated] = useState(false);
  const { currentUser } = useAuth();
  //creating IP state
  const [ip, setIP] = useState("");
  const [enroll, setEnroll] = useState("");

  function checkIsGenerated() {
    const db = dbref(database);
    let enrollNo = window.localStorage.getItem("LC_Enroll");
    setEnroll(enroll);
    get(child(db, `/history/lcApproved/${enrollNo}`)).then((snap) => {
      if (snap.exists()) {
        // console.log("generated");
        setIsAlreadyGenerated(true);
      } else {
        // console.log("not generated");
        setIsAlreadyGenerated(false);
      }
    });
  }

  function WriteData() {
    const student = {
      enroll: window.localStorage.getItem("LC_Enroll"),
      progress: window.localStorage.getItem("LC_Progress").toUpperCase(),
      conduct: window.localStorage.getItem("LC_Conduct")
        ? window.localStorage.getItem("LC_Conduct").toUpperCase()
        : "",
      dateOfLeaving: window.localStorage.getItem("LC_DateOfLeaving"),
      reason: window.localStorage.getItem("LC_Reason")
        ? window.localStorage.getItem("LC_Reason").toUpperCase()
        : "",
      nationality: window.localStorage.getItem("LC_Nationality").toUpperCase(),
      remark: window.localStorage.getItem("LC_Remark")
        ? window.localStorage.getItem("LC_Remark").toUpperCase()
        : "",
      generalRegNo: window.localStorage.getItem("LC_GeneralRegNo"),
      fullName: window.localStorage.getItem("LC_FullName")
        ? window.localStorage.getItem("LC_FullName").toUpperCase()
        : "",
      aadharNo: window.localStorage.getItem("LC_AadharNo"),
      religion: window.localStorage.getItem("LC_Religion")
        ? window.localStorage.getItem("LC_Religion").toUpperCase()
        : "",
      caste: window.localStorage.getItem("LC_Caste")
        ? window.localStorage.getItem("LC_Caste").toUpperCase()
        : "",
      subCaste: window.localStorage.getItem("LC_SubCaste")
        ? window.localStorage.getItem("LC_SubCaste").toUpperCase()
        : "",
      placeOfBirth: window.localStorage.getItem("LC_PlaceOfBirth"),
      dateOfBirth: window.localStorage.getItem("LC_DateOfBirth"),
      dateOfBirthInWords: window.localStorage
        .getItem("LC_DateOfBirthInWords")
        .toUpperCase(),
      lastInstituteAttended: window.localStorage
        .getItem("LC_LastInstituteAttended")
        .toUpperCase(),
      dateOfAdmission: window.localStorage.getItem("LC_DateOfAdmission"),
      courseYear: window.localStorage.getItem("LC_CourseYear"),
      since: window.localStorage.getItem("LC_Since"),
    };
    PrintDoc(student);
  }

  //creating function to load ip address from the API
  const getIP = async () => {
    $.getJSON("https://api.ipify.org/?format=json", function (e) {
      // console.log(e.ip);
      setIP(e.ip);
    });
  };

  function PrintDoc(student) {
    const db = database;
    let data = 0;
    get(child(dbref(db), `/info/LC`)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        let updateNoValue = data.no;
        if (updateNoValue == 9999) {
          updateNoValue = 1;
        } else {
          updateNoValue += 1;
        }
        update(dbref(db, `/info/LC/`), {
          accepted: data.accepted + 1,
          no: updateNoValue,
        }).then((snap) => {
          set(dbref(db, "/history/lcApproved/" + student.enroll), {
            lcNo: LcNo,
            enroll: student.enroll,
            generalRegNo: student.generalRegNo,
            fullName: student.fullName,
            aadharNo: student.aadharNo,
            nationality: student.nationality,
            religion: student.religion,
            caste: student.caste,
            subCaste: student.subCaste,
            placeOfBirth: student.placeOfBirth,
            dateOfBirth: student.dateOfBirth,
            dateOfBirthInWords: student.dateOfBirthInWords,
            lastInstituteAttended: student.lastInstituteAttended,
            dateOfAdmission: student.dateOfAdmission,
            courseYear: student.courseYear,
            since: student.since,
            conduct: student.conduct,
            dateOfLeaving: student.dateOfLeaving,
            reason: student.reason,
            remark: student.remark,
            progress: student.progress,
            IP: ip,
          }).then(() => {
            setSubmittedStatus(true);
            remove(dbref(db, "/filledLC/" + student.enroll))
              .then(() => {
                // console.log("Deleted user data");
                var Btns = document.getElementById("Actions");
                Btns.style.visibility = "hidden";
                window.print();
              })
              .catch((error) => {
                // console.log("unsuccessful, error " + error);
              });
          });
        });
      }
    });
  }

  function formatLcNo(lcNo) {
    let no = new String(lcNo);
    if (no.length != 4) {
      while (no.length < 4) {
        no = "0" + no;
      }
    }
    return no;
  }

  function getLcNo() {
    const db = database;
    let data = 0;

    //reducing pending and increasing accepted
    get(child(dbref(db), `/info/LC`)).then((snapshot) => {
      if (snapshot.exists()) {
        data = snapshot.val();
        if (parseInt(data.no) > 9999) {
          setLcNo(1);
        } else {
          setLcNo(parseInt(data.no));
        }
        setLoading(false);
      }
    });
  }

  function checkAuthorization() {
    const emails = ["gppoffice@gmail.com", "studentsection@gmail.com"];
    if (emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/profile");
    }
  }

  function handleBack() {
    window.location.href = "/studentsectionportal";
  }

  useEffect(() => {
    checkAuthorization();
    // checkIsGenerated();
    getIP();
    getLcNo();
    return () => {};
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {loading ? (
        <>
          <BeatLoader
            color="#1A2B40"
            size={18}
            margin={2}
            style={{ marginTop: "300px" }}
            loading={loading}
          />
        </>
      ) : (
        <div className="lc__container">
          <div id="lc__doc">
            {/* {isAlreadyGenerated ? (
              <div className="watermark">
                <img src={duplicate} alt="duplicate" />
              </div>
            ) : (
              ""
            )} */}
            <div className="lc__Border1">
              <div className="lc__Border2">
                <div className="lc__heading">
                  <div className="lc__logo">
                    <img src={logo} alt="Logo" srcSet="" />
                  </div>
                  <div>
                    <p className="lc__header">GOVERNMENT POLYTECHNIC PEN</p>
                    <div className="lc_contact">
                      <p>
                        Shivajinagar, Ramwadi, Pen - Raigad. 402107 Dist -
                        Raigad.
                      </p>
                      <p>Phone Number :(02143)253389, 9405691405</p>
                      <p>
                        E-mail:governmentpolytechnicpen@rediffmail.com
                        <span className="tabSpace">
                          Website:www.gppen.ac.in
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lc__dash"></div>
                <div className="titleSec">
                  <p className="lc__title">Leaving Certificate</p>
                  <span className="lc__RegNo">No. {formatLcNo(LcNo)}</span>
                </div>
                <p className="warning">
                  No Change in any entry in this certificate shall be made
                  except by the authority issuing it and any infrigment of this
                  requirement is liable to invoice the imposition on of such as
                  penalty even that of rustication.
                </p>
                <ul className="details">
                  <li>
                    <span>1. General Registered Number of the Candidate :</span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_GeneralRegNo")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>2. Enrollment No : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_Enroll")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>3. U.I.D. No (Aadhar No.) : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_AadharNo")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>4. Name of the Candidate (in full) : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_FullName")
                          ? window.localStorage
                              .getItem("LC_FullName")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>5. Nationality : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_Nationality")
                          ? window.localStorage
                              .getItem("LC_Nationality")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>6. Religion : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_Religion")
                          ? window.localStorage
                              .getItem("LC_Religion")
                              .toUpperCase()
                          : ""}
                        <span className="tabSpace"></span>
                        <span className="tabSpace"></span>
                      </p>
                    </div>
                    <span className="tabSpace"> Caste : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_Caste")
                          ? window.localStorage
                              .getItem("LC_Caste")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                    <span className="tabSpace">Subcaste : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_SubCaste")
                          ? window.localStorage
                              .getItem("LC_SubCaste")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>7. Place of Birth : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_PlaceOfBirth")
                          ? window.localStorage
                              .getItem("LC_PlaceOfBirth")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span>
                      8. Date of Birth : According to the Christian era and the
                      new national calendar :
                    </span>
                    <div className="info">
                      <div className="dob">
                        <span className="EmptySquare nogap info__details">
                          {String(
                            window.localStorage.getItem("LC_DateOfBirth")
                          ).charAt(0)}
                        </span>
                        <span className="EmptySquare info__details">
                          {" "}
                          {String(
                            window.localStorage.getItem("LC_DateOfBirth")
                          ).charAt(1)}
                        </span>
                        <span className="EmptySquare nogap info__details">
                          {String(
                            window.localStorage.getItem("LC_DateOfBirth")
                          ).charAt(3)}
                        </span>
                        <span className="EmptySquare info__details">
                          {" "}
                          {String(
                            window.localStorage.getItem("LC_DateOfBirth")
                          ).charAt(4)}
                        </span>

                        <span className="EmptySquare nogap info__details">
                          {String(
                            window.localStorage.getItem("LC_DateOfBirth")
                          ).charAt(6)}
                        </span>
                        <span className="EmptySquare nogap info__details">
                          {String(
                            window.localStorage.getItem("LC_DateOfBirth")
                          ).charAt(7)}
                        </span>
                        <span className="EmptySquare nogap info__details">
                          {String(
                            window.localStorage.getItem("LC_DateOfBirth")
                          ).charAt(8)}
                        </span>
                        <span className="EmptySquare info__details">
                          {" "}
                          {String(
                            window.localStorage.getItem("LC_DateOfBirth")
                          ).charAt(9)}
                        </span>
                      </div>
                      <p className="info__details">
                        {window.localStorage.getItem("LC_DateOfBirthInWords")
                          ? window.localStorage
                              .getItem("LC_DateOfBirthInWords")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li className="grid_info">
                    <div className="long_info">
                      9. Last Institute attended :
                    </div>
                    <div className="info__details">
                      {window.localStorage.getItem("LC_LastInstituteAttended")
                        ? window.localStorage
                            .getItem("LC_LastInstituteAttended")
                            .toUpperCase()
                        : ""}
                    </div>
                  </li>
                  <li>
                    <span>10. Date of Admission : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_DateOfAdmission")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>11. Progress : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_Progress")
                          ? window.localStorage
                              .getItem("LC_Progress")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>12. Conduct : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_Conduct")
                          ? window.localStorage
                              .getItem("LC_Conduct")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>13. Date of leaving Polytechnic : </span>
                    <div className="info">
                      <p className="info__details">
                        {String(
                          window.localStorage.getItem("LC_DateOfLeaving")
                        )}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>14. Course and Year in which studying : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_CourseYear")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>15. Year of Admission : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_Since")}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>16. Reason for leaving Institute : </span>
                    <div className="info">
                      <p className="info__details">
                        {window.localStorage.getItem("LC_Reason")
                          ? window.localStorage
                              .getItem("LC_Reason")
                              .toUpperCase()
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li className="grid_info">
                    <div className="long_info">17. Remark :</div>
                    <div className="info__details">
                      {window.localStorage.getItem("LC_Remark")
                        ? window.localStorage.getItem("LC_Remark").toUpperCase()
                        : ""}
                    </div>
                  </li>
                </ul>
                <p>
                  Certified that the above information is in accordance with the
                  Institute Register.
                </p>
                <p className="lc__date">Date : </p>
                <div className="lc__Signatures">
                  <div className="lc__clerk">
                    <h3>Clerk</h3>
                  </div>
                  <div className="registrar">
                    <h3>Registrar</h3>
                  </div>
                  <div className="seal"></div>
                  <div className="principal">
                    <h3>
                      Principal,
                      <br />
                      Government Polytechnic, Pen
                    </h3>
                  </div>
                </div>
              </div>
            </div>
            <div id="Actions">
              <input
                type="button"
                className="btn btn-primary"
                onClick={WriteData}
                id="printBtn"
                value="Print"
              />
              <input
                type="button"
                className="btn btn-danger"
                onClick={handleBack}
                value={"Go Back"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LcPreview;
