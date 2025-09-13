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
    <div className="h-full flex items-center justify-center">
      <SharedForm<LoginFormValues>
        initialValues={initialValues}
        validationSchema={loginFormValidationSchema}
        onSubmit={handleSubmit}
      >
        <div className="w-full max-w-2xl px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Login</h1>
            <p className="text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <CustomInput
                label=""
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <CustomInput
                  label=""
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 px-4 rounded-lg mt-8 hover:bg-blue-900 transition-colors duration-200 font-medium"
          >
            Login
          </button>
        </div>
      </SharedForm>
    </div>
  );
};

export default LoginForm;
