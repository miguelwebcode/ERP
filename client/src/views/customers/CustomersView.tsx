import { useNavigate } from "react-router-dom";
import { SharedButton } from "../../components/ui/SharedButton";

export const CustomersView = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md gap-4">
        <h1 className="uppercase font-bold text-xl">Customer CRUD</h1>
        <div className="flex flex-col gap-3">
          <SharedButton
            text="CREATE Customer"
            handleClick={() => {
              navigate("/customers/add");
            }}
          />
          <SharedButton
            text="READ Customers"
            handleClick={() => {
              navigate("/customers/read");
            }}
          />
          <SharedButton
            text="UPDATE Customer"
            handleClick={() => {
              navigate("/customers/edit");
            }}
          />
          <SharedButton
            text="DELETE Customer"
            handleClick={() => {
              navigate("/customers/delete");
            }}
          />
        </div>
      </div>
    </div>
  );
};
