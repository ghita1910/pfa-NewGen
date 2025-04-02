import axios from "axios";

const config = {
  apiUrls: [
    "http://192.168.1.3:8000", // Réseau local 1
    "http://10.10.1.190:8000", // Réseau local 2
    "http://192.1.10.1:8000",  // Réseau local 3
  ],
};

// Fonction pour tester rapidement si une URL est accessible.
const isUrlAccessible = async (url) => {
  try {
    const response = await axios.get(`${url}/docs`); // endpoint FastAPI par défaut
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Fonction pour choisir dynamiquement la bonne IP
const getApiUrl = async () => {
  for (const url of config.apiUrls) {
    if (await isUrlAccessible(url)) {
      console.log("✅ API disponible sur l'URL :", url);
      return url;
    } else {
      console.log("❌ API non disponible sur l'URL :", url);
    }
  }
  throw new Error("❌ Aucune adresse IP valide trouvée dans apiUrls");
};

export default {
  getApiUrl,
};
