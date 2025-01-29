import { ReactNode } from "react";

type SharedCard = {
  children: ReactNode;
};
export const SharedCard = ({ children }: SharedCard) => {
  return (
    <div className="bg-slate-50 rounded-xl shadow-lg p-4 w-fit h-fit">
      {children}
    </div>
  );
};
