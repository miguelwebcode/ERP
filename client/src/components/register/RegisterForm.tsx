import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { saveUserData } from "../../services/users";
import { useNavigate } from "react-router-dom";
import SharedForm from "../formik/SharedForm";
import { CustomInput } from "../formik/CustomInput/CustomInput";
import { registerFormValidationSchema } from "../../schemas";
import { CustomSelect } from "../formik/CustomSelect";
import { roles } from "../../data";
import { RegisterFormValues } from "../../types/form-values-types";

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
    }
  };

  return (
    <SharedForm<RegisterFormValues>
      initialValues={initialValues}
      validationSchema={registerFormValidationSchema}
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <div className="w-4/5">
          <CustomInput
            type="text"
            label="Name"
            name="name"
            placeholder="Enter your name"
          />
          <CustomSelect label="Role" name="role">
            <option value="" className="text-center">
              -- Select an option --
            </option>
            {roles.map((role) => {
              return <option key={role.id}>{role.value}</option>;
            })}
          </CustomSelect>
          <CustomInput
            type="text"
            label="Email"
            name="email"
            placeholder="Enter your email"
          />
          <CustomInput
            type="password"
            label="Password"
            name="password"
            placeholder="Enter your password"
          />
          <CustomInput
            type="password"
            label="Confirm password"
            name="confirmPassword"
            placeholder="Enter your password again"
          />
        </div>
        <button
          type="submit"
          className="w-4/5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Register
        </button>
        <div className="p-3">
          <span>Do you have an account? </span>
          <button
            className="text-blue-500"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      </div>
    </SharedForm>
  );
};

export default RegisterForm;
