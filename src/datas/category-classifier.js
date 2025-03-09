// Liste de mots-clés par catégorie
const categoryKeywords = {
  'Animalerie': [
      'chat', 'chien', 'animal', 'animaux', 'nourriture', 'litière', 'croquettes', 'jouets', 'laisse',
      'aquarium', 'poisson', 'oiseau', 'hamster', 'rongeur', 'terrarium', 'gamelle', 'collier', 'harnais',
      'veterinaire', 'pet', 'cage', 'niche', 'panier', 'griffoir'
  ],
  'Auto et Moto': [
      'voiture', 'auto', 'automobile', 'moto', 'scooter', 'vehicule', 'pieces', 'accessoires',
      'entretien', 'nettoyage', 'pneu', 'batterie', 'huile', 'moteur', 'phare', 'frein',
      'autoradio', 'gps', 'casque', 'siege', 'enjoliveur', 'essuie-glace', 'outillage', 'carenage'
  ],
  'Bagages et Voyage': [
      'valise', 'bagage', 'sac', 'voyage', 'trolley', 'cabine', 'soute', 'etiquette',
      'passeport', 'trousse', 'accessoires', 'organiseur', 'adaptateur', 'oreiller',
      'masque', 'bouchon', 'transport', 'roulette', 'polycarbonate', 'bandouliere'
  ],
  'Beauté et Parfum': [
      'beaute', 'parfum', 'maquillage', 'soin', 'visage', 'creme', 'serum', 'lotion',
      'vernis', 'rouge', 'levres', 'fond', 'teint', 'mascara', 'shampoing', 'cheveux',
      'coloration', 'coiffure', 'accessoire', 'manucure', 'pedicure', 'epilateur',
      'rasoir', 'aftershave', 'eau de toilette', 'deodorant', 'anti-rides', 'solaire'
  ],
  'Bébés et Puériculture': [
      'bebe', 'enfant', 'puericulture', 'couche', 'poussette', 'biberon', 'chaise', 'siege',
      'auto', 'vetement', 'repas', 'allaitement', 'baignoire', 'lange', 'lingette', 'toise',
      'doudou', 'parc', 'lit', 'jouet', 'eveil', 'securite', 'surveillance', 'tetine',
      'poussette', 'porte-bebe', 'echarpe', 'sterilisateur', 'mouche-bebe'
  ],
  'Cuisine': [
      'casserole', 'poele', 'ustensile', 'assiette', 'verre', 'couvert', 'robot',
      'mixeur', 'blender', 'four', 'micro onde', 'cafetiere', 'bouilloire', 'plat',
      'cuisine', 'culinaire', 'batterie', 'cocotte', 'marmite', 'passoire'
  ],
  'Décoration': [
      'decoration', 'deco', 'cadre', 'miroir', 'vase', 'bougie', 'horloge', 'tapis',
      'coussin', 'rideau', 'store', 'sticker', 'poster', 'tableau', 'statue',
      'photophore', 'paillasson', 'panneau', 'tenture', 'bibelot'
  ],
  'Électroménager': [
      'electromenager', 'refrigerateur', 'frigo', 'lave', 'vaisselle', 'linge',
      'seche', 'cuisiniere', 'congelateur', 'aspirateur', 'robot', 'climatiseur',
      'ventilateur', 'micro ondes', 'plaque', 'hotte', 'four'
  ],
  'Électronique et Informatique': [
      'ordinateur', 'pc', 'portable', 'tablette', 'smartphone', 'telephone', 'ecran',
      'moniteur', 'clavier', 'souris', 'casque', 'enceinte', 'imprimante', 'scanner',
      'webcam', 'microphone', 'disque', 'memoire', 'ram', 'processeur', 'carte graphique',
      'stockage', 'accessoire', 'cable', 'chargeur', 'batterie', 'reseau', 'routeur',
      'modem', 'switch', 'connectique', 'adaptateur', 'hub', 'usb', 'hdmi', 'bluetooth'
  ],
  'Épicerie et Alimentation': [
      'nourriture', 'aliment', 'epicerie', 'boisson', 'the', 'cafe', 'infusion', 'snack',
      'conserve', 'pate', 'riz', 'cereale', 'chocolat', 'bonbon', 'confiserie', 'huile',
      'vinaigre', 'epice', 'condiment', 'farine', 'sucre', 'sel', 'bio', 'vegan',
      'vegetarien', 'sans gluten', 'lactose', 'dietetique'
  ],
  'Films et Séries TV': [
      'film', 'serie', 'dvd', 'blu-ray', 'bluray', 'coffret', 'edition', 'collector',
      'limitee', 'integrale', 'saison', 'episode', 'box', 'set', 'cinema', 'television',
      'documentaire', 'animation', 'comedie', 'action', 'thriller', 'horreur', 'fantastique'
  ],
  'Fournitures de Bureau': [
      'papier', 'stylo', 'crayon', 'feutre', 'marqueur', 'surligneur', 'gomme', 'taille-crayon',
      'classeur', 'chemise', 'dossier', 'reliure', 'agenda', 'cahier', 'bloc', 'post-it',
      'trombonne', 'agrafe', 'ciseaux', 'calculatrice', 'ruban', 'adhesif', 'etiquette',
      'pince', 'perforateur', 'agrafeuse'
  ],
  'Instruments de Musique': [
      'instrument', 'musique', 'guitare', 'piano', 'clavier', 'batterie', 'percussion',
      'violon', 'flute', 'saxophone', 'trompette', 'harmonica', 'micro', 'ampli',
      'amplificateur', 'pedales', 'effet', 'accessoire', 'cable', 'mediator', 'accordeur',
      'metronome', 'pupitre', 'partition', 'corde', 'anche', 'archet'
  ],
  'Jardin': [
      'jardin', 'plante', 'jardinage', 'exterieur', 'terrasse', 'balcon', 'outil',
      'tondeuse', 'arrosage', 'pelle', 'rateau', 'taille', 'haie', 'barbecue',
      'parasol', 'salon jardin', 'serre', 'pot', 'semence', 'graines'
  ],
  'Jeux Vidéo et Consoles': [
      'jeu', 'video', 'console', 'manette', 'accessoire', 'playstation', 'xbox',
      'nintendo', 'switch', 'pc', 'gamer', 'gaming', 'arcade', 'simulation',
      'action', 'aventure', 'rpg', 'sport', 'course', 'combat', 'plateforme',
      'strategie', 'fps', 'mmorpg', 'vr', 'realite virtuelle', 'casque'
  ],
  'Jouets et Jeux': [
      'jouet', 'jeu', 'puzzle', 'peluche', 'poupee', 'figurine', 'construction',
      'lego', 'playmobil', 'educatif', 'eveil', 'exterieur', 'plein air', 'voiture',
      'telecommande', 'drone', 'societe', 'carte', 'plateau', 'echec', 'dessin',
      'peinture', 'modelisme', 'maquette', 'deguisement'
  ],
  'Literie': [
      'lit', 'matelas', 'sommier', 'drap', 'couette', 'oreiller', 'couverture',
      'housse', 'traversin', 'taie', 'alese', 'surmatelas', 'couvre lit', 'plaid',
      'edredon', 'duvet', 'protege matelas'
  ],
  'Logiciels': [
      'logiciel', 'software', 'programme', 'application', 'suite', 'antivirus',
      'securite', 'bureautique', 'word', 'excel', 'office', 'windows', 'macos',
      'adobe', 'photoshop', 'illustrator', 'indesign', 'premiere', 'montage',
      'video', 'audio', 'retouche', 'licence', 'abonnement', 'telechargement'
  ],
  'Luminaire': [
      'lampe', 'luminaire', 'eclairage', 'lumiere', 'applique', 'plafonnier', 'ampoule',
      'suspension', 'spot', 'lustre', 'lampadaire', 'veilleuse', 'guirlande', 'led',
      'lanterne', 'abat jour', 'halogene'
  ],
  'Maison': [
      'maison', 'interieur', 'amenagement', 'accessoire', 'organisation',
      'rangement', 'stockage', 'boite', 'panier', 'cintre', 'sac', 'housse',
      'decoration', 'textile', 'tapis', 'rideau', 'linge'
  ],
  'Mobilier': [
      'meuble', 'table', 'chaise', 'bureau', 'lit', 'canape', 'fauteuil', 'armoire',
      'commode', 'etagere', 'bibliotheque', 'tabouret', 'banc', 'buffet', 'vitrine',
      'console', 'secretaire', 'rangement', 'tiroir', 'meuble tv', 'penderie'
  ],
  'Mode et Vêtements': [
      'vetement', 'habillement', 'mode', 'homme', 'femme', 'enfant', 'tshirt',
      'chemise', 'pantalon', 'jean', 'robe', 'jupe', 'manteau', 'veste', 'blouson',
      'pull', 'sweat', 'gilet', 'sous-vetement', 'chaussette', 'collant',
      'pyjama', 'maillot', 'bain', 'echarpe', 'bonnet', 'gant'
  ],
  'Bijoux et Accessoires': [
      'bijou', 'montre', 'bracelet', 'collier', 'bague', 'boucle', 'oreille',
      'pendentif', 'chaine', 'jonc', 'gourmette', 'diamant', 'or', 'argent',
      'plaque', 'perle', 'swarovski', 'cristal', 'acier', 'titane', 'cuir'
  ],
  'Chaussures': [
      'chaussure', 'basket', 'sneaker', 'botte', 'bottine', 'escarpin', 'mocassin',
      'sandale', 'ballerine', 'derby', 'richelieu', 'slip-on', 'tong', 'mule',
      'sabot', 'semelle', 'lacet', 'talon', 'compense', 'plateforme', 'sport'
  ],
  'Musique et CD': [
      'musique', 'cd', 'vinyle', 'album', 'single', 'compilation', 'coffret',
      'edition', 'limitee', 'collector', 'box', 'set', 'pop', 'rock', 'metal',
      'jazz', 'classique', 'rap', 'hip-hop', 'electro', 'blues', 'reggae',
      'folk', 'country', 'world', 'bande originale', 'soundtrack'
  ],
  'Outils et Bricolage': [
      'outil', 'bricolage', 'tournevis', 'marteau', 'perceuse', 'visseuse', 'scie',
      'ponceuse', 'meuleuse', 'cle', 'pince', 'niveau', 'metre', 'equerre', 'etabli',
      'compresseur', 'visserie', 'clouterie', 'quincaillerie', 'fixation', 'joint',
      'menuiserie', 'plomberie', 'electricite', 'peinture', 'papier peint'
  ],
  'Produits Ménagers': [
      'nettoyage', 'entretien', 'menager', 'savon', 'lessive', 'detergent', 'desinfectant',
      'aspirateur', 'balai', 'serpillere', 'chiffon', 'produit', 'vaisselle', 'rangement',
      'nettoyant', 'desodorisant', 'antipoussiere', 'brosse', 'eponge', 'vitre', 'sol'
  ],
  'Quincaillerie': [
      'outil', 'bricolage', 'vis', 'clou', 'perceuse', 'tournevis', 'marteau',
      'pince', 'scie', 'ponceuse', 'peinture', 'colle', 'echelle', 'escabeau',
      'rangement', 'boite', 'caisse', 'etabli', 'accessoire'
  ],
  'Salle de bain': [
      'bain', 'douche', 'lavabo', 'robinet', 'toilette', 'wc', 'serviette',
      'tapis bain', 'armoire toilette', 'brosse dent', 'savon', 'salle eau',
      'sanitaire', 'baignoire', 'vasque', 'miroir', 'porte serviette'
  ],
  'Santé et Soins personnels': [
      'sante', 'soin', 'personnel', 'hygiene', 'medicament', 'vitamine', 'complement',
      'alimentaire', 'parapharmacie', 'brosse', 'dent', 'dentifrice', 'savon',
      'gel', 'douche', 'shampooing', 'deodorant', 'rasoir', 'mousse', 'creme',
      'hydratant', 'serum', 'masque', 'lotion', 'tonique', 'bain', 'huile'
  ],
  'Sports et Plein air': [
      'sport', 'plein air', 'fitness', 'musculation', 'velo', 'course', 'running',
      'natation', 'randonnee', 'camping', 'peche', 'chasse', 'ski', 'snowboard',
      'tennis', 'football', 'basketball', 'rugby', 'golf', 'equitation', 'yoga',
      'pilates', 'crossfit', 'accessoire', 'equipement', 'tenue', 'chaussure'
  ]
};

function cleanText(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlève les accents
    .replace(/[^\w\s]/g, ' ')                         // Garde uniquement lettres, chiffres et espaces
    .replace(/\s+/g, ' ')                             // Normalise les espaces
    .trim();
}

function extractPageContent() {
  const selectors = {
    title: '#productTitle',
    breadcrumbs: '#wayfinding-breadcrumbs_feature_div li',
    description: '#productDescription',
    bulletPoints: '#feature-bullets li',
    details: '#detailBullets_feature_div li'
  };

  return Object.entries(selectors).reduce((content, [key, selector]) => {
    const elements = document.querySelectorAll(selector);
    const text = Array.from(elements)
      .map(el => el.textContent)
      .join(' ');
    return `${content} ${text}`;
  }, '');
}

export function classifyPage() {
  const pageContent = cleanText(extractPageContent());
  
  // Calculer un score pour chaque catégorie
  const scores = Object.entries(categoryKeywords).map(([category, keywords]) => {
    const score = keywords.reduce((count, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      return count + (pageContent.match(regex) || []).length;
    }, 0);
    return { category, score };
  });

  // Trier par score et prendre la meilleure correspondance
  const bestMatch = scores.reduce((max, curr) => 
    curr.score > max.score ? curr : max,
    { category: 'default', score: 0 }
  );

  console.log('Category scores:', scores);
  return bestMatch.score > 0 ? bestMatch.category : 'default';
}