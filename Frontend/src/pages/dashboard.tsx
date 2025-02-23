"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import "../style/dash.css" // ✅ Import CSS

interface User {
  fullName: string
  email: string
  googleId: string
}

function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err))
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">MyApp</div>
        <ul className="nav-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </nav>

      {/* Dashboard Content */}
      <motion.div className="dashboard-container" initial="hidden" animate="visible" variants={containerVariants}>
        {user ? (
          <>
            <motion.h1 variants={containerVariants}>Welcome, {user.fullName}!</motion.h1>
            <motion.button
              variants={containerVariants}
              onClick={() => navigate("/form")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Form
            </motion.button>
          </>
        ) : (
          <motion.h1 variants={containerVariants}>Not Authenticated</motion.h1>
        )}
      </motion.div>
    </>
  )
}

export default Dashboard
