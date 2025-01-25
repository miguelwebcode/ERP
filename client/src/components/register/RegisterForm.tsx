import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { saveUserData } from "../../services/users";
import { useNavigate } from "react-router-dom";
import SharedForm from "../formik/SharedForm";
import { CustomInput } from "../formik/CustomInput";
import { registerFormValidationSchema } from "../../schemas";

type RegisterFormValues = {
  name: string;
  role: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const navigate = useNavigate();

const initialValues: RegisterFormValues = {
  name: "",
  role: "",
  email: "",
  password: "",
};

const RegisterForm = () => {
  const navigate = useNavigate();

  const onSubmit = async (values: RegisterFormValues) => {
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
  /* 
 TODO: Change role to CustomSelect
*/
  return (
    <SharedForm<RegisterFormValues>
      initialValues={initialValues}
      validationSchema={registerFormValidationSchema}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <div className="flex flex-col w-4/5">
          <CustomInput
            type="text"
            label="Name"
            name="name"
            placeholder="Enter your name"
          />
          <CustomInput
            type="text"
            label="Role"
            name="role"
            placeholder="Enter your role"
          />
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
        </div>
        <button
          type="submit"
          className="w-fit bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
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
