import React from "react";
import "../styles/pagenotfound.css";

export default function PageNotFound() {
  return (
    <div className="Parent">
      <div className="terminal">
        <h1>
          Error <span className="errorcode">404</span>
        </h1>
        <p className="output">
          The page you are looking for might have been removed, had its name
          changed or is temporarily unavailable.
        </p>
        <p className="output">
          Please try to [go back] or <a href="/home">return to the homepage</a>.
        </p>
        <p className="output">Good luck.</p>
      </div>
    </div>
  );
}
