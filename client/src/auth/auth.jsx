import { useState, createContext, useContext, useEffect } from "react"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [department, setDepartment] = useState(() => {
    const storedDepartment = localStorage.getItem("department")
    return storedDepartment || ""
  })

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user")
    return storedUser ? JSON.parse(storedUser) : null
  })

  const login = (user, department) => {
    localStorage.setItem("user", JSON.stringify(user))
    setUser(user)
    localStorage.setItem("department", department)
    setDepartment(department)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    localStorage.removeItem("department")
    setDepartment("")
  }

  // Track user activity
  let inactivityTimeout

  const handleUserActivity = () => {
    clearTimeout(inactivityTimeout)
    inactivityTimeout = setTimeout(() => {
      logout()
    }, 600000)
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleUserActivity)
    document.addEventListener("keydown", handleUserActivity)

    handleUserActivity()

    return () => {
      document.removeEventListener("mousemove", handleUserActivity)
      document.removeEventListener("keydown", handleUserActivity)
      clearTimeout(inactivityTimeout)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, department, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
