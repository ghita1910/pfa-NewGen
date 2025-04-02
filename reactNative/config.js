const config = {
    apiUrls: [
      "http://10.10.1.190:8000",   // Option 2 : IP alternative réseau
      "http://192.168.1.3:8000", // Option 1 : IP réseau local
      "http://192.1.10.1:8000",
          // Option 3 : Autre réseau local
    ],
  };
  
  // Fonction pour choisir l'IP en fonction d'un critère (par exemple, réseau disponible ou première IP valide)
  const getApiUrl = () => {
    // Exemple d'une logique simple pour choisir la première adresse qui est accessible
    for (const url of config.apiUrls) {
      if (isValidUrl(url)) {
        return url;
      }
    }
    throw new Error('Aucune adresse IP valide trouvée');
  };
  
  // Fonction de validation de l'URL (par exemple, vérifier la disponibilité)
  const isValidUrl = (url) => {
    // Une vérification basique, tu peux utiliser des bibliothèques comme axios pour tester la disponibilité.
    return true;  // Remplace par une vraie logique, comme un test de connexion ou un ping.
  };
  
  export default {
    getApiUrl,
  };
  