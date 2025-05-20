import browser from 'webextension-polyfill';

// Liste de mots-clés par catégorie - version bilingue séparée par langue
export const categoryKeywords = {
  'Animalerie': {
    fr: [
      'chat', 'chien', 'animal', 'animaux', 'nourriture', 'litière', 'croquettes', 'jouets', 'laisse',
      'aquarium', 'poisson', 'oiseau', 'hamster', 'rongeur', 'terrarium', 'gamelle', 'collier', 'harnais',
      'veterinaire', 'pet', 'cage', 'niche', 'panier', 'griffoir', 'animalerie', 'toilettage', 'brosse',
      'antiparasitaire', 'vermifuge', 'clapier', 'volière', 'reptile', 'tortue', 'perroquet', 'perruche',
      'canne à pêche', 'hameçon', 'carpe', 'vêtement pour chien', 'manteau chien', 'friandise', 'santé animale',
      'pipette', 'puce', 'tique', 'vermifuge', 'soin dentaire', 'sac transport', 'coussin', 'grattoir',
      'écuelle', 'ratelier', 'foin', 'paille', 'copeaux', 'sciure', 'arbre à chat', 'chatière',
      'canne à pêche', 'caisse transport', 'muselière', 'longe', 'croquette', 'pâtée', 'complément alimentaire',
      'accessoire aquarium', 'pompe', 'filtre', 'oxygénateur', 'chauffage', 'éclairage', 'thermomètre',
      'sable aquarium', 'plante aquatique', 'décor aquarium', 'filet', 'épuisette', 'lapin', 'NAC', 'souris'
    ],
    en: [
      'cat', 'dog', 'pet', 'pets', 'food', 'litter', 'kibble', 'toys', 'leash',
      'aquarium', 'fish', 'bird', 'hamster', 'rodent', 'terrarium', 'bowl', 'collar', 'harness',
      'veterinary', 'cage', 'kennel', 'bed', 'scratcher', 'pet store', 'grooming', 'brush',
      'antiparasitic', 'dewormer', 'hutch', 'aviary', 'reptile', 'turtle', 'parrot', 'budgie',
      'fishing rod', 'hook', 'carp', 'dog clothing', 'dog coat', 'treat', 'pet health',
      'pipette', 'flea', 'tick', 'dental care', 'carrier bag', 'cushion', 'scratch post',
      'feeding bowl', 'hay rack', 'hay', 'straw', 'wood shavings', 'sawdust', 'cat tree', 'cat flap',
      'fishing pole', 'pet carrier', 'muzzle', 'lunge line', 'dry food', 'wet food', 'supplement',
      'aquarium accessory', 'pump', 'filter', 'oxygenator', 'heater', 'lighting', 'thermometer',
      'aquarium sand', 'aquatic plant', 'aquarium decoration', 'net', 'landing net', 'rabbit', 'exotic pet', 'mouse',
      'ferret', 'guinea pig', 'gerbil', 'cat litter box', 'scratching post', 'pet feeder', 'automatic feeder'
    ]
  },

  'Auto et Moto': {
    fr: [
      'voiture', 'auto', 'automobile', 'moto', 'scooter', 'vehicule', 'pieces', 'accessoires',
      'entretien', 'nettoyage', 'pneu', 'batterie', 'huile', 'moteur', 'phare', 'frein',
      'autoradio', 'gps', 'casque', 'siege', 'enjoliveur', 'essuie-glace', 'outillage', 'carenage',
      'carrosserie', 'embrayage', 'boite de vitesse', 'alternateur', 'démarreur', 'courroie', 'suspension',
      'amortisseur', 'échappement', 'silencieux', 'pot catalytique', 'radiateur', 'liquide de refroidissement',
      'liquide de frein', 'filtre à air', 'filtre à huile', 'filtre à carburant', 'filtre habitacle',
      'bougie', 'durite', 'joint', 'culasse', 'cylindre', 'piston', 'segment', 'vilebrequin', 'soupape',
      'turbo', 'injecteur', 'pompe à eau', 'pompe à carburant', 'pompe à huile', 'disque', 'plaquette',
      'etrier', 'maitre-cylindre', 'roulement', 'cardan', 'transmission', 'cardans', 'soufflet',
      'pare-brise', 'vitre', 'rétroviseur', 'antenne', 'capot', 'portière', 'aile', 'pare-choc',
      'calandre', 'jante', 'valve', 'barre de toit', 'attelage', 'remorque', 'coffre de toit'
    ],
    en: [
      'car', 'automotive', 'motorcycle', 'scooter', 'vehicle', 'parts', 'accessories',
      'maintenance', 'cleaning', 'tire', 'battery', 'oil', 'engine', 'headlight', 'brake',
      'stereo', 'gps', 'helmet', 'seat', 'hubcap', 'wiper', 'tools', 'fairing',
      'body', 'clutch', 'gearbox', 'alternator', 'starter', 'belt', 'suspension',
      'shock absorber', 'exhaust', 'muffler', 'catalytic converter', 'radiator', 'coolant',
      'brake fluid', 'air filter', 'oil filter', 'fuel filter', 'cabin filter',
      'spark plug', 'hose', 'gasket', 'cylinder head', 'cylinder', 'piston', 'piston ring', 'crankshaft', 'valve',
      'turbocharger', 'injector', 'water pump', 'fuel pump', 'oil pump', 'disc', 'pad',
      'caliper', 'master cylinder', 'bearing', 'drive shaft', 'transmission', 'CV joint', 'boot',
      'windshield', 'window', 'mirror', 'antenna', 'hood', 'door', 'fender', 'bumper',
      'grille', 'wheel rim', 'valve stem', 'roof rack', 'tow hitch', 'trailer', 'roof box',
      'spark plug', 'timing belt', 'camshaft', 'fuel tank', 'handlebars', 'mudguard', 'taillight'
    ]
  },

  'Bagages et Voyage': {
    fr: [
      'valise', 'bagage', 'sac', 'voyage', 'trolley', 'cabine', 'soute', 'etiquette',
      'passeport', 'trousse', 'accessoires', 'organiseur', 'adaptateur', 'oreiller',
      'masque', 'bouchon', 'transport', 'roulette', 'polycarbonate', 'bandouliere',
      'sac à dos', 'bagage à main', 'portedocuments', 'pochette', 'sacoche', 'mallette',
      'sac de voyage', 'malle', 'coffre', 'cadenas', 'balance', 'bagagerie', 
      'protection bagage', 'housse', 'pochette voyage', 'trousse toilette', 'confort voyage',
      'accessoire voyage', 'chargeur universel', 'convertisseur', 'adaptateur secteur',
      'prise internationale', 'guide voyage', 'carte voyage', 'location voiture', 'vol',
      'hôtel', 'auberge', 'camping', 'randonnée', 'trek', 'backpack', 'gourde',
      'thermos', 'compas', 'jumelles', 'boussole', 'GPS portable', 'sac étanche',
      'poche secrète', 'anti-vol', 'RFID', 'protège-passeport', 'porte-monnaie',
      'serviette microfibre', 'imperméable', 'poncho', 'parapluie', 'lunettes soleil', 'crème solaire'
    ],
    en: [
      'suitcase', 'luggage', 'bag', 'travel', 'trolley', 'cabin', 'hold', 'tag',
      'passport', 'kit', 'accessories', 'organizer', 'adapter', 'pillow',
      'mask', 'plug', 'transport', 'wheels', 'polycarbonate', 'strap',
      'backpack', 'carry-on', 'document holder', 'pouch', 'satchel', 'briefcase',
      'duffel bag', 'trunk', 'chest', 'lock', 'scale', 'luggage set',
      'luggage cover', 'protective cover', 'travel pouch', 'toiletry bag', 'travel comfort',
      'travel accessory', 'universal charger', 'converter', 'power adapter',
      'international plug', 'travel guide', 'travel map', 'car rental', 'flight',
      'hotel', 'hostel', 'camping', 'hiking', 'trekking', 'backpacking', 'water bottle',
      'thermos', 'binoculars', 'compass', 'portable GPS', 'waterproof bag',
      'hidden pocket', 'anti-theft', 'RFID', 'passport holder', 'wallet',
      'microfiber towel', 'raincoat', 'poncho', 'umbrella', 'sunglasses', 'sunscreen',
      'luggage tag', 'packing cubes', 'compression bags', 'travel pillow', 'luggage strap'
    ]
  },

  'Beauté et Parfum': {
    fr: [
      'beaute', 'parfum', 'maquillage', 'soin', 'visage', 'creme', 'serum', 'lotion',
      'vernis', 'rouge', 'levres', 'fond', 'teint', 'mascara', 'shampoing', 'cheveux',
      'coloration', 'coiffure', 'accessoire', 'manucure', 'pedicure', 'epilateur',
      'rasoir', 'aftershave', 'eau de toilette', 'deodorant', 'anti-rides', 'solaire',
      'parfumerie', 'soin peau', 'hydratant', 'nettoyant', 'exfoliant', 'gommage',
      'masque visage', 'tonique', 'contour yeux', 'anti-cerne', 'highlighter', 'blush',
      'fard à paupières', 'eye-liner', 'crayon', 'lèvres', 'gloss', 'rouge à lèvres',
      'baume', 'démaquillant', 'coton', 'pinceau maquillage', 'éponge', 'beautyblender',
      'palette', 'correcteur', 'contouring', 'poudre', 'bronzer', 'illuminateur',
      'anti-imperfection', 'anti-âge', 'hyaluronique', 'cellulite', 'fermeté', 'cosmétique',
      'huile essentielle', 'modelage', 'peeling', 'spa', 'bien-être', 'massage',
      'raser', 'mousse', 'gel', 'lait corporel', 'gant', 'éponge', 'bougie parfumée'
    ],
    en: [
      'beauty', 'perfume', 'makeup', 'care', 'face', 'cream', 'serum', 'lotion',
      'nail polish', 'lipstick', 'foundation', 'mascara', 'shampoo', 'hair',
      'color', 'hairstyle', 'accessory', 'manicure', 'pedicure', 'epilator',
      'razor', 'aftershave', 'cologne', 'deodorant', 'anti-wrinkle', 'sunscreen',
      'perfumery', 'skincare', 'moisturizer', 'cleanser', 'exfoliator', 'scrub',
      'face mask', 'toner', 'eye cream', 'concealer', 'highlighter', 'blush',
      'eyeshadow', 'eyeliner', 'pencil', 'lips', 'lip gloss', 'lipstick',
      'balm', 'makeup remover', 'cotton pad', 'makeup brush', 'sponge', 'beautyblender',
      'palette', 'corrector', 'contouring', 'powder', 'bronzer', 'illuminator',
      'blemish', 'anti-aging', 'hyaluronic', 'cellulite', 'firmness', 'cosmetics',
      'essential oil', 'modeling', 'peeling', 'spa', 'wellness', 'massage',
      'shaving', 'foam', 'gel', 'body milk', 'glove', 'sponge', 'scented candle',
      'facial', 'primer', 'setting spray', 'brow gel', 'lash curler', 'nail file'
    ]
  },

  'Bébés et Puériculture': {
    fr: [
      'bebe', 'enfant', 'puericulture', 'couche', 'poussette', 'biberon', 'chaise', 'siege',
      'auto', 'vetement', 'repas', 'allaitement', 'baignoire', 'lange', 'lingette', 'toise',
      'doudou', 'parc', 'lit', 'jouet', 'eveil', 'securite', 'surveillance', 'tetine',
      'poussette', 'porte-bebe', 'echarpe', 'sterilisateur', 'mouche-bebe',
      'landau', 'berceau', 'couffin', 'transat', 'tapis d\'eveil', 'mobile', 'veilleuse',
      'babyphone', 'thermometre', 'mouche-bebe', 'anneau dentition', 'bavoir', 'goupillon',
      'trotteur', 'chauffe-biberon', 'tire-lait', 'coussin allaitement', 'matelas à langer',
      'table à langer', 'pot', 'rehausseur', 'siège auto', 'cosy', 'nacelle', 'gigoteuse',
      'pyjama', 'body', 'grenouillère', 'chancelière', 'ombrelle', 'protection soleil',
      'moustiquaire', 'filet', 'barrière', 'tapis de bain', 'trousse toilette', 'thermomètre bain',
      'sortie de bain', 'cape de bain', 'gant toilette', 'shampoing', 'savon', 'lait corporel',
      'crème change', 'talc', 'coton-tige', 'coupe-ongle', 'brosse cheveux', 'peigne'
    ],
    en: [
      'baby', 'child', 'childcare', 'diaper', 'stroller', 'bottle', 'chair', 'seat',
      'auto', 'clothing', 'meal', 'breastfeeding', 'bathtub', 'cloth', 'wipe', 'measuring',
      'plush', 'playpen', 'crib', 'toy', 'development', 'safety', 'monitor', 'pacifier',
      'stroller', 'carrier', 'sling', 'sterilizer', 'nasal aspirator',
      'pram', 'cradle', 'bassinet', 'bouncer', 'play mat', 'mobile', 'night light',
      'baby monitor', 'thermometer', 'nasal aspirator', 'teething ring', 'bib', 'bottle brush',
      'walker', 'bottle warmer', 'breast pump', 'nursing pillow', 'changing mat',
      'changing table', 'potty', 'booster seat', 'car seat', 'infant carrier', 'carrycot', 'sleeping bag',
      'pajamas', 'bodysuit', 'onesie', 'footmuff', 'parasol', 'sun protection',
      'mosquito net', 'mesh', 'safety gate', 'bath mat', 'toiletry bag', 'bath thermometer',
      'hooded towel', 'bath cape', 'washcloth', 'shampoo', 'soap', 'body lotion',
      'diaper cream', 'talcum powder', 'cotton swab', 'nail clipper', 'hairbrush', 'comb',
      'high chair', 'baby food', 'formula', 'sippy cup', 'teether', 'diaper pail'
    ]
  },

  'Cuisine': {
    fr: [
      'casserole', 'poele', 'ustensile', 'assiette', 'verre', 'couvert', 'robot',
      'mixeur', 'blender', 'four', 'micro onde', 'cafetiere', 'bouilloire', 'plat',
      'cuisine', 'culinaire', 'batterie', 'cocotte', 'marmite', 'passoire',
      'cuiseur', 'autocuiseur', 'mijoteuse', 'crêpière', 'gaufrier', 'sauteuse',
      'thermostat', 'induction', 'plaque', 'cuisson', 'vitrocéramique', 'gaz',
      'barbecue', 'plancha', 'grill', 'raclette', 'fondue', 'pierrade', 'wok',
      'couteau', 'économe', 'mandoline', 'hachoir', 'fouet', 'spatule', 'louche',
      'écumoire', 'presse-agrumes', 'centrifugeuse', 'presse-ail', 'balance',
      'doseur', 'minuteur', 'thermomètre', 'moule', 'ramequin', 'plaque pâtisserie',
      'rouleau', 'emporte-pièce', 'poche à douille', 'spatule pâtisserie', 'pinceau',
      'saladier', 'bol', 'cuillère bois', 'cuillère silicone', 'passoire', 'chinois',
      'entonnoir', 'râpe', 'zesteur', 'vide-pomme', 'casse-noix', 'ouvre-boîte'
    ],
    en: [
      'pot', 'pan', 'utensil', 'plate', 'glass', 'cutlery', 'robot',
      'mixer', 'blender', 'oven', 'microwave', 'coffee maker', 'kettle', 'dish',
      'kitchen', 'culinary', 'cookware', 'dutch oven', 'cooking pot', 'colander',
      'cooker', 'pressure cooker', 'slow cooker', 'crepe maker', 'waffle maker', 'saute pan',
      'thermostat', 'induction', 'hob', 'cooking', 'ceramic', 'gas',
      'barbecue', 'griddle', 'grill', 'raclette', 'fondue', 'stone grill', 'wok',
      'knife', 'peeler', 'mandoline', 'chopper', 'whisk', 'spatula', 'ladle',
      'skimmer', 'citrus juicer', 'juicer', 'garlic press', 'scale',
      'measuring cup', 'timer', 'thermometer', 'mold', 'ramekin', 'baking sheet',
      'rolling pin', 'cookie cutter', 'piping bag', 'pastry spatula', 'brush',
      'salad bowl', 'bowl', 'wooden spoon', 'silicone spoon', 'strainer', 'conical strainer',
      'funnel', 'grater', 'zester', 'apple corer', 'nutcracker', 'can opener',
      'cutting board', 'knife set', 'measuring spoons', 'baking dish', 'muffin tin'
    ]
  },

  'Décoration': {
    fr: [
      'decoration', 'deco', 'cadre', 'miroir', 'vase', 'bougie', 'horloge', 'tapis',
      'coussin', 'rideau', 'store', 'sticker', 'poster', 'tableau', 'statue',
      'photophore', 'paillasson', 'panneau', 'tenture', 'bibelot', 'suspension',
      'lustre', 'applique', 'lampadaire', 'lampion', 'guirlande', 'ampoule',
      'abat-jour', 'plafonnier', 'éclairage', 'ambiance', 'décor', 'intérieur',
      'extérieur', 'jardin', 'terrasse', 'balcon', 'plante', 'artificielle',
      'paravent', 'séparateur', 'cloison', 'étagère', 'bibliothèque', 'meuble',
      'table', 'chaise', 'fauteuil', 'canapé', 'pouf', 'banc', 'commode',
      'console', 'vitrine', 'buffet', 'patère', 'porte-manteau', 'luminaire',
      'plaid', 'jeté de lit', 'nappe', 'chemin de table', 'set de table',
      'bougeoir', 'chandelier', 'lanterne', 'mobile', 'carillon', 'porte-photo',
      'papier peint', 'sticker mural', 'peinture décorative', 'fresque', 'murale'
    ],
    en: [
      'decoration', 'decor', 'frame', 'mirror', 'vase', 'candle', 'clock', 'rug',
      'cushion', 'curtain', 'blind', 'sticker', 'poster', 'painting', 'statue',
      'candle holder', 'doormat', 'sign', 'tapestry', 'ornament', 'pendant',
      'chandelier', 'sconce', 'floor lamp', 'lantern', 'garland', 'bulb',
      'lampshade', 'ceiling light', 'lighting', 'ambiance', 'decor', 'interior',
      'exterior', 'garden', 'terrace', 'balcony', 'plant', 'artificial',
      'screen', 'separator', 'partition', 'shelf', 'bookcase', 'furniture',
      'table', 'chair', 'armchair', 'sofa', 'pouf', 'bench', 'dresser',
      'console', 'display cabinet', 'buffet', 'coat hook', 'coat rack', 'light fixture',
      'throw', 'bedspread', 'tablecloth', 'table runner', 'placemat',
      'candle holder', 'chandelier', 'lantern', 'mobile', 'wind chime', 'photo frame',
      'wallpaper', 'wall sticker', 'decorative paint', 'fresco', 'mural',
      'throw pillow', 'area rug', 'wall art', 'ceramic vase', 'decorative bowl'
    ]
  },

  'Électroménager': {
    fr: [
      'electromenager', 'refrigerateur', 'frigo', 'lave', 'vaisselle', 'linge',
      'seche', 'cuisiniere', 'congelateur', 'aspirateur', 'robot', 'climatiseur',
      'ventilateur', 'micro ondes', 'plaque', 'hotte', 'four', 'grille-pain',
      'mixeur', 'blender', 'batteur', 'centrifugeuse', 'machine à café', 'expresso',
      'cafetière', 'bouilloire', 'friteuse', 'multicuiseur', 'rice cooker', 'crêpière',
      'gaufrier', 'appareil raclette', 'appareil fondue', 'yaourtière', 'sorbetière',
      'machine à pain', 'extracteur de jus', 'déshydrateur', 'cave à vin', 'cellier',
      'réfrigérateur américain', 'combiné réfrigérateur-congélateur', 'congélateur armoire',
      'congélateur coffre', 'lave-vaisselle encastrable', 'lave-vaisselle pose libre',
      'lave-linge hublot', 'lave-linge top', 'sèche-linge pompe à chaleur', 'sèche-linge condensation',
      'cuisinière induction', 'cuisinière vitrocéramique', 'cuisinière gaz', 'four encastrable',
      'four combiné', 'four vapeur', 'four micro-ondes', 'plaque induction', 'plaque vitrocéramique'
    ],
    en: [
      'appliance', 'refrigerator', 'fridge', 'dishwasher', 'washing machine',
      'dryer', 'stove', 'freezer', 'vacuum', 'robot', 'air conditioner',
      'fan', 'microwave', 'cooktop', 'hood', 'oven', 'toaster',
      'mixer', 'blender', 'beater', 'juicer', 'coffee machine', 'espresso machine',
      'coffee maker', 'kettle', 'deep fryer', 'multi-cooker', 'rice cooker', 'crepe maker',
      'waffle maker', 'raclette grill', 'fondue set', 'yogurt maker', 'ice cream maker',
      'bread machine', 'juice extractor', 'food dehydrator', 'wine cooler', 'cellar',
      'american refrigerator', 'fridge-freezer', 'upright freezer',
      'chest freezer', 'built-in dishwasher', 'freestanding dishwasher',
      'front-loading washing machine', 'top-loading washing machine', 'heat pump dryer', 'condenser dryer',
      'induction cooker', 'ceramic cooker', 'gas cooker', 'built-in oven',
      'combination oven', 'steam oven', 'microwave oven', 'induction hob', 'ceramic hob',
      'slow cooker', 'food processor', 'stand mixer', 'hand mixer', 'electric kettle'
    ]
  },

  'Électronique et Informatique': {
    fr: [
      'ordinateur', 'pc', 'portable', 'tablette', 'smartphone', 'telephone', 'ecran',
      'moniteur', 'clavier', 'souris', 'casque', 'enceinte', 'imprimante', 'scanner',
      'webcam', 'microphone', 'disque', 'memoire', 'ram', 'processeur', 'carte graphique',
      'stockage', 'accessoire', 'cable', 'chargeur', 'batterie', 'reseau', 'routeur',
      'modem', 'switch', 'connectique', 'adaptateur', 'hub', 'usb', 'hdmi', 'bluetooth',
      'informatique', 'bureautique', 'serveur', 'nas', 'stockage réseau', 'disque dur',
      'SSD', 'clé USB', 'carte SD', 'lecteur', 'graveur', 'DVD', 'Blu-ray', 'tour',
      'boîtier', 'alimentation', 'refroidissement', 'ventilateur', 'watercooling',
      'carte mère', 'écran tactile', 'écran led', 'écran oled', 'ultra HD', '4K', '8K',
      'smart TV', 'télévision', 'home cinéma', 'barre de son', 'caisson de basse',
      'ampli', 'tuner', 'récepteur', 'décodeur', 'satellite', 'console de jeu',
      'manette', 'appareil photo', 'caméscope', 'drone', 'GPS', 'montres connectées'
    ],
    en: [
      'computer', 'pc', 'laptop', 'tablet', 'smartphone', 'phone', 'screen',
      'monitor', 'keyboard', 'mouse', 'headset', 'speaker', 'printer', 'scanner',
      'webcam', 'microphone', 'disk', 'memory', 'ram', 'processor', 'graphics card',
      'storage', 'accessory', 'cable', 'charger', 'battery', 'network', 'router',
      'modem', 'switch', 'connectivity', 'adapter', 'hub', 'usb', 'hdmi', 'bluetooth',
      'computing', 'office equipment', 'server', 'nas', 'network storage', 'hard drive',
      'SSD', 'USB drive', 'SD card', 'reader', 'burner', 'DVD', 'Blu-ray', 'tower',
      'case', 'power supply', 'cooling', 'fan', 'watercooling',
      'motherboard', 'touchscreen', 'led screen', 'oled screen', 'ultra HD', '4K', '8K',
      'smart TV', 'television', 'home theater', 'soundbar', 'subwoofer',
      'amplifier', 'tuner', 'receiver', 'decoder', 'satellite', 'game console',
      'controller', 'camera', 'camcorder', 'drone', 'GPS', 'smartwatch',
      'desktop computer', 'all-in-one', 'CPU', 'SSD drive', 'mechanical keyboard'
    ]
  },
  
  'Épicerie et Alimentation': {
    fr: [
      'nourriture', 'aliment', 'epicerie', 'boisson', 'the', 'cafe', 'infusion', 'snack',
      'conserve', 'pate', 'riz', 'cereale', 'chocolat', 'bonbon', 'confiserie', 'huile',
      'vinaigre', 'epice', 'condiment', 'farine', 'sucre', 'sel', 'bio', 'vegan',
      'vegetarien', 'sans gluten', 'lactose', 'dietetique', 'boulangerie', 'patisserie',
      'viennoiserie', 'baguette', 'pain', 'croissant', 'brioche', 'fruit', 'legume',
      'produit laitier', 'fromage', 'yaourt', 'beurre', 'creme', 'lait', 'oeuf',
      'viande', 'boeuf', 'poulet', 'porc', 'agneau', 'charcuterie', 'jambon', 'saucisson',
      'poisson', 'fruit de mer', 'crevette', 'saumon', 'thon', 'pates alimentaires',
      'ravioli', 'spaghetti', 'tagliatelle', 'sauce', 'tomate', 'pesto', 'soupe', 'bouillon',
      'surgelé', 'dessert', 'gateau', 'tarte', 'compote', 'confiture', 'miel', 'sirop',
      'aperitif', 'chips', 'olive', 'noix', 'amande', 'pistache', 'cacahuete', 'raisin sec',
      'muesli', 'avoine', 'quinoa', 'couscous', 'biscuit', 'gaufre', 'crepe', 'moutarde',
      'ketchup', 'mayonnaise', 'soja', 'tofu', 'seitan', 'legumineuse', 'lentille', 'pois chiche',
      'haricot', 'feve', 'semoule', 'boulgour'
    ],
    en: [
      'food', 'grocery', 'beverage', 'tea', 'coffee', 'infusion', 'snack',
      'canned', 'pasta', 'rice', 'cereal', 'chocolate', 'candy', 'confectionery', 'oil',
      'vinegar', 'spice', 'condiment', 'flour', 'sugar', 'salt', 'organic', 'vegan',
      'vegetarian', 'gluten free', 'lactose', 'diet', 'bakery', 'pastry',
      'bread', 'baguette', 'croissant', 'brioche', 'fruit', 'vegetable',
      'dairy', 'cheese', 'yogurt', 'butter', 'cream', 'milk', 'egg',
      'meat', 'beef', 'chicken', 'pork', 'lamb', 'deli', 'ham', 'salami',
      'fish', 'seafood', 'shrimp', 'salmon', 'tuna', 'noodle',
      'ravioli', 'spaghetti', 'tagliatelle', 'sauce', 'tomato', 'pesto', 'soup', 'broth',
      'frozen', 'dessert', 'cake', 'pie', 'compote', 'jam', 'honey', 'syrup',
      'appetizer', 'chips', 'olive', 'nut', 'almond', 'pistachio', 'peanut', 'raisin',
      'muesli', 'oat', 'quinoa', 'couscous', 'cookie', 'waffle', 'pancake', 'mustard',
      'ketchup', 'mayonnaise', 'soy', 'tofu', 'seitan', 'legume', 'lentil', 'chickpea',
      'bean', 'broad bean', 'semolina', 'bulgur', 'smoothie', 'granola', 'cracker', 'pickle',
      'relish', 'chutney', 'cornflakes', 'bagel', 'muffin', 'sausage', 'bacon', 'jerky'
    ]
  },
    
  'Films et Séries TV': {
    fr: [
      'film', 'serie', 'dvd', 'blu-ray', 'bluray', 'coffret', 'edition', 'collector',
      'limitee', 'integrale', 'saison', 'episode', 'box', 'set', 'cinema', 'television',
      'documentaire', 'animation', 'comedie', 'action', 'thriller', 'horreur', 'fantastique',
      'science-fiction', 'drame', 'romance', 'biopic', 'historique', 'aventure', 'western',
      'policier', 'guerre', 'musical', 'jeunesse', 'familial', 'comedie musicale', 'dessin anime',
      'super-heros', 'manga', 'anime', 'court-metrage', 'realisateur', 'acteur', 'actrice',
      'producteur', 'scenario', 'bande-son', 'musique', 'soundtrack', 'adaptation', 'remake',
      'prequel', 'sequel', 'spin-off', 'trilogie', 'saga', 'univers', 'franchise', 'sitcom',
      'telenovela', 'feuilleton', 'mini-serie', 'docu-serie', 'tele-realite', 'talk-show',
      'emission', 'jeu televise', 'telefilm', 'direct-to-video', 'inédit', 'sous-titre',
      'doublage', 'version originale', 'VOST', 'VF', 'montage', 'format', 'widescreen',
      '4K', 'HDR', 'UHD', 'streaming', 'VOD', 'plateforme', 'abonnement', 'diffusion',
      'avant-premiere', 'critique', 'festival', 'ceremonie', 'prix', 'oscar', 'cesar',
      'nomination', 'blockbuster', 'independant', 'court-metrage', 'long-metrage', 'camera',
      'tournage', 'post-production', 'effets speciaux', 'CGI'
    ],
    en: [
      'movie', 'series', 'dvd', 'blu-ray', 'bluray', 'box set', 'edition', 'collector',
      'limited', 'complete', 'season', 'episode', 'box', 'set', 'cinema', 'television',
      'documentary', 'animation', 'comedy', 'action', 'thriller', 'horror', 'fantasy',
      'sci-fi', 'drama', 'romance', 'biopic', 'historical', 'adventure', 'western',
      'crime', 'war', 'musical', 'youth', 'family', 'cartoon', 'anime',
      'superhero', 'manga', 'short film', 'director', 'actor', 'actress',
      'producer', 'screenplay', 'soundtrack', 'music', 'adaptation', 'remake',
      'prequel', 'sequel', 'spin-off', 'trilogy', 'saga', 'universe', 'franchise', 'sitcom',
      'soap opera', 'mini-series', 'docuseries', 'reality show', 'talk show',
      'program', 'game show', 'TV movie', 'direct-to-video', 'exclusive', 'subtitle',
      'dubbing', 'original version', 'subbed', 'dubbed', 'edit', 'format', 'widescreen',
      '4K', 'HDR', 'UHD', 'streaming', 'VOD', 'platform', 'subscription', 'broadcast',
      'premiere', 'review', 'festival', 'ceremony', 'award', 'oscar', 'golden globe',
      'nomination', 'blockbuster', 'indie', 'short', 'feature film', 'camera',
      'filming', 'post-production', 'special effects', 'CGI', 'rotten tomatoes', 'imdb',
      'metacritic', 'director cut', 'extended cut', 'theatrical release', 'cast', 'plot',
      'screenplay', 'screenwriter', 'cinematography', 'binge-watch', 'cliffhanger', 'pilot'
    ]
  },
    
  'Fournitures de Bureau': {
    fr: [
      'papier', 'stylo', 'crayon', 'feutre', 'marqueur', 'surligneur', 'gomme', 'taille-crayon',
      'classeur', 'chemise', 'dossier', 'reliure', 'agenda', 'cahier', 'bloc', 'post-it',
      'trombonne', 'agrafe', 'ciseaux', 'calculatrice', 'ruban', 'adhesif', 'etiquette',
      'pince', 'perforateur', 'agrafeuse', 'pochette', 'intercalaire', 'separateur', 'carnet',
      'repertoire', 'calendrier', 'ephemeride', 'semainier', 'memo', 'pense-bete', 'tableau',
      'paperboard', 'punaise', 'aimant', 'veleda', 'effaceur', 'feuille', 'ramette', 'copie',
      'bristol', 'carton', 'cartonné', 'plastifie', 'transparent', 'pochette plastique',
      'protege-document', 'porte-vue', 'sous-main', 'tapis de souris', 'corbeille', 'poubelle',
      'boite archive', 'destructeur', 'dechiqueteuse', 'devidoir', 'scotch', 'colle', 'baton de colle',
      'correcteur', 'blanc correcteur', 'encre', 'cartouche', 'toner', 'imprimante', 'photocopie',
      'scanner', 'tampon', 'encrier', 'enveloppe', 'timbre', 'courrier', 'lettre', 'colis',
      'expediteur', 'destinataire', 'entete', 'papier a lettre', 'carte de visite', 'badge',
      'porte-nom', 'attache parisienne', 'elastique', 'pince-notes', 'marque-page', 'regle',
      'equerre', 'rapporteur', 'compas', 'formulaire', 'registre', 'signature', 'parapheur',
      'trieur', 'bannette', 'porte-document', 'ardoise', 'craie', 'planche a pince'
    ],
    en: [
      'paper', 'pen', 'pencil', 'marker', 'highlighter', 'eraser', 'sharpener',
      'binder', 'folder', 'binding', 'agenda', 'notebook', 'pad', 'post-it',
      'paperclip', 'staple', 'scissors', 'calculator', 'tape', 'adhesive', 'label',
      'clip', 'hole punch', 'stapler', 'pocket', 'divider', 'separator', 'notepad',
      'directory', 'calendar', 'daily calendar', 'weekly planner', 'memo', 'reminder', 'board',
      'flipchart', 'thumbtack', 'magnet', 'whiteboard marker', 'eraser', 'sheet', 'ream', 'copy',
      'index card', 'cardboard', 'cardstock', 'laminated', 'transparent', 'sheet protector',
      'display book', 'desk pad', 'mouse pad', 'wastebasket', 'trash bin',
      'archive box', 'shredder', 'dispenser', 'scotch tape', 'glue', 'glue stick',
      'correction fluid', 'white-out', 'ink', 'cartridge', 'toner', 'printer', 'photocopy',
      'scanner', 'stamp', 'ink pad', 'envelope', 'postage stamp', 'mail', 'letter', 'package',
      'sender', 'recipient', 'letterhead', 'writing paper', 'business card', 'badge',
      'name tag', 'paper fastener', 'rubber band', 'binder clip', 'bookmark', 'ruler',
      'set square', 'protractor', 'compass', 'form', 'register', 'signature', 'signature book',
      'sorter', 'letter tray', 'document holder', 'blackboard', 'chalk', 'clipboard',
      'address book', 'desk organizer', 'staple remover', 'three-hole punch', 'document case',
      'sticky note', 'memo pad', 'file cabinet', 'desk drawer', 'push pin', 'paper weight',
      'pen holder', 'pencil cup', 'tape measure', 'calculator tape', 'envelope sealer'
    ]
  },
  
  'Instruments de Musique': {
   fr: [
    'instrument', 'musique', 'guitare', 'piano', 'clavier', 'batterie', 'percussion',
    'violon', 'flute', 'saxophone', 'trompette', 'harmonica', 'micro', 'ampli',
    'amplificateur', 'pedales', 'effet', 'accessoire', 'cable', 'mediator', 'accordeur',
    'metronome', 'pupitre', 'partition', 'corde', 'anche', 'archet', 'acoustique',
    'electrique', 'electroacoustique', 'synthetiseur', 'sampler', 'midi', 'interface',
    'table de mixage', 'console', 'sequenceur', 'enregistreur', 'casque', 'microphone',
    'pied de micro', 'stand', 'baguette', 'mailloche', 'caisse claire', 'grosse caisse',
    'cymbale', 'charleston', 'tom', 'cajon', 'congas', 'bongos', 'djembe', 'tambourin',
    'triangle', 'xylophone', 'vibraphone', 'marimba', 'carillon', 'cloche', 'gong',
    'contrebasse', 'violoncelle', 'alto', 'harpe', 'lyre', 'cithare', 'ukulele', 'banjo',
    'mandoline', 'balalaika', 'bouzouki', 'sitar', 'luth', 'guitare basse', 'clarinette',
    'hautbois', 'basson', 'cor anglais', 'piccolo', 'flute traversiere', 'flute a bec',
    'ocarina', 'cor', 'cornet', 'bugle', 'trombone', 'tuba', 'euphonium', 'accordeon',
    'bandoneon', 'harmonica chromatique', 'melodica', 'orgue', 'orgue electronique',
    'pedalier', 'diapason', 'solfege', 'theorie musicale', 'tablature', 'enceinte', 'retour',
    'sono', 'equalizer', 'reverb', 'delay', 'distortion', 'chorus', 'boite a rythme'
    ],
    en: [
    'instrument', 'music', 'guitar', 'piano', 'keyboard', 'drums', 'percussion',
    'violin', 'flute', 'saxophone', 'trumpet', 'harmonica', 'microphone', 'amp',
    'amplifier', 'pedals', 'effect', 'accessory', 'cable', 'pick', 'tuner',
    'metronome', 'stand', 'sheet music', 'string', 'reed', 'bow', 'acoustic',
    'electric', 'electroacoustic', 'synthesizer', 'sampler', 'midi', 'interface',
    'mixer', 'console', 'sequencer', 'recorder', 'headphones', 'microphone',
    'mic stand', 'drumstick', 'mallet', 'snare drum', 'bass drum',
    'cymbal', 'hi-hat', 'tom-tom', 'cajon', 'conga', 'bongo', 'djembe', 'tambourine',
    'triangle', 'xylophone', 'vibraphone', 'marimba', 'glockenspiel', 'bell', 'gong',
    'double bass', 'cello', 'viola', 'harp', 'lyre', 'zither', 'ukulele', 'banjo',
    'mandolin', 'balalaika', 'bouzouki', 'sitar', 'lute', 'bass guitar', 'clarinet',
    'oboe', 'bassoon', 'english horn', 'piccolo', 'transverse flute', 'recorder',
    'ocarina', 'french horn', 'cornet', 'bugle', 'trombone', 'tuba', 'euphonium', 'accordion',
    'bandoneon', 'chromatic harmonica', 'melodica', 'organ', 'electronic organ',
    'pedal board', 'tuning fork', 'music theory', 'tablature', 'speaker', 'monitor',
    'sound system', 'equalizer', 'reverb', 'delay', 'distortion', 'chorus', 'drum machine',
    'audio interface', 'DAW', 'preamp', 'condenser microphone', 'dynamic microphone', 'pop filter',
    'capo', 'slide', 'guitar strap', 'violin chin rest', 'rosin', 'woodwind', 'brass'
    ]
  },

  'Jardin': {
   fr: [
    'jardin', 'plante', 'jardinage', 'exterieur', 'terrasse', 'balcon', 'outil',
    'tondeuse', 'arrosage', 'pelle', 'rateau', 'taille', 'haie', 'barbecue',
    'parasol', 'salon jardin', 'serre', 'pot', 'semence', 'graines', 'bulbe',
    'tubercule', 'fleur', 'arbuste', 'arbre', 'conifere', 'feuillage', 'fruitier',
    'potager', 'legume', 'aromate', 'herbe', 'gazon', 'pelouse', 'compost', 'terreau',
    'engrais', 'fertilisant', 'pesticide', 'insecticide', 'fongicide', 'herbicide',
    'desherbant', 'pulverisateur', 'arrosoir', 'tuyau', 'goutteur', 'asperseur',
    'irrigation', 'bache', 'paillage', 'brouette', 'secateur', 'cisaille', 'elagueuse',
    'tronconneuse', 'debroussailleuse', 'coupe-bordure', 'motoculteur', 'bineuse', 'beche',
    'fourche', 'pioche', 'transplantoir', 'griffe', 'sarcloir', 'taille-haie', 'souffleur',
    'aspirateur', 'broyeur', 'composteur', 'bac', 'jardiniere', 'suspension', 'tuteur',
    'treillage', 'pergola', 'tonnelle', 'kiosque', 'gloriette', 'cabane', 'abri', 'cloture',
    'grillage', 'palissade', 'bordure', 'dalles', 'pave', 'gravier', 'ecorce', 'paillis',
    'rocaille', 'bassin', 'fontaine', 'pompe', 'eclairage', 'deco', 'statue', 'mobilier',
    'chaise', 'table', 'banc', 'hamac', 'balancelle', 'store', 'bain de soleil', 'transat'
    ],
    en: [
    'garden', 'plant', 'gardening', 'outdoor', 'patio', 'balcony', 'tool',
    'lawn mower', 'watering', 'shovel', 'rake', 'trim', 'hedge', 'barbecue',
    'umbrella', 'garden furniture', 'greenhouse', 'pot', 'seed', 'seeds', 'bulb',
    'tuber', 'flower', 'shrub', 'tree', 'conifer', 'foliage', 'fruit tree',
    'vegetable garden', 'vegetable', 'herb', 'grass', 'lawn', 'compost', 'potting soil',
    'fertilizer', 'plant food', 'pesticide', 'insecticide', 'fungicide', 'herbicide',
    'weed killer', 'sprayer', 'watering can', 'hose', 'dripper', 'sprinkler',
    'irrigation', 'tarp', 'mulch', 'wheelbarrow', 'pruner', 'shears', 'pruning saw',
    'chainsaw', 'brush cutter', 'edger', 'tiller', 'hoe', 'spade',
    'fork', 'pickaxe', 'trowel', 'cultivator', 'weeder', 'hedge trimmer', 'blower',
    'vacuum', 'shredder', 'composter', 'container', 'planter', 'hanging basket', 'stake',
    'trellis', 'pergola', 'arbor', 'gazebo', 'pavilion', 'shed', 'shelter', 'fence',
    'wire fence', 'privacy screen', 'edging', 'paving', 'paver', 'gravel', 'bark', 'mulch',
    'rock garden', 'pond', 'fountain', 'pump', 'lighting', 'decor', 'statue', 'furniture',
    'chair', 'table', 'bench', 'hammock', 'swing', 'awning', 'sun lounger', 'deck chair',
    'garden hose reel', 'kneeling pad', 'garden gloves', 'topiary', 'bird feeder', 'bird bath',
    'cold frame', 'propagator', 'weed barrier', 'rain barrel', 'landscape fabric'
      ]
    },
  
  'Jeux Vidéo et Consoles': {
   fr: [
    'jeu', 'video', 'console', 'manette', 'accessoire', 'playstation', 'xbox',
    'nintendo', 'switch', 'pc', 'gamer', 'gaming', 'arcade', 'simulation',
    'action', 'aventure', 'rpg', 'sport', 'course', 'combat', 'plateforme',
    'strategie', 'fps', 'mmorpg', 'vr', 'realite virtuelle', 'casque', 'joystick',
    'volant', 'pedalier', 'stick', 'gamepad', 'controleur', 'bouton', 'gachette',
    'portable', 'cartouche', 'disque', 'dematerialise', 'telechargement', 'connexion',
    'online', 'multijoueur', 'solo', 'campagne', 'histoire', 'scenario', 'personnage',
    'avatar', 'profil', 'sauvegarde', 'checkpoint', 'niveau', 'monde', 'environnement',
    'graphisme', 'frame rate', 'resolution', 'texture', 'pixel', 'polygone', 'rendu',
    'shader', 'haptique', 'vibration', 'retour de force', 'camera', 'vue subjective',
    'tps', 'rts', 'moba', 'battle royale', 'survie', 'horreur', 'puzzle', 'reflexion',
    'roguelike', 'roguelite', 'indie', 'AAA', 'editeur', 'developpeur', 'studio',
    'patch', 'mise a jour', 'dlc', 'extension', 'season pass', 'free-to-play', 'premium',
    'abonnement', 'boutique', 'microtransaction', 'skin', 'cosmetique', 'emote', 'buff',
    'nerf', 'spawn', 'respawn', 'hitbox', 'lag', 'ping', 'serveur', 'connexion',
    'fps', 'performance', 'chargement', 'streaming', 'cross-play', 'cross-platform'
    ],
    en: [
    'game', 'video', 'console', 'controller', 'accessory', 'playstation', 'xbox',
    'nintendo', 'switch', 'pc', 'gamer', 'gaming', 'arcade', 'simulation',
    'action', 'adventure', 'rpg', 'sports', 'racing', 'fighting', 'platform',
    'strategy', 'fps', 'mmorpg', 'vr', 'virtual reality', 'headset', 'joystick',
    'steering wheel', 'pedals', 'arcade stick', 'gamepad', 'controller', 'button', 'trigger',
    'handheld', 'cartridge', 'disc', 'digital', 'download', 'connection',
    'online', 'multiplayer', 'singleplayer', 'campaign', 'story', 'plot', 'character',
    'avatar', 'profile', 'save', 'checkpoint', 'level', 'world', 'environment',
    'graphics', 'frame rate', 'resolution', 'texture', 'pixel', 'polygon', 'rendering',
    'shader', 'haptic', 'vibration', 'force feedback', 'camera', 'first-person',
    'tps', 'rts', 'moba', 'battle royale', 'survival', 'horror', 'puzzle', 'brain teaser',
    'roguelike', 'roguelite', 'indie', 'AAA', 'publisher', 'developer', 'studio',
    'patch', 'update', 'dlc', 'expansion', 'season pass', 'free-to-play', 'premium',
    'subscription', 'store', 'microtransaction', 'skin', 'cosmetic', 'emote', 'buff',
    'nerf', 'spawn', 'respawn', 'hitbox', 'lag', 'ping', 'server', 'connection',
    'fps', 'performance', 'loading', 'streaming', 'cross-play', 'cross-platform',
    'early access', 'beta', 'alpha', 'mod', 'modding', 'lootbox', 'achievement', 'trophy',
    'esports', 'streamer', 'twitch', 'youtube', 'gaming chair', 'monitor', 'gaming mouse'
    ]
  },
    
  'Jouets et Jeux': {
   fr: [
    'jouet', 'jeu', 'puzzle', 'peluche', 'poupee', 'figurine', 'construction',
    'lego', 'playmobil', 'educatif', 'eveil', 'exterieur', 'plein air', 'voiture',
    'telecommande', 'drone', 'societe', 'carte', 'plateau', 'echec', 'dessin',
    'peinture', 'modelisme', 'maquette', 'deguisement', 'costume', 'masque', 'grimage',
    'maquillage', 'anniversaire', 'fete', 'guirlande', 'ballon', 'pinata', 'boule',
    'bille', 'toupie', 'yo-yo', 'diabolo', 'baton', 'cerceau', 'corde a sauter',
    'frisbee', 'ballon', 'balle', 'raquette', 'quille', 'bowling', 'piscine', 'pataugeoire',
    'trampoline', 'toboggan', 'balancoire', 'bascule', 'portique', 'cabane', 'tipi',
    'tente', 'dinette', 'cuisine', 'menage', 'caisse', 'magasin', 'docteur', 'bricolage',
    'etabli', 'garage', 'maison', 'poupee', 'barbie', 'poupon', 'landau', 'poussette',
    'biberon', 'vetement', 'accessoire', 'cheval', 'baton', 'ferme', 'animaux', 'dinosaure',
    'robot', 'transformers', 'action man', 'super-heros', 'marvel', 'dc', 'star wars',
    'pokemon', 'cartes', 'collection', 'album', 'vignette', 'autocollant', 'tampon',
    'pate a modeler', 'argile', 'poterie', 'perle', 'bracelet', 'bijou', 'kit', 'scientifique',
    'experience', 'microscope', 'telescope', 'espace', 'astronomie', 'chimie', 'nature'
    ],
    en: [
    'toy', 'game', 'puzzle', 'plush', 'doll', 'figure', 'building',
    'lego', 'playmobil', 'educational', 'development', 'outdoor', 'car',
    'remote control', 'drone', 'board game', 'card', 'chess', 'drawing',
    'paint', 'modeling', 'model', 'costume', 'outfit', 'mask', 'face paint',
    'makeup', 'birthday', 'party', 'garland', 'balloon', 'pinata', 'ball',
    'marble', 'spinning top', 'yo-yo', 'diabolo', 'stick', 'hoop', 'jump rope',
    'frisbee', 'ball', 'racket', 'skittle', 'bowling', 'pool', 'paddling pool',
    'trampoline', 'slide', 'swing', 'seesaw', 'play structure', 'playhouse', 'teepee',
    'tent', 'play kitchen', 'housekeeping', 'cash register', 'store', 'doctor', 'DIY',
    'workbench', 'garage', 'dollhouse', 'barbie', 'baby doll', 'pram', 'stroller',
    'bottle', 'clothing', 'accessory', 'rocking horse', 'stick horse', 'farm', 'animals', 'dinosaur',
    'robot', 'transformers', 'action figure', 'superhero', 'marvel', 'dc', 'star wars',
    'pokemon', 'trading cards', 'collection', 'album', 'sticker', 'stamp',
    'play-doh', 'clay', 'pottery', 'bead', 'bracelet', 'jewelry', 'kit', 'science',
    'experiment', 'microscope', 'telescope', 'space', 'astronomy', 'chemistry', 'nature',
    'puppet', 'finger puppet', 'stuffed animal', 'teddy bear', 'board game', 'monopoly',
    'scrabble', 'jenga', 'dice', 'playing cards', 'craft kit', 'jigsaw puzzle', 'rubik cube'
    ]
  },

  'Literie': {
   fr: [
    'lit', 'matelas', 'sommier', 'drap', 'couette', 'oreiller', 'couverture',
    'housse', 'traversin', 'taie', 'alese', 'surmatelas', 'couvre lit', 'plaid',
    'edredon', 'duvet', 'protege matelas', 'parure de lit', 'ensemble', 'drap housse',
    'drap plat', 'cache sommier', 'tour de lit', 'ciel de lit', 'baldaquin', 'tete de lit',
    'pied de lit', 'cadre de lit', 'structure de lit', 'bois de lit', 'lit simple',
    'lit double', 'lit queen size', 'lit king size', 'lit superpose', 'mezzanine',
    'lit gigogne', 'lit coffre', 'canape lit', 'clic-clac', 'futon', 'convertible',
    'bz', 'lit pliant', 'lit parapluie', 'berceau', 'couffin', 'lit bebe', 'matelas bebe',
    'matelas a ressorts', 'matelas en mousse', 'matelas a memoire de forme', 'matelas latex',
    'matelas orthopedique', 'matelas gonflable', 'matelas d appoint', 'oreiller en plume',
    'oreiller en duvet', 'oreiller synthetique', 'oreiller ergonomique', 'oreiller cervical',
    'oreiller a memoire de forme', 'oreiller anti-acarien', 'traversin en plume', 'traversin en duvet',
    'traversin synthetique', 'couette en plume', 'couette en duvet', 'couette synthetique',
    'couette 4 saisons', 'couette ete', 'couette hiver', 'couette legere', 'couette chaude',
    'housse de couette', 'bouton', 'zip', 'fermeture', 'anti-acarien', 'hypoallergenique',
    'impermeable', 'respirant', 'garnissage', 'fibres', 'tissage', 'percale', 'satin',
    'flanelle', 'jersey', 'coton', 'lin', 'bambou', 'soie', 'microfibre', 'fil',
    'densite', 'grammage', 'epaisseur', 'confort', 'ferme', 'moelleux', 'gonflant',
    'doudou', 'polochon'
    ],
    en: [
    'bed', 'mattress', 'box spring', 'sheet', 'duvet', 'pillow', 'blanket',
    'cover', 'bolster', 'pillowcase', 'pad', 'topper', 'bedspread', 'throw',
    'quilt', 'comforter', 'protector', 'bed set', 'ensemble', 'fitted sheet',
    'flat sheet', 'bed skirt', 'crib bumper', 'canopy', 'four-poster', 'headboard',
    'footboard', 'bed frame', 'bed structure', 'bedstead', 'single bed',
    'double bed', 'queen size bed', 'king size bed', 'bunk bed', 'loft bed',
    'trundle bed', 'storage bed', 'sofa bed', 'click-clack', 'futon', 'convertible',
    'daybed', 'folding bed', 'travel cot', 'cradle', 'bassinet', 'crib', 'crib mattress',
    'spring mattress', 'foam mattress', 'memory foam mattress', 'latex mattress',
    'orthopedic mattress', 'air mattress', 'guest mattress', 'feather pillow',
    'down pillow', 'synthetic pillow', 'ergonomic pillow', 'cervical pillow',
    'memory foam pillow', 'anti-dust mite pillow', 'feather bolster', 'down bolster',
    'synthetic bolster', 'feather duvet', 'down duvet', 'synthetic duvet',
    'all-season duvet', 'summer duvet', 'winter duvet', 'lightweight duvet', 'warm duvet',
    'duvet cover', 'button', 'zipper', 'closure', 'anti-dust mite', 'hypoallergenic',
    'waterproof', 'breathable', 'filling', 'fibers', 'weave', 'percale', 'sateen',
    'flannel', 'jersey', 'cotton', 'linen', 'bamboo', 'silk', 'microfiber', 'thread',
    'density', 'weight', 'thickness', 'comfort', 'firm', 'soft', 'fluffy',
    'comfort object', 'body pillow', 'mattress foundation', 'platform bed', 'adjustable bed',
    'sleep number', 'tempur-pedic', 'casper', 'purple', 'nectar', 'sleep mask', 'bed runner'
    ]
  },

  'Logiciels': {
   fr: [
    'logiciel', 'software', 'programme', 'application', 'suite', 'antivirus',
    'securite', 'bureautique', 'word', 'excel', 'office', 'windows', 'macos',
    'adobe', 'photoshop', 'illustrator', 'indesign', 'premiere', 'montage',
    'video', 'audio', 'retouche', 'licence', 'abonnement', 'telechargement', 
    'installation', 'mise a jour', 'upgrade', 'patch', 'version', 'interface',
    'systeme exploitation', 'os', 'linux', 'unix', 'driver', 'pilote', 'peripherique',
    'compatible', 'compatibilite', 'powerpoint', 'outlook', 'acces', 'onenote',
    'tableur', 'traitement de texte', 'base de donnees', 'presentation', 'courriel',
    'email', 'messagerie', 'gmail', 'outlook', 'yahoo', 'thunderbird', 'navigateur',
    'chrome', 'firefox', 'safari', 'edge', 'explorer', 'opera', 'extensions', 'plugin',
    'add-on', 'complement', 'cloud', 'sauvegarde', 'backup', 'stockage', 'serveur',
    'reseau', 'partage', 'synchronisation', 'cryptage', 'chiffrement', 'pare-feu',
    'firewall', 'malware', 'spyware', 'ransomware', 'trojan', 'virus', 'scan',
    'analyse', 'protection', 'vpn', 'proxy', 'anonymat', 'confidentialite', 'privacy',
    'graphisme', 'CAO', 'DAO', 'modélisation', '3D', 'animation', 'effet spécial',
    'lightroom', 'after effects', 'final cut', 'pro tools', 'ableton', 'cubase',
    'logic pro', 'fl studio', 'garageband', 'imovie', 'filmora', 'davinci resolve',
    'autocad', 'sketchup', 'cinema 4d', 'maya', 'blender', 'revit', 'archicad',
    'comptabilite', 'gestion', 'erp', 'crm', 'sage', 'ciel', 'ebp', 'sap'
    ],
    en: [
    'software', 'program', 'application', 'suite', 'antivirus',
    'security', 'office', 'word', 'excel', 'windows', 'macos',
    'adobe', 'photoshop', 'illustrator', 'indesign', 'premiere', 'editing',
    'video', 'audio', 'retouch', 'license', 'subscription', 'download',
    'installation', 'update', 'upgrade', 'patch', 'version', 'interface',
    'operating system', 'os', 'linux', 'unix', 'driver', 'device',
    'compatible', 'compatibility', 'powerpoint', 'outlook', 'access', 'onenote',
    'spreadsheet', 'word processor', 'database', 'presentation', 'email',
    'mail', 'messaging', 'gmail', 'outlook', 'yahoo', 'thunderbird', 'browser',
    'chrome', 'firefox', 'safari', 'edge', 'explorer', 'opera', 'extensions', 'plugin',
    'add-on', 'complement', 'cloud', 'backup', 'storage', 'server',
    'network', 'sharing', 'synchronization', 'encryption', 'cipher', 'firewall',
    'malware', 'spyware', 'ransomware', 'trojan', 'virus', 'scan',
    'analysis', 'protection', 'vpn', 'proxy', 'anonymity', 'privacy',
    'graphics', 'CAD', 'modeling', '3D', 'animation', 'special effect',
    'lightroom', 'after effects', 'final cut', 'pro tools', 'ableton', 'cubase',
    'logic pro', 'fl studio', 'garageband', 'imovie', 'filmora', 'davinci resolve',
    'autocad', 'sketchup', 'cinema 4d', 'maya', 'blender', 'revit', 'archicad',
    'accounting', 'management', 'erp', 'crm', 'sage', 'quickbooks', 'xero', 'sap',
    'developer tools', 'IDE', 'visual studio', 'xcode', 'android studio', 'eclipse',
    'intellij', 'jetbrains', 'git', 'github', 'gitlab', 'bitbucket', 'jira', 'slack'
    ]
  },

  'Luminaire': {
   fr: [
    'lampe', 'luminaire', 'eclairage', 'lumiere', 'applique', 'plafonnier', 'ampoule',
    'suspension', 'spot', 'lustre', 'lampadaire', 'veilleuse', 'guirlande', 'led',
    'lanterne', 'abat jour', 'halogene', 'lampe de bureau', 'lampe de chevet', 'liseuse',
    'reglette', 'tube', 'neon', 'fluorescent', 'balisage', 'projecteur', 'spot encastre',
    'spot rail', 'spot orientable', 'applique murale', 'lampe a poser', 'lampe tactile',
    'lampe variateur', 'lampe articulee', 'lampe flexible', 'lampe a pince', 'lampe loupe',
    'lampe architecte', 'lampe clip', 'lampe industrielle', 'lampe vintage', 'suspension multiple',
    'suspension reglable', 'lustre moderne', 'lustre contemporain', 'lustre baroque', 'lustre cristal',
    'lustre design', 'candelabre', 'chandelier', 'bougeoir', 'photophore', 'lanterne decorative',
    'lanterne exterieure', 'lanterne solaire', 'eclairage exterieur', 'borne', 'potelet',
    'applique exterieure', 'projecteur exterieur', 'spot exterieur', 'lampadaire exterieur',
    'eclairage paysager', 'eclairage jardin', 'eclairage allee', 'eclairage piscine',
    'ruban led', 'bandeau led', 'rampe led', 'kit led', 'bande led', 'profil led',
    'transformateur', 'alimentation', 'connecteur', 'variateur', 'gradateur', 'interrupteur',
    'telecommande', 'detecteur', 'capteur mouvement', 'crepusculaire', 'minuterie', 'rgb',
    'multicolore', 'connecte', 'intelligent', 'bluetooth', 'wifi', 'domotique', 'philips hue',
    'filament', 'Edison', 'retro', 'vintage', 'globe', 'flamme', 'spot', 'dichroique',
    'culot', 'douille', 'suspension', 'rosace', 'cable', 'fil', 'cordon', 'chaine'
    ],
    en: [
    'lamp', 'light', 'lighting', 'fixture', 'sconce', 'ceiling light', 'bulb',
    'pendant', 'spotlight', 'chandelier', 'floor lamp', 'night light', 'string lights', 'led',
    'lantern', 'lampshade', 'halogen', 'desk lamp', 'bedside lamp', 'reading lamp',
    'strip light', 'tube', 'neon', 'fluorescent', 'marker light', 'projector', 'recessed spot',
    'track light', 'adjustable spotlight', 'wall light', 'table lamp', 'touch lamp',
    'dimmer lamp', 'articulated lamp', 'flexible lamp', 'clip-on lamp', 'magnifying lamp',
    'architect lamp', 'clip lamp', 'industrial lamp', 'vintage lamp', 'multiple pendant',
    'adjustable pendant', 'modern chandelier', 'contemporary chandelier', 'baroque chandelier', 'crystal chandelier',
    'design chandelier', 'candelabra', 'candle holder', 'tealight holder', 'decorative lantern',
    'outdoor lantern', 'solar lantern', 'outdoor lighting', 'bollard', 'post light',
    'outdoor wall light', 'outdoor floodlight', 'outdoor spotlight', 'outdoor floor lamp',
    'landscape lighting', 'garden lighting', 'pathway lighting', 'pool lighting',
    'led strip', 'led tape', 'led bar', 'led kit', 'led band', 'led profile',
    'transformer', 'power supply', 'connector', 'dimmer', 'dimmer switch', 'switch',
    'remote control', 'detector', 'motion sensor', 'dusk to dawn', 'timer', 'rgb',
    'multicolor', 'connected', 'smart', 'bluetooth', 'wifi', 'home automation', 'philips hue',
    'filament', 'Edison', 'retro', 'vintage', 'globe', 'flame', 'spot', 'dichroic',
    'base', 'socket', 'suspension', 'canopy', 'cable', 'wire', 'cord', 'chain',
    'downlight', 'uplighter', 'tiffany lamp', 'task light', 'light fitting', 'light fixture'
    ]
  },

  'Mode et Vêtements': {
   fr: [
    'vetement', 'habillement', 'mode', 'homme', 'femme', 'enfant', 'tshirt',
    'chemise', 'pantalon', 'jean', 'robe', 'jupe', 'manteau', 'veste', 'blouson',
    'pull', 'sweat', 'gilet', 'sous-vetement', 'chaussette', 'collant',
    'pyjama', 'maillot', 'bain', 'echarpe', 'bonnet', 'gant', 'chemisier',
    'polo', 'cravate', 'noeud papillon', 'costume', 'tailleur', 'blazer',
    'short', 'bermuda', 'corsaire', 'legging', 'jogging', 'survetement',
    'debardeur', 'caraco', 'bustier', 'body', 'combinaison', 'salopette',
    'trench', 'imperméable', 'coupe-vent', 'doudoune', 'parka', 'caban',
    'cardigan', 'poncho', 'châle', 'etole', 'foulard', 'ceinture', 'bretelle',
    'soutien-gorge', 'culotte', 'slip', 'boxer', 'caleçon', 'string',
    'shorty', 'nuisette', 'déshabillé', 'bas', 'mi-bas', 'legging', 'collant',
    'chaussure', 'basket', 'tennis', 'mocassin', 'derby', 'richelieu', 'escarpin',
    'bottine', 'botte', 'ballerine', 'sandale', 'espadrille', 'mule', 'tong',
    'chausson', 'pantoufle', 'casquette', 'chapeau', 'béret', 'cagoule', 'bandana',
    'serre-tête', 'bandeau', 'mitaine', 'moufle', 'lingerie', 'robe de chambre',
    'peignoir', 'doudou', 'grenouillère', 'body bébé', 'bavoir', 'barboteuse',
    'maillot de corps', 'sac', 'sac à main', 'pochette', 'cartable', 'besace',
    'sacoche', 'sac à dos', 'valise', 'portefeuille', 'porte-monnaie', 'bijou',
    'montre', 'bracelet', 'collier', 'bague', 'boucle d\'oreille', 'lunettes'
    ],
    en: [
    'clothing', 'fashion', 'men', 'women', 'child', 'tshirt',
    'shirt', 'pants', 'jeans', 'dress', 'skirt', 'coat', 'jacket',
    'sweater', 'sweatshirt', 'cardigan', 'underwear', 'sock', 'tights',
    'pajamas', 'swimsuit', 'swimming', 'scarf', 'hat', 'glove', 'blouse',
    'polo', 'tie', 'bow tie', 'suit', 'women\'s suit', 'blazer',
    'shorts', 'bermuda', 'capri pants', 'leggings', 'joggers', 'tracksuit',
    'tank top', 'camisole', 'bustier', 'bodysuit', 'jumpsuit', 'overalls',
    'trench coat', 'raincoat', 'windbreaker', 'down jacket', 'parka', 'peacoat',
    'cardigan', 'poncho', 'shawl', 'stole', 'neckerchief', 'belt', 'suspender',
    'bra', 'panty', 'brief', 'boxer', 'boxer brief', 'thong',
    'boyshort', 'negligee', 'robe', 'stocking', 'knee-high', 'legging', 'pantyhose',
    'shoe', 'sneaker', 'tennis shoe', 'loafer', 'derby', 'oxford', 'pump',
    'ankle boot', 'boot', 'ballet flat', 'sandal', 'espadrille', 'mule', 'flip-flop',
    'slipper', 'house shoe', 'cap', 'hat', 'beret', 'balaclava', 'bandana',
    'headband', 'hairband', 'fingerless glove', 'mitten', 'lingerie', 'dressing gown',
    'bathrobe', 'comfort blanket', 'onesie', 'baby bodysuit', 'bib', 'romper',
    'undershirt', 'bag', 'handbag', 'clutch', 'satchel', 'messenger bag',
    'pouch', 'backpack', 'suitcase', 'wallet', 'coin purse', 'jewelry',
    'watch', 'bracelet', 'necklace', 'ring', 'earring', 'glasses',
    'hoodie', 'crop top', 'maxi dress', 'mini skirt', 'pleated skirt', 'denim jacket'
    ]
  },

  'Bijoux et Accessoires': {
   fr: [
    'bijou', 'montre', 'bracelet', 'collier', 'bague', 'boucle', 'oreille',
    'pendentif', 'chaine', 'jonc', 'gourmette', 'diamant', 'or', 'argent',
    'plaque', 'perle', 'swarovski', 'cristal', 'acier', 'titane', 'cuir',
    'alliance', 'solitaire', 'chevalière', 'créole', 'puces', 'broche', 'épingle',
    'diadème', 'tiare', 'couronne', 'parure', 'gemme', 'pierre précieuse', 'rubis',
    'saphir', 'émeraude', 'topaze', 'améthyste', 'aigue-marine', 'opale', 'grenat',
    'citrine', 'jade', 'turquoise', 'onyx', 'camée', 'chaîne de cheville', 'bracelet de cheville',
    'bracelet manchette', 'bague de fiançailles', 'piercing', 'charm', 'médaillon',
    'talisman', 'amulette', 'rosaire', 'chapelet', 'crucifix', 'croix', 'étoile',
    'cœur', 'trèfle', 'montre automatique', 'montre quartz', 'montre digitale', 'montre connectée',
    'montre mécanique', 'chronomètre', 'fermoir', 'brillant', 'platine', 'vermeil',
    'rhodium', 'laiton', 'bronze', 'cuivre', 'céramique', 'nacre', 'coquillage',
    'corail', 'ambre', 'porcelaine', 'résine', 'bois', 'corne', 'os', 'ivoire',
    'écaille', 'plume', 'bijou ethnique', 'bijou fantaisie', 'bijou artisanal', 'bijou vintage',
    'bijou contemporain', 'bijou antique', 'accessoire cheveux', 'pince', 'barrette',
    'épingle à cheveux', 'headband', 'bandeau', 'serre-tête', 'bijou de tête', 'ornement'
    ],
    en: [
    'jewelry', 'watch', 'bracelet', 'necklace', 'ring', 'earring',
    'pendant', 'chain', 'bangle', 'id bracelet', 'diamond', 'gold', 'silver',
    'plated', 'pearl', 'swarovski', 'crystal', 'steel', 'titanium', 'leather',
    'wedding band', 'solitaire', 'signet ring', 'hoop earring', 'stud earring', 'brooch', 'pin',
    'diadem', 'tiara', 'crown', 'jewelry set', 'gem', 'precious stone', 'ruby',
    'sapphire', 'emerald', 'topaz', 'amethyst', 'aquamarine', 'opal', 'garnet',
    'citrine', 'jade', 'turquoise', 'onyx', 'cameo', 'ankle chain', 'anklet',
    'cuff bracelet', 'engagement ring', 'body piercing', 'charm', 'locket',
    'talisman', 'amulet', 'rosary', 'prayer beads', 'crucifix', 'cross', 'star',
    'heart', 'clover', 'automatic watch', 'quartz watch', 'digital watch', 'smartwatch',
    'mechanical watch', 'chronometer', 'clasp', 'brilliant', 'platinum', 'vermeil',
    'rhodium', 'brass', 'bronze', 'copper', 'ceramic', 'mother of pearl', 'shell',
    'coral', 'amber', 'porcelain', 'resin', 'wood', 'horn', 'bone', 'ivory',
    'tortoiseshell', 'feather', 'ethnic jewelry', 'costume jewelry', 'handcrafted jewelry', 'vintage jewelry',
    'contemporary jewelry', 'antique jewelry', 'hair accessory', 'hair clip', 'barrette',
    'hairpin', 'headband', 'hair band', 'head piece', 'hair ornament', 'embellishment',
    'cocktail ring', 'promise ring', 'toe ring', 'belly button ring', 'gemstone', 'birthstone'
    ]
  },

  'Chaussures': {
   fr: [
    'chaussure', 'basket', 'sneaker', 'botte', 'bottine', 'escarpin', 'mocassin',
    'sandale', 'ballerine', 'derby', 'richelieu', 'slip-on', 'tong', 'mule',
    'sabot', 'semelle', 'lacet', 'talon', 'compense', 'plateforme', 'sport',
    'running', 'jogging', 'trail', 'randonnée', 'marche', 'trekking', 'alpinisme',
    'escalade', 'montagne', 'ski', 'snowboard', 'après-ski', 'surf', 'skateboard',
    'roller', 'patin', 'football', 'rugby', 'tennis', 'golf', 'basket-ball',
    'handball', 'volley-ball', 'danse', 'ballet', 'gymnastique', 'fitness', 'yoga',
    'pilates', 'aquatique', 'plage', 'piscine', 'cuissarde', 'botte cavalière',
    'bottes de pluie', 'bottes en caoutchouc', 'bottes fourrées', 'chelsea boots',
    'desert boots', 'rangers', 'doc martens', 'ugg', 'converse', 'vans', 'adidas',
    'nike', 'puma', 'reebok', 'asics', 'new balance', 'skechers', 'timberland',
    'birkenstock', 'havaianas', 'crocs', 'salomon', 'merrell', 'rieker', 'geox',
    'clarks', 'kickers', 'aigle', 'le coq sportif', 'lacoste', 'chausson', 'pantoufle',
    'babouche', 'espadrille', 'cuir', 'daim', 'nubuck', 'toile', 'synthétique',
    'textile', 'mesh', 'gore-tex', 'imperméable', 'membrane', 'respirant', 'amorti',
    'confort', 'orthopédique', 'semelle intérieure', 'voûte plantaire', 'talon aiguille',
    'talon bloc', 'talon kitten', 'talon bottier', 'stiletto', 'compensé', 'corde'
    ],
    en: [
    'shoe', 'sneaker', 'boot', 'pump', 'loafer',
    'sandal', 'ballet flat', 'derby', 'oxford', 'slip-on', 'flip-flop', 'mule',
    'clog', 'insole', 'lace', 'heel', 'wedge', 'platform', 'sport',
    'running', 'jogging', 'trail', 'hiking', 'walking', 'trekking', 'mountaineering',
    'climbing', 'mountain', 'ski', 'snowboard', 'after-ski', 'surf', 'skateboard',
    'roller', 'skate', 'football', 'rugby', 'tennis', 'golf', 'basketball',
    'handball', 'volleyball', 'dance', 'ballet', 'gymnastics', 'fitness', 'yoga',
    'pilates', 'aquatic', 'beach', 'pool', 'thigh-high boot', 'riding boot',
    'rain boot', 'rubber boot', 'fur-lined boot', 'chelsea boot',
    'desert boot', 'combat boot', 'doc martens', 'ugg', 'converse', 'vans', 'adidas',
    'nike', 'puma', 'reebok', 'asics', 'new balance', 'skechers', 'timberland',
    'birkenstock', 'havaianas', 'crocs', 'salomon', 'merrell', 'rieker', 'geox',
    'clarks', 'kickers', 'aigle', 'le coq sportif', 'lacoste', 'slipper', 'house shoe',
    'babouche', 'espadrille', 'leather', 'suede', 'nubuck', 'canvas', 'synthetic',
    'textile', 'mesh', 'gore-tex', 'waterproof', 'membrane', 'breathable', 'cushioning',
    'comfort', 'orthopedic', 'insole', 'arch support', 'stiletto heel',
    'block heel', 'kitten heel', 'cuban heel', 'stiletto', 'wedge', 'rope',
    'high-top', 'low-top', 'moccasin', 'boat shoe', 'driving shoe', 'penny loafer'
    ]
  },

  'Musique et CD': {
   fr: [
    'musique', 'cd', 'vinyle', 'album', 'single', 'compilation', 'coffret',
    'edition', 'limitee', 'collector', 'box', 'set', 'pop', 'rock', 'metal',
    'jazz', 'classique', 'rap', 'hip-hop', 'electro', 'blues', 'reggae',
    'folk', 'country', 'world', 'bande originale', 'soundtrack', 'disque',
    '33 tours', '45 tours', 'maxi', 'EP', 'picture disc', 'remix', 'live',
    'concert', 'unplugged', 'acoustique', 'symphonique', 'opera', 'opérette',
    'chorale', 'chant', 'vocal', 'instrumental', 'orchestre', 'philharmonique',
    'symphonie', 'concerto', 'sonate', 'chanson française', 'variété', 'variété française',
    'indie', 'alternative', 'grunge', 'punk', 'hardcore', 'death metal',
    'black metal', 'heavy metal', 'thrash', 'hard rock', 'progressive', 'psychédélique',
    'funk', 'soul', 'r&b', 'disco', 'dance', 'techno', 'house', 'trance',
    'ambient', 'trip-hop', 'downtempo', 'drum and bass', 'dubstep', 'gospel',
    'spiritual', 'new age', 'relaxation', 'méditation', 'musique de film',
    'musique de jeu vidéo', 'enfant', 'comptine', 'berceuse', 'karaoké',
    'tropical', 'latino', 'salsa', 'merengue', 'bachata', 'tango', 'flamenco',
    'oriental', 'raï', 'afro', 'celte', 'reggaeton', 'ska', 'dub', 'zouk',
    'K-pop', 'J-pop', 'chansons de Noël', 'musique religieuse', 'musique sacrée',
    'hymne', 'baroque', 'renaissance', 'médiéval', 'contemporain', 'avant-garde'
    ],
    en: [
    'music', 'cd', 'vinyl', 'album', 'single', 'compilation', 'box set',
    'edition', 'limited', 'collector', 'box', 'set', 'pop', 'rock', 'metal',
    'jazz', 'classical', 'rap', 'hip-hop', 'electronic', 'blues', 'reggae',
    'folk', 'country', 'world', 'original soundtrack', 'soundtrack', 'record',
    'LP', '45 RPM', 'maxi single', 'EP', 'picture disc', 'remix', 'live',
    'concert', 'unplugged', 'acoustic', 'symphonic', 'opera', 'operetta',
    'choral', 'vocal', 'voice', 'instrumental', 'orchestra', 'philharmonic',
    'symphony', 'concerto', 'sonata', 'french song', 'variety', 'french variety',
    'indie', 'alternative', 'grunge', 'punk', 'hardcore', 'death metal',
    'black metal', 'heavy metal', 'thrash', 'hard rock', 'progressive', 'psychedelic',
    'funk', 'soul', 'r&b', 'disco', 'dance', 'techno', 'house', 'trance',
    'ambient', 'trip-hop', 'downtempo', 'drum and bass', 'dubstep', 'gospel',
    'spiritual', 'new age', 'relaxation', 'meditation', 'film score',
    'video game music', 'children', 'nursery rhyme', 'lullaby', 'karaoke',
    'tropical', 'latin', 'salsa', 'merengue', 'bachata', 'tango', 'flamenco',
    'oriental', 'rai', 'afro', 'celtic', 'reggaeton', 'ska', 'dub', 'zouk',
    'K-pop', 'J-pop', 'Christmas songs', 'religious music', 'sacred music',
    'hymn', 'baroque', 'renaissance', 'medieval', 'contemporary', 'avant-garde',
    'streaming', 'digital download', 'deluxe edition', 'remastered', 'anniversary edition'
    ]
  },

  'Outils et Bricolage': {
   fr: [
    'outil', 'bricolage', 'tournevis', 'marteau', 'perceuse', 'visseuse', 'scie',
    'ponceuse', 'meuleuse', 'cle', 'pince', 'niveau', 'metre', 'equerre', 'etabli',
    'compresseur', 'visserie', 'clouterie', 'quincaillerie', 'fixation', 'joint',
    'menuiserie', 'plomberie', 'electricite', 'peinture', 'papier peint',
    'lime', 'rabot', 'ciseaux à bois', 'burin', 'pied de biche', 'perceuse à colonne',
    'scie circulaire', 'scie sauteuse', 'scie à onglet', 'défonceuse', 'fraiseuse',
    'toupie', 'tour à bois', 'chalumeau', 'poste à souder', 'décapeur thermique',
    'pistolet à colle', 'pistolet à peinture', 'agrafeuse', 'cloueuse', 'riveteuse',
    'cle à molette', 'cle plate', 'cle à pipe', 'cle allen', 'cle dynamométrique',
    'pince multiprise', 'pince coupante', 'pince à dénuder', 'pince à sertir',
    'tenaille', 'marteau de vitrier', 'massette', 'masse', 'maillet', 'fil à plomb',
    'équerre de menuisier', 'rapporteur', 'compas', 'traceur', 'cordeau', 'laser',
    'télémètre', 'détecteur', 'hygromètre', 'thermomètre', 'manomètre', 'multimètre',
    'testeur', 'perforateur', 'burineur', 'carrelette', 'coupe-carreaux', 'coupe-tube',
    'coupe-boulon', 'serre-joint', 'étau', 'enclume', 'chevalet', 'escabeau', 'échelle',
    'établi pliant', 'caisse à outils', 'servante', 'rangement', 'coffre', 'foret',
    'mèche', 'embout', 'fraise', 'disque', 'lame', 'abrasif', 'papier de verre',
    'lime', 'râpe', 'colle', 'adhésif', 'ruban', 'isolant', 'mousse expansive',
    'silicone', 'mastic', 'enduit', 'primaire', 'vernis', 'lasure', 'teinte',
    'diluant', 'décapant', 'solvant', 'huile', 'graisse', 'lubrifiant', 'antirouille'
    ],
    en: [
    'tool', 'diy', 'screwdriver', 'hammer', 'drill', 'driver', 'saw',
    'sander', 'grinder', 'wrench', 'pliers', 'level', 'tape measure', 'square', 'workbench',
    'compressor', 'screws', 'nails', 'hardware', 'fastener', 'seal',
    'carpentry', 'plumbing', 'electrical', 'paint', 'wallpaper',
    'file', 'plane', 'wood chisel', 'cold chisel', 'crowbar', 'drill press',
    'circular saw', 'jigsaw', 'miter saw', 'router', 'milling machine',
    'shaper', 'wood lathe', 'blowtorch', 'welding machine', 'heat gun',
    'glue gun', 'paint gun', 'stapler', 'nail gun', 'riveter',
    'adjustable wrench', 'open-end wrench', 'box wrench', 'hex key', 'torque wrench',
    'water pump pliers', 'cutting pliers', 'wire stripper', 'crimping pliers',
    'pincers', 'glazier hammer', 'club hammer', 'sledge hammer', 'mallet', 'plumb bob',
    'carpenter square', 'protractor', 'compass', 'chalk line', 'line reel', 'laser level',
    'rangefinder', 'detector', 'hygrometer', 'thermometer', 'pressure gauge', 'multimeter',
    'tester', 'rotary hammer', 'chisel hammer', 'tile cutter', 'tile nipper', 'pipe cutter',
    'bolt cutter', 'clamp', 'vise', 'anvil', 'sawhorse', 'step ladder', 'ladder',
    'folding workbench', 'toolbox', 'tool chest', 'storage', 'case', 'drill bit',
    'auger bit', 'bit', 'router bit', 'disc', 'blade', 'abrasive', 'sandpaper',
    'file', 'rasp', 'glue', 'adhesive', 'tape', 'insulation', 'expanding foam',
    'silicone', 'putty', 'filler', 'primer', 'varnish', 'wood stain', 'tint',
    'thinner', 'stripper', 'solvent', 'oil', 'grease', 'lubricant', 'rust inhibitor'
    ]
  },

  'Photographie': {
   fr: [ 
    'appareil photo', 'objectif', 'boitier', 'trépied', 'capteur', 'flash', 'numérique', 
    'argentique', 'hybride', 'téléobjectif', 'grandangle', 'macro', 'photographie', 
    'compact', 'pellicule', 'focale', 'mise au point', 'viseur', 'exposition', 
    'obturateur', 'diaphragme', 'ouverture', 'sac photo', 'réflecteur', 'filtre',
    'papier photo', 'impression photo', 'tirage photo', 'encre photo', 'brillant', 'mat',
    'reflex', 'bridge', 'stabilisateur', 'collimateur', 'balance des blancs', 'cadrage',
    'profondeur de champ', 'bokeh', 'contre-jour', 'portrait', 'paysage', 'studio',
    'lumière continue', 'déclencheur', 'retardateur', 'pied', 'trépied', 'monopode',
    'correcteur', 'photosensible', 'chimie photo', 'développeur', 'fixateur', 'bain arrêt',
    'agrandisseur', 'chambre noire', 'polaroid', 'instantané', 'lomographie', 'carte mémoire',
    'stockage', 'batterie', 'chargeur', 'logiciel retouche', 'lightroom', 'photoshop',
    'raw', 'jpeg', 'plein format', 'aps-c', 'recadrage', 'résolution', 'pixel', 'mode rafale',
    'flash cobra', 'diffuseur', 'pare-soleil', 'bonnette', 'filtre polarisant', 'filtre nd',
      
    // Anglais
    'camera', 'dslr', 'lens', 'mirrorless', 'telephoto', 'stabilizer', 
    'photography', 'fisheye', 'viewfinder', 'shutter', 'aperture', 
    'iso', 'camera bag', 'lightroom', 'photoshop', 'monopod', 'bracketing', 
    'hdr', 'panorama', 'timelapse', 'megapixels', 'lens hood', 'prime lens', 
    'landscape', 'portrait', 'photo paper', 'printing', 'glossy', 'matte', 
    'photo ink', 'photo print', 'epson photo', 'canon photo', 'full frame',
    'crop sensor', 'zoom lens', 'wide angle', 'focal length', 'depth of field',
    'exposure triangle', 'white balance', 'raw format', 'jpeg', 'histogram',
    'light meter', 'flash sync', 'hotshoe', 'memory card', 'sd card', 'compact flash',
    'tripod head', 'ball head', 'gimbal', 'polarizing filter', 'neutral density',
    'graduated filter', 'color correction', 'macro photography', 'street photography',
    'wildlife photography', 'studio strobe', 'softbox', 'beauty dish', 'snoot',
    'umbrella', 'backdrop', 'light stand', 'tethering', 'focus stacking', 'bracketing',
    'time-lapse', 'intervalometer', 'golden hour', 'blue hour', 'composition',
    'rule of thirds', 'leading lines', 'symmetry', 'framing', 'spot metering'
    ]
  },

  'Produits Ménagers': {
   fr: [
    'nettoyage', 'entretien', 'menager', 'savon', 'lessive', 'detergent', 'desinfectant',
    'aspirateur', 'balai', 'serpillere', 'chiffon', 'produit', 'vaisselle', 'rangement',
    'nettoyant', 'desodorisant', 'antipoussiere', 'brosse', 'eponge', 'vitre', 'sol',
    'nettoyant multi-surface', 'nettoyant sol', 'nettoyant cuisine', 'nettoyant salle de bain',
    'nettoyant sanitaire', 'nettoyant WC', 'nettoyant vitres', 'nettoyant inox',
    'nettoyant tapis', 'nettoyant moquette', 'nettoyant meuble', 'nettoyant bois',
    'nettoyant cuir', 'nettoyant argent', 'nettoyant bijoux', 'nettoyant four',
    'nettoyant plaque', 'nettoyant friteuse', 'déboucheur', 'détartrant', 'anticalcaire',
    'lessive liquide', 'lessive poudre', 'lessive capsule', 'adoucissant', 'assouplissant',
    'eau de javel', 'eau écarlate', 'ammoniaque', 'bicarbonate', 'vinaigre blanc',
    'cristaux de soude', 'pierre d\'argile', 'savon noir', 'savon de Marseille',
    'lessiver', 'décaper', 'récurer', 'frotter', 'brosser', 'essuyer', 'sécher',
    'cirer', 'lustrer', 'polir', 'raviver', 'détacher', 'dégraisser', 'désinfecter',
    'assainir', 'purifier', 'parfumer', 'désodoriser', 'aérer', 'ventiler',
    'aspirer', 'balayer', 'épousseter', 'laver', 'rincer', 'essorer',
    'repasser', 'plier', 'étendre', 'sécher', 'ranger', 'trier', 'organiser',
    'classer', 'étiqueter', 'boîte', 'caisse', 'panier', 'corbeille', 'sac', 'bac',
    'container', 'poubelle', 'collecteur', 'tri', 'compost', 'recyclage', 'déchet',
    'ordure', 'lingette', 'torchon', 'lavette', 'microfibre', 'gant', 'éponge',
    'grattoir', 'raclette', 'balai', 'balai-brosse', 'balai espagnol', 'pelle', 'balayette',
    'plumeau', 'manche télescopique', 'tête de loup', 'brosse WC', 'balai WC'
    ],
    en: [
    'cleaning', 'maintenance', 'household', 'soap', 'laundry', 'detergent', 'disinfectant',
    'vacuum', 'broom', 'mop', 'cloth', 'product', 'dishwashing', 'storage',
    'cleaner', 'deodorizer', 'duster', 'brush', 'sponge', 'window', 'floor',
    'multi-surface cleaner', 'floor cleaner', 'kitchen cleaner', 'bathroom cleaner',
    'toilet cleaner', 'glass cleaner', 'stainless steel cleaner',
    'carpet cleaner', 'rug cleaner', 'furniture cleaner', 'wood cleaner',
    'leather cleaner', 'silver cleaner', 'jewelry cleaner', 'oven cleaner',
    'stovetop cleaner', 'fryer cleaner', 'drain cleaner', 'descaler', 'limescale remover',
    'liquid detergent', 'powder detergent', 'laundry pod', 'fabric softener', 'conditioner',
    'bleach', 'stain remover', 'ammonia', 'baking soda', 'white vinegar',
    'washing soda', 'cleaning stone', 'black soap', 'Marseille soap',
    'wash', 'strip', 'scour', 'scrub', 'brush', 'wipe', 'dry',
    'wax', 'polish', 'buff', 'revive', 'spot clean', 'degrease', 'disinfect',
    'sanitize', 'purify', 'scent', 'deodorize', 'air out', 'ventilate',
    'vacuum', 'sweep', 'dust', 'wash', 'rinse', 'wring',
    'iron', 'fold', 'hang', 'dry', 'organize', 'sort', 'arrange',
    'classify', 'label', 'box', 'crate', 'basket', 'bin', 'bag', 'container',
    'trash can', 'garbage can', 'collector', 'sorting', 'compost', 'recycling', 'waste',
    'garbage', 'wipe', 'dish towel', 'dishcloth', 'microfiber', 'glove', 'sponge',
    'scraper', 'squeegee', 'broom', 'scrub brush', 'push broom', 'dustpan', 'hand brush',
    'feather duster', 'telescopic handle', 'cobweb duster', 'toilet brush', 'toilet cleaner'
    ]
  },

  'Quincaillerie': {
   fr: [
    'outil', 'bricolage', 'vis', 'clou', 'perceuse', 'tournevis', 'marteau',
    'pince', 'scie', 'ponceuse', 'peinture', 'colle', 'echelle', 'escabeau',
    'rangement', 'boite', 'caisse', 'etabli', 'accessoire', 'boulon', 'écrou',
    'rondelle', 'cheville', 'goujon', 'rivet', 'agrafe', 'crampon', 'cavalier',
    'piton', 'crochet', 'anneau', 'chaîne', 'câble', 'fil', 'corde', 'sangle',
    'poignée', 'bouton', 'serrure', 'verrou', 'loquet', 'cadenas', 'gond',
    'charnière', 'paumelle', 'pivot', 'équerre', 'entretoise', 'support',
    'console', 'étagère', 'rail', 'glissière', 'coulisse', 'roulette',
    'castor', 'patin', 'butée', 'arrêt', 'aimant', 'velcro', 'adhésif',
    'silicone', 'mastic', 'joint', 'isolant', 'mousse', 'calfeutrage',
    'tuyau', 'tube', 'raccord', 'adaptateur', 'coude', 'té', 'réduction',
    'vanne', 'robinet', 'clapet', 'manchon', 'collier', 'bride', 'bouchon',
    'connecteur', 'domino', 'interrupteur', 'prise', 'douille', 'disjoncteur',
    'fusible', 'gaine', 'presse-étoupe', 'boîtier', 'tableau électrique',
    'protection', 'gant', 'lunette', 'casque', 'masque', 'bouchon oreille',
    'genouillère', 'ceinture', 'harnais', 'chaussure sécurité', 'vêtement travail',
    'mesure', 'règle', 'mètre', 'niveau', 'fil à plomb', 'équerre', 'compas',
    'jauge', 'calibre', 'rapporteur', 'gabarit', 'pochoir', 'trace', 'marqueur'
    ],
    en: [
    'tool', 'diy', 'screw', 'nail', 'drill', 'screwdriver', 'hammer',
    'pliers', 'saw', 'sander', 'paint', 'glue', 'ladder', 'step ladder',
    'storage', 'box', 'crate', 'workbench', 'accessory', 'bolt', 'nut',
    'washer', 'wall plug', 'dowel', 'rivet', 'staple', 'clamp', 'clip',
    'eyebolt', 'hook', 'ring', 'chain', 'cable', 'wire', 'rope', 'strap',
    'handle', 'knob', 'lock', 'bolt lock', 'latch', 'padlock', 'hinge pin',
    'hinge', 'door hinge', 'pivot', 'bracket', 'spacer', 'support',
    'shelf bracket', 'shelf', 'rail', 'slide', 'drawer slide', 'caster',
    'wheel', 'furniture pad', 'door stop', 'stopper', 'magnet', 'velcro', 'adhesive',
    'silicone', 'putty', 'seal', 'insulation', 'foam', 'weatherstripping',
    'hose', 'pipe', 'fitting', 'adapter', 'elbow', 'tee', 'reducer',
    'valve', 'faucet', 'check valve', 'sleeve', 'collar', 'flange', 'cap',
    'connector', 'terminal block', 'switch', 'outlet', 'socket', 'circuit breaker',
    'fuse', 'conduit', 'cable gland', 'junction box', 'electrical panel',
    'protection', 'glove', 'safety glasses', 'helmet', 'mask', 'ear plug',
    'knee pad', 'tool belt', 'harness', 'safety shoe', 'work clothes',
    'measurement', 'ruler', 'tape measure', 'level', 'plumb line', 'square', 'compass',
    'gauge', 'caliper', 'protractor', 'template', 'stencil', 'marking', 'marker',
    'hardware store', 'joinery', 'fasteners', 'woodworking', 'anchors', 'trowel'
    ]
  },

  'Salle de bain': {
   fr: [
    'bain', 'douche', 'lavabo', 'robinet', 'toilette', 'wc', 'serviette',
    'tapis bain', 'armoire toilette', 'brosse dent', 'savon', 'salle eau',
    'sanitaire', 'baignoire', 'vasque', 'miroir', 'porte serviette', 
    'cabine douche', 'paroi douche', 'receveur douche', 'bonde', 'siphon',
    'mitigeur', 'mélangeur', 'thermostatique', 'douchette', 'pommeau', 'flexible',
    'rideau douche', 'pare-douche', 'porte coulissante', 'abattant WC', 'réservoir',
    'chasse d\'eau', 'bidet', 'lave-mains', 'évier', 'lavabo double', 'meuble vasque',
    'colonne', 'sous vasque', 'plan travail', 'carrelage', 'faïence', 'joint',
    'tablette', 'étagère', 'niche', 'panier', 'organisateur', 'rangement', 'placard',
    'armoire', 'meuble haut', 'meuble bas', 'étagère murale', 'étagère d\'angle',
    'porte-serviette chauffant', 'sèche-serviette', 'radiateur', 'chauffage d\'appoint',
    'ventilation', 'VMC', 'grille aération', 'extracteur', 'déshumidificateur',
    'miroir grossissant', 'miroir lumineux', 'éclairage', 'spot', 'applique', 'plafonnier',
    'distributeur savon', 'porte savon', 'gobelet', 'porte brosse à dents', 'porte papier',
    'brosse WC', 'poubelle', 'balance', 'marchepied', 'tabouret', 'siège douche',
    'tapis antidérapant', 'ventouse', 'sèche-cheveux', 'chauffe-eau', 'balai', 'raclette',
    'éponge', 'gant toilette', 'serviette main', 'serviette bain', 'peignoir', 'drap bain',
    'tapis contour WC', 'produit nettoyant', 'gel douche', 'shampoing', 'après-shampoing',
    'dentifrice', 'bain moussant', 'sel de bain', 'cosmétique', 'soin', 'maquillage',
    'rasoir', 'mousse à raser', 'after-shave', 'parfum', 'déodorant', 'coton-tige'
    ],
    en: [
    'bath', 'shower', 'sink', 'faucet', 'tap', 'toilet', 'towel',
    'bath mat', 'medicine cabinet', 'toothbrush', 'soap', 'bathroom',
    'sanitary', 'bathtub', 'basin', 'mirror', 'towel rack',
    'shower enclosure', 'shower screen', 'shower tray', 'drain', 'trap',
    'mixer tap', 'mixing valve', 'thermostatic', 'hand shower', 'shower head', 'flexible hose',
    'shower curtain', 'shower door', 'sliding door', 'toilet seat', 'toilet tank',
    'flush', 'bidet', 'hand basin', 'sink', 'double sink', 'vanity unit',
    'pedestal', 'under sink cabinet', 'countertop', 'tile', 'ceramic tile', 'grout',
    'shelf', 'ledge', 'niche', 'basket', 'organizer', 'storage', 'cabinet',
    'cupboard', 'wall cabinet', 'base cabinet', 'wall shelf', 'corner shelf',
    'heated towel rail', 'towel warmer', 'radiator', 'space heater',
    'ventilation', 'extractor fan', 'ventilation grille', 'extractor', 'dehumidifier',
    'magnifying mirror', 'illuminated mirror', 'lighting', 'spotlight', 'wall light', 'ceiling light',
    'soap dispenser', 'soap dish', 'tumbler', 'toothbrush holder', 'toilet paper holder',
    'toilet brush', 'trash can', 'scale', 'step stool', 'stool', 'shower seat',
    'non-slip mat', 'suction cup', 'hair dryer', 'water heater', 'broom', 'squeegee',
    'sponge', 'washcloth', 'hand towel', 'bath towel', 'bathrobe', 'bath sheet',
    'toilet rug', 'cleaner', 'shower gel', 'shampoo', 'conditioner',
    'toothpaste', 'bubble bath', 'bath salt', 'cosmetic', 'skincare', 'makeup',
    'razor', 'shaving foam', 'after-shave', 'perfume', 'deodorant', 'cotton swab',
    'plunger', 'toilet plunger', 'bathroom accessories', 'shower caddy', 'steam shower'
    ]
  },

  'Santé et Soins personnels': {
   fr: [
    'sante', 'soin', 'personnel', 'hygiene', 'medicament', 'vitamine', 'complement',
    'alimentaire', 'parapharmacie', 'brosse', 'dent', 'dentifrice', 'savon',
    'gel', 'douche', 'shampooing', 'deodorant', 'rasoir', 'mousse', 'creme',
    'hydratant', 'serum', 'masque', 'lotion', 'tonique', 'bain', 'huile',
    'antiseptique', 'désinfectant', 'pansement', 'bandage', 'sparadrap', 'compresse',
    'gaze', 'coton', 'thermomètre', 'tensiomètre', 'test', 'diagnostic', 'homéopathie',
    'aromathérapie', 'phytothérapie', 'huile essentielle', 'tisane', 'infusion', 'probiotique',
    'collagène', 'protéine', 'acide hyaluronique', 'rétinol', 'antioxydant', 'oméga-3',
    'zinc', 'magnésium', 'fer', 'calcium', 'potassium', 'vitamine C', 'vitamine D',
    'vitamine B', 'multivitamine', 'antibactérien', 'antifongique', 'antiseptique',
    'antihistaminique', 'analgésique', 'anti-inflammatoire', 'antipyrétique', 'laxatif',
    'antidiarrhéique', 'antiacide', 'sirop', 'comprimé', 'gélule', 'pastille', 'ampoule',
    'spray', 'pommade', 'baume', 'gouttes', 'collyre', 'flacon', 'stick', 'roll-on',
    'gommage', 'exfoliant', 'peeling', 'nettoyant', 'démaquillant', 'toner', 'après-rasage',
    'mousse à raser', 'cire', 'épilation', 'dépilatoire', 'coupe-ongle', 'lime à ongle',
    'vernis', 'dissolvant', 'manucure', 'pédicure', 'pince à épiler', 'coton-tige',
    'mouchoir', 'lingette', 'coupe-faim', 'minceur', 'drainage', 'cellulite', 'relaxant',
    'sommeil', 'stress', 'anxiété', 'énergie', 'vitalité', 'mémoire', 'concentration',
    'articulation', 'muscle', 'circulation', 'digestion', 'transit', 'immunité'
    ],
    en: [
    'health', 'care', 'personal', 'hygiene', 'medicine', 'vitamin', 'supplement',
    'dietary', 'pharmacy', 'brush', 'tooth', 'toothpaste', 'soap',
    'gel', 'shower', 'shampoo', 'deodorant', 'razor', 'foam', 'cream',
    'moisturizer', 'serum', 'mask', 'lotion', 'toner', 'bath', 'oil',
    'antiseptic', 'disinfectant', 'plaster', 'bandage', 'adhesive tape', 'compress',
    'gauze', 'cotton', 'thermometer', 'blood pressure monitor', 'test', 'diagnostic', 'homeopathy',
    'aromatherapy', 'herbal medicine', 'essential oil', 'herbal tea', 'infusion', 'probiotic',
    'collagen', 'protein', 'hyaluronic acid', 'retinol', 'antioxidant', 'omega-3',
    'zinc', 'magnesium', 'iron', 'calcium', 'potassium', 'vitamin C', 'vitamin D',
    'vitamin B', 'multivitamin', 'antibacterial', 'antifungal', 'antiseptic',
    'antihistamine', 'painkiller', 'anti-inflammatory', 'fever reducer', 'laxative',
    'anti-diarrheal', 'antacid', 'syrup', 'tablet', 'capsule', 'lozenge', 'ampoule',
    'spray', 'ointment', 'balm', 'drops', 'eye drops', 'bottle', 'stick', 'roll-on',
    'scrub', 'exfoliant', 'peeling', 'cleanser', 'makeup remover', 'toner', 'aftershave',
    'shaving foam', 'wax', 'hair removal', 'depilatory', 'nail clipper', 'nail file',
    'nail polish', 'remover', 'manicure', 'pedicure', 'tweezers', 'cotton swab',
    'tissue', 'wipe', 'appetite suppressant', 'slimming', 'drainage', 'cellulite', 'relaxant',
    'sleep', 'stress', 'anxiety', 'energy', 'vitality', 'memory', 'concentration',
    'joint', 'muscle', 'circulation', 'digestion', 'transit', 'immunity',
    'first aid kit', 'sunscreen', 'sunblock', 'moisturizer', 'body wash', 'conditioner'
    ]
  },

  'Sports et Plein air': {
   fr: [
    'sport', 'plein air', 'fitness', 'musculation', 'velo', 'course', 'running',
    'natation', 'randonnee', 'camping', 'peche', 'chasse', 'ski', 'snowboard',
    'tennis', 'football', 'basketball', 'rugby', 'golf', 'equitation', 'yoga',
    'pilates', 'crossfit', 'accessoire', 'equipement', 'tenue', 'chaussure',
    'vélo électrique', 'VTT', 'vélo de route', 'vélo de ville', 'BMX', 'trottinette',
    'roller', 'skateboard', 'longboard', 'surf', 'bodyboard', 'planche à voile',
    'kitesurf', 'paddle', 'kayak', 'canoë', 'rafting', 'plongée', 'snorkeling',
    'voile', 'bateau', 'jet ski', 'escalade', 'alpinisme', 'via ferrata', 'spéléologie',
    'canyoning', 'raquette à neige', 'ski de fond', 'ski alpin', 'ski de randonnée',
    'snowboard', 'motoneige', 'patinage', 'hockey', 'football américain', 'baseball',
    'volleyball', 'handball', 'badminton', 'squash', 'padel', 'ping-pong', 'billard',
    'fléchettes', 'pétanque', 'tir à l\'arc', 'tir sportif', 'escrime', 'boxe',
    'arts martiaux', 'judo', 'karaté', 'taekwondo', 'aikido', 'kung-fu', 'MMA',
    'trail', 'marathon', 'triathlon', 'athlétisme', 'gymnastique', 'danse', 'zumba',
    'aquagym', 'aquabike', 'cardio', 'HIIT', 'haltère', 'kettlebell', 'barre',
    'corde à sauter', 'élastique', 'tapis', 'ballon', 'step', 'rameur', 'vélo elliptique',
    'tapis de course', 'appareil abdominaux', 'banc de musculation', 'cage à squat',
    'barre de traction', 'trampoline', 'plein air', 'bivouac', 'tente', 'sac de couchage',
    'matelas gonflable', 'réchaud', 'gourde', 'thermos', 'lampe frontale', 'boussole',
    'GPS', 'jumelles', 'longue-vue', 'drone', 'caméra sportive', 'montre connectée'
    ],
    en: [
    'sports', 'outdoors', 'fitness', 'bodybuilding', 'bike', 'run', 'running',
    'swimming', 'hiking', 'camping', 'fishing', 'hunting', 'ski', 'snowboard',
    'tennis', 'soccer', 'basketball', 'rugby', 'golf', 'horse riding', 'yoga',
    'pilates', 'crossfit', 'accessory', 'equipment', 'outfit', 'shoe',
    'electric bike', 'mountain bike', 'road bike', 'city bike', 'BMX', 'scooter',
    'roller skate', 'skateboard', 'longboard', 'surfing', 'bodyboard', 'windsurfing',
    'kitesurfing', 'paddle', 'kayak', 'canoe', 'rafting', 'diving', 'snorkeling',
    'sailing', 'boat', 'jet ski', 'climbing', 'mountaineering', 'via ferrata', 'caving',
    'canyoning', 'snowshoe', 'cross-country skiing', 'downhill skiing', 'ski touring',
    'snowboarding', 'snowmobile', 'ice skating', 'hockey', 'american football', 'baseball',
    'volleyball', 'handball', 'badminton', 'squash', 'padel', 'table tennis', 'pool',
    'darts', 'petanque', 'archery', 'sport shooting', 'fencing', 'boxing',
    'martial arts', 'judo', 'karate', 'taekwondo', 'aikido', 'kung fu', 'MMA',
    'trail running', 'marathon', 'triathlon', 'athletics', 'gymnastics', 'dance', 'zumba',
    'aqua aerobics', 'aqua cycling', 'cardio', 'HIIT', 'dumbbell', 'kettlebell', 'bar',
    'jump rope', 'resistance band', 'mat', 'ball', 'step', 'rowing machine', 'elliptical trainer',
    'treadmill', 'ab machine', 'weight bench', 'squat rack',
    'pull-up bar', 'trampoline', 'outdoor', 'bivouac', 'tent', 'sleeping bag',
    'air mattress', 'stove', 'water bottle', 'thermos', 'headlamp', 'compass',
    'GPS', 'binoculars', 'spotting scope', 'drone', 'action camera', 'smartwatch',
    'backpack', 'trekking pole', 'sport bottle', 'protein shaker', 'fitness tracker'
    ]
  },

  // Les livres sont traités par ISBN mais on pourrait passer au travers
  // Ou bien on pourrait avoir des articles en rapport avec la lecture
  'Accessoires de lecture': {
   fr: [
    'livre', 'roman', 'bande dessinee', 'bd', 'manga', 'biographie', 'autobiographie',
    'encyclopedie', 'dictionnaire', 'guide', 'recit', 'essai', 'nouvelle', 'conte',
    'poesie', 'revue', 'magazine', 'journal', 'album', 'partition', 'manuel', 'scolaire',
    'marque-page', 'signet', 'liseuse', 'kindle', 'kobo', 'e-reader', 'tablette', 
    'support livre', 'bibliotheque', 'etagere livres', 'lampe lecture', 'loupe lecture',
    'pupitre', 'lutrin', 'reliure', 'pochette livre', 'housse liseuse', 'protection kindle',
    'papier', 'cahier', 'carnet', 'stylo', 'crayon', 'libraire', 'librairie', 'bibliotheque',
    'litterature', 'fiction', 'thriller', 'polar', 'fantastique', 'science-fiction', 
    'romance', 'collection', 'edition', 'tome', 'volume', 'serie', 'saga', 'trilogie',
    'poche', 'grand format', 'broche', 'relie', 'couverture', 'jaquette', 'auteur',
    'editeur', 'publication', 'parution', 'nouveaute', 'bestseller', 'classique',
    'annales', 'reference', 'etude', 'apprentissage', 'sciences', 'histoire', 'geographie',
    'art', 'cuisine', 'voyage', 'tourisme', 'pratique', 'sante', 'bien-etre', 'psychologie',
    'developpement personnel', 'coffret', 'numismatique', 'coin', 'philatelie', 'timbre',
    'collection', 'porte-livre', 'tourne-page', 'repose-livre', 'etui', 'organiseur',
    'reliure', 'intercalaire', 'onglet', 'adhesif', 'protege-livre'
    ],
    en: [
    'book', 'novel', 'comic', 'comics', 'manga', 'biography', 'autobiography',
    'encyclopedia', 'dictionary', 'guide', 'story', 'essay', 'short story', 'tale',
    'poetry', 'magazine', 'journal', 'album', 'sheet music', 'textbook', 'educational',
    'bookmark', 'e-reader', 'kindle', 'kobo', 'tablet', 'reading light', 'book stand',
    'bookshelf', 'book holder', 'reading glasses', 'magnifier', 'book weight', 'book cover',
    'e-reader case', 'kindle cover', 'kobo case', 'book sleeve', 'reading lamp', 'book rest',
    'book easel', 'book binding', 'binding machine', 'reading pillow', 'page turner',
    'bookend', 'library', 'bookstore', 'literature', 'fiction', 'mystery', 'thriller',
    'fantasy', 'science fiction', 'romance', 'collection', 'edition', 'volume', 'series',
    'saga', 'trilogy', 'paperback', 'hardcover', 'dust jacket', 'cover', 'author',
    'publisher', 'publication', 'release', 'new release', 'bestseller', 'classic',
    'study guide', 'reference', 'learning', 'academic', 'science', 'history', 'geography',
    'art', 'cooking', 'travel', 'health', 'well-being', 'psychology', 'self-help',
    'box set', 'collection', 'numismatics', 'philately', 'book light', 'page holder',
    'book lamp', 'reading tracker', 'book clip', 'page marker', 'book divider', 'tab',
    'sticky note', 'book protector', 'reading stand', 'book cart', 'book caddy',
    'reading chair', 'book tote', 'library card', 'book repair', 'page reinforcement'
    ]
  }
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
  'Accessoires de lecture': 'Books & Reading Accessories',
  'default': 'default'
};

// Cache pour les données préparées
let preparedData = null;

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

// Fonction de préprocesseur de texte unifiée
export function preprocessText(text) {
  if (!text) return [];
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlève les accents
    .replace(/[^\w\s]/g, ' ')                         // Garde uniquement lettres, chiffres et espaces
    .replace(/\s+/g, ' ')                             // Normalise les espaces
    .trim()
    .split(' ')
    .filter(word => word.length > 2);  // Enlève les mots trop courts
}

// Extraction du texte de la page simplifiée
function extractProductText() {
  return {
    title: document.getElementById('productTitle')?.textContent || '',
    breadcrumbs: Array.from(document.querySelectorAll('#wayfinding-breadcrumbs_feature_div li, .a-breadcrumb li span'))
      .map(item => item.textContent.trim())
      .filter(text => text && text !== '›' && !text.includes('Amazon'))
      .join(' '),
    description: document.getElementById('productDescription')?.textContent || '',
    features: document.getElementById('feature-bullets')?.textContent || '',
    details: document.getElementById('detailBullets_feature_div')?.textContent || '',
    brand: document.querySelector('.po-brand .po-break-word, #bylineInfo, [id*="brand"]')?.textContent || ''
  };
}

// Module TF-IDF pour la classification
// Dans src/datas/category-classifier.js
const TfIdfClassifier = {
  // Préparation des données (calculer les IDF une seule fois)
  prepare(categoryKeywords) {
    // Utiliser un Map pour améliorer la performance
    const idf = new Map();
    const allTerms = new Set();
    const totalCategories = Object.keys(categoryKeywords).length;
    
    // Premièrement, collecter tous les termes
    for (const keywords of Object.values(categoryKeywords)) {
      for (const keyword of keywords) {
        const terms = preprocessText(keyword);
        for (const term of terms) {
          allTerms.add(term);
        }
      }
    }
    
    // Ensuite, calculer l'IDF pour chaque terme
    for (const term of allTerms) {
      let categoryCount = 0;
      
      // Compter dans combien de catégories le terme apparaît
      for (const [_, keywords] of Object.entries(categoryKeywords)) {
        // Optimisation: éviter de réprocesser les mots-clés à chaque fois
        const containsTerm = keywords.some(keyword => 
          preprocessText(keyword).includes(term)
        );
        
        if (containsTerm) {
          categoryCount++;
        }
      }
      
      // Calculer IDF
      if (categoryCount > 0) {
        idf.set(term, Math.log(totalCategories / categoryCount));
      }
    }
    
    return { idf, allTerms: [...allTerms] };
  },
  
  // Classification d'un produit (optimisée)
  classify(productText, categoryKeywords, preparedData) {
    const { idf } = preparedData;
    const scores = {};
    
    // Prétraiter tout le texte du produit une seule fois
    const productTerms = preprocessText(Object.values(productText).join(' '));
    
    // Calculer TF pour le texte du produit
    const tf = new Map();
    for (const term of productTerms) {
      tf.set(term, (tf.get(term) || 0) + 1);
    }
    
    // Normaliser TF
    const maxTf = Math.max(...tf.values(), 1);
    for (const [term, count] of tf.entries()) {
      tf.set(term, count / maxTf);
    }
    
    // Poids simplifiés pour chaque source de texte
    const sourceWeights = {
      title: 3,
      breadcrumbs: 2.5,
      brand: 1.5,
      features: 1.2,
      details: 1,
      description: 0.8
    };
    
    // Calculer les scores par catégorie
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      let score = 0;
      
      // Créer un ensemble des termes uniques pour cette catégorie (une seule fois)
      const categoryTerms = new Set();
      for (const keyword of keywords) {
        preprocessText(keyword).forEach(term => categoryTerms.add(term));
      }
      
      // Score basé sur TF-IDF global
      for (const term of categoryTerms) {
        if (tf.has(term) && idf.has(term)) {
          score += tf.get(term) * idf.get(term);
        }
      }
      
      // Limiter le nombre de catégories traitées pour de meilleures performances
      if (score > 0) {
        scores[category] = score;
      }
    }
    
    // Trouver la meilleure catégorie
    let bestCategory = 'default';
    let bestScore = 0;
    
    for (const [category, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }
    
    return bestCategory;
  }
}

// Fonction pour récupérer les mots-clés combinés avec gestion d'erreur améliorée
async function getCombinedKeywords(lang = 'fr') {
  try {
    // Récupérer les mots-clés personnalisés depuis le stockage
    const result = await browser.storage.local.get('userCategoryKeywords');
    const userKeywords = result.userCategoryKeywords || {};
    
    // Créer une copie des mots-clés par défaut
    const combinedKeywords = {};
    
    // Construire les mots-clés en fonction de la langue
    Object.entries(categoryKeywords).forEach(([category, keywordsByLang]) => {
      // Initialiser le tableau pour cette catégorie
      combinedKeywords[category] = [];
      
      // Ajouter les mots-clés par défaut pour la langue spécifiée
      if (keywordsByLang[lang] && Array.isArray(keywordsByLang[lang])) {
        combinedKeywords[category] = [...keywordsByLang[lang]];
      }
      
      // Ajouter les mots-clés personnalisés pour la langue spécifiée
      if (userKeywords[category] && userKeywords[category][lang] && Array.isArray(userKeywords[category][lang])) {
        combinedKeywords[category] = [...combinedKeywords[category], ...userKeywords[category][lang]];
      }
    });
    
    return combinedKeywords;
  } catch (error) {
    console.error('DansMaZone: Erreur lors du chargement des mots-clés personnalisés', error);
    
    // Fallback aux mots-clés par défaut pour la langue spécifiée
    const defaultKeywords = {};
    Object.entries(categoryKeywords).forEach(([category, keywordsByLang]) => {
      defaultKeywords[category] = keywordsByLang[lang] || [];
    });
    
    return defaultKeywords;
  }
}

/**
 * Classifie la page produit Amazon en utilisant l'algorithme TF-IDF
 * @returns {Promise<string>} La catégorie détectée
 */
export async function classifyPage(combinedSites) {
  try {
    // Détecter la langue de la page
    const lang = detectLanguage();
    console.info('DansMaZone: Langue détectée:', lang);
    
    // Obtenir les mots-clés combinés pour la langue détectée
    const combinedKeywords = await getCombinedKeywords(lang);
    
    // Extraire le texte de la page
    const productText = extractProductText();
    
    // Préparer les données TF-IDF (avec mise en cache)
    // Remarque: preparedData est maintenant spécifique à la langue
    if (!preparedData) {
      preparedData = TfIdfClassifier.prepare(combinedKeywords);
    }
    
    // Classifier le produit
    let category = TfIdfClassifier.classify(productText, combinedKeywords, preparedData);
    
    // Si aucune catégorie n'est trouvée, utiliser 'default'
    if (!category || category === 'Unknown') {
      category = 'default';
    }
    
    console.info('DansMaZone: Category detected:', category);
    
    // Gérer la traduction si nécessaire
    if (lang === 'en' && category !== 'default') {
      // Convertir en anglais si nécessaire
      const enCategory = categoryMapping[category] || category;
      return enCategory;
    }
    
    return category;
  } catch (error) {
    console.error('DansMaZone: Error in classifyPage:', error);
    return 'default'; // Retourner la catégorie par défaut en cas d'erreur
  }
}
