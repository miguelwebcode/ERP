import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { saveUserData } from "../../../services/users/users";
import { useNavigate } from "react-router-dom";
import SharedForm from "../../formik/SharedForm/SharedForm";
import { CustomInput } from "../../formik/CustomInput/CustomInput";
import { registerFormValidationSchema } from "../../../schemas";
import { CustomSelect } from "../../formik/CustomSelect/CustomSelect";
import { roles } from "../../../data";
import { RegisterFormValues } from "../../../types/form-values-types";
import { toast } from "react-toastify";
import { useState } from "react";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues: RegisterFormValues = {
    name: "",
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: RegisterFormValues) => {
    console.log("Form data", values);
    const { name, role, email, password } = values;

    try {
      // Crear usuario con Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Obtener el UID del usuario recién creado
      const { user } = userCredential;

      // Opcional: Guardar datos adicionales en Firestore
      await saveUserData(user.uid, { name, role, email });
      navigate("/");
    } catch (err: any) {
      console.error("Error registering user: ", err);
      toast.error(`${email} is already in use`);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <SharedForm<RegisterFormValues>
        initialValues={initialValues}
        validationSchema={registerFormValidationSchema}
        onSubmit={handleSubmit}
      >
        <div className="w-full px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Register</h1>
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <CustomInput
                label=""
                name="name"
                type="text"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <CustomSelect label="" name="role">
                <option value="" className="text-center">
                  -- Select an option --
                </option>
                {roles.map((role) => {
                  return <option key={role.id}>{role.value}</option>;
                })}
              </CustomSelect>
            </div>

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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                {/* <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button> */}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <CustomInput
                  label=""
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                />
                {/* <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button> */}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 px-4 rounded-lg mt-8 hover:bg-blue-900 transition-colors duration-200 font-medium"
          >
            Register
          </button>
        </div>
      </SharedForm>
    </div>
  );
};

export default RegisterForm;
