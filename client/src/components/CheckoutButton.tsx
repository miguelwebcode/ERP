import { fetchCustomerData } from "../api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

/* 
 TODO: AVERIGUAR QUE ME FALTA PARA PODER LEER FIRESTORE
*/
const obtenerClientes = async () => {
  const querySnapshot = await getDocs(collection(db, "customers"));
  console.log(querySnapshot);
  console.log("¿Está vacío?", querySnapshot.empty); // Verifica si hay documentos

  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
};

const handleClick = async () => {
  const data = await fetchCustomerData();
  console.log(data);
};

export const CheckoutButton = () => {
  return (
    <button
      onClick={() => {
        handleClick();
        obtenerClientes();
      }}
      className="bg-slate-600 hover:bg-slate-800 text-white font-bold uppercase p-3 rounded-lg "
    >
      Checkout
    </button>
  );
};
