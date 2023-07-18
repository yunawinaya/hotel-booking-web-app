import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";

const PrivateRoute = ({ component: Component }) => {
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      }
    });
  }, [navigate]);

  return <Component />;
};

export default PrivateRoute;
