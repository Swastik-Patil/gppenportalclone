import React, { useState, useEffect } from "react";
import logo from "../res/LogoBonafide.jpg";
import "../styles/LcPreview.css";
import { ref as dbref, child, get, set } from "firebase/database";
import { database } from "../utils/init-firebase";
import BeatLoader from "react-spinners/BeatLoader";
import { useAuth } from "../contexts/AuthContext";

function PreviousLcPreview() {
  const [loading, setLoading] = useState(true);
  const [orgData, setOrgData] = useState();
  const { currentUser } = useAuth();

  function checkAuthorization() {
    const emails = ["gppoffice@gmail.com", "studentsection@gmail.com"];
    if (emails.indexOf(currentUser.email) === -1) {
      window.location.replace("/profile");
    }
  }

  function captilizeString(s) {
    const ans = s.charAt(0).toUpperCase() + s.slice(1);
    return ans;
  }

  function getStudentDataFromDB() {
    const db = dbref(database);
    let selected = window.sessionStorage.getItem("selectedStudent");
    let path = window.sessionStorage.getItem("path");
    get(child(db, `${path}/${selected}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const std_data = snapshot.val();
          setOrgData(std_data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
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

  useEffect(() => {
    checkAuthorization();
    getStudentDataFromDB();
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
            <div className="lc__Border1">
              <div className="lc__Border2">
                <div className="lc__heading">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={logo} alt="Logo" id="logo" srcSet="" />
                  </div>
                  <div>
                    <p className="lc__header">GOVERNMENT POLYTECHNIC PEN</p>
                    <p>
                      Shivajinagar, Ramwadi, Pen - Raigad. 402107 Dist - Raigad.
                    </p>
                    <p>Phone Number : (02143)253389, 9405691405</p>
                    <p>
                      E-mail:governmentpolytechnicpen@rediffmail.com
                      <span className="tabSpace">Website:www.gppen.ac.in</span>
                    </p>
                  </div>
                </div>
                <div className="lc__dash"></div>
                <div className="titleSec">
                  <p className="lc__title">Leaving Certificate</p>
                  <span className="lc__RegNo">
                    No. {formatLcNo(orgData.lcNo)}
                  </span>
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
                      <p className="info__details">{orgData.generalRegNo}</p>
                    </div>
                  </li>
                  <li>
                    <span>2. Enrollment No : </span>
                    <div className="info">
                      <p className="info__details">{orgData.enroll}</p>
                    </div>
                  </li>
                  <li>
                    <span>3. U.I.D. No (Aadhar No.) : </span>
                    <div className="info">
                      <p className="info__details">{orgData.aadharNo}</p>
                    </div>
                  </li>
                  <li>
                    <span>4. Name of the Candidate (in full) : </span>
                    <div className="info">
                      <p className="info__details">{orgData.fullName}</p>
                    </div>
                  </li>
                  <li>
                    <span>5. Nationality : </span>
                    <div className="info">
                      <p className="info__details">{orgData.nationality}</p>
                    </div>
                  </li>
                  <li>
                    <span>6. Religion : </span>
                    <div className="info">
                      <p className="info__details">
                        {orgData.religion
                          ? captilizeString(String(orgData.religion))
                          : ""}
                        <span className="tabSpace"></span>
                        <span className="tabSpace"></span>
                      </p>
                    </div>
                    <span className="tabSpace"> Caste : </span>
                    <div className="info">
                      <p className="info__details">
                        {orgData.caste
                          ? captilizeString(String(orgData.caste))
                          : ""}
                      </p>
                    </div>
                    <span className="tabSpace">Subcaste : </span>
                    <div className="info">
                      <p className="info__details">
                        {orgData.subCaste
                          ? captilizeString(String(orgData.subCaste))
                          : ""}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>7. Place of Birth : </span>
                    <div className="info">
                      <p className="info__details">{orgData.placeOfBirth}</p>
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
                      new national calendar (Both in words & figure)
                    </span>
                    <div className="info">
                      <div className="dob">
                        <span className="EmptySquare nogap info__details">
                          {String(orgData.dateOfBirth).charAt(0)}
                        </span>
                        <span className="EmptySquare info__details">
                          {String(orgData.dateOfBirth).charAt(1)}
                        </span>
                        <span className="EmptySquare nogap info__details">
                          {String(orgData.dateOfBirth).charAt(3)}
                        </span>
                        <span className="EmptySquare info__details">
                          {String(orgData.dateOfBirth).charAt(4)}
                        </span>

                        <span className="EmptySquare nogap info__details">
                          {String(orgData.dateOfBirth).charAt(6)}
                        </span>
                        <span className="EmptySquare nogap info__details">
                          {String(orgData.dateOfBirth).charAt(7)}
                        </span>
                        <span className="EmptySquare nogap info__details">
                          {String(orgData.dateOfBirth).charAt(8)}
                        </span>
                        <span className="EmptySquare info__details">
                          {" "}
                          {String(orgData.dateOfBirth).charAt(9)}
                        </span>
                      </div>
                      <p className="info__details">
                        {orgData.dateOfBirthInWords}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span> 9. Last Institute attended : </span>
                    <div className="info">
                      <p className="info__details">
                        {orgData.lastInstituteAttended}
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>10. Date of Admission : </span>
                    <div className="info">
                      <p className="info__details">{orgData.dateOfAdmission}</p>
                    </div>
                  </li>
                  <li>
                    <span>11. Progress : </span>
                    <div className="info">
                      <p className="info__details">Good</p>
                    </div>
                  </li>
                  <li>
                    <span>12. Conduct : </span>
                    <div className="info">
                      <p className="info__details">{orgData.conduct}</p>
                    </div>
                  </li>
                  <li>
                    <span>13. Date of leaving Polytechnic : </span>
                    <div className="info">
                      <p className="info__details">{orgData.dateOfLeaving}</p>
                    </div>
                  </li>
                  <li>
                    <span>14. Course and Year in which studying : </span>
                    <div className="info">
                      <p className="info__details">{orgData.courseYear}</p>
                    </div>
                  </li>
                  <li>
                    <span>15. Year of Admission: </span>
                    <div className="info">
                      <p className="info__details">{orgData.dateOfAdmission}</p>
                    </div>
                  </li>
                  <li>
                    <span>16. Reason for leaving Institute : </span>
                    <div className="info">
                      <p className="info__details">{orgData.reason}</p>
                    </div>
                  </li>
                  <li>
                    <span>17. Remark : </span>
                    <div className="info">
                      <p className="info__details">{orgData.remark}</p>
                    </div>
                  </li>
                </ul>
                <p>
                  Certified that the above information is in accordance with the
                  Institute Register.
                </p>
                <p>Date : </p>

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
              <div></div>
              <input
                type="button"
                className="btn btn-danger"
                onClick={() => (window.location.href = "/previousLc")}
                value="Go Back"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PreviousLcPreview;
