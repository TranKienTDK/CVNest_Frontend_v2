import React, { useEffect } from "react";
import { getUserRole, isAuthenticated } from "@/helper/storage";
import UserHomepage from "./Homepage";
import HRHomepage from "./HRHomepage";
import { Navigate } from "react-router-dom";

const HomeRouter = () => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  // If authenticated and role is HR, show HR homepage
  if (authenticated && userRole === "HR") {
    return <HRHomepage />;
  }
  
  // For regular users or unauthenticated visitors, show the regular homepage
  return <UserHomepage />;
};

export default HomeRouter;
