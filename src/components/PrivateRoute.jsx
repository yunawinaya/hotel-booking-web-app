import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";

const PrivateRoute = ({ component: Component }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setAuthChecked(true);
      if (!user) {
        navigate("/");
      }
    });
  }, [navigate]);

  return authChecked ? <Component /> : null;
};

export default PrivateRoute;
