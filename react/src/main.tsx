import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'

// 🔵 Appliquer le style global ici
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.backgroundColor = "darkgrey"; // même couleur que ta page

document.documentElement.style.margin = "0";
document.documentElement.style.padding = "0";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
