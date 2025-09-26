// Popup Modal JavaScript
let popupClosed = false;
let popupInitialized = false;

// Fonction pour initialiser le popup
function initializePopup() {
  if (popupInitialized) return;
  
  const popup = document.getElementById('special-offer-popup');
  const closeBtn = document.getElementById('popup-close');
  const popupModel = document.getElementById('popup-hawkspine-model');
  
  if (!popup) {
    console.log('Popup non trouvé, réessai dans 100ms...');
    setTimeout(initializePopup, 100);
    return;
  }
  
  popupInitialized = true;
  console.log('Popup initialisé avec succès');
  
  // Fonction pour afficher le popup
  function showPopup() {
    if (popup && !popupClosed) {
      console.log('Affichage du popup...');
      popup.style.display = 'flex';
      // Force reflow pour que l'animation fonctionne
      popup.offsetHeight;
      popup.classList.add('show');
      
      // Empêcher le scroll du body
      document.body.style.overflow = 'hidden';
    }
  }
  
  // Fonction pour masquer le popup
  function hidePopup() {
    if (popup) {
      popup.classList.remove('show');
      // Restaurer le scroll du body après l'animation
      setTimeout(() => {
        popup.style.display = 'none';
        document.body.style.overflow = '';
      }, 400);
    }
  }
  
  // Fermer le popup avec le bouton X
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      hidePopup();
      popupClosed = true;
    });
  }
  
  // Fermer le popup en cliquant sur l'overlay (mais pas sur le contenu)
  if (popup) {
    popup.addEventListener('click', function(e) {
      if (e.target === popup) {
        hidePopup();
        popupClosed = true;
      }
    });
  }
  
  // Fermer le popup avec la touche Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup && popup.classList.contains('show')) {
      hidePopup();
      popupClosed = true;
    }
  });
  
  // Gestion du modèle 3D dans le popup
  if (popupModel) {
    popupModel.addEventListener('load', function() {
      console.log('Modèle 3D du popup chargé');
    });
    
    popupModel.addEventListener('error', function() {
      console.error('Erreur lors du chargement du modèle 3D du popup');
    });
  }
  
  // Afficher le popup après 4 secondes
  setTimeout(showPopup, 4000);
}

// Démarrer l'initialisation du popup
document.addEventListener('DOMContentLoaded', function() {
  // Attendre un peu que le popup HTML soit chargé
  setTimeout(initializePopup, 500);
});

// Animation d'entrée du popup avec GSAP si disponible
if (typeof gsap !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('special-offer-popup');
    const popupContainer = popup?.querySelector('.popup-container');
    
    if (popup && popupContainer) {
      // Animation d'entrée plus fluide avec GSAP
      const showPopupGSAP = () => {
        popup.style.display = 'flex';
        gsap.fromTo(popup, 
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: "power2.out" }
        );
        gsap.fromTo(popupContainer,
          { scale: 0.8, y: 50, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      };
      
      // Remplacer la fonction showPopup par la version GSAP
      const originalTimeout = setTimeout;
      setTimeout = function(callback, delay) {
        if (delay === 7000) {
          return originalTimeout(showPopupGSAP, delay);
        }
        return originalTimeout(callback, delay);
      };
    }
  });
}
