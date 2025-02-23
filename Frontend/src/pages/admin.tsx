import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import "../style/admin.css" // ✅ Import CSS


const AdminPortal: React.FC = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/recruitment");
        setSubmissions(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const csvHeaders = [
    { label: "Full Name", key: "fullName" },
    { label: "Department", key: "department" },
    { label: "Domain", key: "domain" },
    { label: "Tech Stack", key: "techStack" },
    { label: "Current Projects", key: "currentProjects" },
    { label: "Previous Projects", key: "previousProjects" },
    { label: "Achievements", key: "achievements" },
    { label: "Other Clubs", key: "otherClubs" },
    { label: "Priority", key: "priority" },
    { label: "Availability", key: "availability" },
    { label: "LinkedIn", key: "linkedIn" },
    { label: "GitHub", key: "github" },
  ];

  return (
    <div>
      <h1>Admin Portal</h1>
      {loading ? (
        <p>Loading submissions...</p>
      ) : (
        <>
          <CSVLink data={submissions} headers={csvHeaders} filename="recruitment_data.csv">
            <button>Download CSV</button>
          </CSVLink>
          <table border={1}>  {/* ✅ Number, not a string */}

            <thead>
              <tr>
                {csvHeaders.map((header) => (
                  <th key={header.key}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index}>
                  {csvHeaders.map((header) => (
                    <td key={header.key}>{submission[header.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminPortal;
