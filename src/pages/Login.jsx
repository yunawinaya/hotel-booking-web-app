import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase.js";
import { toast, Toaster } from "react-hot-toast";
import { Container, Typography } from "@mui/material";

export default function Login() {
  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow("SignUp");
  const handleShowLogin = () => setModalShow("Login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) navigate("/hotels");
  }, [currentUser, navigate]);

  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setModalShow(null);
    setErrorMessage("");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log(res.user);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          setErrorMessage("Invalid email or password.");
          break;
        case "auth/user-not-found":
          setErrorMessage("User not found.");
          break;
        default:
          setErrorMessage("An error occurred. Please try again later.");
          break;
      }
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        if (user) {
          await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            photoURL: user.photoURL,
          });
        }
      })
      .catch((error) => {
        const errorMessage = error.message;

        toast.error(errorMessage);
      });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, username);
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Please input your email");
      }
    }
  };

  return (
    <>
      <Container
        sx={{ display: "grid", placeContent: "center", height: "100vh" }}
        maxWidth="md"
      >
        <Typography textAlign={"center"} variant="h4" sx={{ marginBottom: 4 }}>
          Welcome to NomadsLyfe
        </Typography>
        <Col className="d-grid gap-2">
          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowLogin}
          >
            Login
          </Button>
          <Button
            className="rounded-pill"
            variant="outline-dark"
            onClick={handleGoogleLogin}
          >
            <i className="bi bi-google"></i> Sign up with Google
          </Button>
          <Button className="rounded-pill" onClick={handleShowSignUp}>
            Create an account
          </Button>
        </Col>
        <Modal
          show={modalShow !== null}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              {modalShow === "SignUp"
                ? "Create your account"
                : "Log in to your account"}
            </h2>
            <Form
              className="d-grid gap-2 px-5"
              onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
            >
              {errorMessage && (
                <p className="text-danger" style={{ fontSize: "12px" }}>
                  {errorMessage}
                </p>
              )}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  onChange={(e) => setUsername(e.target.value)}
                  type="email"
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group className="mb-1" controlId="formBasicPassword">
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              {modalShow === "Login" && (
                <Button
                  className="rounded-pill mb-3 text-auto"
                  variant="secondary"
                  size="sm"
                  onClick={handleForgotPassword}
                >
                  Forgot password
                </Button>
              )}
              <Button className="rounded-pill" type="submit">
                {modalShow === "SignUp" ? "Sign up" : "Log in"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1500,
          style: {
            fontSize: 14,
          },
        }}
      />
    </>
  );
}
