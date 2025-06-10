import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/meak.png";
import background from "../../assets/backpurple.jpg";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/auth/admin-login", {
        email,
        password,
      });
  
      const token = response.data.token;
      localStorage.setItem("adminToken", token); // ✅ On stocke le token
  
      console.log("✅ Login success:", token);
      navigate("/home"); // ou "/home", à toi de choisir
    } catch (err: any) {
      setError("Email ou mot de passe incorrect");
    }
  };
  

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.container,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: "all 1s ease-in-out",
        }}
      >
        {/* ✅ Logo à gauche */}
        <div style={styles.left}>
          <img src={logo} alt="Logo" style={{ width: 500, height: 500 }} />
        </div>

        {/* ✅ Formulaire à droite */}
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome</h1>
          <p style={styles.subtitle}>Please login to Admin Dashboard</p>

          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            style={{
              ...styles.loginButton,
              boxShadow: hovered ? "0 0 15px #752ca3" : "none",
              transform: hovered ? "scale(1.03)" : "scale(1)",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleLogin}
          >
            LOGIN
          </button>

          <p style={styles.forgot}>Mot de passe oublié ?</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    height: "100vh",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    width: "85%",
    maxWidth: 1200,
    height: "80vh",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(5px)",
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0 0 30px rgba(0,0,0,0.2)",
  },
  left: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.02)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    padding: 50,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 45,
    fontWeight: "bold",
    marginBottom: 6,
    fontFamily: "sans-serif",
    color: "#752ca3",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    maxWidth: 350,
    padding: 12,
    borderRadius: 6,
    border: "1px solid #ddd",
    fontSize: 14,
    backgroundColor: "#f7f7f7",
    color: "#111",
  },
  loginButton: {
    width: 350,
    padding: 12,
    backgroundColor: "#752ca3",
    color: "#fff",
    border: "none",
    borderRadius: 7 ,
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 10,
    transition: "all 0.3s ease-in-out",
  },
  forgot: {
    marginTop: 14,
    fontSize: 12,
    color: "#888",
    textDecoration: "underline",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: -5,
  },
};
