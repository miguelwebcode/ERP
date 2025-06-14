import { login } from "../../../services/auth/service/authService";
import { useNavigate } from "react-router-dom";
import SharedForm from "../../formik/SharedForm/SharedForm";
import { loginFormValidationSchema } from "../../../schemas";
import { CustomInput } from "../../formik/CustomInput/CustomInput";
import { LoginFormValues } from "../../../types/form-values-types";
import { toast } from "react-toastify";

const LoginForm = () => {
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: LoginFormValues) => {
    const { email, password } = values;
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      toast.error("Invalid credentials");
      console.log(err);
    }
  };

  return (
    <SharedForm<LoginFormValues>
      initialValues={initialValues}
      validationSchema={loginFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center justify-center bg-ds-white p-6 rounded shadow-ds-2 w-96">
        <h1 className="text-3xl font-bold mb-4">Login</h1>

        <div className="w-4/5 flex flex-col gap-4">
          <CustomInput
            label="Email"
            name="email"
            type="text"
            placeholder="Enter your email"
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-4/5 bg-ds-primary-500 text-white py-2 px-4 mt-6 mb-4 rounded hover:bg-ds-primary-600"
        >
          <p className="text-xl font-semibold">Login</p>
        </button>
        <div>
          <span>Don't have an account? </span>
          <button
            className="text-blue-500"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default LoginForm;
