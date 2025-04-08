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
      <div className="flex flex-col items-center justify-center bg-ds-white p-ds-24 rounded-ds-sm shadow-ds-2 w-ds-384">
        <h1 className="text-ds-2xl font-bold mb-ds-16">Login</h1>

        <div className="w-4/5 flex flex-col gap-ds-24">
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
          className="w-4/5 bg-ds-primary-500 text-white py-ds-8 px-ds-16 mt-ds-24 mb-ds-16 rounded hover:bg-ds-primary-600"
        >
          <p className="text-ds-lg font-semibold">Login</p>
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
