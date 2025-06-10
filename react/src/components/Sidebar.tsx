import React, { JSX } from "react";
import {
  FiUsers,
  FiSettings,
  FiHome,
  FiHelpCircle,
  FiUserCheck

} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import meakLogo from "../assets/meak1.png";
import meakText from "../assets/meak2.png";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <img src={meakLogo} alt="Meak Icon" style={styles.logoIcon} />
        <img src={meakText} alt="Meak Text" style={styles.logoText} />
      </div>

      <div style={styles.nav}>
        <SidebarItem icon={<FiHome />} label="Dashboard" onClick={() => navigate("/home")} />
        <SidebarItem icon={<FiUsers />} label="Clients" onClick={() => navigate("/admin/clients")} />
        <SidebarItem icon={<FiUsers />} label="Prestataires" onClick={() => navigate("/admin/prestataires")} />
        <SidebarItem icon={<FiUserCheck />} label="Demandes" onClick={() => navigate("/admin/demandes")} />
        <SidebarItem icon={<FiSettings />} label="Services" />
      </div>

      <div style={styles.separator} />

      <div style={styles.bottom}>
        <SidebarItem icon={<FiSettings />} label="Paramètres" onClick={() => navigate("/admin/settings")} />
        <SidebarItem icon={<FiHelpCircle />} label="Centre d'aide"  onClick={() => navigate("/admin/help")} />
      </div>
    </div>
  );
};

export default Sidebar;

const SidebarItem = ({
  icon,
  label,
  onClick,
}: {
  icon: JSX.Element;
  label: string;
  onClick?: () => void;
}) => (
  <div style={styles.sidebarItem} onClick={onClick}>
    <span style={{ marginRight: 12 }}>{icon}</span>
    <span>{label}</span>
  </div>
);

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: 180,
    backgroundColor: "rgb(30, 41, 59)",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 30,
    height: 48,
  },
  logoIcon: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
  logoText: {
    height: 23,
    marginLeft: -20,
    marginTop: 10,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  separator: {
    height: 1,
    backgroundColor: "#374151",
    margin: "20px 0",
  },
  bottom: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    fontSize: 17,
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#e5e7eb",
    backgroundColor: "transparent",
    transition: "all 0.3s",
  },
};
