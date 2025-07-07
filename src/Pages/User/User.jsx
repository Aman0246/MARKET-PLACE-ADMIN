import React, { useState, useEffect } from "react";
import Button from "../../Component/Atoms/Button/Button";
import DataTable from "../../Component/Table/DataTable";
import { FiEdit2 } from "react-icons/fi";
import { BsTrash2 } from "react-icons/bs";

export default function User() {
  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    {
      key: "status",
      label: "Status",
      render: (value, row, rowIndex) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={value === "Active"}
            onChange={() => toggleStatus(rowIndex)}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition-colors">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
          </div>
        </label>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="flex gap-3">
          <button onClick={() => handleEdit(row)}>
            <FiEdit2 className="w-4 h-4 text-blue-500 hover:text-blue-700" />
          </button>
          <button onClick={() => handleDelete(row)}>
            <BsTrash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
          </button>
        </div>
      ),
    },
  ];

  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulating API response with dummy data
    const dummyUsers = [
      {
        name: "Alice Johnson",
        description:
          "Senior developer with a strong background in frontend technologies and team leadership.",
        status: "Active",
      },
      {
        name: "Bob Smith",
        description:
          "Handles all DevOps responsibilities, and ensures uptime for services across environments.",
        status: "Inactive",
      },
      {
        name: "Charlie Brown",
        description:
          "Intern currently working on the user authentication module and frontend design tweaks.Intern currently working on the user authentication module and frontend design tweaks.",
        status: "Active",
      },
      {
        name: "Alice Johnson",
        description:
          "Senior developer with a strong background in frontend technologies and team leadership.",
        status: "Active",
      },
      {
        name: "Bob Smith",
        description:
          "Handles all DevOps responsibilities, and ensures uptime for services across environments.",
        status: "Inactive",
      },
      {
        name: "Charlie Brown",
        description:
          "Intern currently working on the user authentication module and frontend design tweaks.Intern currently working on the user authentication module and frontend design tweaks.",
        status: "Active",
      },
      {
        name: "Alice Johnson",
        description:
          "Senior developer with a strong background in frontend technologies and team leadership.",
        status: "Active",
      },
      {
        name: "Bob Smith",
        description:
          "Handles all DevOps responsibilities, and ensures uptime for services across environments.",
        status: "Inactive",
      },
      {
        name: "Charlie Brown",
        description:
          "Intern currently working on the user authentication module and frontend design tweaks.Intern currently working on the user authentication module and frontend design tweaks.",
        status: "Active",
      },
      {
        name: "Alice Johnson",
        description:
          "Senior developer with a strong background in frontend technologies and team leadership.",
        status: "Active",
      },
      {
        name: "Bob Smith",
        description:
          "Handles all DevOps responsibilities, and ensures uptime for services across environments.",
        status: "Inactive",
      },
      {
        name: "Charlie Brown",
        description:
          "Intern currently working on the user authentication module and frontend design tweaks.Intern currently working on the user authentication module and frontend design tweaks.",
        status: "Active",
      },
    ];

    setData(dummyUsers);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <Button variant="primary" size="md" loading={false}>
        Submit
      </Button>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
