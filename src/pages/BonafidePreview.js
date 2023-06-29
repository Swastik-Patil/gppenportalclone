import React, { useEffect, useState } from "react";
import logo from "../res/LogoBonafide.jpg";
import "../styles/print.css";
import "../styles/BonafidePreview.css";
import { ref as dbref, child, get } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../utils/init-firebase";
import BeatLoader from "react-spinners/BeatLoader";
import stamp from "../res/stamp.png";

export default function BonafidePreview() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [enroll, setEnroll] = useState(null);
  const [branch, setBranch] = useState(null);
  const [actionDate, setActionDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clerkSign, setClerkSign] = useState(null);
  const [principalSign, setPrincipalSign] = useState(null);

  function getSigns(branchOfStudent) {
    const db = dbref(database);
    get(child(db, `/signatures/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          setPrincipalSign(data.PR.sign);
          switch (branchOfStudent) {
            case "CM":
              setClerkSign(data.CM.sign);
              break;
            case "CE":
              setClerkSign(data.CE.sign);
              break;
            case "CH":
              setClerkSign(data.CH.sign);
              break;
            case "ME":
              setClerkSign(data.ME.sign);
              break;
            case "IC":
              setClerkSign(data.IC.sign);
              break;
            default:
              break;
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function readUserPastData() {
    const db = dbref(database);
    get(child(db, `/history/approved/${currentUser.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          setUserData(data);
          setEnroll(data.enroll);
          setBranch(data.branch);
          setActionDate(data.actionDate);
          getSigns(data.branch);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function branchSetter(branch) {
    switch (branch) {
      case "CM":
        return "Computer Technology";
        break;
      case "CH":
        return "Chemical Engineering";
        break;
      case "IC":
        return "Instrumentation control Engineering";
        break;
      case "ME":
        return "Mechanical Engineering";
        break;
      case "CE":
        return "Civil Engineering";
        break;
      default:
        return "";
    }
  }

  function handleBack() {
    window.location.href = "/profile";
  }

  function formatNo(No) {
    let no = new String(No);
    if (no.length != 3) {
      while (no.length < 3) {
        no = "0" + no;
      }
    }
    return no;
  }

  useEffect(() => {
    readUserPastData();
    return () => {};
  }, []);

  function PrintDoc() {
    var Btns = document.getElementById("Actions");
    Btns.style.visibility = "hidden";
    window.print();
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
        <BeatLoader color="#1A2B40" size={18} margin={2} loading={loading} />
      ) : (
        <div className="container">
          <div id="bc__doc">
            {userData ? (
              <div className="bc__Border1">
                <div className="bc__Border2">
                  <div className="bc__heading">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        className="bc__logo"
                        src={logo}
                        alt="Logo"
                        id="logo"
                        srcSet=""
                      />
                    </div>
                    <div>
                      <p className="bc__header" id="clgTitle">
                        GOVERNMENT POLYTECHNIC PEN
                      </p>
                      <p style={{ fontSize: "small" }}>
                        Shivaji Nagar, Ramwadi, Pen, Dist. Raigad. 402 107.
                      </p>
                      <p style={{ fontSize: "12px" }}>
                        Ph.(02143)253389, 257081, Email-gpraigad1@sancharnet.com
                      </p>
                      <p style={{ fontSize: "small" }}>
                        Website : www.gppen.ac.in
                      </p>
                    </div>
                  </div>
                  <div className="dash"></div>
                  <div className="body">
                    <p className="date">
                      <span>
                        GPP/SS/{userData.branch}/Bonafide/
                        {new Date().getFullYear()}/
                        <span id="bc__RegNo">
                          {" "}
                          {formatNo(userData.bonafide_no)}
                        </span>
                      </span>
                      <span>
                        Date: <span id="TodayDate">{actionDate}</span>
                      </span>
                    </p>
                    <div className="bc__title">
                      <h2 id="bcTitle">BONAFIDE CERTIFICATE</h2>
                    </div>
                    <span>
                      This is to certify that{" "}
                      <span id="gender">
                        {userData.gender == "male" ? "Kumar" : "Kumari"}{" "}
                      </span>
                      {userData.fullName} Roll No. {userData.rollNo} is a
                      bonafide student of Government Polytechnic, Pen, Dist.
                      Raigad. Studying in {userData.year} year Diploma in{" "}
                      {branchSetter(userData.branch)} Branch of the Year{" "}
                      {userData.cacyear +
                        "-" +
                        parseInt(new Date(userData.cacyear).getFullYear() + 1)
                          .toString()
                          .slice(2)}
                      .
                      <span id="HisHer">
                        {" "}
                        {userData.gender == "male" ? "His" : "Her"}
                      </span>{" "}
                      date of Birth is{" "}
                      {new String(userData.dateOfBirth).replaceAll(".", "/")} as
                      per office record.
                      <br />
                      This Certificate is issued on{" "}
                      <span id="HisHer">
                        {" "}
                        {userData.gender == "male" ? "his" : "her"}{" "}
                      </span>{" "}
                      request application dated{" "}
                      {new Date(userData.appliedDate).getDate() +
                        "/" +
                        (new Date(userData.appliedDate).getMonth() + 1) +
                        "/" +
                        new Date(userData.appliedDate).getFullYear()}
                      .
                      <br />
                      <span>
                        This certificate is valid till {userData.validityDate}.
                      </span>
                    </span>

                    <br />
                  </div>
                  <div className="bc__Signatures">
                    <div>
                      <img
                        src={clerkSign}
                        className="Signatures"
                        alt="signature"
                      />
                    </div>
                    <div>
                      <img
                        src={stamp}
                        className="Stamp"
                        alt="stamp"
                        srcSet=""
                      />
                    </div>
                    <div>
                      <img src={principalSign} className="Signatures" alt="" />
                    </div>
                  </div>
                  <div className="bc__Signatures">
                    <div className="bc__clerk">
                      <h3 className="signText">
                        <br />
                        Student Section Clerk Sign.
                      </h3>
                    </div>
                    <div className="bc__principal">
                      <h3 className="signText">
                        Principal
                        <br />
                        Government Polytechnic, Pen
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              readUserPastData()
            )}
          </div>
          <div id="Actions">
            <input
              type="button"
              onClick={PrintDoc}
              id="printBtn"
              value="Print"
              className="btns"
            />
            <input
              type="button"
              onClick={handleBack}
              id="printBtn"
              value="Go Back"
              className="btn btn-danger"
            />
          </div>
        </div>
      )}
    </div>
  );
}
