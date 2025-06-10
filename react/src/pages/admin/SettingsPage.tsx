import React, { useState } from "react";
import {
  FiUser,
  FiMoon,
  FiShield,
  FiMail,
  FiLogOut,
  FiBell,
  FiActivity,
  FiEdit,
  FiLock,
  FiCheckCircle,
  FiMessageCircle,
} from "react-icons/fi";
import Sidebar from "../../components/Sidebar";

const SettingsPage: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.main}>
        <h1 style={styles.title}>⚙️ Centre de Configuration Admin</h1>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}><FiUser /> Informations du Compte</h2>
          <div style={styles.infoRow}><strong>Nom :</strong> Admin</div>
          <div style={styles.infoRow}><strong>Email :</strong> admin@esisa.ac.ma</div>
          <div style={styles.infoRow}><strong>Rôle :</strong> Super Administrateur</div>
          <div style={styles.btnGroup}>
            <button style={styles.editBtn}><FiEdit /> Modifier</button>
            <button style={styles.logoutBtn}><FiLogOut /> Déconnexion</button>
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}><FiMoon /> Apparence & Thème</h2>
          <label style={styles.toggleLabel}>
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span>Activer le thème sombre</span>
          </label>
          <p style={styles.note}>Thème adapté à la nuit 🌙 et à la concentration.</p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}><FiBell /> Centre de Notifications</h2>
          <label style={styles.toggleLabel}>
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            <span>Recevoir des alertes système et erreurs critiques</span>
          </label>
          <p style={styles.note}>Soyez averti en cas de problème ou d’activité suspecte.</p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}><FiShield /> Sécurité & Mots de passe</h2>
          <button style={styles.securityBtn}><FiLock /> Réinitialiser mot de passe</button>
          <p style={styles.note}>Mot de passe sécurisé requis : 8+ caractères, symbole, chiffre.</p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}><FiActivity /> Historique des Activités</h2>
          <ul style={styles.list}>
            <li><FiCheckCircle /> 12 comptes prestataires validés</li>
            <li><FiMessageCircle /> 5 réponses envoyées à des demandes</li>
            <li>🗑️ 2 comptes clients désactivés</li>
          </ul>
        </section>

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}><FiMail /> Support & Contact</h2>
          <p>Une question ? Besoin d’assistance ?</p>
          <p><strong>📨 support@meak.app</strong></p>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    color: "#f3f4f6",
    fontFamily: "'Segoe UI', sans-serif",
  },
  main: {
    flex: 1,
    padding: 40,
    overflowY: "auto",
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    marginBottom: 30,
    color: "#e0e7ff",
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 28,
    borderRadius: 18,
    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 18,
    color: "#c084fc",
  },
  infoRow: {
    fontSize: 16,
    marginBottom: 8,
  },
  toggleLabel: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 15,
    marginTop: 8,
  },
  note: {
    fontSize: 13,
    marginTop: 6,
    color: "#9ca3af",
  },
  logoutBtn: {
    marginTop: 12,
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
  editBtn: {
    marginTop: 12,
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    marginRight: 12,
  },
  securityBtn: {
    backgroundColor: "#8b5cf6",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    marginTop: 10,
  },
  list: {
    paddingLeft: 20,
    fontSize: 14,
    lineHeight: 1.8,
  },
  btnGroup: {
    display: "flex",
    gap: 12,
    marginTop: 12,
  },
};
