import React, { useEffect, useState } from "react";
import {
  FiLogOut,
  FiBell,
  FiSearch,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import profilePic from "../../assets/1.png";
import Sidebar from "../../components/Sidebar";

import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
  AreaChart, Area,
} from 'recharts';

// Realistic Moroccan client names and projects count
const clientsData = [
  { name: "Youssef", projects: 152 },
  { name: "Amine", projects: 134 },
  { name: "Meryem", projects: 120 },
  { name: "Sofia", projects: 88 },
  { name: "Hamid", projects: 43 },
];

// Realistic Moroccan prestataires and ratings
const prestatairesData = [
  { name: "Kawtar", rating: 4.8 },
  { name: "Mehdi", rating: 4.6 },
  { name: "Nour", rating: 4.4 },
  { name: "Said", rating: 4.3 },
  { name: "Imane M.", rating: 4.1 },
];

// Services distribution realistic percentages
const serviceDistribution = [
  { name: "Electricité", value: 28 },
  { name: "Plomberie", value: 23 },
  { name: "Nettoyage", value: 18 },
  { name: "Jardinage", value: 14 },
  { name: "Peinture", value: 9 },
  { name: "Autres", value: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#6A33AA'];

// Monthly user growth (clients + prestataires)
const monthlyUserGrowth = [
  { month: 'Jan', clients: 1200, prestataires: 320 },
  { month: 'Feb', clients: 1500, prestataires: 410 },
  { month: 'Mar', clients: 1800, prestataires: 530 },
  { month: 'Apr', clients: 2100, prestataires: 590 },
  { month: 'May', clients: 2600, prestataires: 660 },
  { month: 'Jun', clients: 3100, prestataires: 720 },
];

// Revenue trends by month (in thousands)
const revenueTrends = [
  { month: 'Jan', revenue: 58 },
  { month: 'Feb', revenue: 72 },
  { month: 'Mar', revenue: 81 },
  { month: 'Apr', revenue: 96 },
  { month: 'May', revenue: 102 },
  { month: 'Jun', revenue: 120 },
];

const AdminHome: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
  }, []);

  return (
    <div style={styles.container}>
      {/* === SIDEBAR === */}
      <Sidebar />

      {/* === MAIN CONTENT === */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <div style={styles.searchBox}>
            <FiSearch size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search campaign, customer, etc..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.rightHeader}>
            <FiBell size={18} color="#fff" style={{ marginRight: 18 }} />
            <div style={styles.verticalDivider} />
            <div style={styles.adminWrapper}>
              <img src={profilePic} alt="profile" style={styles.profilePic} />
              <div style={styles.adminHeaderBlock}>
                <div style={styles.adminName}>@Admin</div>
                <div style={styles.adminEmail}>admin@esisa.ac.ma</div>
              </div>
              <FiLogOut
                color="#EF4444"
                size={16}
                style={{ cursor: "pointer", marginLeft: 12 }}
                title="Déconnexion"
                onClick={() => {
                  const confirmLogout = window.confirm("Voulez-vous vraiment vous déconnecter ?");
                  if (confirmLogout) {
                    localStorage.removeItem("adminToken");
                    navigate("/admin/login");
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            ...styles.content,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <h1 style={styles.contentTitle}>Dashboard</h1>

          {/* === Charts Section === */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>

            {/* Line Chart - Monthly User Growth */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Monthly User Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyUserGrowth} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4a" />
                  <XAxis dataKey="month" stroke="#bbb" />
                  <YAxis stroke="#bbb" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="clients" stroke="#0088FE" activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="prestataires" stroke="#00C49F" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Top Clients by Projects */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Top Clients by Projects</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={clientsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4a" />
                  <XAxis dataKey="name" stroke="#bbb" />
                  <YAxis stroke="#bbb" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projects" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Top Prestataires by Rating */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Top Prestataires by Rating</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prestatairesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4a" />
                  <XAxis dataKey="name" stroke="#bbb" />
                  <YAxis stroke="#bbb" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Service Distribution */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Service Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label
                  >
                    {serviceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Area Chart - Revenue Trends */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Revenue Trends (in 1,000 MAD)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={revenueTrends}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#bbb" />
                  <YAxis stroke="#bbb" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3a4a" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#fff",
    fontFamily: "sans-serif",
  },
  sidebar: {
    width: 180,
    backgroundColor: "rgb(30, 41, 59)",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
  },
  main: {
    flex: 1,
    padding: 30,
    backgroundColor: "#0f172a",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1f2937",
    padding: "8px 12px",
    borderRadius: 8,
    width: 320,
  },
  searchInput: {
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    marginLeft: 10,
    fontSize: 14,
    width: "100%",
  },
  rightHeader: {
    display: "flex",
    alignItems: "center",
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#4B5563",
    marginRight: 18,
  },
  adminWrapper: {
    display: "flex",
    alignItems: "center",
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    marginRight: 10,
    objectFit: "cover",
  },
  adminHeaderBlock: {
    display: "flex",
    flexDirection: "column",
  },
  adminName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  adminEmail: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  content: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 30,
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "all 0.5s ease-in-out",
    height: "100%",
  },
  contentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },

  chartCard: {
    flex: 1,
    minWidth: 350,
    backgroundColor: '#253341',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0 6px 15px rgba(0,0,0,0.3)',
  },
  chartTitle: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 18,
  },
};
