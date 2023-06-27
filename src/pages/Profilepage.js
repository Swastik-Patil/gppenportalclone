import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Studentportal from "../components/Studentportal";

export default function Profilepage() {
  const { currentUser } = useAuth();

  function checkAuthorization() {
    const emails = [
      "hodcomputer@gmail.com",
      "hodcivil@gmail.com",
      "hodmechanical@gmail.com",
      "hodchemical@gmail.com",
      "hodic@gmail.com",
    ];
    if (emails.indexOf(currentUser.email) !== -1) {
      window.location.replace("/HODPortal");
    }
    const std_emails = ["principalGPP@gmail.com", "admin@gmail.com"];
    if (std_emails.indexOf(currentUser.email) !== -1) {
      window.location.replace("/adminHome");
    }

    const std_emails_office = [
      "gppoffice@gmail.com",
      "gppoffice2@gmail.com",
      "studentsection@gmail.com",
    ];
    if (std_emails_office.indexOf(currentUser.email) !== -1) {
      window.location.replace("/studentSectionPortal");
    }
  }

  useEffect(() => {
    checkAuthorization();
    return () => {};
  }, []);

  return (
    <React.Fragment>
      <Studentportal />
    </React.Fragment>
  );
}
