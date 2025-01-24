import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const ProjectForm = () => {
  const initialFormState = {
    customerId: "",
    description: "",
    endDate: "",
    name: "",
    startDate: "",
    state: "",
    developer: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "projects"), {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      setFormData(initialFormState);
      alert("Project created successfully!");
    } catch (error) {
      console.error("Error creating project: ", error);
      alert("Error creating project!");
    }
  };

  return (
    <div className="flex justify-center items-center w-96">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Create Project</h2>
        <div>
          <label
            htmlFor="customerId"
            className="block text-sm font-medium text-gray-700"
          >
            Customer ID
          </label>
          <input
            id="customerId"
            type="text"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Project Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </label>
          <input
            id="state"
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="developer"
            className="block text-sm font-medium text-gray-700"
          >
            Developer
          </label>
          <input
            id="developer"
            type="text"
            name="developer"
            value={formData.developer}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Create Project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;
