import { ReactNode } from "react";

type SharedCard = {
  children: ReactNode;
};

/*
    TODO: Delete SharedCard component when updated card components tested (customer, project, employee cards)
*/

export const SharedCard = ({ children }: SharedCard) => {
  return (
    <div className="bg-ds-white rounded shadow-ds-2 w-fit h-fit">
      {children}
    </div>
  );
};
