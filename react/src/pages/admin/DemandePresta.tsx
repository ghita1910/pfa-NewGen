// 📁 DemandePresta.tsx
import React, { useEffect, useState } from "react";
import {
  FiTrash,
  FiEye,
  FiArrowLeft,
  FiSearch,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import profilePic from "../../assets/1.png";

const DemandePresta: React.FC = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [visible, setVisible] = useState(false);
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({});
  const [approveId, setApproveId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setVisible(true), 300);
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/admin/pending-prestataires");
        setPrestataires(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Erreur chargement prestataires", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const results = prestataires.filter((p: any) =>
      p.username?.toLowerCase().includes(lower)
    );
    setFiltered(results);
  }, [search, prestataires]);

  const getImageUrl = (path: string) => {
    if (!path) return "UsersAssets/default.png";
    return path.replace(/^\.?\/*/, "");
  };

  const confirmApprove = async () => {
    if (!approveId) return;
    try {
      await axios.put(`http://localhost:8000/admin/approve-prestataire/${approveId}`);
      setPrestataires(prev => prev.filter((p: any) => p.prestataireID !== approveId));
      setApproveId(null);
      setShowToast("✔️ Prestataire approuvé avec succès");
      setTimeout(() => setShowToast(""), 2000);
    } catch (error) {
      console.error("Erreur approbation :", error);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:8000/admin/delete-client/${deleteId}`);
      setPrestataires(prev => prev.filter((p: any) => p.prestataireID !== deleteId));
      setDeleteId(null);
      setShowToast("✔️ Prestataire supprimé avec succès");
      setTimeout(() => setShowToast(""), 2000);
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.main}>
        {/* === Topbar === */}
        <div style={styles.topbar}>
          <div style={styles.searchBox}>
            <FiSearch size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search prestataire..."
              style={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div style={styles.rightHeader}>
            <FiBell size={18} color="#fff" style={{ marginRight: 18 }} />
            <div style={styles.verticalDivider} />
            <div style={styles.adminWrapper}>
              <img src={profilePic} alt="admin" style={styles.profilePic} />
              <div>
                <div style={styles.adminName}>@Admin</div>
                <div style={styles.adminEmail}>admin@esisa.ac.ma</div>
              </div>
              <FiLogOut
                size={16}
                color="#EF4444"
                style={{ marginLeft: 12, cursor: "pointer" }}
                onClick={() => {
                  const confirmLogout = window.confirm("Voulez-vous vous déconnecter ?");
                  if (confirmLogout) {
                    localStorage.removeItem("adminToken");
                    navigate("/admin/login");
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* === Main Content === */}
        <div style={{
          ...styles.content,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}>
          <h1 style={styles.contentTitle}>Approuver demandes des Prestataires</h1>

          <div style={styles.cardsContainer}>
            {filtered.map((p: any) => {
              const isFlipped = flippedCards[p.prestataireID] || false;
              return (
                <div key={p.prestataireID} style={styles.cardWrapper}>
                  <div
                    style={{
                      ...styles.cardInner,
                      transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Front */}
                    <div style={{ ...styles.card, ...styles.cardFront }}>
                      <img src={`http://localhost:8000/${getImageUrl(p.photo)}`} alt="prestataire" style={styles.profileImage} />
                      <h3 style={{ marginBottom: 8 }}><span style={{ color: "#c468f5" }}>@</span>{p.username}</h3>
                      <p><strong style={{ color: "#c468f5" }}>Nom :</strong> {p.nom}</p>
                      <p><strong style={{ color: "#c468f5" }}>Prénom :</strong> {p.prenom}</p>
                      <p><strong style={{ color: "#c468f5" }}>Email :</strong> {p.email || "Unassigned"}</p>
                      <p><strong style={{ color: "#c468f5" }}>Téléphone :</strong> {p.telephone || "Unassigned"}</p>

                      <div style={styles.actions}>
                        <button style={styles.viewBtn} onClick={() => setFlippedCards(prev => ({ ...prev, [p.prestataireID]: true }))}>
                          <FiEye />
                        </button>
                        <button style={styles.deleteBtn} onClick={() => setDeleteId(p.prestataireID)}>
                          <FiTrash />
                        </button>
                      </div>
                    </div>

                    {/* Back */}
                    <div style={{ ...styles.card, ...styles.cardBack }}>
                      <div style={{ textAlign: "left" }}>
                        <p style={{textAlign:'center'}}><strong style={{ color: "#c468f5" }}>Spécialité :</strong> {p.specialite}</p>
                        <p style={{textAlign:'center'}}><strong style={{ color: "#c468f5" }}>Description :</strong> {p.description || "Aucune"}</p>
                        <p style={{textAlign:'center'}}>
                          <strong style={{ color: "#c468f5" }}>CIN :</strong>{" "}
                          <a href={`http://localhost:8000/${p.cin_photo}`} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}>
                            Voir photo
                          </a>
                        </p>
                        <p style={{textAlign:'center'}}>
                          <strong style={{ color: "#c468f5" }}>CV :</strong>{" "}
                          {p.cv ? (
                            <a href={`http://localhost:8000/${p.cv}`} target="_blank" rel="noreferrer" style={{ color: "#38bdf8" }}>
                              Voir CV
                            </a>
                          ) : "Non fourni"}
                        </p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 100 }}>
                        <button style={{ ...styles.viewBtn, backgroundColor: "#10b981" }} onClick={() => setApproveId(p.prestataireID)}>Approuver</button>
                        <button style={styles.deleteBtn} onClick={() => setDeleteId(p.prestataireID)}>Refuser</button>
                        <button style={styles.viewBtn} onClick={() => setFlippedCards(prev => ({ ...prev, [p.prestataireID]: false }))}>
                          <FiArrowLeft /> Retour
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* === MODAL Approve/Delete === */}
      {(approveId !== null || deleteId !== null) && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ marginBottom: 10 }}>
              {approveId ? "Confirmer l'approbation" : "Confirmer la suppression"}
            </h3>
            <p>
              {approveId
                ? "Voulez-vous approuver ce prestataire ?"
                : "Voulez-vous vraiment supprimer ce prestataire ?"}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => {
                  setApproveId(null);
                  setDeleteId(null);
                }}
                style={styles.cancelBtn}
              >
                Annuler
              </button>
              <button
                onClick={approveId ? confirmApprove : confirmDelete}
                style={{
                  ...styles.confirmBtn,
                  backgroundColor: approveId ? "#10b981" : "#ef4444",
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === TOAST === */}
      {showToast && <div style={styles.toast}>{showToast}</div>}
    </div>
  );
};

export default DemandePresta;
 


// styles à ajouter dans un second message si besoin
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "sans-serif",
    backgroundColor: "#0f172a",
    color: "#fff",
  },
  sidebar: {
    width: 180,
    backgroundColor: "#1e293b",
    display: "flex",
    flexDirection: "column",
    padding: 20,
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
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    padding: "10px 12px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#e5e7eb",
    backgroundColor: "transparent",
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
  adminName: {
    fontSize: 14,
    fontWeight: "bold",
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
    width: "95%",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  
  contentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  cardsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },
  
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 10,
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
  },
  viewBtn: {
    backgroundColor: "#6366f1",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#1f2937",
    padding: 30,
    borderRadius: 10,
    width: "90%",
    maxWidth: 400,
    boxShadow: "0 0 20px rgba(0,0,0,0.4)",
    color: "#f9fafb",
  },
  cancelBtn: {
    backgroundColor: "#6b7280",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
    color: "#fff",
  },
  confirmBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    bottom: 30,
    right: 30,
    backgroundColor: "#4ade80",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    zIndex: 99999,
    fontWeight: "bold",
    fontSize: 14,
  },
  cardWrapper: {
    perspective: 1000,
    width: "100%",
    height: 360,
    position: "relative",
    transition: "transform 0.3s ease",
  },
  cardInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    transformStyle: "preserve-3d",
    transition: "transform 0.8s",
  },
  
  card: {
    position: "absolute", // crucial
    width: "100%",
    height: "100%", // force chaque face à avoir exactement la même taille
    backfaceVisibility: "hidden",
    borderRadius: 12,
    padding: 15,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    flexDirection: "column",
    textAlign: "center",
    backgroundColor: "#334155",
    boxSizing: "border-box", // très important pour que padding ne casse pas le layout
  },
  
  cardFront: {
    transform: "rotateY(0deg)",
    zIndex: 2,
  },
  
  cardBack: {
    transform: "rotateY(180deg)",
    zIndex: 1,
    textAlign: "center",
  },
  
  
  
};
