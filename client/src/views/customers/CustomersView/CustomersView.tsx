import { useNavigate } from "react-router-dom";
import { SharedButton } from "../../../components/ui/SharedButton/SharedButton";

export const CustomersView = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md gap-6">
        <h1 className="uppercase font-bold text-xl">Customer CRUD</h1>
        <div className="flex flex-col gap-5">
          <SharedButton
            text="CREATE Customer"
            onClick={() => {
              navigate("/customers/add");
            }}
          />
          <SharedButton
            text="READ Customers"
            onClick={() => {
              navigate("/customers/read");
            }}
          />
          <SharedButton
            text="UPDATE Customer"
            onClick={() => {
              navigate("/customers/edit");
            }}
          />
          <SharedButton
            text="DELETE Customer"
            onClick={() => {
              navigate("/customers/delete");
            }}
          />
        </div>
      </div>
    </div>
  );
};
