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
            <div>
              <Register />
              <div>
                <p>Do you have an account?</p>
                <button
                  onClick={() => {
                    setShowRegister(false);
                  }}
                >
                  Login
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Login />
              <div>
                <p>Don't have an account?</p>
                <button
                  onClick={() => {
                    setShowRegister(true);
                  }}
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
