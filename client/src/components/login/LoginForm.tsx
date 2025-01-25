import { login } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import SharedForm from "../formik/SharedForm";
import { loginFormValidationSchema } from "../../schemas";
import { CustomInput } from "../formik/CustomInput";

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (values: LoginFormValues) => {
    const { email, password } = values;
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SharedForm<LoginFormValues>
      initialValues={initialValues}
      validationSchema={loginFormValidationSchema}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96">
        <div className="flex flex-col w-4/5">
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
          className="w-4/5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <div className="p-3">
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
