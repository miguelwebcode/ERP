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

const RegisterForm = () => {
  const navigate = useNavigate();

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
        <div className="w-3/12 px-8">
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
              <CustomInput
                label="Name"
                name="name"
                type="text"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <CustomSelect label="Role" name="role">
                <option value="" className="text-center">
                  -- Select an option --
                </option>
                {roles.map((role) => {
                  return <option key={role.id}>{role.value}</option>;
                })}
              </CustomSelect>
            </div>

            <div>
              <CustomInput
                label="Email"
                name="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <div className="relative">
                <CustomInput
                  label="Password"
                  name="password"
                  type={"password"}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <CustomInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type={"password"}
                  placeholder="Repeat your password"
                />
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
