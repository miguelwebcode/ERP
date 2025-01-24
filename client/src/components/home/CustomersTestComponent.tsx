import { testWriteCustomer, testReadCustomers } from "../../api/testFirestore";

const CustomersTestComponent = () => {
  const handleWriteCustomer = async () => {
    await testWriteCustomer();
  };

  const handleReadCustomers = async () => {
    await testReadCustomers();
  };

  return (
    <div className="flex flex-col gap-4">
      <h1>Firestore Customers Test</h1>
      <div className="flex flex-col gap-3">
        <button
          className="bg-slate-600 hover:bg-slate-800 text-white font-bold uppercase p-3 rounded-lg "
          onClick={handleWriteCustomer}
        >
          Add Customer
        </button>
        <button
          className="bg-slate-600 hover:bg-slate-800 text-white font-bold uppercase p-3 rounded-lg "
          onClick={handleReadCustomers}
        >
          Read Customers
        </button>
      </div>
    </div>
  );
};

export default CustomersTestComponent;
