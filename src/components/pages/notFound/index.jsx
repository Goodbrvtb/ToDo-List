import { useNavigate } from "react-router";
import { Button } from "antd";
export function NotFound() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Button onClick={() => handleNavigation("/")}>HomePage</Button>
    </div>
  );
}
