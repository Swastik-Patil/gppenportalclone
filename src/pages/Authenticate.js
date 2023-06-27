import React, { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import "../styles/AuthenticateStyle.css";
import BG from "../res/AuthenticateBG.jpeg";
import { ref as dbref, child, get, set } from "firebase/database";
import { useToast } from "@chakra-ui/react";
import useMounted from "../hooks/useMounted";
import { database } from "../utils/init-firebase";
import BeatLoader from "react-spinners/BeatLoader";
import { Link } from "react-router-dom";
import styled from "styled-components";

function Authenticate() {
  const [loading, setLoading] = useState(true);
  const { register, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const [logemail, setLogEmail] = useState("");
  const [logpassword, setLogPassword] = useState("");

  const toast = useToast();
  const regmounted = useRef(false);
  const mounted = useMounted();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    regmounted.current = true;
    return () => {
      regmounted.current = false;
    };
  }, []);

  function handleRedirectToOrBack() {
    window.location.href = "/profile";
  }

  function validateStudent() {
    let aadhar = document.getElementById("Aadhar").value;
    let email = document.getElementById("Email").value;
    let enroll = document.getElementById("Enroll").value;
    const db = dbref(database);
    get(child(db, `/orgData/${enroll}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (
            data.aadharNo === aadhar &&
            data.enrollNo === enroll &&
            data.registerStatus.isRegistered === false
          ) {
            //making isRegistered = true in database
            set(dbref(database, `/orgData/${enroll}/registerStatus/`), {
              isRegistered: true,
            })
              .then((snapshot) => {
                // console.log("Data set successfully");

                setIsSubmitting(true);
                register(email, password)
                  .then((res) => {
                    //mapping uid with enrollment
                    set(dbref(database, `/mapToEnroll/${res.user.uid}`), {
                      enrollNo: enroll,
                    }).then((snapshot) => {
                      // console.log("Data set successfully");
                    });
                  })
                  .catch((error) => {
                    document.getElementById("RegisterButton").innerHTML =
                      "Register";
                    document.getElementById(
                      "RegisterButton"
                    ).style.disabled = false;
                    toast({
                      description: error.message,
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                  });
              })
              .finally(() => {
                mounted.current && setIsSubmitting(false);
              });
          } else {
            document.getElementById("RegisterButton").innerHTML = "Register";
            document.getElementById("RegisterButton").style.disabled = false;
            if (data.registerStatus.isRegistered) {
              toast({
                description: "User already registered with above Enrollment",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            } else {
              toast({
                description: "Details does not match the records ",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            }
          }
        } else {
          document.getElementById("RegisterButton").innerHTML = "Register";
          document.getElementById("RegisterButton").style.disabled = false;
          toast({
            description: "No student found in the record !",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        document.getElementById("RegisterButton").style.disabled = false;
        document.getElementById("RegisterButton").innerHTML = "Register";
        toast({
          description: "User does not exist in database",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
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
          {currentUser && <Link to="/home"></Link>}
          <div className="section">
            <div className="container">
              <div className="row full-height justify-content-center">
                <div className="col-12 text-center align-self-center py-5">
                  <div className="section pb-5 pt-5 pt-sm-2 text-center">
                    <h6
                      className="mb-0 pb-3"
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      <span className="m-2 headSpan">Log In</span>
                      <span className="m-2 headSpan">Register</span>
                    </h6>
                    <input
                      className="checkbox"
                      type="checkbox"
                      id="reg-log"
                      name="reg-log"
                    />
                    <label htmlFor="reg-log"></label>
                    <span className="instructionSpan">
                      Click on the arrow to change
                    </span>
                    <div className="card-3d-wrap mx-auto">
                      <div className="card-3d-wrapper">
                        <div className="card-front">
                          <div className="center-wrap">
                            <div className="section text-center">
                              <h4
                                className="mb-4 pb-3"
                                style={{
                                  color: "white",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                }}
                              >
                                Log In
                              </h4>
                              <div className="form-group">
                                <input
                                  type="email"
                                  name="logemail"
                                  className="form-style"
                                  placeholder="Your Email"
                                  id="logemail"
                                  autoComplete="off"
                                  value={logemail}
                                  onChange={(e) => setLogEmail(e.target.value)}
                                />
                                <i className="input-icon uil uil-at"></i>
                              </div>
                              <div className="form-group mt-2">
                                <input
                                  type="password"
                                  name="logpass"
                                  className="form-style"
                                  placeholder="Your Password"
                                  id="logpass"
                                  autoComplete="off"
                                  value={logpassword}
                                  onChange={(e) =>
                                    setLogPassword(e.target.value)
                                  }
                                />
                                <i className="input-icon uil uil-lock-alt"></i>
                              </div>
                              <button
                                id="LoginButton"
                                className="Btn mt-4"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  document.getElementById(
                                    "LoginButton"
                                  ).style.disabled = true;
                                  if (!logemail || !logpassword) {
                                    toast({
                                      description: "Credentials not valid.",
                                      status: "error",
                                      duration: 9000,
                                      isClosable: true,
                                    });
                                    return;
                                  }
                                  document.getElementById(
                                    "LoginButton"
                                  ).innerHTML =
                                    '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>';
                                  setIsSubmitting(true);
                                  login(logemail, logpassword)
                                    .then((res) => {
                                      handleRedirectToOrBack();
                                    })
                                    .catch((error) => {
                                      // console.log(error.message);
                                      toast({
                                        description: error.message,
                                        status: "error",
                                        duration: 9000,
                                        isClosable: true,
                                      });
                                    })
                                    .finally(() => {
                                      document.getElementById(
                                        "LoginButton"
                                      ).innerHTML = "Login";
                                      mounted.current && setIsSubmitting(false);
                                    });

                                  e.preventDefault();

                                  document.getElementById(
                                    "LoginButton"
                                  ).style.disabled = false;
                                }}
                              >
                                Log In
                              </button>
                              <p className="mb-0 mt-4 text-center">
                                <Link to="/forgot-password">
                                  Forgot password?
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="card-back">
                          <div className="center-wrap">
                            <div className="section text-center">
                              <h4
                                className="mb-4 pb-3"
                                style={{
                                  color: "white",
                                  fontSize: "20px",
                                  fontWeight: "bold",
                                }}
                              >
                                Register
                              </h4>
                              <div className="form-group">
                                <input
                                  type="text"
                                  name="logname"
                                  className="form-style"
                                  placeholder="Enrollment Number"
                                  id="Enroll"
                                  autoComplete="off"
                                />
                              </div>

                              <div className="form-group mt-2">
                                <input
                                  type="text"
                                  name="logpass"
                                  className="form-style"
                                  placeholder="Aadhar Number"
                                  id="Aadhar"
                                  autoComplete="off"
                                />
                              </div>

                              <div className="form-group mt-2">
                                <input
                                  type="email"
                                  className="form-style"
                                  placeholder="Your Email"
                                  id="Email"
                                  name="email"
                                  autoComplete="off"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                                <i className="input-icon uil uil-at"></i>
                              </div>
                              <div className="form-group mt-2">
                                <input
                                  className="form-style"
                                  placeholder="Create Password"
                                  id="pass"
                                  name="password"
                                  type="password"
                                  autoComplete="password"
                                  required
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                                <i className="input-icon uil uil-lock-alt"></i>
                              </div>
                              <div className="form-group mt-2">
                                <input
                                  className="form-style"
                                  placeholder="Confirm Password"
                                  id="cpass"
                                  name="cpassword"
                                  type="password"
                                  autoComplete="password"
                                  required
                                  value={cPassword}
                                  onChange={(e) => setCPassword(e.target.value)}
                                />
                                <i className="input-icon uil uil-lock-alt"></i>
                              </div>
                              <button
                                id="RegisterButton"
                                type="submit"
                                className="Btn mt-4"
                                onClick={async (e) => {
                                  e.preventDefault();
                                  document.getElementById(
                                    "RegisterButton"
                                  ).style.disabled = true;
                                  if (!email || !password) {
                                    toast({
                                      description: "Credentials not valid.",
                                      status: "error",
                                      duration: 9000,
                                      isClosable: true,
                                    });
                                    return;
                                  } else if (password !== cPassword) {
                                    toast({
                                      description: "Passwords do not match !",
                                      status: "error",
                                      duration: 9000,
                                      isClosable: true,
                                    });
                                    return;
                                  }
                                  document.getElementById(
                                    "RegisterButton"
                                  ).innerHTML =
                                    '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>';

                                  validateStudent();
                                }}
                              >
                                Register
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Contain>
      )}
    </div>
  );
}

const Contain = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  color: white;
  font-family: sans-serif;
  height: fit-content;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.2);
  background: url(${BG}) center center/cover no-repeat;
  @media (max-width: 650px) {
    position: absolute;
    background-attachment: fixed;
    height: fit-content;
    width: 110wh;
  }
`;

export default Authenticate;
