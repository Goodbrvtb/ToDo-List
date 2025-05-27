import { Button } from "antd";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import "./App.css";

export function App() {
  const navigate = useNavigate();
  const myToken = localStorage.getItem("myToken");
  useEffect(() => {
    if (myToken) {
      navigate("/task");
    }
  }, [myToken, navigate]);
  let location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      {location.pathname == "/" && (
        <div className="title-home">
          <h1>ToDo List </h1>
          <Button onClick={() => handleNavigation("/login")}>Login</Button>
          <Button onClick={() => handleNavigation("/registration")}>
            Registration
          </Button>
        </div>
      )}
      <Outlet />
    </div>
  );
}
