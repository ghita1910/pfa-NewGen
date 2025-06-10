import React, { useState } from "react";
import {
  HiOutlineSearch,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineBookOpen,
  HiOutlineSupport,
  HiOutlinePhone,
} from "react-icons/hi";
import Sidebar from "../../components/Sidebar";

const helpData = [
  {
    icon: <HiOutlineUserGroup size={32} />,
    title: "Gérer les comptes utilisateurs",
    description: "Ajoutez, modifiez ou désactivez des comptes client ou prestataire facilement.",
    link: "#",
  },
  {
    icon: <HiOutlineCog size={32} />,
    title: "Paramétrage de l'application",
    description: "Modifiez l’apparence, les préférences et activez les alertes importantes.",
    link: "#",
  },
  {
    icon: <HiOutlineBookOpen size={32} />,
    title: "Documentation complète",
    description: "Accédez à tous les guides techniques et fonctionnels de Meak Admin.",
    link: "#",
  },
  {
    icon: <HiOutlineSupport size={32} />,
    title: "Assistance & Tickets",
    description: "Soumettez une demande d’assistance personnalisée à notre équipe support.",
    link: "#",
  },
  {
    icon: <HiOutlinePhone size={32} />,
    title: "Contacter l’équipe",
    description: "Disponible du lundi au vendredi de 9h à 18h via téléphone ou WhatsApp.",
    link: "#",
  },
];

const HelpCenterPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredData = helpData.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.main}>
        <h1 style={styles.title}> Centre d’aide Meak</h1>

        <div style={styles.searchBox}>
          <HiOutlineSearch size={20} color="#9ca3af" />
          <input
            type="text"
            placeholder="Rechercher une question ou une fonctionnalité..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.cardsContainer}>
          {filteredData.map((item, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{item.icon}</div>
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardDescription}>{item.description}</p>
              <a href={item.link} style={styles.link}>Voir plus →</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#f3f4f6",
    fontFamily: "Segoe UI, sans-serif",
  },
  main: {
    flex: 1,
    padding: "40px 60px",
    overflowY: "auto",
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 28,
    color: "#e0e7ff",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1f2937",
    padding: "12px 16px",
    borderRadius: 12,
    marginBottom: 36,
    maxWidth: 550,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  searchInput: {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 30,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 28,
    borderRadius: 18,
    boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  icon: {
    marginBottom: 14,
    color: "#a78bfa",
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 700,
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#cbd5e1",
    marginBottom: 14,
    lineHeight: 1.5,
  },
  link: {
    fontSize: 14,
    color: "#38bdf8",
    fontWeight: 600,
    textDecoration: "none",
  },
};
