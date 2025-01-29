import { Customer } from "../../types";

type CustomerCardProps = {
  customer: Customer;
};
export const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <>
      <div className="flex flex-col mb-4 gap-1 ">
        <label className="block text-sm font-medium">Name</label>
        <span className="text-md">{customer.name}</span>
      </div>
      <div className="flex flex-col mb-4  gap-1 ">
        <label className="block text-sm font-medium">Email</label>
        <span>{customer.email}</span>
      </div>

      <div className="flex flex-col mb-4  gap-1 ">
        <label className="block text-sm font-medium">Phone</label>
        <span className="text-md">{customer.phone}</span>
      </div>
      <div className="flex flex-col mb-4  gap-1 ">
        <label className="block text-sm font-medium">Address</label>
        <span>{customer.company}</span>
      </div>

      <div className="flex flex-col mb-4  gap-1 ">
        <label className="block text-sm font-medium">Company</label>
        <span className="text-md">{customer.company}</span>
      </div>
      <div className="flex flex-col mb-4  gap-1 ">
        <label className="block text-sm font-medium">Project</label>
        <span>{customer.project}</span>
      </div>

      <div className="flex flex-col mb-4 gap-1">
        <label className="block text-sm font-medium">Created at</label>
        <span className="text-md">{customer.createdAt}</span>
      </div>
      {customer.updatedAt && (
        <div className="flex flex-col mb-4 gap-1">
          <label className="block text-sm font-medium">Updated at</label>
          <span>{customer.updatedAt}</span>
        </div>
      )}
    </>
  );
};
