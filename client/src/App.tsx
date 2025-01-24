import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Login from "./components/login/Login";
import { watchAuthState } from "./services/auth";
import Register from "./components/register/Register";
import { HomePage } from "./components/home/HomePage";

const App = () => {
  /* 
   TODO: Manage state with zustand
  */
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    watchAuthState(setUser);
  }, []);

  return (
    <div>
      {user ? (
        <HomePage user={user} />
      ) : (
        <>
          {showRegister ? (
            <Register
              callback={() => {
                setShowRegister(false);
              }}
            />
          ) : (
            <Login
              callback={() => {
                setShowRegister(true);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
