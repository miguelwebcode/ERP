import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useAppStore } from "../../stores/app-store";
import { SharedButton } from "../../components/ui/SharedButton/SharedButton";
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoReader } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";

export const HomeView = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="uppercase font-bold text-3xl">HOME</h1>
      <h2 className="my-8">Welcome, {user && user.email} </h2>
      <div className="flex flex-col lg:flex-row gap-4 ">
        {/* CARD CUSTOMERS */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded shadow-md min-w-[300px]">
          <h3 className="uppercase font-bold text-center text-xl">
            MANAGE CUSTOMERS
          </h3>
          <div className="flex justify-around gap-6">
            <SharedButton
              className="flex-1 px-4"
              text="CREATE"
              Icon={FaPlus}
              onClick={() => {
                navigate("/customers/add");
              }}
            />
            <SharedButton
              className="flex-1 px-4"
              text="READ"
              Icon={IoReader}
              onClick={() => {
                navigate("/customers/read");
              }}
            />
          </div>
          <div className="flex justify-around gap-6">
            <SharedButton
              className="flex-1 px-4"
              text="UPDATE"
              Icon={MdEdit}
              onClick={() => {
                navigate("/customers/edit");
              }}
            />
            <SharedButton
              className="flex-1 px-4"
              text="DELETE"
              Icon={MdDeleteForever}
              onClick={() => {
                navigate("/customers/delete");
              }}
            />
          </div>
        </div>
        {/* CARD PROJECTS */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded shadow-md min-w-[300px]">
          <h3 className="uppercase font-bold text-center text-xl">
            MANAGE PROJECTS
          </h3>
          <div className="flex justify-around gap-6">
            <SharedButton
              className="flex-1 px-4"
              text="CREATE"
              Icon={FaPlus}
              onClick={() => {
                navigate("/projects/add");
              }}
            />
            <SharedButton
              className="flex-1 px-4"
              text="READ"
              Icon={IoReader}
              onClick={() => {
                navigate("/projects/read");
              }}
            />
          </div>
          <div className="flex justify-around gap-6">
            <SharedButton
              className="flex-1 px-4"
              text="UPDATE"
              Icon={MdEdit}
              onClick={() => {
                navigate("/projects/edit");
              }}
            />
            <SharedButton
              className="flex-1 px-4"
              text="DELETE"
              Icon={MdDeleteForever}
              onClick={() => {
                navigate("/projects/delete");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
