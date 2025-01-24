import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import Login from "./components/Login";
import CustomersTestComponent from "./components/CustomersTestComponent";
import { watchAuthState } from "./services/auth";
import Register from "./components/Register";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    watchAuthState(setUser);
  }, []);

  return (
    <div>
      {user ? (
        <div className="flex flex-col h-[100vh] items-center justify-center p-5">
          <h1>Welcome, {user.email}</h1>
          <CustomersTestComponent />
        </div>
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
