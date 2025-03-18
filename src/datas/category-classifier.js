import browser from 'webextension-polyfill';

// Liste de mots-clés par catégorie - version bilingue
export const categoryKeywords = {
  'Animalerie': [
    // Français
    'chat', 'chien', 'animal', 'animaux', 'nourriture', 'litière', 'croquettes', 'jouets', 'laisse',
    'aquarium', 'poisson', 'oiseau', 'hamster', 'rongeur', 'terrarium', 'gamelle', 'collier', 'harnais',
    'veterinaire', 'pet', 'cage', 'niche', 'panier', 'griffoir',
    // Anglais
    'cat', 'dog', 'pet', 'pets', 'food', 'litter', 'kibble', 'toys', 'leash',
    'aquarium', 'fish', 'bird', 'hamster', 'rodent', 'terrarium', 'bowl', 'collar', 'harness',
    'veterinary', 'cage', 'kennel', 'bed', 'scratcher'
  ],
  'Auto et Moto': [
    // Français
    'voiture', 'auto', 'automobile', 'moto', 'scooter', 'vehicule', 'pieces', 'accessoires',
    'entretien', 'nettoyage', 'pneu', 'batterie', 'huile', 'moteur', 'phare', 'frein',
    'autoradio', 'gps', 'casque', 'siege', 'enjoliveur', 'essuie-glace', 'outillage', 'carenage',
    // Anglais
    'car', 'automotive', 'motorcycle', 'scooter', 'vehicle', 'parts', 'accessories',
    'maintenance', 'cleaning', 'tire', 'battery', 'oil', 'engine', 'headlight', 'brake',
    'stereo', 'gps', 'helmet', 'seat', 'hubcap', 'wiper', 'tools', 'fairing'
  ],
  'Bagages et Voyage': [
    // Français
    'valise', 'bagage', 'sac', 'voyage', 'trolley', 'cabine', 'soute', 'etiquette',
    'passeport', 'trousse', 'accessoires', 'organiseur', 'adaptateur', 'oreiller',
    'masque', 'bouchon', 'transport', 'roulette', 'polycarbonate', 'bandouliere',
    // Anglais
    'suitcase', 'luggage', 'bag', 'travel', 'trolley', 'cabin', 'hold', 'tag',
    'passport', 'kit', 'accessories', 'organizer', 'adapter', 'pillow',
    'mask', 'plug', 'transport', 'wheels', 'polycarbonate', 'strap'
  ],
  'Beauté et Parfum': [
    // Français
    'beaute', 'parfum', 'maquillage', 'soin', 'visage', 'creme', 'serum', 'lotion',
    'vernis', 'rouge', 'levres', 'fond', 'teint', 'mascara', 'shampoing', 'cheveux',
    'coloration', 'coiffure', 'accessoire', 'manucure', 'pedicure', 'epilateur',
    'rasoir', 'aftershave', 'eau de toilette', 'deodorant', 'anti-rides', 'solaire',
    // Anglais
    'beauty', 'perfume', 'makeup', 'care', 'face', 'cream', 'serum', 'lotion',
    'nail polish', 'lipstick', 'foundation', 'mascara', 'shampoo', 'hair',
    'color', 'hairstyle', 'accessory', 'manicure', 'pedicure', 'epilator',
    'razor', 'aftershave', 'cologne', 'deodorant', 'anti-wrinkle', 'sunscreen'
  ],
  'Bébés et Puériculture': [
    // Français
    'bebe', 'enfant', 'puericulture', 'couche', 'poussette', 'biberon', 'chaise', 'siege',
    'auto', 'vetement', 'repas', 'allaitement', 'baignoire', 'lange', 'lingette', 'toise',
    'doudou', 'parc', 'lit', 'jouet', 'eveil', 'securite', 'surveillance', 'tetine',
    'poussette', 'porte-bebe', 'echarpe', 'sterilisateur', 'mouche-bebe',
    // Anglais
    'baby', 'child', 'childcare', 'diaper', 'stroller', 'bottle', 'chair', 'seat',
    'auto', 'clothing', 'meal', 'breastfeeding', 'bathtub', 'cloth', 'wipe', 'measuring',
    'plush', 'playpen', 'crib', 'toy', 'development', 'safety', 'monitor', 'pacifier',
    'stroller', 'carrier', 'sling', 'sterilizer', 'nasal aspirator'
  ],
  'Cuisine': [
    // Français
    'casserole', 'poele', 'ustensile', 'assiette', 'verre', 'couvert', 'robot',
    'mixeur', 'blender', 'four', 'micro onde', 'cafetiere', 'bouilloire', 'plat',
    'cuisine', 'culinaire', 'batterie', 'cocotte', 'marmite', 'passoire',
    // Anglais
    'pot', 'pan', 'utensil', 'plate', 'glass', 'cutlery', 'robot',
    'mixer', 'blender', 'oven', 'microwave', 'coffee maker', 'kettle', 'dish',
    'kitchen', 'culinary', 'cookware', 'dutch oven', 'cooking pot', 'colander'
  ],
  'Décoration': [
    // Français
    'decoration', 'deco', 'cadre', 'miroir', 'vase', 'bougie', 'horloge', 'tapis',
    'coussin', 'rideau', 'store', 'sticker', 'poster', 'tableau', 'statue',
    'photophore', 'paillasson', 'panneau', 'tenture', 'bibelot',
    // Anglais
    'decoration', 'decor', 'frame', 'mirror', 'vase', 'candle', 'clock', 'rug',
    'cushion', 'curtain', 'blind', 'sticker', 'poster', 'painting', 'statue',
    'candle holder', 'doormat', 'sign', 'tapestry', 'ornament'
  ],
  'Électroménager': [
    // Français
    'electromenager', 'refrigerateur', 'frigo', 'lave', 'vaisselle', 'linge',
    'seche', 'cuisiniere', 'congelateur', 'aspirateur', 'robot', 'climatiseur',
    'ventilateur', 'micro ondes', 'plaque', 'hotte', 'four',
    // Anglais
    'appliance', 'refrigerator', 'fridge', 'dishwasher', 'washing machine',
    'dryer', 'stove', 'freezer', 'vacuum', 'robot', 'air conditioner',
    'fan', 'microwave', 'cooktop', 'hood', 'oven'
  ],
  'Électronique et Informatique': [
    // Français
    'ordinateur', 'pc', 'portable', 'tablette', 'smartphone', 'telephone', 'ecran',
    'moniteur', 'clavier', 'souris', 'casque', 'enceinte', 'imprimante', 'scanner',
    'webcam', 'microphone', 'disque', 'memoire', 'ram', 'processeur', 'carte graphique',
    'stockage', 'accessoire', 'cable', 'chargeur', 'batterie', 'reseau', 'routeur',
    'modem', 'switch', 'connectique', 'adaptateur', 'hub', 'usb', 'hdmi', 'bluetooth',
    // Anglais
    'computer', 'pc', 'laptop', 'tablet', 'smartphone', 'phone', 'screen',
    'monitor', 'keyboard', 'mouse', 'headset', 'speaker', 'printer', 'scanner',
    'webcam', 'microphone', 'disk', 'memory', 'ram', 'processor', 'graphics card',
    'storage', 'accessory', 'cable', 'charger', 'battery', 'network', 'router',
    'modem', 'switch', 'connectivity', 'adapter', 'hub', 'usb', 'hdmi', 'bluetooth'
  ],
  'Épicerie et Alimentation': [
    // Français
    'nourriture', 'aliment', 'epicerie', 'boisson', 'the', 'cafe', 'infusion', 'snack',
    'conserve', 'pate', 'riz', 'cereale', 'chocolat', 'bonbon', 'confiserie', 'huile',
    'vinaigre', 'epice', 'condiment', 'farine', 'sucre', 'sel', 'bio', 'vegan',
    'vegetarien', 'sans gluten', 'lactose', 'dietetique',
    // Anglais
    'food', 'grocery', 'beverage', 'tea', 'coffee', 'infusion', 'snack',
    'canned', 'pasta', 'rice', 'cereal', 'chocolate', 'candy', 'confectionery', 'oil',
    'vinegar', 'spice', 'condiment', 'flour', 'sugar', 'salt', 'organic', 'vegan',
    'vegetarian', 'gluten free', 'lactose', 'diet'
  ],
  'Films et Séries TV': [
    // Français
    'film', 'serie', 'dvd', 'blu-ray', 'bluray', 'coffret', 'edition', 'collector',
    'limitee', 'integrale', 'saison', 'episode', 'box', 'set', 'cinema', 'television',
    'documentaire', 'animation', 'comedie', 'action', 'thriller', 'horreur', 'fantastique',
    // Anglais
    'movie', 'series', 'dvd', 'blu-ray', 'bluray', 'box set', 'edition', 'collector',
    'limited', 'complete', 'season', 'episode', 'box', 'set', 'cinema', 'television',
    'documentary', 'animation', 'comedy', 'action', 'thriller', 'horror', 'fantasy'
  ],
  'Fournitures de Bureau': [
    // Français
    'papier', 'stylo', 'crayon', 'feutre', 'marqueur', 'surligneur', 'gomme', 'taille-crayon',
    'classeur', 'chemise', 'dossier', 'reliure', 'agenda', 'cahier', 'bloc', 'post-it',
    'trombonne', 'agrafe', 'ciseaux', 'calculatrice', 'ruban', 'adhesif', 'etiquette',
    'pince', 'perforateur', 'agrafeuse',
    // Anglais
    'paper', 'pen', 'pencil', 'marker', 'highlighter', 'eraser', 'sharpener',
    'binder', 'folder', 'binding', 'agenda', 'notebook', 'pad', 'post-it',
    'paperclip', 'staple', 'scissors', 'calculator', 'tape', 'adhesive', 'label',
    'clip', 'hole punch', 'stapler'
  ],
  'Instruments de Musique': [
    // Français
    'instrument', 'musique', 'guitare', 'piano', 'clavier', 'batterie', 'percussion',
    'violon', 'flute', 'saxophone', 'trompette', 'harmonica', 'micro', 'ampli',
    'amplificateur', 'pedales', 'effet', 'accessoire', 'cable', 'mediator', 'accordeur',
    'metronome', 'pupitre', 'partition', 'corde', 'anche', 'archet',
    // Anglais
    'instrument', 'music', 'guitar', 'piano', 'keyboard', 'drums', 'percussion',
    'violin', 'flute', 'saxophone', 'trumpet', 'harmonica', 'microphone', 'amp',
    'amplifier', 'pedals', 'effect', 'accessory', 'cable', 'pick', 'tuner',
    'metronome', 'stand', 'sheet music', 'string', 'reed', 'bow'
  ],
  'Jardin': [
    // Français
    'jardin', 'plante', 'jardinage', 'exterieur', 'terrasse', 'balcon', 'outil',
    'tondeuse', 'arrosage', 'pelle', 'rateau', 'taille', 'haie', 'barbecue',
    'parasol', 'salon jardin', 'serre', 'pot', 'semence', 'graines',
    // Anglais
    'garden', 'plant', 'gardening', 'outdoor', 'patio', 'balcony', 'tool',
    'lawn mower', 'watering', 'shovel', 'rake', 'trim', 'hedge', 'barbecue',
    'umbrella', 'garden furniture', 'greenhouse', 'pot', 'seed', 'seeds'
  ],
  'Jeux Vidéo et Consoles': [
    // Français
    'jeu', 'video', 'console', 'manette', 'accessoire', 'playstation', 'xbox',
    'nintendo', 'switch', 'pc', 'gamer', 'gaming', 'arcade', 'simulation',
    'action', 'aventure', 'rpg', 'sport', 'course', 'combat', 'plateforme',
    'strategie', 'fps', 'mmorpg', 'vr', 'realite virtuelle', 'casque',
    // Anglais
    'game', 'video', 'console', 'controller', 'accessory', 'playstation', 'xbox',
    'nintendo', 'switch', 'pc', 'gamer', 'gaming', 'arcade', 'simulation',
    'action', 'adventure', 'rpg', 'sports', 'racing', 'fighting', 'platform',
    'strategy', 'fps', 'mmorpg', 'vr', 'virtual reality', 'headset'
  ],
  'Jouets et Jeux': [
    // Français
    'jouet', 'jeu', 'puzzle', 'peluche', 'poupee', 'figurine', 'construction',
    'lego', 'playmobil', 'educatif', 'eveil', 'exterieur', 'plein air', 'voiture',
    'telecommande', 'drone', 'societe', 'carte', 'plateau', 'echec', 'dessin',
    'peinture', 'modelisme', 'maquette', 'deguisement',
    // Anglais
    'toy', 'game', 'puzzle', 'plush', 'doll', 'figure', 'building',
    'lego', 'playmobil', 'educational', 'development', 'outdoor', 'car',
    'remote control', 'drone', 'board game', 'card', 'chess', 'drawing',
    'paint', 'modeling', 'model', 'costume'
  ],
  'Literie': [
    // Français
    'lit', 'matelas', 'sommier', 'drap', 'couette', 'oreiller', 'couverture',
    'housse', 'traversin', 'taie', 'alese', 'surmatelas', 'couvre lit', 'plaid',
    'edredon', 'duvet', 'protege matelas',
    // Anglais
    'bed', 'mattress', 'box spring', 'sheet', 'duvet', 'pillow', 'blanket',
    'cover', 'bolster', 'pillowcase', 'pad', 'topper', 'bedspread', 'throw',
    'quilt', 'comforter', 'protector'
  ],
  'Logiciels': [
    // Français
    'logiciel', 'software', 'programme', 'application', 'suite', 'antivirus',
    'securite', 'bureautique', 'word', 'excel', 'office', 'windows', 'macos',
    'adobe', 'photoshop', 'illustrator', 'indesign', 'premiere', 'montage',
    'video', 'audio', 'retouche', 'licence', 'abonnement', 'telechargement',
    // Anglais
    'software', 'program', 'application', 'suite', 'antivirus',
    'security', 'office', 'word', 'excel', 'windows', 'macos',
    'adobe', 'photoshop', 'illustrator', 'indesign', 'premiere', 'editing',
    'video', 'audio', 'retouch', 'license', 'subscription', 'download'
  ],
  'Luminaire': [
    // Français
    'lampe', 'luminaire', 'eclairage', 'lumiere', 'applique', 'plafonnier', 'ampoule',
    'suspension', 'spot', 'lustre', 'lampadaire', 'veilleuse', 'guirlande', 'led',
    'lanterne', 'abat jour', 'halogene',
    // Anglais
    'lamp', 'light', 'lighting', 'fixture', 'sconce', 'ceiling light', 'bulb',
    'pendant', 'spotlight', 'chandelier', 'floor lamp', 'night light', 'string lights', 'led',
    'lantern', 'lampshade', 'halogen'
  ],
  'Maison': [
    // Français
    'maison', 'interieur', 'amenagement', 'accessoire', 'organisation',
    'rangement', 'stockage', 'boite', 'panier', 'cintre', 'sac', 'housse',
    'decoration', 'textile', 'tapis', 'rideau', 'linge',
    // Anglais
    'home', 'interior', 'arrangement', 'accessory', 'organization',
    'storage', 'box', 'basket', 'hanger', 'bag', 'cover',
    'decoration', 'textile', 'rug', 'curtain', 'linen'
  ],
  'Mobilier': [
    // Français
    'meuble', 'table', 'chaise', 'bureau', 'lit', 'canape', 'fauteuil', 'armoire',
    'commode', 'etagere', 'bibliotheque', 'tabouret', 'banc', 'buffet', 'vitrine',
    'console', 'secretaire', 'rangement', 'tiroir', 'meuble tv', 'penderie',
    // Anglais
    'furniture', 'table', 'chair', 'desk', 'bed', 'sofa', 'couch', 'armchair', 'wardrobe',
    'dresser', 'shelf', 'bookcase', 'stool', 'bench', 'buffet', 'cabinet',
    'console', 'secretary', 'storage', 'drawer', 'tv stand', 'closet'
  ],
  'Mode et Vêtements': [
    // Français
    'vetement', 'habillement', 'mode', 'homme', 'femme', 'enfant', 'tshirt',
    'chemise', 'pantalon', 'jean', 'robe', 'jupe', 'manteau', 'veste', 'blouson',
    'pull', 'sweat', 'gilet', 'sous-vetement', 'chaussette', 'collant',
    'pyjama', 'maillot', 'bain', 'echarpe', 'bonnet', 'gant',
    // Anglais
    'clothing', 'fashion', 'men', 'women', 'child', 'tshirt',
    'shirt', 'pants', 'jeans', 'dress', 'skirt', 'coat', 'jacket',
    'sweater', 'sweatshirt', 'cardigan', 'underwear', 'sock', 'tights',
    'pajamas', 'swimsuit', 'swimming', 'scarf', 'hat', 'glove'
  ],
  'Bijoux et Accessoires': [
    // Français
    'bijou', 'montre', 'bracelet', 'collier', 'bague', 'boucle', 'oreille',
    'pendentif', 'chaine', 'jonc', 'gourmette', 'diamant', 'or', 'argent',
    'plaque', 'perle', 'swarovski', 'cristal', 'acier', 'titane', 'cuir',
    // Anglais
    'jewelry', 'watch', 'bracelet', 'necklace', 'ring', 'earring',
    'pendant', 'chain', 'bangle', 'id bracelet', 'diamond', 'gold', 'silver',
    'plated', 'pearl', 'swarovski', 'crystal', 'steel', 'titanium', 'leather'
  ],
  'Chaussures': [
    // Français
    'chaussure', 'basket', 'sneaker', 'botte', 'bottine', 'escarpin', 'mocassin',
    'sandale', 'ballerine', 'derby', 'richelieu', 'slip-on', 'tong', 'mule',
    'sabot', 'semelle', 'lacet', 'talon', 'compense', 'plateforme', 'sport',
    // Anglais
    'shoe', 'sneaker', 'boot', 'pump', 'loafer',
    'sandal', 'ballet flat', 'derby', 'oxford', 'slip-on', 'flip-flop', 'mule',
    'clog', 'insole', 'lace', 'heel', 'wedge', 'platform', 'sport'
  ],
  'Musique et CD': [
    // Français
    'musique', 'cd', 'vinyle', 'album', 'single', 'compilation', 'coffret',
    'edition', 'limitee', 'collector', 'box', 'set', 'pop', 'rock', 'metal',
    'jazz', 'classique', 'rap', 'hip-hop', 'electro', 'blues', 'reggae',
    'folk', 'country', 'world', 'bande originale', 'soundtrack',
    // Anglais
    'music', 'cd', 'vinyl', 'album', 'single', 'compilation', 'box set',
    'edition', 'limited', 'collector', 'box', 'set', 'pop', 'rock', 'metal',
    'jazz', 'classical', 'rap', 'hip-hop', 'electronic', 'blues', 'reggae',
    'folk', 'country', 'world', 'original soundtrack', 'soundtrack'
  ],
  'Outils et Bricolage': [
    // Français
    'outil', 'bricolage', 'tournevis', 'marteau', 'perceuse', 'visseuse', 'scie',
    'ponceuse', 'meuleuse', 'cle', 'pince', 'niveau', 'metre', 'equerre', 'etabli',
    'compresseur', 'visserie', 'clouterie', 'quincaillerie', 'fixation', 'joint',
    'menuiserie', 'plomberie', 'electricite', 'peinture', 'papier peint',
    // Anglais
    'tool', 'diy', 'screwdriver', 'hammer', 'drill', 'driver', 'saw',
    'sander', 'grinder', 'wrench', 'pliers', 'level', 'tape measure', 'square', 'workbench',
    'compressor', 'screws', 'nails', 'hardware', 'fastener', 'seal',
    'carpentry', 'plumbing', 'electrical', 'paint', 'wallpaper'
  ],
  'Produits Ménagers': [
    // Français
    'nettoyage', 'entretien', 'menager', 'savon', 'lessive', 'detergent', 'desinfectant',
    'aspirateur', 'balai', 'serpillere', 'chiffon', 'produit', 'vaisselle', 'rangement',
    'nettoyant', 'desodorisant', 'antipoussiere', 'brosse', 'eponge', 'vitre', 'sol',
    // Anglais
    'cleaning', 'maintenance', 'household', 'soap', 'laundry', 'detergent', 'disinfectant',
    'vacuum', 'broom', 'mop', 'cloth', 'product', 'dishwashing', 'storage',
    'cleaner', 'deodorizer', 'duster', 'brush', 'sponge', 'window', 'floor'
  ],
  'Photographie': [
    // Français 
    "appareil photo", "objectif", "boitier", "trépied", "capteur", "flash", "numérique", 
    "argentique", "hybride", "téléobjectif", "grandangle", "macro", "photographie", 
    "compact", "pellicule", "focale", "mise au point", "viseur", "exposition", 
    "obturateur", "diaphragme", "ouverture", "sac photo", "réflecteur", "filtre",
    
    // Anglais
    "camera", "dslr", "lens", "mirrorless", "telephoto", "stabilizer", 
    "photography", "fisheye", "viewfinder", "shutter", "aperture", 
    "iso", "camera bag", "lightroom", "photoshop", "monopod", "bracketing", 
    "hdr", "panorama", "timelapse", "megapixels", "lens hood", "prime lens", 
    "landscape", "portrait"
  ],
  'Quincaillerie': [
    // Français
    'outil', 'bricolage', 'vis', 'clou', 'perceuse', 'tournevis', 'marteau',
    'pince', 'scie', 'ponceuse', 'peinture', 'colle', 'echelle', 'escabeau',
    'rangement', 'boite', 'caisse', 'etabli', 'accessoire',
    // Anglais
    'tool', 'diy', 'screw', 'nail', 'drill', 'screwdriver', 'hammer',
    'pliers', 'saw', 'sander', 'paint', 'glue', 'ladder', 'step ladder',
    'storage', 'box', 'crate', 'workbench', 'accessory'
  ],
  'Salle de bain': [
    // Français
    'bain', 'douche', 'lavabo', 'robinet', 'toilette', 'wc', 'serviette',
    'tapis bain', 'armoire toilette', 'brosse dent', 'savon', 'salle eau',
    'sanitaire', 'baignoire', 'vasque', 'miroir', 'porte serviette',
    // Anglais
    'bath', 'shower', 'sink', 'faucet', 'tap', 'toilet', 'towel',
    'bath mat', 'medicine cabinet', 'toothbrush', 'soap', 'bathroom',
    'sanitary', 'bathtub', 'basin', 'mirror', 'towel rack'
  ],
  'Santé et Soins personnels': [
    // Français
    'sante', 'soin', 'personnel', 'hygiene', 'medicament', 'vitamine', 'complement',
    'alimentaire', 'parapharmacie', 'brosse', 'dent', 'dentifrice', 'savon',
    'gel', 'douche', 'shampooing', 'deodorant', 'rasoir', 'mousse', 'creme',
    'hydratant', 'serum', 'masque', 'lotion', 'tonique', 'bain', 'huile',
    // Anglais
    'health', 'care', 'personal', 'hygiene', 'medicine', 'vitamin', 'supplement',
    'dietary', 'pharmacy', 'brush', 'tooth', 'toothpaste', 'soap',
    'gel', 'shower', 'shampoo', 'deodorant', 'razor', 'foam', 'cream',
    'moisturizer', 'serum', 'mask', 'lotion', 'toner', 'bath', 'oil'
  ],
  'Sports et Plein air': [
    // Français
    'sport', 'plein air', 'fitness', 'musculation', 'velo', 'course', 'running',
    'natation', 'randonnee', 'camping', 'peche', 'chasse', 'ski', 'snowboard',
    'tennis', 'football', 'basketball', 'rugby', 'golf', 'equitation', 'yoga',
    'pilates', 'crossfit', 'accessoire', 'equipement', 'tenue', 'chaussure',
    // Anglais
    'sports', 'outdoors', 'fitness', 'bodybuilding', 'bike', 'run', 'running',
    'swimming', 'hiking', 'camping', 'fishing', 'hunting', 'ski', 'snowboard',
    'tennis', 'soccer', 'basketball', 'rugby', 'golf', 'horse riding', 'yoga',
    'pilates', 'crossfit', 'accessory', 'equipment', 'outfit', 'shoe'
  ],
  'Livres': [
    // Français
    'livre', 'roman', 'bande dessinee', 'bd', 'manga', 'biographie', 'autobiographie',
    'encyclopedie', 'dictionnaire', 'guide', 'recit', 'essai', 'nouvelle', 'conte',
    'poesie', 'revue', 'magazine', 'journal', 'album', 'partition', 'manuel', 'scolaire',
    // Anglais
    'book', 'novel', 'comic', 'comics', 'manga', 'biography', 'autobiography',
    'encyclopedia', 'dictionary', 'guide', 'story', 'essay', 'short story', 'tale',
    'poetry', 'magazine', 'journal', 'album', 'sheet music', 'textbook', 'educational'
  ]
};

// Correspondance entre catégories en français et anglais
export const categoryMapping = {
  'Animalerie': 'Pet Supplies',
  'Auto et Moto': 'Automotive',
  'Bagages et Voyage': 'Luggage & Travel',
  'Beauté et Parfum': 'Beauty & Fragrances',
  'Bébés et Puériculture': 'Baby & Childcare',
  'Cuisine': 'Kitchen',
  'Décoration': 'Home Decor',
  'Électroménager': 'Appliances',
  'Électronique et Informatique': 'Electronics & Computers',
  'Épicerie et Alimentation': 'Grocery & Food',
  'Films et Séries TV': 'Movies & TV Shows',
  'Fournitures de Bureau': 'Office Supplies',
  'Instruments de Musique': 'Musical Instruments',
  'Jardin': 'Garden',
  'Jeux Vidéo et Consoles': 'Video Games & Consoles',
  'Jouets et Jeux': 'Toys & Games',
  'Literie': 'Bedding',
  'Logiciels': 'Software',
  'Luminaire': 'Lighting',
  'Maison': 'Home',
  'Mobilier': 'Furniture',
  'Mode et Vêtements': 'Clothing & Fashion',
  'Bijoux et Accessoires': 'Jewelry & Accessories',
  'Chaussures': 'Shoes',
  'Musique et CD': 'Music & CDs',
  'Outils et Bricolage': 'Tools & DIY',
  'Produits Ménagers': 'Household Products',
  'Quincaillerie': 'Hardware',
  'Salle de bain': 'Bathroom',
  'Santé et Soins personnels': 'Health & Personal Care',
  'Sports et Plein air': 'Sports & Outdoors',
  'Livres': 'Books',
  'default': 'default'
};

// Détecter la langue de la page Amazon
export function detectLanguage() {
  // Basé sur l'URL Amazon.ca
  const url = window.location.href;
  
  // Vérifier si le site est en français (sur amazon.ca)
  if (url.includes('/dp/') || url.includes('/gp/')) {
    if (url.includes('/fr_CA/') || url.includes('language=fr_CA')) {
      return 'fr';
    }
  }
  
  // Basé sur les éléments HTML
  const htmlLang = document.documentElement.lang;
  if (htmlLang) {
    if (htmlLang.startsWith('fr')) {
      return 'fr';
    } else if (htmlLang.startsWith('en')) {
      return 'en';
    }
  }
  
  // Recherche d'éléments spécifiques à la version française
  const frenchElements = document.querySelectorAll('[data-language="fr_CA"], .nav-locale-fr');
  if (frenchElements && frenchElements.length > 0) {
    return 'fr';
  }
  
  // Par défaut, on suppose que c'est anglais pour Amazon.ca
  return 'en';
}

function cleanText(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlève les accents
    .replace(/[^\w\s]/g, ' ')                         // Garde uniquement lettres, chiffres et espaces
    .replace(/\s+/g, ' ')                             // Normalise les espaces
    .trim();
}

function extractPageContent() {
  // Sections spécifiques au produit, en ordre de priorité
  const prioritySections = {
    title: '#productTitle',
    brand: '.po-brand .po-break-word',
    category: '#wayfinding-breadcrumbs_feature_div li',
    aboutItem: '#feature-bullets .a-list-item', // Section "About this item"
    productInfo: '.po-break-word', // Caractéristiques du produit
    specTable: '.a-normal.a-spacing-micro tr' // Table des spécifications
  };

  return Object.entries(prioritySections).reduce((content, [key, selector]) => {
    const elements = document.querySelectorAll(selector);
    const text = Array.from(elements)
      .map(el => el.textContent.trim())
      .join(' ');
    return `${content} ${text}`;
  }, '');
}


/**
 * Extrait la catégorie de produit de manière robuste en utilisant plusieurs méthodes
 * @returns {string} La catégorie détectée ou 'Unknown'
 */
function getProductCategoryRobust() {
  // Approche 1: Par le fil d'Ariane avec plusieurs sélecteurs
  const breadcrumbSelectors = [
    '#wayfinding-breadcrumbs_feature_div li span.a-list-item',
    '.a-breadcrumb li span',
    '[id*="breadcrumb"] li',
    '.breadcrumb li',
    'nav[aria-label="Breadcrumb"] li',
    '[id*="SalesRank"] a',
    '#prodDetails .a-section a'
  ];
  
  // Tester chaque sélecteur jusqu'à ce qu'on en trouve un qui fonctionne
  for (const selector of breadcrumbSelectors) {
    const breadcrumbs = document.querySelectorAll(selector);
    if (breadcrumbs.length > 0) {
      const categories = Array.from(breadcrumbs)
        .map(item => item.textContent.trim())
        .filter(text => 
          text && 
          text !== '›' && 
          !text.includes('retour') &&
          !text.includes('Retour') &&
          !text.includes('Amazon') && 
          !text.includes('Prime')
        )
        .slice(0, 3); // Prendre jusqu'à 3 niveaux de catégories
      
      if (categories.length > 0) {
        const categoryPath = categories
          .join('/')
          .replace(/\s+/g, ' ')
          .replace(/[›\\/]+/g, '/')
          .replace(/^\W+|\W+$/g, '')
          .trim();
        
        // Termes spécifiques à chaque catégorie qui nécessitent une attribution directe
        const categorySpecificTerms = {
          'Électronique et Informatique': ['audio', 'casque', 'écouteur', 'amplificateur', 'dac', 'headphone', 'earphone', 'amplifier', 'ordinateur', 'pc', 'smartphone', 'tablette'],
          'Instruments de Musique': ['guitare', 'piano', 'batterie', 'violon', 'saxophone', 'trompette'],
          'Photographie': ['appareil photo', 'objectif', 'reflex', 'mirrorless', 'dslr', 'camera']
        };
        
        // Détecter si la catégorie contient des termes spécifiques
        let matchedCategory = null;
        
        for (const [category, terms] of Object.entries(categorySpecificTerms)) {
          const isMatch = terms.some(term => categoryPath.toLowerCase().includes(term));
          if (isMatch) {
            matchedCategory = category;
            console.log(`DansMaZone: Produit de type ${category} détecté dans le fil d'Ariane`);
            break;
          }
        }
        
        if (matchedCategory) {
          const originalPath = categoryPath;
          // Vérifie si la catégorie détectée n'est pas déjà incluse
          if (!categoryPath.toLowerCase().includes(matchedCategory.toLowerCase())) {
            categoryPath = matchedCategory + '/' + originalPath;
          }
        }
        
        console.log('DansMaZone: Catégorie trouvée via fil d\'Ariane:', categoryPath);
        return categoryPath;
      }
    }
  }
  
  // Approche 2: Par les métadonnées
  const metaSelectors = [
    'meta[name="keywords"]',
    'meta[property="product:category"]',
    'meta[property="og:product:category"]'
  ];
  
  for (const selector of metaSelectors) {
    const metaElement = document.querySelector(selector);
    if (metaElement && metaElement.content) {
      const metaContent = metaElement.content.split(',')[0].trim();
      if (metaContent) {
        console.log('DansMaZone: Catégorie trouvée via métadonnées:', metaContent);
        return metaContent;
      }
    }
  }
  
  // Approche 3: Par les données structurées JSON-LD
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script.textContent);
      // Rechercher différentes propriétés possibles de catégorie
      const category = data.category || 
                       data.itemListElement?.[0]?.item?.category ||
                       data.about?.category ||
                       data.offers?.category ||
                       data.brand?.category;
      
      if (category) {
        console.log('DansMaZone: Catégorie trouvée via JSON-LD:', category);
        return typeof category === 'string' ? category : category.name || JSON.stringify(category);
      }
    } catch (e) {
      // Ignorer les erreurs de parsing JSON
    }
  }
  
  // Approche 4: Par l'URL
  const urlPatterns = [
    /\/([^\/]+)\/dp\//,
    /\/([^\/]+)\/product\//,
    /\/gp\/product\/[^\/]+\/([^\/]+)\//
  ];
  
  for (const pattern of urlPatterns) {
    const urlMatch = window.location.pathname.match(pattern);
    if (urlMatch && urlMatch[1]) {
      const urlCategory = urlMatch[1].replace(/-/g, ' ');
      console.log('DansMaZone: Catégorie trouvée via URL:', urlCategory);
      return urlCategory;
    }
  }
  
  // Approche 5: Par les data-attributes
  const dataAttributeSelectors = [
    '[data-category]',
    '[data-department]',
    '[data-asin-category]'
  ];
  
  for (const selector of dataAttributeSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      for (const attr of ['data-category', 'data-department', 'data-asin-category']) {
        const value = element.getAttribute(attr);
        if (value) {
          console.log(`DansMaZone: Catégorie trouvée via ${attr}:`, value);
          return value;
        }
      }
    }
  }
  
  // Approche 6: Rechercher dans la section "Best Sellers Rank"
  const salesRankSelectors = [
    '#SalesRank',
    '#productDetails_detailBullets_sections1 th:contains("Best Sellers Rank"), #productDetails_detailBullets_sections1 th:contains("Classement des meilleures ventes")',
    '.a-section:contains("Best Sellers Rank"), .a-section:contains("Classement des meilleures ventes")'
  ];
  
  for (const selector of salesRankSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent;
      const rankMatch = text.match(/in ([^(]+)/);
      if (rankMatch && rankMatch[1]) {
        console.log('DansMaZone: Catégorie trouvée via Best Sellers Rank:', rankMatch[1].trim());
        return rankMatch[1].trim();
      }
    }
  }
  
  console.log('DansMaZone: Aucune catégorie trouvée, retour à Unknown');
  return 'Unknown';
}

/**
 * Trouve la catégorie connue la plus proche d'une chaîne de caractères
 * @param {string} categoryString - La chaîne de texte représentant la catégorie
 * @param {Object} knownCategories - Les catégories connues (soit combinedSites, soit categoryKeywords)
 * @returns {string} La catégorie connue correspondante ou 'default'
 */
function findNearestCategory(categoryString, knownCategories) {
  if (!categoryString || categoryString === 'Unknown') {
    return 'default';
  }
  
  // Conversion en minuscules pour comparaison insensible à la casse
  const lowercaseCategory = categoryString.toLowerCase();
  
  // 1. Rechercher une correspondance exacte
  for (const category in knownCategories) {
    if (category.toLowerCase() === lowercaseCategory) {
      console.log('DansMaZone: Correspondance exacte trouvée:', category);
      return category;
    }
  }
  
  // 2. Rechercher des correspondances partielles
  // D'abord essayer de trouver une catégorie qui est incluse dans la chaîne
  for (const category in knownCategories) {
    if (lowercaseCategory.includes(category.toLowerCase())) {
      console.log('DansMaZone: Catégorie incluse trouvée:', category);
      return category;
    }
  }
  
  // 3. Vérifier si la chaîne est incluse dans une catégorie
  for (const category in knownCategories) {
    if (category.toLowerCase().includes(lowercaseCategory)) {
      console.log('DansMaZone: Chaîne incluse dans catégorie:', category);
      return category;
    }
  }
  
  // 4. Rechercher des correspondances de mots (mots en commun) avec vérification sémantique
  const categoryWords = lowercaseCategory.split(/\s+/).filter(word => word.length > 2); // Ignorer les mots trop courts
  let bestCategory = 'default';
  let maxCategoryScore = 0;
  
  // Liste de mots à ignorer pour la correspondance car trop génériques
  const stopWords = ['et', 'and', 'the', 'les', 'des', 'de', 'la', 'le', 'un', 'une', 'a', 'an'];
  
  // Groupes de catégories similaires qui peuvent prêter à confusion
  const categoryGroups = {
    tech: ['Électronique et Informatique', 'Instruments de Musique', 'Jeux Vidéo et Consoles', 'Photographie'],
    beauty: ['Santé et Soins personnels', 'Beauté et Parfum', 'Bijoux et Accessoires'],
    home: ['Maison', 'Décoration', 'Mobilier', 'Literie', 'Cuisine', 'Luminaire'],
    clothing: ['Mode et Vêtements', 'Chaussures', 'Bijoux et Accessoires']
  };
  
  // Termes spécifiques à chaque catégorie qui aident à désambiguïser
  const categorySpecificTerms = {
    'Électronique et Informatique': {
      terms: ['ordinateur', 'pc', 'smartphone', 'tablette', 'audio', 'casque', 'écouteur', 'amplificateur'],
      matchBonus: 3
    },
    'Instruments de Musique': {
      terms: ['guitare', 'piano', 'batterie', 'violon', 'instrument'],
      matchBonus: 3
    },
    'Bijoux et Accessoires': {
      terms: ['bijou', 'montre', 'bracelet', 'collier', 'bague', 'or', 'argent', 'perle'],
      matchBonus: 3,
      required: ['bijou', 'bracelet', 'montre', 'collier']  // Au moins un de ces termes doit être présent
    }
  };
  
  // Déterminer si la chaîne contient des termes ambigus
  const hasAccessoireTerm = lowercaseCategory.includes('accessoire');
  const hasAudioTerm = lowercaseCategory.includes('audio') || 
                       lowercaseCategory.includes('écouteur') || 
                       lowercaseCategory.includes('headphone') || 
                       lowercaseCategory.includes('casque');
  
  // Trouver à quels groupes appartient chaque catégorie
  const getCategoryGroups = (category) => {
    return Object.entries(categoryGroups)
      .filter(([_, categories]) => categories.includes(category))
      .map(([group, _]) => group);
  };
  
  for (const category in knownCategories) {
    const categoryLowercase = category.toLowerCase();
    const knownCategoryWords = categoryLowercase.split(/\s+/).filter(word => !stopWords.includes(word));
    
    // Compter les mots en commun
    const commonWords = categoryWords.filter(word => 
      !stopWords.includes(word) && 
      knownCategoryWords.some(knownWord => knownWord.includes(word) || word.includes(knownWord))
    ).length;
    
    // Poids initial basé sur les mots communs
    let categoryScore = commonWords;
    
    // Vérifier les termes spécifiques à la catégorie
    const specificTerms = categorySpecificTerms[category];
    if (specificTerms) {
      // Vérifier si les termes spécifiques sont présents
      const hasSpecificTerms = specificTerms.terms.some(term => 
        lowercaseCategory.includes(term)
      );
      
      if (hasSpecificTerms) {
        categoryScore += specificTerms.matchBonus || 2;
      }
      
      // Vérifier si un terme requis est absent pour cette catégorie
      if (specificTerms.required && specificTerms.required.length > 0) {
        const hasRequiredTerm = specificTerms.required.some(term => 
          lowercaseCategory.includes(term)
        );
        
        if (!hasRequiredTerm) {
          categoryScore -= 2; // Pénalité si aucun terme requis n'est présent
        }
      }
    }
    
    // Désambiguïsation contextuelle pour les catégories qui peuvent se chevaucher
    if (hasAccessoireTerm) {
      // Si on parle d'accessoires et d'audio, favoriser l'électronique
      if (hasAudioTerm && category === 'Électronique et Informatique') {
        categoryScore += 3;
      }
      
      // Réduire la pertinence de "Bijoux et Accessoires" s'il n'y a pas de termes de bijouterie
      if (category === 'Bijoux et Accessoires' && !lowercaseCategory.includes('bijou') && 
          !lowercaseCategory.includes('montre') && !lowercaseCategory.includes('bracelet')) {
        categoryScore -= 1;
      }
    }
    
    // Trouver à quels groupes cette catégorie appartient
    const groups = getCategoryGroups(category);
    
    // Vérifier si la catégorie appartient à un groupe cohérent avec le contexte
    if (hasAudioTerm && groups.includes('tech')) {
      categoryScore += 1; // Petit bonus pour les catégories tech quand on parle d'audio
    }
    
    if (categoryScore > maxCategoryScore) {
      maxCategoryScore = categoryScore;
      bestCategory = category;
    }
  }
  
  if (maxCategoryScore > 0) {
    console.log('DansMaZone: Meilleure correspondance de mots:', bestCategory, 'avec score', maxCategoryScore);
    return bestCategory;
  }
  
  // 5. Rechercher dans les mappings de catégories
  // Vérifier si on a des correspondances dans le mapping français/anglais
  for (const [frCategory, enCategory] of Object.entries(categoryMapping)) {
    if (lowercaseCategory.includes(enCategory.toLowerCase())) {
      console.log('DansMaZone: Correspondance trouvée dans le mapping EN->FR:', frCategory);
      return frCategory;
    }
  }
  
  console.log('DansMaZone: Aucune correspondance trouvée, utilisation de default');
  return 'default';
}

// Fonction pour récupérer les mots-clés combinés avec gestion d'erreur améliorée
async function getCombinedKeywords() {
  try {
    // Récupérer les mots-clés personnalisés depuis le stockage
    const result = await browser.storage.local.get('userCategoryKeywords');
    const userKeywords = result.userCategoryKeywords || {};
    
    // Créer une copie des mots-clés par défaut
    const combinedKeywords = structuredClone(categoryKeywords);
    
    // Fusionner avec les mots-clés personnalisés
    Object.entries(userKeywords).forEach(([category, keywords]) => {
      if (!combinedKeywords[category]) {
        combinedKeywords[category] = [];
      }
      
      // Ajouter les mots-clés français et anglais
      if (keywords.fr && Array.isArray(keywords.fr)) {
        combinedKeywords[category] = [...combinedKeywords[category], ...keywords.fr];
      }
      if (keywords.en && Array.isArray(keywords.en)) {
        combinedKeywords[category] = [...combinedKeywords[category], ...keywords.en];
      }
    });
    
    return combinedKeywords;
  } catch (error) {
    console.error('DansMaZone: Erreur lors du chargement des mots-clés personnalisés', error);
    return categoryKeywords; // Fallback aux mots-clés par défaut
  }
}

// Obtenir la catégorie dans la langue demandée
export function getLocalizedCategory(category, targetLang = 'fr') {
  if (targetLang === 'en') {
    return categoryMapping[category] || category;
  }
  return category;
}

/**
 * Classifie la page produit Amazon en utilisant plusieurs approches
 * @returns {Promise<string>} La catégorie détectée
 */
export async function classifyPage(combinedSites) {
  try {
    // Obtenir les mots-clés combinés (par défaut + personnalisés)
    const combinedKeywords = await getCombinedKeywords();
    
    // 1. D'abord essayer par le fil d'Ariane et autres méthodes structurées
    const structuredCategory = getProductCategoryRobust();
    
    // 2. Essayer de trouver une correspondance directe avec la catégorie structurée
    if (structuredCategory !== 'Unknown') {
      const directMatch = findNearestCategory(structuredCategory, combinedKeywords);
      if (directMatch !== 'default') {
        console.log('DansMaZone: Catégorie trouvée directement:', directMatch);
        return directMatch;
      }
    }
    
    // 3. Analyser le contenu pour les mots-clés
    const pageContent = cleanText(extractPageContent());
    
    // Obtenir le nom du produit
    const productNameElement = document.getElementById('productTitle');
    const productName = productNameElement ? cleanText(productNameElement.textContent) : '';
    
    // Obtenir le fabricant/marque
    const brandElement = document.querySelector('.po-brand .po-break-word') || 
                          document.querySelector('#bylineInfo') ||
                          document.querySelector('[id*="brand"]');
    const brandName = brandElement ? cleanText(brandElement.textContent) : '';
    
    // Calculer un score pour chaque catégorie
    const scores = Object.entries(combinedKeywords).map(([category, keywords]) => {
      let score = 0;
      
      // Parcourir tous les mots-clés
      for (const keyword of keywords) {
        if (!keyword) continue; // Ignorer les mots-clés vides
        
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        
        // Chercher dans le contenu total
        const pageMatches = (pageContent.match(regex) || []).length;
        
        // Chercher dans le nom du produit (poids multiplié par 3)
        const productNameMatches = productName ? (productName.match(regex) || []).length * 3 : 0;
        
        // Chercher dans le nom de la marque (poids multiplié par 2)
        const brandMatches = brandName ? (brandName.match(regex) || []).length * 2 : 0;
        
        score += pageMatches + productNameMatches + brandMatches;
      }
      
      // Boost pour les catégories qui correspondent partiellement au structuredCategory
      if (structuredCategory !== 'Unknown') {
        if (structuredCategory.toLowerCase().includes(category.toLowerCase()) || 
            category.toLowerCase().includes(structuredCategory.toLowerCase())) {
          score += 3;
        }
      }
      
      return { category, score };
    });

    // Trier par score et prendre la meilleure correspondance
    const bestMatch = scores.reduce((max, curr) => 
      curr.score > max.score ? curr : max,
      { category: 'default', score: 0 }
    );

    console.log('DansMaZone: Scores des catégories:', scores);
    
    // Si le score est faible et qu'on a une catégorie structurée, essayer une approche hybride
    if (bestMatch.score < 2 && structuredCategory !== 'Unknown') {
      // Utiliser la catégorie du breadcrumb et essayer de trouver une correspondance
      const nearestCategory = findNearestCategory(structuredCategory, combinedKeywords);
      if (nearestCategory !== 'default') {
        console.log('DansMaZone: Score faible, utilisation de la catégorie structurée:', nearestCategory);
        return nearestCategory;
      }
    }
    
    // Détecter la langue et renvoyer la catégorie appropriée
    const lang = detectLanguage();
    if (lang === 'en' && bestMatch.score > 0) {
      // Convertir en anglais si nécessaire
      return categoryMapping[bestMatch.category] || bestMatch.category;
    }
    
    return bestMatch.score > 0 ? bestMatch.category : 'default';
  } catch (error) {
    console.error('DansMaZone: Error in classifyPage:', error);
    
    // Tentative de récupération en cas d'erreur
    try {
      const fallbackCategory = getProductCategoryRobust();
      if (fallbackCategory !== 'Unknown' && combinedSites) {
        const nearestCategory = findNearestCategory(fallbackCategory, combinedSites);
        if (nearestCategory !== 'default') {
          console.log('DansMaZone: Récupération d\'erreur avec catégorie:', nearestCategory);
          return nearestCategory;
        }
      }
    } catch (fallbackError) {
      console.error('DansMaZone: Erreur lors de la récupération:', fallbackError);
    }
    
    return 'default'; // Retourner la catégorie par défaut en cas d'erreur
  }
}
