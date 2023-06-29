import React from "react";
import "../style.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  Profilepage,
  ResetPasswordPage,
  ForgotPasswordPage,
  BonafideApplication,
  BonafidePreview,
  HomePage,
  PageNotFound,
  MyApplications,
  TrackApplication,
  HOD_Portal,
  HOD_Pending,
  HOD_Approved,
  HOD_Rejected,
  HODControlPanel,
  StudentDetails,
  Authenticate,
  StudentSection,
  AdminHome,
  DashBoard,
  UnauthorizePage,
  LcPreview,
  OfficeHome,
  LcDetails,
  newLcDetails,
  HODSignature,
  SampleBonafide,
  PreviousLc,
  PreviousLcPreview,
  NotEligiblePage,
  FilledLC,
} from "../pages";

export default function AppRouter() {
  return (
    <>
      <Router>
        <Switch>
          <ProtectedRoute exact path="/" component={HomePage} />
          <ProtectedRoute path="/myApplications" component={MyApplications} />
          <ProtectedRoute exact path="/login" component={Authenticate} />
          <ProtectedRoute exact path="/register" component={Authenticate} />
          <ProtectedRoute exact path="/profile" component={Profilepage} />
          <ProtectedRoute exact path="/home" component={HomePage} />
          <ProtectedRoute
            exact
            path="/bonafidepreview"
            component={BonafidePreview}
          />
          <ProtectedRoute
            exact
            path="/sampleBonafide"
            component={SampleBonafide}
          />

          <ProtectedRoute
            exact
            path="/UnAuthorize"
            component={UnauthorizePage}
          />

          <ProtectedRoute exact path="/adminHome" component={AdminHome} />
          <ProtectedRoute exact path="/dashboard" component={DashBoard} />
          <ProtectedRoute
            exact
            path="/bonafideapplication"
            component={BonafideApplication}
          />
          <ProtectedRoute
            exact
            path="/trackApplication"
            component={TrackApplication}
          />
          <ProtectedRoute
            exact
            path="/studentSectionPortal"
            component={StudentSection}
          />
          <ProtectedRoute exact path="/officeHome" component={OfficeHome} />
          <ProtectedRoute exact path="/lcDetails" component={LcDetails} />
          <ProtectedRoute exact path="/filledLC" component={FilledLC} />
          <ProtectedRoute exact path="/newlcDetails" component={newLcDetails} />
          <ProtectedRoute exact path="/lcPreview" component={LcPreview} />
          <ProtectedRoute exact path="/previousLc" component={PreviousLc} />
          <ProtectedRoute
            exact
            path="/PreviousLcPreview"
            component={PreviousLcPreview}
          />

          <ProtectedRoute exact path="/Details" component={StudentDetails} />
          <ProtectedRoute exact path="/HODPortal" component={HOD_Portal} />
          <ProtectedRoute exact path="/HODPending" component={HOD_Pending} />
          <ProtectedRoute exact path="/HODRejected" component={HOD_Rejected} />
          <ProtectedRoute exact path="/HODApproved" component={HOD_Approved} />
          <ProtectedRoute exact path="/HODSignature" component={HODSignature} />
          <ProtectedRoute
            exact
            path="/HODControlPanel"
            component={HODControlPanel}
          />
          <ProtectedRoute
            exact
            path="/forgot-password"
            component={ForgotPasswordPage}
          />
          <ProtectedRoute
            exact
            path="/reset-password"
            component={ResetPasswordPage}
          />
          <ProtectedRoute
            exact
            path="/notEligible"
            component={NotEligiblePage}
          />

          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </>
  );
}

function ProtectedRoute(props) {
  const { currentUser } = useAuth();
  const { path } = props;
  const location = useLocation();
  if (
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password" ||
    path === "/reset-password"
  ) {
    return currentUser ? (
      <Redirect to={location.state?.from ?? "/home"} />
    ) : (
      <Route {...props} />
    );
  }
  return currentUser ? (
    <Route {...props} />
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: { from: path },
      }}
    />
  );
}
