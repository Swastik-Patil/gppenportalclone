import React from "react";
import AuthContextProvider from "./contexts/AuthContext";
import AppRouter from "./components/AppRouter";

function App(props) {
  return (
    <>
      <AuthContextProvider>
        <AppRouter />
      </AuthContextProvider>
    </>
  );
}

export default App;
