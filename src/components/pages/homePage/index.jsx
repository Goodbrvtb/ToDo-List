import React from "react";
import { NavLink } from "react-router";
export function HomePage() {
  return (
    <div>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/registration">Registration</NavLink>
    </div>
  );
}
