import { createContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
export const AuthContext = createContext({});

export const AuthContextProvider = ({ children, setDarkMode }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        const isAdminUser = await checkIfUserIsAdmin(user.uid);
        setIsAdmin(isAdminUser);
      }
    });
    return () => unsubscribe();
  }, []);

  const checkIfUserIsAdmin = async (uid) => {
    try {
      const userDocRef = doc(db, `users/${uid}`);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return userData.isAdmin === true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error checking user admin status:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, setDarkMode, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
