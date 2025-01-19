import axios from "axios";

const handleClick = async () => {
  const URL = "http://localhost:4000";
  const { data } = await axios(URL, { method: "GET" });
  console.log(data);
};

export const CheckoutButton = () => {
  return (
    <button
      onClick={handleClick}
      className="bg-slate-600 hover:bg-slate-800 text-white font-bold uppercase p-3 rounded-lg "
    >
      Checkout
    </button>
  );
};
