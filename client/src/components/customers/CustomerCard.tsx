import { Customer } from "../../types";
import { CardField } from "../ui/CardField";

type CustomerCardProps = {
  customer: Customer;
};
export const CustomerCard = ({ customer }: CustomerCardProps) => {
  return (
    <>
      <CardField label="Name" value={customer.name} />
      <CardField label="Email" value={customer.email} />
      <CardField label="Phone" value={customer.phone} />
      <CardField label="Address" value={customer.address} />
      <CardField label="Company" value={customer.company} />
      <CardField label="Project" value={customer.project} />
      <CardField label="Created at" value={customer.createdAt} />
      {customer.updatedAt && (
        <CardField label="Updated at" value={customer.updatedAt} />
      )}
    </>
  );
};
