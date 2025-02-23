import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "../style/form.css" // ✅ Import CSS

const FormPage: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    domain: "",
    techStack: "",
    currentProjects: "",
    previousProjects: "",
    achievements: "",
    otherClubs: "",
    priority: "",
    availability: "",
    linkedIn: "",
    github: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true) // Disable button while submitting
    try {
      await axios.post("http://localhost:5000/api/recruitment", formData)
      navigate("/confirmation") // Redirect to confirmation page after successful submission
    } catch (error) {
      alert("Error submitting form.")
    } finally {
      setIsSubmitting(false) // Re-enable button
    }
  }

  return (
    <div className="form-container">
      <h2>Recruitment Form</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input type="text" name="department" placeholder="Department" onChange={handleChange} required />
        <input type="text" name="domain" placeholder="Domain (comma-separated)" onChange={handleChange} required />
        <input type="text" name="techStack" placeholder="Tech Stack" onChange={handleChange} required />
        <textarea name="currentProjects" placeholder="Current Projects" onChange={handleChange} required />
        <textarea name="previousProjects" placeholder="Previous Projects" onChange={handleChange} required />
        <textarea name="achievements" placeholder="Achievements" onChange={handleChange} required />
        <input type="text" name="otherClubs" placeholder="Other Clubs" onChange={handleChange} />
        <input type="text" name="priority" placeholder="Priority" onChange={handleChange} required />
        <input type="text" name="availability" placeholder="Availability" onChange={handleChange} required />
        <input type="url" name="linkedIn" placeholder="LinkedIn Profile" onChange={handleChange} required />
        <input type="url" name="github" placeholder="GitHub Profile" onChange={handleChange} required />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  )
}

export default FormPage
