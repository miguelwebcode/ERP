import { useNavigate } from "react-router-dom";
import { SharedButton } from "../components/ui/SharedButton";

export const CustomersView = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md gap-4">
        <h1 className="uppercase font-bold text-xl">Customer's VIEW</h1>

        <SharedButton
          text="Add Customer"
          handleClick={() => navigate("/customers/add")}
        />
        <SharedButton
          text="Edit Customer"
          handleClick={() => navigate("/customers/edit")}
        />
      </div>
    </div>
  );
};
