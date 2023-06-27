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

import Profilepage from "../pages/Profilepage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import BonafideApplication from "../pages/BonafideApplication";
import BonafidePreview from "../pages/BonafidePreview";
import HomePage from "../pages/HomePage";
import PageNotFound from "../pages/PageNotFound";
import MyApplications from "../pages/MyApplications";
import TrackApplication from "../pages/TrackApplication";
import HOD_Portal from "./HOD_Portal";
import HOD_Pending from "../pages/HOD_Pending";
import HOD_Rejected from "../pages/HOD_Rejected";
import HOD_Approved from "../pages/HOD_Approved";
import StudentDetails from "../pages/StudentDetail";
import HODControlPanel from "../pages/HODControlPanel";
import Authenticate from "../pages/Authenticate";
import StudentSection from "../pages/StudentSection";
import AdminHome from "../pages/AdminHome";
import DashBoard from "../pages/Dashboard";
import UnauthorizePage from "../pages/UnauthorizePage";
import LcPreview from "../pages/LcPreview";
import OfficeHome from "../pages/OfficeHome";
import LcDetails from "../pages/LcDetails";
import newLcDetails from "../pages/newLcDetails";
import HODSignature from "../pages/HODSignature";
import SampleBonafide from "../pages/sampleBonafide";
import PreviousLc from "../pages/PreviousLc";
import PreviousLcPreview from "../pages/PreviousLcPreview";
import NotEligiblePage from "../pages/NotEligiblePage";
import FilledLC from "../pages/FilledLC";

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
