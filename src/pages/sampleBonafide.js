import React, { useEffect, useState } from "react";
import logo from "../res/LogoBonafide.jpg";
import "../styles/print.css";
import "../styles/BonafidePreview.css";
import { ref as dbref, child, get } from "firebase/database";
import { database } from "../utils/init-firebase";
import BeatLoader from "react-spinners/BeatLoader";
import stamp from "../res/stamp.png";

export default function SampleBonafide() {
  const [loading, setLoading] = useState(true);
  const [clerkSign, setClerkSign] = useState(null);
  const [principalSign, setPrincipalSign] = useState(null);

  var today = new Date();
  var date =
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

  function getSigns() {
    const db = dbref(database);
    get(child(db, `/signatures/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          let data = snapshot.val();
          setPrincipalSign(data.PR.sign);
          switch (window.localStorage.getItem("Clerk_Sign")) {
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
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    getSigns();
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
        <BeatLoader color="#1A2B40" size={18} margin={2} loading={loading} />
      ) : (
        <div className="container">
          <div id="bc__doc">
            <div className="bc__Border1">
              <div className="bc__Border2">
                <div className="bc__heading">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={logo} alt="Logo" id=" logo" srcSet="" />
                  </div>
                  <div>
                    <p className="bc__header">GOVERNMENT POLYTECHNIC PEN</p>
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
                      Gpp/ss/dept/Bonafide/{new Date().getFullYear()}/
                      <strong>1</strong>
                    </span>
                    <span>
                      Date: <span id="TodayDate">{date}</span>
                    </span>
                  </p>
                  <div className="bc__title">
                    <h2 className="lc__title">BONAFIDE CERTIFICATE</h2>
                  </div>
                  <span>
                    This is to certify that <span id="gender"></span>
                    Yash Ravindra Dabhade Roll No. 3316 is a bonafide student of
                    Government Polytechnic, Pen, Dist. Raigad. Studying in Third
                    year in Computer Technology Engineering Branch of the Year
                    2022 12/02/2022
                    <span id="HisHer"></span> date of Birth is 28/04/2003 as per
                    office record.
                    <br />
                    This Certificate is issued on <span id="HisHer"></span>{" "}
                    request application dated on 12/02/2022 .
                  </span>
                  <br />
                </div>
                <div className="bc__Signatures">
                  <div>
                    <img
                      height={120}
                      width={120}
                      src={clerkSign}
                      className="Signatures"
                      alt="signature"
                    />
                  </div>
                  <div>
                    <img src={stamp} alt="stamp" className="Stamp" srcset="" />
                  </div>
                  <div>
                    <img src={principalSign} className="Signatures" alt="" />
                  </div>
                </div>
                <div className="bc__Signatures">
                  <div className="bc__clerk">
                    <h3>
                      <br />
                      Student Section Clerk Sign.
                    </h3>
                  </div>
                  <div className="bc__principal">
                    <h3>
                      Principal
                      <br />
                      Government Polytechnic, Pen
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
