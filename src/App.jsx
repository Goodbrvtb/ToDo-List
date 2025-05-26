import { Button } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router";
import "./App.css";
export function App() {
  let location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      {location.pathname == "/" && (
        <div className="titel-home">
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
