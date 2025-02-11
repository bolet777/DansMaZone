// Liste de mots-clés par catégorie
const categoryKeywords = {
    'Animalerie': [
        'chat', 'chien', 'animal', 'animaux', 'nourriture', 'litière', 'croquettes', 'jouets', 'laisse',
        'aquarium', 'poisson', 'oiseau', 'hamster', 'rongeur', 'terrarium', 'gamelle', 'collier', 'harnais',
        'veterinaire', 'pet', 'cage', 'niche', 'panier', 'griffoir'
    ],
    'Produits Ménagers': [
        'nettoyage', 'entretien', 'menager', 'savon', 'lessive', 'detergent', 'desinfectant',
        'aspirateur', 'balai', 'serpillere', 'chiffon', 'produit', 'vaisselle', 'rangement',
        'nettoyant', 'desodorisant', 'antipoussiere', 'brosse', 'eponge', 'vitre', 'sol'
    ],
    'Mobilier': [
        'meuble', 'table', 'chaise', 'bureau', 'lit', 'canape', 'fauteuil', 'armoire',
        'commode', 'etagere', 'bibliotheque', 'tabouret', 'banc', 'buffet', 'vitrine',
        'console', 'secretaire', 'rangement', 'tiroir', 'meuble tv', 'penderie'
    ],
    'Luminaire': [
        'lampe', 'luminaire', 'eclairage', 'lumiere', 'applique', 'plafonnier', 'ampoule',
        'suspension', 'spot', 'lustre', 'lampadaire', 'veilleuse', 'guirlande', 'led',
        'lanterne', 'abat jour', 'halogene'
    ],
    'Literie': [
        'lit', 'matelas', 'sommier', 'drap', 'couette', 'oreiller', 'couverture',
        'housse', 'traversin', 'taie', 'alese', 'surmatelas', 'couvre lit', 'plaid',
        'edredon', 'duvet', 'protege matelas'
    ],
    'Cuisine': [
        'casserole', 'poele', 'ustensile', 'assiette', 'verre', 'couvert', 'robot',
        'mixeur', 'blender', 'four', 'micro onde', 'cafetiere', 'bouilloire', 'plat',
        'cuisine', 'culinaire', 'batterie', 'cocotte', 'marmite', 'passoire'
    ],
    'Jardin': [
        'jardin', 'plante', 'jardinage', 'exterieur', 'terrasse', 'balcon', 'outil',
        'tondeuse', 'arrosage', 'pelle', 'rateau', 'taille', 'haie', 'barbecue',
        'parasol', 'salon jardin', 'serre', 'pot', 'semence', 'graines'
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
    'Salle de bain': [
        'bain', 'douche', 'lavabo', 'robinet', 'toilette', 'wc', 'serviette',
        'tapis bain', 'armoire toilette', 'brosse dent', 'savon', 'salle eau',
        'sanitaire', 'baignoire', 'vasque', 'miroir', 'porte serviette'
    ],
    'Quincaillerie': [
        'outil', 'bricolage', 'vis', 'clou', 'perceuse', 'tournevis', 'marteau',
        'pince', 'scie', 'ponceuse', 'peinture', 'colle', 'echelle', 'escabeau',
        'rangement', 'boite', 'caisse', 'etabli', 'accessoire'
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