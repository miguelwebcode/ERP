import { ReactNode } from "react";

type SharedCard = {
  children: ReactNode;
};
export const SharedCard = ({ children }: SharedCard) => {
  return (
    <div className="bg-ds-white rounded-ds-sm shadow-ds-2 p-ds-20 w-fit h-fit">
      {children}
    </div>
  );
};
