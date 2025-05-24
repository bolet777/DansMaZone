/**
 * @file src/datas/category-classifier.js
 * @license GPL-3.0
 * @copyright DansMaZone.ca
 * 
 * Module de classification de produits pour l'extension DansMaZone
 * 
 * Ce module fournit les fonctionnalités nécessaires pour analyser et classifier
 * les produits Amazon dans des catégories spécifiques en utilisant l'algorithme TF-IDF.
 * Il contient les dictionnaires de mots-clés par catégorie (en français et anglais),
 * les correspondances entre catégories dans les deux langues, et les fonctions
 * d'analyse et de classification.
 * 
 * Le processus de classification se déroule en plusieurs étapes :
 * 1. Détection de la langue de la page (FR/EN)
 * 2. Extraction du texte pertinent de la page produit
 * 3. Prétraitement du texte (normalisation, suppression des caractères spéciaux)
 * 4. Calcul des scores TF-IDF pour chaque catégorie
 * 5. Sélection de la catégorie avec le score le plus élevé
 */

// Import conditionnel simple
let browser;

if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
  // Environnement de test
  browser = global.browser;
} else {
  // Environnement extension - import normal
  try {
    const browserModule = await import('webextension-polyfill');
    browser = browserModule.default;
  } catch (error) {
    console.error('Erreur import webextension-polyfill:', error);
  }
}

// Global Maps
const keywordsCache = new Map();
const classificationCache = new Map();

// Liste de mots-clés par catégorie - version bilingue séparée par langue
export const categoryKeywords = {
  'Animalerie': {
    fr: [
      'chat', 'chien', 'animal', 'animaux', 'nourriture animale', 'litière', 'croquettes', 'jouets animaux', 'laisse',
      'aquarium', 'poisson', 'oiseau', 'hamster', 'rongeur', 'terrarium', 'gamelle animale', 'collier animal', 'harnais',
      'veterinaire', 'pet', 'cage animale', 'niche', 'panier animal', 'griffoir', 'animalerie', 'toilettage', 'brosse animale',
      'antiparasitaire', 'vermifuge', 'clapier', 'volière', 'reptile', 'tortue', 'perroquet', 'perruche',
      'canne à pêche', 'hameçon', 'carpe', 'vêtement pour chien', 'manteau chien', 'friandise animale', 'santé animale',
      'pipette', 'puce', 'tique', 'soin dentaire animal', 'sac transport animal', 'coussin animal', 'grattoir',
      'écuelle', 'ratelier', 'foin', 'paille', 'copeaux', 'sciure', 'arbre à chat', 'chatière',
      'caisse transport animal', 'muselière', 'longe', 'croquette', 'pâtée', 'complément alimentaire animal',
      'accessoire aquarium', 'pompe aquarium', 'filtre aquarium', 'oxygénateur', 'chauffage aquarium', 'éclairage aquarium', 'thermomètre aquarium',
      'sable aquarium', 'plante aquatique', 'décor aquarium', 'filet aquarium', 'épuisette', 'lapin', 'NAC', 'souris'
    ],
    en: [
      'cat', 'dog', 'pet', 'pets', 'pet food', 'litter', 'kibble', 'pet toys', 'leash',
      'aquarium', 'fish', 'bird', 'hamster', 'rodent', 'terrarium', 'pet bowl', 'pet collar', 'harness',
      'veterinary', 'pet cage', 'kennel', 'pet bed', 'scratcher', 'pet store', 'grooming', 'pet brush',
      'antiparasitic', 'dewormer', 'hutch', 'aviary', 'reptile', 'turtle', 'parrot', 'budgie',
      'fishing rod', 'hook', 'carp', 'dog clothing', 'dog coat', 'pet treat', 'pet health',
      'pipette', 'flea', 'tick', 'pet dental care', 'pet carrier bag', 'pet cushion', 'scratch post',
      'feeding bowl', 'hay rack', 'hay', 'straw', 'wood shavings', 'sawdust', 'cat tree', 'cat flap',
      'fishing pole', 'pet carrier', 'muzzle', 'lunge line', 'dry food', 'wet food', 'pet supplement',
      'aquarium accessory', 'aquarium pump', 'aquarium filter', 'oxygenator', 'aquarium heater', 'aquarium lighting', 'aquarium thermometer',
      'aquarium sand', 'aquatic plant', 'aquarium decoration', 'aquarium net', 'landing net', 'rabbit', 'exotic pet', 'mouse',
      'ferret', 'guinea pig', 'gerbil', 'cat litter box', 'scratching post', 'pet feeder', 'automatic feeder'
    ]
  },

  'Auto et Moto': {
    fr: [
      'voiture', 'auto', 'automobile', 'moto', 'scooter', 'vehicule', 'pieces auto', 'accessoires auto',
      'entretien auto', 'nettoyage auto', 'pneu', 'batterie auto', 'huile moteur', 'moteur', 'phare', 'frein',
      'autoradio', 'gps auto', 'casque moto', 'siege auto', 'enjoliveur', 'essuie-glace', 'outillage auto', 'carenage',
      'carrosserie', 'embrayage', 'boite de vitesse', 'alternateur', 'démarreur', 'courroie moteur', 'suspension auto',
      'amortisseur', 'échappement', 'silencieux', 'pot catalytique', 'radiateur auto', 'liquide de refroidissement',
      'liquide de frein', 'filtre à air', 'filtre à huile', 'filtre à carburant', 'filtre habitacle',
      'bougie', 'durite', 'joint moteur', 'culasse', 'cylindre moteur', 'piston', 'segment', 'vilebrequin', 'soupape',
      'turbo', 'injecteur', 'pompe à eau', 'pompe à carburant', 'pompe à huile', 'disque frein', 'plaquette frein',
      'etrier frein', 'maitre-cylindre', 'roulement auto', 'cardan', 'transmission auto', 'cardans', 'soufflet',
      'pare-brise', 'vitre auto', 'rétroviseur', 'antenne auto', 'capot', 'portière', 'aile auto', 'pare-choc',
      'calandre', 'jante', 'valve pneu', 'barre de toit', 'attelage', 'remorque', 'coffre de toit'
    ],
    en: [
      'car', 'automotive', 'motorcycle', 'scooter', 'vehicle', 'auto parts', 'car accessories',
      'car maintenance', 'car cleaning', 'tire', 'car battery', 'motor oil', 'engine', 'headlight', 'brake',
      'car stereo', 'car gps', 'motorcycle helmet', 'car seat', 'hubcap', 'wiper', 'auto tools', 'fairing',
      'car body', 'clutch', 'gearbox', 'alternator', 'starter', 'engine belt', 'car suspension',
      'shock absorber', 'exhaust', 'muffler', 'catalytic converter', 'car radiator', 'coolant',
      'brake fluid', 'air filter', 'oil filter', 'fuel filter', 'cabin filter',
      'spark plug', 'hose', 'engine gasket', 'cylinder head', 'engine cylinder', 'piston', 'piston ring', 'crankshaft', 'valve',
      'turbocharger', 'injector', 'water pump', 'fuel pump', 'oil pump', 'brake disc', 'brake pad',
      'brake caliper', 'master cylinder', 'car bearing', 'drive shaft', 'car transmission', 'CV joint', 'boot',
      'windshield', 'car window', 'mirror', 'car antenna', 'hood', 'door', 'car fender', 'bumper',
      'grille', 'wheel rim', 'tire valve', 'roof rack', 'tow hitch', 'trailer', 'roof box',
      'spark plug', 'timing belt', 'camshaft', 'fuel tank', 'handlebars', 'mudguard', 'taillight'
    ]
  },

  'Bagages et Voyage': {
    fr: [
      'valise', 'bagage', 'voyage', 'trolley', 'cabine', 'soute', 'etiquette',
      'passeport', 'trousse', 'organiseur voyage', 'oreiller voyage',
      'roulette', 'polycarbonate', 'bandouliere',
      'sac à dos', 'bagage à main', 'portedocuments', 'pochette voyage', 'sacoche voyage', 'mallette voyage',
      'sac de voyage', 'malle voyage', 'coffre voyage', 'cadenas voyage', 'balance bagage', 'bagagerie', 
      'protection bagage', 'housse valise', 'pochette voyage', 'trousse toilette', 'confort voyage',
      'accessoire voyage', 'chargeur voyage', 'convertisseur voyage', 'adaptateur voyage',
      'prise voyage', 'guide voyage', 'carte voyage', 'location voiture', 'vol',
      'hôtel', 'auberge', 'camping', 'randonnée', 'trek', 'backpack', 'gourde voyage',
      'thermos voyage', 'compas voyage', 'jumelles voyage', 'boussole', 'GPS portable', 'sac étanche',
      'poche secrète', 'anti-vol', 'RFID voyage', 'protège-passeport', 'porte-monnaie voyage',
      'serviette microfibre', 'imperméable voyage', 'poncho voyage', 'parapluie voyage', 'lunettes soleil', 'crème solaire'
    ],
    en: [
      'suitcase', 'luggage', 'travel', 'trolley', 'cabin', 'hold', 'tag',
      'passport', 'travel kit', 'travel organizer', 'travel pillow',
      'travel mask', 'travel plug', 'transport', 'wheels', 'polycarbonate', 'strap',
      'backpack', 'carry-on', 'document holder', 'travel pouch', 'travel satchel', 'travel briefcase',
      'duffel bag', 'travel trunk', 'travel chest', 'travel lock', 'luggage scale', 'luggage set',
      'luggage cover', 'protective cover', 'travel pouch', 'toiletry bag', 'travel comfort',
      'travel accessory', 'travel charger', 'travel converter', 'travel adapter',
      'travel plug', 'travel guide', 'travel map', 'car rental', 'flight',
      'hotel', 'hostel', 'camping', 'hiking', 'trekking', 'backpacking', 'travel bottle',
      'travel thermos', 'travel binoculars', 'travel compass', 'portable GPS', 'waterproof bag',
      'hidden pocket', 'anti-theft', 'travel RFID', 'passport holder', 'travel wallet',
      'microfiber towel', 'travel raincoat', 'travel poncho', 'travel umbrella', 'sunglasses', 'sunscreen',
      'luggage tag', 'packing cubes', 'compression bags', 'travel pillow', 'luggage strap'
    ]
  },

  'Beauté et Parfum': {
    fr: [
      'beaute', 'parfum', 'maquillage', 'soin visage', 'visage', 'creme visage', 'serum beaute', 'lotion beaute',
      'vernis ongles', 'rouge levres', 'levres', 'fond teint', 'teint', 'mascara', 'shampoing', 'cheveux',
      'coloration cheveux', 'coiffure', 'accessoire beaute', 'manucure', 'pedicure', 'epilateur',
      'rasoir beaute', 'aftershave', 'eau de toilette', 'deodorant', 'anti-rides', 'protection solaire',
      'parfumerie', 'soin peau', 'hydratant visage', 'nettoyant visage', 'exfoliant', 'gommage visage',
      'masque visage', 'tonique', 'contour yeux', 'anti-cerne', 'highlighter', 'blush',
      'fard à paupières', 'eye-liner', 'crayon beaute', 'gloss', 'baume levres',
      'démaquillant', 'coton beaute', 'pinceau maquillage', 'eponge maquillage', 'beautyblender',
      'palette maquillage', 'correcteur teint', 'contouring', 'poudre maquillage', 'bronzer', 'illuminateur',
      'anti-imperfection', 'anti-âge', 'acide hyaluronique', 'anti-cellulite', 'fermeté peau', 'cosmétique',
      'huile essentielle', 'modelage visage', 'peeling visage', 'spa beaute', 'bien-être beaute', 'massage beaute',
      'mousse rasage', 'gel beaute', 'lait corporel', 'gant beaute', 'bougie parfumée', 'eau micellaire'
    ],
    en: [
      'beauty', 'perfume', 'makeup', 'facial care', 'face', 'face cream', 'beauty serum', 'beauty lotion',
      'nail polish', 'lipstick', 'foundation', 'mascara', 'shampoo', 'hair',
      'hair color', 'hairstyle', 'beauty accessory', 'manicure', 'pedicure', 'epilator',
      'beauty razor', 'aftershave', 'cologne', 'deodorant', 'anti-wrinkle', 'sun protection',
      'perfumery', 'skincare', 'face moisturizer', 'facial cleanser', 'exfoliator', 'facial scrub',
      'face mask', 'toner', 'eye cream', 'concealer', 'highlighter', 'blush',
      'eyeshadow', 'eyeliner', 'beauty pencil', 'lips', 'lip gloss', 'lip balm',
      'makeup remover', 'beauty cotton', 'makeup brush', 'makeup sponge', 'beautyblender',
      'makeup palette', 'color corrector', 'contouring', 'makeup powder', 'bronzer', 'illuminator',
      'blemish control', 'anti-aging', 'hyaluronic acid', 'anti-cellulite', 'skin firmness', 'cosmetics',
      'essential oil', 'facial modeling', 'facial peeling', 'beauty spa', 'beauty wellness', 'beauty massage',
      'shaving foam', 'beauty gel', 'body milk', 'beauty glove', 'scented candle', 'micellar water',
      'facial primer', 'setting spray', 'brow gel', 'lash curler', 'nail file', 'bb cream'
    ]
  },

  'Bébés et Puériculture': {
    fr: [
      'bebe', 'enfant', 'puericulture', 'couche bebe', 'poussette', 'biberon', 'chaise bebe', 'siege bebe',
      'siege auto bebe', 'vetement bebe', 'repas bebe', 'allaitement', 'baignoire bebe', 'lange', 'lingette bebe', 'toise',
      'doudou', 'parc bebe', 'lit bebe', 'jouet bebe', 'eveil bebe', 'securite bebe', 'surveillance bebe', 'tetine',
      'porte-bebe', 'echarpe portage', 'sterilisateur biberon', 'mouche-bebe',
      'landau', 'berceau', 'couffin', 'transat bebe', 'tapis d\'eveil', 'mobile bebe', 'veilleuse bebe',
      'babyphone', 'thermometre bebe', 'anneau dentition', 'bavoir', 'goupillon biberon',
      'trotteur bebe', 'chauffe-biberon', 'tire-lait', 'coussin allaitement', 'matelas à langer',
      'table à langer', 'pot bebe', 'rehausseur bebe', 'siège auto', 'cosy bebe', 'nacelle', 'gigoteuse',
      'pyjama bebe', 'body bebe', 'grenouillère', 'chancelière', 'ombrelle poussette', 'protection soleil bebe',
      'moustiquaire bebe', 'filet protection', 'barrière securite', 'tapis de bain bebe', 'trousse toilette bebe', 'thermomètre bain',
      'sortie de bain bebe', 'cape de bain', 'gant toilette bebe', 'shampoing bebe', 'savon bebe', 'lait corporel bebe',
      'crème change', 'talc bebe', 'coton-tige bebe', 'coupe-ongle bebe', 'brosse cheveux bebe', 'peigne bebe'
    ],
    en: [
      'baby', 'child', 'childcare', 'baby diaper', 'stroller', 'baby bottle', 'baby chair', 'baby seat',
      'baby car seat', 'baby clothing', 'baby meal', 'breastfeeding', 'baby bathtub', 'baby cloth', 'baby wipe', 'baby measuring',
      'baby plush', 'baby playpen', 'baby crib', 'baby toy', 'baby development', 'baby safety', 'baby monitor', 'pacifier',
      'baby carrier', 'baby sling', 'bottle sterilizer', 'nasal aspirator',
      'baby pram', 'baby cradle', 'bassinet', 'baby bouncer', 'baby play mat', 'baby mobile', 'baby night light',
      'baby monitor', 'baby thermometer', 'teething ring', 'baby bib', 'bottle brush',
      'baby walker', 'bottle warmer', 'breast pump', 'nursing pillow', 'baby changing mat',
      'changing table', 'baby potty', 'baby booster seat', 'car seat', 'infant carrier', 'carrycot', 'baby sleeping bag',
      'baby pajamas', 'baby bodysuit', 'baby onesie', 'footmuff', 'stroller parasol', 'baby sun protection',
      'baby mosquito net', 'protection mesh', 'baby safety gate', 'baby bath mat', 'baby toiletry bag', 'bath thermometer',
      'baby hooded towel', 'baby bath cape', 'baby washcloth', 'baby shampoo', 'baby soap', 'baby body lotion',
      'diaper cream', 'baby talcum powder', 'baby cotton swab', 'baby nail clipper', 'baby hairbrush', 'baby comb',
      'high chair', 'baby food', 'baby formula', 'sippy cup', 'baby teether', 'diaper pail'
    ]
  },

  'Cuisine': {
    fr: [
      'casserole', 'poele', 'ustensile culinaire', 'assiette', 'verre cuisine', 'couvert', 'robot culinaire',
      'mixeur', 'blender', 'four', 'micro onde', 'cafetiere', 'bouilloire', 'plat cuisson',
      'cuisine', 'culinaire', 'batterie cuisine', 'cocotte', 'marmite', 'passoire cuisine',
      'cuiseur vapeur', 'autocuiseur', 'mijoteuse', 'crêpière', 'gaufrier', 'sauteuse',
      'thermostat cuisine', 'plaque induction', 'plaque cuisson', 'cuisson', 'vitrocéramique', 'cuisinière gaz',
      'barbecue', 'plancha', 'grill', 'appareil raclette', 'set fondue', 'pierrade', 'wok',
      'couteau cuisine', 'économe', 'mandoline cuisine', 'hachoir électrique', 'fouet cuisine', 'spatule cuisine', 'louche',
      'écumoire', 'presse-agrumes', 'extracteur jus', 'presse-ail', 'balance cuisine',
      'verre doseur', 'minuteur cuisine', 'thermomètre culinaire', 'moule pâtisserie', 'ramequin', 'plaque pâtisserie',
      'rouleau pâtisserie', 'emporte-pièce', 'poche à douille', 'spatule pâtisserie', 'pinceau cuisine',
      'saladier', 'bol mélangeur', 'cuillère bois', 'cuillère silicone', 'chinois cuisine',
      'entonnoir cuisine', 'râpe cuisine', 'zesteur', 'vide-pomme', 'casse-noix', 'ouvre-boîte cuisine'
    ],
    en: [
      'cooking pot', 'frying pan', 'culinary utensil', 'dinner plate', 'kitchen glass', 'cutlery', 'food processor',
      'hand mixer', 'blender', 'oven', 'microwave', 'coffee maker', 'electric kettle', 'cooking dish',
      'kitchen', 'culinary', 'cookware set', 'dutch oven', 'cooking pot', 'kitchen colander',
      'steam cooker', 'pressure cooker', 'slow cooker', 'crepe maker', 'waffle maker', 'saute pan',
      'cooking thermostat', 'induction hob', 'cooking hob', 'cooking', 'ceramic hob', 'gas stove',
      'barbecue', 'cooking griddle', 'kitchen grill', 'raclette maker', 'fondue set', 'stone grill', 'wok',
      'kitchen knife', 'vegetable peeler', 'kitchen mandoline', 'food chopper', 'kitchen whisk', 'cooking spatula', 'kitchen ladle',
      'skimmer', 'citrus juicer', 'juice extractor', 'garlic press', 'kitchen scale',
      'measuring cup', 'kitchen timer', 'cooking thermometer', 'baking mold', 'ramekin', 'baking sheet',
      'rolling pin', 'cookie cutter', 'piping bag', 'pastry spatula', 'pastry brush',
      'mixing bowl', 'mixing bowl', 'wooden spoon', 'silicone spoon', 'fine strainer', 'conical strainer',
      'kitchen funnel', 'kitchen grater', 'zester', 'apple corer', 'nutcracker', 'can opener',
      'cutting board', 'knife set', 'measuring spoons', 'baking dish', 'muffin tin'
    ]
  },

  'Décoration': {
    fr: [
      'decoration maison', 'deco interieur', 'cadre photo', 'miroir decoratif', 'vase decoratif', 'bougie decorative', 'horloge murale', 'tapis decoratif',
      'coussin decoratif', 'rideau decoration', 'store decoration', 'sticker decoratif', 'poster mural', 'tableau decoratif', 'statue decorative',
      'photophore', 'paillasson', 'panneau decoratif', 'tenture murale', 'bibelot decoratif', 'suspension decorative',
      'lustre decoratif', 'applique murale', 'lampadaire design', 'lampion decoratif', 'guirlande decorative', 'ampoule decorative',
      'abat-jour', 'plafonnier decoratif', 'eclairage decoratif', 'ambiance decorative', 'decor maison', 'decoration interieur',
      'decoration exterieur', 'decoration jardin', 'decoration terrasse', 'decoration balcon', 'plante decorative', 'plante artificielle',
      'paravent decoratif', 'separateur decoratif', 'cloison decorative', 'etagere decorative', 'bibliotheque decorative', 'meuble decoratif',
      'table decorative', 'chaise decorative', 'fauteuil decoratif', 'canape decoratif', 'pouf decoratif', 'banc decoratif', 'commode decorative',
      'console decorative', 'vitrine decorative', 'buffet decoratif', 'patere decorative', 'porte-manteau decoratif', 'luminaire decoratif',
      'plaid decoratif', 'jete de lit', 'nappe decorative', 'chemin de table', 'set de table decoratif',
      'bougeoir decoratif', 'chandelier decoratif', 'lanterne decorative', 'mobile decoratif', 'carillon decoratif', 'porte-photo decoratif',
      'papier peint decoratif', 'sticker mural', 'peinture decorative', 'fresque murale', 'art mural'
    ],
    en: [
      'home decoration', 'interior decor', 'photo frame', 'decorative mirror', 'decorative vase', 'decorative candle', 'wall clock', 'decorative rug',
      'decorative cushion', 'decorative curtain', 'decorative blind', 'decorative sticker', 'wall poster', 'decorative painting', 'decorative statue',
      'candle holder', 'doormat', 'decorative sign', 'wall tapestry', 'decorative ornament', 'decorative pendant',
      'decorative chandelier', 'wall sconce', 'designer floor lamp', 'decorative lantern', 'decorative garland', 'decorative bulb',
      'lampshade', 'decorative ceiling light', 'decorative lighting', 'decorative ambiance', 'home decor', 'interior decoration',
      'exterior decoration', 'garden decoration', 'terrace decoration', 'balcony decoration', 'decorative plant', 'artificial plant',
      'decorative screen', 'decorative separator', 'decorative partition', 'decorative shelf', 'decorative bookcase', 'decorative furniture',
      'decorative table', 'decorative chair', 'decorative armchair', 'decorative sofa', 'decorative pouf', 'decorative bench', 'decorative dresser',
      'decorative console', 'decorative display cabinet', 'decorative buffet', 'decorative coat hook', 'decorative coat rack', 'decorative light fixture',
      'decorative throw', 'bedspread', 'decorative tablecloth', 'table runner', 'decorative placemat',
      'decorative candle holder', 'decorative chandelier', 'decorative lantern', 'decorative mobile', 'decorative wind chime', 'decorative photo frame',
      'decorative wallpaper', 'wall sticker', 'decorative paint', 'wall fresco', 'wall art',
      'throw pillow', 'area rug', 'wall art', 'ceramic vase', 'decorative bowl'
    ]
  },

  'Électroménager': {
    fr: [
      'electromenager', 'refrigerateur', 'frigo', 'lave vaisselle', 'electromenager vaisselle', 'lave linge',
      'seche linge', 'cuisiniere', 'congelateur', 'aspirateur menager', 'robot menager', 'climatiseur',
      'ventilateur menager', 'micro ondes', 'plaque cuisson', 'hotte aspirante', 'four electromenager', 'grille-pain',
      'mixeur electromenager', 'blender electromenager', 'batteur electromenager', 'centrifugeuse', 'machine à café', 'machine expresso',
      'cafetière électrique', 'bouilloire électrique', 'friteuse électrique', 'multicuiseur électrique', 'cuiseur riz électrique', 'crêpière électrique',
      'gaufrier électrique', 'appareil raclette', 'appareil fondue', 'yaourtière électrique', 'sorbetière électrique',
      'machine à pain', 'extracteur de jus', 'déshydrateur alimentaire', 'cave à vin électrique', 'cellier électrique',
      'réfrigérateur américain', 'combiné réfrigérateur-congélateur', 'congélateur armoire',
      'congélateur coffre', 'lave-vaisselle encastrable', 'lave-vaisselle pose libre',
      'lave-linge hublot', 'lave-linge top', 'sèche-linge pompe à chaleur', 'sèche-linge condensation',
      'cuisinière induction', 'cuisinière vitrocéramique', 'cuisinière gaz', 'four encastrable',
      'four combiné', 'four vapeur', 'four micro-ondes', 'plaque induction électrique', 'plaque vitrocéramique'
    ],
    en: [
      'home appliance', 'refrigerator', 'electric fridge', 'electric dishwasher', 'washing machine',
      'electric dryer', 'electric stove', 'electric freezer', 'home vacuum', 'kitchen robot', 'air conditioner',
      'home fan', 'microwave appliance', 'electric cooktop', 'range hood', 'electric oven', 'electric toaster',
      'electric mixer', 'electric blender', 'electric beater', 'electric juicer', 'electric coffee machine', 'espresso machine',
      'electric coffee maker', 'electric kettle', 'electric deep fryer', 'electric multi-cooker', 'electric rice cooker', 'electric crepe maker',
      'electric waffle maker', 'electric raclette grill', 'electric fondue set', 'electric yogurt maker', 'electric ice cream maker',
      'electric bread machine', 'electric juice extractor', 'electric food dehydrator', 'electric wine cooler', 'electric cellar',
      'american refrigerator', 'electric fridge-freezer', 'upright freezer',
      'chest freezer', 'built-in dishwasher', 'freestanding dishwasher',
      'front-loading washing machine', 'top-loading washing machine', 'heat pump dryer', 'condenser dryer',
      'induction cooker', 'ceramic cooker', 'gas cooker', 'built-in oven',
      'combination oven', 'steam oven', 'microwave oven', 'electric induction hob', 'ceramic hob',
      'electric slow cooker', 'electric food processor', 'electric stand mixer', 'electric hand mixer', 'electric kettle'
    ]
  },

  'Électronique et Informatique': {
    fr: [
      'ordinateur', 'pc bureau', 'ordinateur portable', 'tablette numérique', 'smartphone', 'téléphone portable', 'écran ordinateur',
      'moniteur pc', 'clavier ordinateur', 'souris informatique', 'casque audio', 'enceinte ordinateur', 'imprimante', 'scanner',
      'webcam', 'microphone pc', 'disque dur', 'mémoire vive', 'ram', 'processeur', 'carte graphique',
      'stockage numérique', 'accessoire informatique', 'câble informatique', 'chargeur électronique', 'batterie électronique', 'réseau informatique', 'routeur wifi',
      'modem internet', 'switch réseau', 'connectique informatique', 'adaptateur électronique', 'hub usb', 'port usb', 'câble hdmi', 'bluetooth',
      'informatique', 'bureautique', 'serveur informatique', 'nas', 'stockage réseau', 'disque dur externe',
      'SSD', 'clé USB', 'carte mémoire SD', 'lecteur cd', 'graveur dvd', 'lecteur DVD', 'lecteur Blu-ray', 'tour pc',
      'boîtier pc', 'alimentation pc', 'refroidissement pc', 'ventilateur pc', 'watercooling',
      'carte mère', 'écran tactile', 'écran led', 'écran oled', 'ultra HD', 'résolution 4K', 'résolution 8K',
      'smart TV', 'télévision', 'home cinéma', 'barre de son', 'caisson de basse',
      'amplificateur audio', 'tuner radio', 'récepteur satellite', 'décodeur tv', 'antenne satellite', 'console de jeu',
      'manette jeu', 'appareil photo numérique', 'caméscope', 'drone', 'GPS portable', 'montre connectée'
    ],
    en: [
      'computer', 'desktop pc', 'laptop computer', 'digital tablet', 'smartphone', 'mobile phone', 'computer screen',
      'pc monitor', 'computer keyboard', 'computer mouse', 'audio headset', 'computer speaker', 'printer', 'scanner',
      'webcam', 'pc microphone', 'hard disk', 'computer memory', 'ram', 'processor', 'graphics card',
      'digital storage', 'computer accessory', 'computer cable', 'electronic charger', 'electronic battery', 'computer network', 'wifi router',
      'internet modem', 'network switch', 'computer connectivity', 'electronic adapter', 'usb hub', 'usb port', 'hdmi cable', 'bluetooth',
      'computing', 'office equipment', 'computer server', 'nas', 'network storage', 'external hard drive',
      'SSD drive', 'USB drive', 'SD memory card', 'cd reader', 'dvd burner', 'DVD player', 'Blu-ray player', 'pc tower',
      'pc case', 'pc power supply', 'pc cooling', 'pc fan', 'watercooling',
      'motherboard', 'touchscreen', 'led display', 'oled display', 'ultra HD', '4K resolution', '8K resolution',
      'smart TV', 'television', 'home theater', 'soundbar', 'subwoofer',
      'audio amplifier', 'radio tuner', 'satellite receiver', 'tv decoder', 'satellite antenna', 'game console',
      'game controller', 'digital camera', 'camcorder', 'drone', 'portable GPS', 'smartwatch',
      'desktop computer', 'all-in-one pc', 'CPU processor', 'solid state drive', 'mechanical keyboard'
    ]
  },
  
  'Épicerie et Alimentation': {
    fr: [
      'nourriture', 'aliment', 'epicerie', 'boisson alimentaire', 'the', 'cafe', 'infusion', 'snack alimentaire',
      'conserve alimentaire', 'pate alimentaire', 'riz', 'cereale petit dejeuner', 'chocolat alimentaire', 'bonbon', 'confiserie', 'huile alimentaire',
      'vinaigre alimentaire', 'epice culinaire', 'condiment alimentaire', 'farine', 'sucre alimentaire', 'sel cuisine', 'produit bio', 'alimentation vegan',
      'produit vegetarien', 'sans gluten', 'sans lactose', 'produit dietetique', 'boulangerie', 'patisserie',
      'viennoiserie', 'baguette pain', 'pain', 'croissant', 'brioche', 'fruit frais', 'legume frais',
      'produit laitier', 'fromage', 'yaourt', 'beurre', 'creme fraiche', 'lait', 'oeuf',
      'viande fraiche', 'boeuf', 'poulet', 'porc', 'agneau', 'charcuterie', 'jambon', 'saucisson',
      'poisson frais', 'fruit de mer', 'crevette', 'saumon', 'thon', 'pates alimentaires',
      'ravioli', 'spaghetti', 'tagliatelle', 'sauce alimentaire', 'tomate', 'pesto', 'soupe', 'bouillon',
      'produit surgelé', 'dessert alimentaire', 'gateau', 'tarte', 'compote', 'confiture', 'miel', 'sirop alimentaire',
      'aperitif', 'chips alimentaire', 'olive', 'noix', 'amande', 'pistache', 'cacahuete', 'raisin sec',
      'muesli', 'avoine', 'quinoa', 'couscous', 'biscuit alimentaire', 'gaufre alimentaire', 'crepe alimentaire', 'moutarde',
      'ketchup', 'mayonnaise', 'sauce soja', 'tofu', 'seitan', 'legumineuse', 'lentille', 'pois chiche',
      'haricot', 'feve', 'semoule', 'boulgour'
    ],
    en: [
      'food', 'grocery', 'food beverage', 'tea', 'coffee', 'infusion', 'food snack',
      'canned food', 'food pasta', 'rice', 'breakfast cereal', 'food chocolate', 'candy', 'confectionery', 'cooking oil',
      'food vinegar', 'culinary spice', 'food condiment', 'flour', 'food sugar', 'cooking salt', 'organic food', 'vegan food',
      'vegetarian food', 'gluten free food', 'lactose free', 'diet food', 'bakery', 'pastry',
      'bakery bread', 'bread', 'baguette', 'croissant', 'brioche', 'fresh fruit', 'fresh vegetable',
      'dairy product', 'cheese', 'yogurt', 'butter', 'fresh cream', 'milk', 'egg',
      'fresh meat', 'beef', 'chicken', 'pork', 'lamb', 'deli meat', 'ham', 'salami',
      'fresh fish', 'seafood', 'shrimp', 'salmon', 'tuna', 'food noodle',
      'ravioli', 'spaghetti', 'tagliatelle', 'food sauce', 'tomato', 'pesto', 'soup', 'broth',
      'frozen food', 'food dessert', 'cake', 'pie', 'compote', 'jam', 'honey', 'food syrup',
      'appetizer', 'food chips', 'olive', 'nut', 'almond', 'pistachio', 'peanut', 'raisin',
      'muesli', 'oat', 'quinoa', 'couscous', 'food cookie', 'food waffle', 'food pancake', 'mustard',
      'ketchup', 'mayonnaise', 'soy sauce', 'tofu', 'seitan', 'legume', 'lentil', 'chickpea',
      'bean', 'broad bean', 'semolina', 'bulgur', 'smoothie', 'granola', 'cracker', 'pickle',
      'relish', 'chutney', 'cornflakes', 'bagel', 'muffin', 'sausage', 'bacon', 'jerky'
    ]
  },
    
  'Films et Séries TV': {
    fr: [
      'film', 'serie tv', 'dvd film', 'blu-ray film', 'bluray film', 'coffret film', 'edition film', 'edition collector',
      'edition limitee', 'integrale serie', 'saison serie', 'episode serie', 'coffret serie', 'coffret tv', 'cinema', 'television',
      'film documentaire', 'film animation', 'film comedie', 'film action', 'film thriller', 'film horreur', 'film fantastique',
      'film science-fiction', 'film drame', 'film romance', 'film biopic', 'film historique', 'film aventure', 'film western',
      'film policier', 'film guerre', 'film musical', 'film jeunesse', 'film familial', 'comedie musicale', 'dessin anime',
      'film super-heros', 'manga', 'anime', 'court-metrage', 'realisateur film', 'acteur film', 'actrice film',
      'producteur film', 'scenario film', 'bande-son film', 'musique film', 'soundtrack film', 'adaptation cinematographique', 'remake film',
      'prequel film', 'sequel film', 'spin-off serie', 'trilogie film', 'saga cinematographique', 'univers cinematographique', 'franchise film', 'sitcom',
      'telenovela', 'feuilleton tv', 'mini-serie', 'docu-serie', 'tele-realite', 'talk-show tv',
      'emission tv', 'jeu televise', 'telefilm', 'direct-to-video', 'film inedit', 'sous-titre film',
      'doublage film', 'version originale', 'VOST', 'VF', 'montage film', 'format video', 'widescreen',
      'film 4K', 'HDR video', 'UHD video', 'streaming video', 'VOD film', 'plateforme streaming', 'abonnement streaming', 'diffusion tv',
      'avant-premiere film', 'critique film', 'festival cinema', 'ceremonie cinema', 'prix cinema', 'oscar film', 'cesar film',
      'nomination cinema', 'blockbuster film', 'film independant', 'long-metrage', 'camera cinema',
      'tournage film', 'post-production film', 'effets speciaux', 'CGI film'
    ],
    en: [
      'movie', 'tv series', 'movie dvd', 'movie blu-ray', 'film bluray', 'movie box set', 'movie edition', 'collector edition',
      'limited edition', 'complete series', 'tv season', 'tv episode', 'series box set', 'tv box set', 'cinema', 'television',
      'documentary film', 'animated movie', 'comedy movie', 'action movie', 'thriller movie', 'horror movie', 'fantasy movie',
      'sci-fi movie', 'drama movie', 'romance movie', 'biopic movie', 'historical movie', 'adventure movie', 'western movie',
      'crime movie', 'war movie', 'musical movie', 'youth movie', 'family movie', 'animated cartoon', 'anime',
      'superhero movie', 'manga', 'short film', 'movie director', 'movie actor', 'movie actress',
      'movie producer', 'movie screenplay', 'movie soundtrack', 'movie music', 'film adaptation', 'movie remake',
      'movie prequel', 'movie sequel', 'tv spin-off', 'movie trilogy', 'film saga', 'cinematic universe', 'movie franchise', 'tv sitcom',
      'soap opera', 'tv series', 'mini-series', 'documentary series', 'reality tv show', 'tv talk show',
      'tv program', 'tv game show', 'tv movie', 'direct-to-video', 'exclusive film', 'movie subtitle',
      'movie dubbing', 'original version', 'subtitled version', 'dubbed version', 'film editing', 'video format', 'widescreen',
      'movie 4K', 'video HDR', 'video UHD', 'video streaming', 'movie VOD', 'streaming platform', 'streaming subscription', 'tv broadcast',
      'movie premiere', 'film review', 'film festival', 'cinema ceremony', 'cinema award', 'movie oscar', 'golden globe',
      'cinema nomination', 'blockbuster movie', 'indie film', 'feature film', 'cinema camera',
      'movie filming', 'film post-production', 'movie special effects', 'movie CGI', 'rotten tomatoes', 'imdb rating',
      'metacritic score', 'director cut', 'extended cut', 'theatrical release', 'movie cast', 'movie plot',
      'movie screenplay', 'screenwriter', 'cinematography', 'binge-watch', 'cliffhanger', 'tv pilot'
    ]
  },
    
  'Fournitures de Bureau': {
    fr: [
      'papier bureau', 'stylo bureau', 'crayon bureau', 'feutre bureau', 'marqueur bureau', 'surligneur', 'gomme bureau', 'taille-crayon',
      'classeur bureau', 'chemise bureau', 'dossier bureau', 'reliure bureau', 'agenda bureau', 'cahier bureau', 'bloc notes', 'post-it',
      'trombone bureau', 'agrafe bureau', 'ciseaux bureau', 'calculatrice bureau', 'ruban adhesif', 'adhesif bureau', 'etiquette bureau',
      'pince bureau', 'perforateur bureau', 'agrafeuse bureau', 'pochette bureau', 'intercalaire bureau', 'separateur bureau', 'carnet bureau',
      'repertoire bureau', 'calendrier bureau', 'ephemeride bureau', 'semainier bureau', 'memo bureau', 'pense-bete bureau', 'tableau bureau',
      'paperboard bureau', 'punaise bureau', 'aimant bureau', 'marqueur veleda', 'effaceur tableau', 'feuille bureau', 'ramette papier', 'papier copie',
      'bristol bureau', 'carton bureau', 'document cartonne', 'document plastifie', 'pochette transparent', 'pochette plastique',
      'protege-document', 'porte-vue bureau', 'sous-main bureau', 'tapis souris bureau', 'corbeille bureau', 'poubelle bureau',
      'boite archive', 'destructeur document', 'dechiqueteuse bureau', 'devidoir scotch', 'scotch bureau', 'colle bureau', 'baton colle',
      'correcteur bureau', 'blanc correcteur', 'encre bureau', 'cartouche bureau', 'toner bureau', 'imprimante bureau', 'photocopie bureau',
      'scanner bureau', 'tampon bureau', 'encrier bureau', 'enveloppe bureau', 'timbre bureau', 'courrier bureau', 'lettre bureau', 'colis bureau',
      'expediteur bureau', 'destinataire bureau', 'entete bureau', 'papier lettre', 'carte visite', 'badge bureau',
      'porte-nom bureau', 'attache parisienne', 'elastique bureau', 'pince-notes', 'marque-page bureau', 'regle bureau',
      'equerre bureau', 'rapporteur bureau', 'compas bureau', 'formulaire bureau', 'registre bureau', 'signature bureau', 'parapheur bureau',
      'trieur bureau', 'bannette bureau', 'porte-document bureau', 'ardoise bureau', 'craie bureau', 'planche pince'
    ],
    en: [
      'office paper', 'office pen', 'office pencil', 'office marker', 'office highlighter', 'eraser', 'pencil sharpener',
      'office binder', 'office folder', 'office binding', 'office agenda', 'office notebook', 'note pad', 'sticky note',
      'office paperclip', 'office staple', 'office scissors', 'office calculator', 'adhesive tape', 'office adhesive', 'office label',
      'office clip', 'office hole punch', 'office stapler', 'office pocket', 'office divider', 'office separator', 'office notepad',
      'office directory', 'office calendar', 'desk calendar', 'office planner', 'office memo', 'office reminder', 'office board',
      'office flipchart', 'office thumbtack', 'office magnet', 'whiteboard marker', 'board eraser', 'office sheet', 'paper ream', 'copy paper',
      'office index card', 'office cardboard', 'cardstock document', 'laminated document', 'transparent pocket', 'plastic pocket',
      'document protector', 'office display book', 'office desk pad', 'office mouse pad', 'office wastebasket', 'office trash bin',
      'office archive box', 'document shredder', 'office shredder', 'tape dispenser', 'office tape', 'office glue', 'glue stick',
      'office correction fluid', 'correction white-out', 'office ink', 'office cartridge', 'office toner', 'office printer', 'office photocopy',
      'office scanner', 'office stamp', 'office ink pad', 'office envelope', 'office stamp', 'office mail', 'office letter', 'office package',
      'office sender', 'office recipient', 'office letterhead', 'letter paper', 'business card', 'office badge',
      'office name tag', 'paper fastener', 'office rubber band', 'binder clip', 'office bookmark', 'office ruler',
      'office set square', 'office protractor', 'office compass', 'office form', 'office register', 'office signature', 'signature book',
      'office sorter', 'office letter tray', 'office document holder', 'office blackboard', 'office chalk', 'clipboard',
      'office address book', 'desk organizer', 'staple remover', 'three-hole punch', 'document case',
      'sticky note', 'memo pad', 'file cabinet', 'desk drawer', 'push pin', 'paper weight',
      'pen holder', 'pencil cup', 'tape measure', 'calculator tape', 'envelope sealer'
    ]
  },
  
  'Instruments de Musique': {
    fr: [
      'instrument musique', 'musique', 'guitare', 'piano', 'clavier musical', 'batterie musique', 'percussion musicale',
      'violon', 'flute', 'saxophone', 'trompette', 'harmonica', 'micro musical', 'ampli musique',
      'amplificateur musical', 'pedales musique', 'effet musical', 'accessoire musical', 'cable musical', 'mediator guitare', 'accordeur musical',
      'metronome', 'pupitre musique', 'partition musique', 'corde instrument', 'anche instrument', 'archet violon', 'guitare acoustique',
      'guitare electrique', 'guitare electroacoustique', 'synthetiseur', 'sampler musical', 'interface midi', 'interface audio',
      'table mixage', 'console mixage', 'sequenceur musical', 'enregistreur audio', 'casque studio', 'microphone studio',
      'pied microphone', 'stand musical', 'baguette batterie', 'mailloche percussion', 'caisse claire', 'grosse caisse',
      'cymbale', 'charleston', 'tom batterie', 'cajon', 'congas', 'bongos', 'djembe', 'tambourin',
      'triangle musical', 'xylophone', 'vibraphone', 'marimba', 'carillon musical', 'cloche musicale', 'gong',
      'contrebasse', 'violoncelle', 'alto', 'harpe', 'lyre', 'cithare', 'ukulele', 'banjo',
      'mandoline', 'balalaika', 'bouzouki', 'sitar', 'luth', 'guitare basse', 'clarinette',
      'hautbois', 'basson', 'cor anglais', 'piccolo', 'flute traversiere', 'flute bec',
      'ocarina', 'cor francais', 'cornet', 'bugle', 'trombone', 'tuba', 'euphonium', 'accordeon',
      'bandoneon', 'harmonica chromatique', 'melodica', 'orgue', 'orgue electronique',
      'pedalier orgue', 'diapason', 'solfege', 'theorie musicale', 'tablature guitare', 'enceinte studio', 'retour scene',
      'sonorisation', 'equalizer audio', 'reverb audio', 'delay audio', 'distortion guitare', 'chorus audio', 'boite rythme'
    ],
    en: [
      'musical instrument', 'music', 'guitar', 'piano', 'musical keyboard', 'drum kit', 'musical percussion',
      'violin', 'flute', 'saxophone', 'trumpet', 'harmonica', 'music microphone', 'music amp',
      'musical amplifier', 'music pedals', 'musical effect', 'musical accessory', 'music cable', 'guitar pick', 'musical tuner',
      'metronome', 'music stand', 'sheet music', 'instrument string', 'instrument reed', 'violin bow', 'acoustic guitar',
      'electric guitar', 'electroacoustic guitar', 'synthesizer', 'music sampler', 'midi interface', 'audio interface',
      'mixing desk', 'mixing console', 'music sequencer', 'audio recorder', 'studio headphones', 'studio microphone',
      'microphone stand', 'music stand', 'drum stick', 'percussion mallet', 'snare drum', 'bass drum',
      'cymbal', 'hi-hat', 'tom drum', 'cajon', 'conga drum', 'bongo drum', 'djembe', 'tambourine',
      'musical triangle', 'xylophone', 'vibraphone', 'marimba', 'musical glockenspiel', 'musical bell', 'gong',
      'double bass', 'cello', 'viola', 'harp', 'lyre', 'zither', 'ukulele', 'banjo',
      'mandolin', 'balalaika', 'bouzouki', 'sitar', 'lute', 'bass guitar', 'clarinet',
      'oboe', 'bassoon', 'english horn', 'piccolo', 'transverse flute', 'recorder flute',
      'ocarina', 'french horn', 'cornet', 'bugle', 'trombone', 'tuba', 'euphonium', 'accordion',
      'bandoneon', 'chromatic harmonica', 'melodica', 'organ', 'electronic organ',
      'organ pedal board', 'tuning fork', 'music theory', 'guitar tablature', 'studio speaker', 'stage monitor',
      'sound system', 'audio equalizer', 'audio reverb', 'audio delay', 'guitar distortion', 'audio chorus', 'drum machine',
      'audio interface', 'music DAW', 'audio preamp', 'condenser microphone', 'dynamic microphone', 'pop filter',
      'guitar capo', 'guitar slide', 'guitar strap', 'violin chin rest', 'violin rosin', 'woodwind instrument', 'brass instrument'
    ]
  },

  'Jardin': {
    fr: [
      'jardin', 'plante exterieure', 'jardinage', 'amenagement exterieur', 'terrasse', 'balcon fleuri', 'outillage jardinage',
      'tondeuse gazon', 'systeme arrosage', 'beche', 'rateau', 'elagage', 'taille haie', 'barbecue exterieur',
      'parasol', 'salon exterieur', 'serre jardinage', 'pot fleur', 'semence', 'graines potager', 'bulbe plantation',
      'tubercule plantation', 'fleurs jardin', 'arbuste ornemental', 'arbre ornement', 'conifere', 'feuillage decoratif', 'arbre fruitier',
      'potager', 'legume potager', 'plante aromatique', 'gazon pelouse', 'gazon', 'pelouse', 'compost organique', 'terreau plantation',
      'engrais plante', 'fertilisant organique', 'traitement plante', 'anti-insecte', 'anti-champignon', 'desherbant',
      'herbicide', 'pulverisateur', 'arrosoir', 'tuyau arrosage', 'goutte goutte', 'asperseur pelouse',
      'irrigation automatique', 'bache protection', 'paillis decoratif', 'brouette', 'secateur', 'cisaille elagage', 'tronconneuse elagage',
      'motoculteur', 'debroussailleuse', 'coupe-bordure pelouse', 'bineuse', 'beche plantation',
      'fourche becher', 'pioche', 'transplantoir', 'serfouette', 'sarcloir', 'taille-haie electrique', 'souffleur feuilles',
      'aspirateur feuilles', 'broyeur vegetaux', 'composteur', 'bac plantation', 'jardiniere balcon', 'suspension florale', 'tuteur plante',
      'treillis plante', 'pergola', 'tonnelle', 'kiosque', 'gloriette', 'abri outils', 'remise jardin', 'cloture',
      'grillage', 'palissade bois', 'bordure massif', 'dalles terrasse', 'pave', 'gravier decoratif', 'ecorce decorative', 'paillis',
      'rocaille', 'bassin aquatique', 'fontaine decorative', 'pompe bassin', 'eclairage exterieur', 'ornement jardin', 'statuette decorative', 'mobilier exterieur',
      'fauteuil exterieur', 'table exterieure', 'banc exterieur', 'hamac', 'balancelle', 'store terrasse', 'bain de soleil', 'transat'
    ],
    en: [
      'garden', 'outdoor plant', 'gardening', 'outdoor landscaping', 'patio', 'flowering balcony', 'gardening tools',
      'lawn mower', 'watering system', 'spade', 'rake', 'pruning', 'hedge trimming', 'outdoor barbecue',
      'patio umbrella', 'outdoor furniture set', 'gardening greenhouse', 'flower pot', 'plant seed', 'vegetable seeds', 'planting bulb',
      'planting tuber', 'flowering plants', 'ornamental shrub', 'ornamental tree', 'evergreen', 'decorative foliage', 'fruit tree',
      'vegetable garden', 'vegetable crop', 'aromatic herb', 'lawn grass', 'turf', 'organic compost', 'planting soil',
      'plant fertilizer', 'organic fertilizer', 'plant treatment', 'insect control', 'fungus control', 'weed killer',
      'herbicide', 'garden sprayer', 'watering can', 'garden hose', 'drip irrigation', 'lawn sprinkler',
      'automatic irrigation', 'protective tarp', 'decorative mulch', 'wheelbarrow', 'pruning shears', 'pruning saw', 'pruning chainsaw',
      'garden tiller', 'brush cutter', 'lawn edger', 'cultivator hoe', 'planting spade',
      'digging fork', 'pickaxe', 'hand trowel', 'hand cultivator', 'weeding hoe', 'electric hedge trimmer', 'leaf blower',
      'leaf vacuum', 'garden shredder', 'composter', 'planting container', 'balcony planter', 'hanging basket', 'plant stake',
      'plant trellis', 'pergola', 'gazebo arbor', 'pavilion', 'garden gazebo', 'tool shed', 'storage shed', 'fencing',
      'wire mesh', 'wooden fence', 'flower bed edging', 'patio stones', 'paving stone', 'decorative gravel', 'decorative bark', 'mulch',
      'rock garden', 'water feature', 'decorative fountain', 'pond pump', 'outdoor lighting', 'landscape ornament', 'decorative statue', 'outdoor furniture',
      'outdoor chair', 'patio table', 'outdoor bench', 'hammock', 'porch swing', 'patio awning', 'sun lounger', 'deck chair',
      'hose reel', 'kneeling pad', 'gardening gloves', 'topiary', 'bird feeder', 'bird bath',
      'cold frame', 'plant propagator', 'weed barrier', 'rain barrel', 'landscape fabric'
    ]
  },
  
  'Jeux Vidéo et Consoles': {
    fr: [
      'jeu vidéo', 'video game', 'console jeu', 'manette jeu', 'accessoire gaming', 'playstation', 'xbox',
      'nintendo', 'nintendo switch', 'pc gaming', 'gamer', 'gaming', 'jeu arcade', 'jeu simulation',
      'jeu action', 'jeu aventure', 'jeu rpg', 'jeu sport', 'jeu course', 'jeu combat', 'jeu plateforme',
      'jeu strategie', 'jeu fps', 'jeu mmorpg', 'casque vr', 'realite virtuelle', 'casque gaming', 'joystick',
      'volant gaming', 'pedalier gaming', 'stick arcade', 'gamepad', 'controleur jeu', 'bouton manette', 'gachette manette',
      'console portable', 'cartouche jeu', 'disque jeu', 'jeu dematerialise', 'telechargement jeu', 'connexion gaming',
      'jeu online', 'mode multijoueur', 'mode solo', 'mode campagne', 'histoire jeu', 'scenario jeu', 'personnage jeu',
      'avatar gaming', 'profil joueur', 'sauvegarde jeu', 'checkpoint', 'niveau jeu', 'monde virtuel', 'environnement jeu',
      'graphisme jeu', 'frame rate', 'resolution gaming', 'texture jeu', 'pixel art', 'polygone', 'rendu 3D',
      'shader', 'feedback haptique', 'vibration manette', 'retour de force', 'camera jeu', 'vue subjective',
      'jeu tps', 'jeu rts', 'jeu moba', 'battle royale', 'jeu survie', 'jeu horreur', 'jeu puzzle', 'jeu reflexion',
      'jeu roguelike', 'jeu roguelite', 'jeu indie', 'jeu AAA', 'editeur jeu', 'developpeur jeu', 'studio gaming',
      'patch jeu', 'mise a jour jeu', 'dlc', 'extension jeu', 'season pass', 'jeu free-to-play', 'version premium',
      'abonnement gaming', 'boutique jeu', 'microtransaction', 'skin jeu', 'cosmetique jeu', 'emote', 'buff jeu',
      'nerf', 'spawn', 'respawn', 'hitbox', 'lag gaming', 'ping jeu', 'serveur jeu', 'cross-play', 'cross-platform'
    ],
    en: [
      'video game', 'gaming video', 'game console', 'game controller', 'gaming accessory', 'playstation', 'xbox',
      'nintendo', 'nintendo switch', 'gaming pc', 'gamer', 'gaming', 'arcade game', 'simulation game',
      'action game', 'adventure game', 'rpg game', 'sports game', 'racing game', 'fighting game', 'platform game',
      'strategy game', 'fps game', 'mmorpg game', 'vr headset', 'virtual reality', 'gaming headset', 'gaming joystick',
      'gaming steering wheel', 'gaming pedals', 'arcade stick', 'gamepad', 'game controller', 'controller button', 'controller trigger',
      'handheld console', 'game cartridge', 'game disc', 'digital game', 'game download', 'gaming connection',
      'online gaming', 'multiplayer mode', 'singleplayer mode', 'campaign mode', 'game story', 'game plot', 'game character',
      'gaming avatar', 'player profile', 'game save', 'checkpoint', 'game level', 'virtual world', 'game environment',
      'game graphics', 'frame rate', 'gaming resolution', 'game texture', 'pixel art', 'polygon', '3D rendering',
      'shader', 'haptic feedback', 'controller vibration', 'force feedback', 'game camera', 'first-person view',
      'tps game', 'rts game', 'moba game', 'battle royale', 'survival game', 'horror game', 'puzzle game', 'brain teaser game',
      'roguelike game', 'roguelite game', 'indie game', 'AAA game', 'game publisher', 'game developer', 'gaming studio',
      'game patch', 'game update', 'dlc', 'game expansion', 'season pass', 'free-to-play game', 'premium version',
      'gaming subscription', 'game store', 'microtransaction', 'game skin', 'game cosmetic', 'emote', 'game buff',
      'nerf', 'spawn', 'respawn', 'hitbox', 'gaming lag', 'game ping', 'game server', 'cross-play', 'cross-platform',
      'early access', 'beta test', 'alpha test', 'game mod', 'modding', 'lootbox', 'achievement', 'trophy'
    ]
  },
    
  'Jouets et Jeux': {
    fr: [
      'jouet enfant', 'jeu enfant', 'puzzle enfant', 'peluche', 'poupee', 'figurine jouet', 'jeu construction',
      'lego', 'playmobil', 'jouet educatif', 'jouet eveil', 'jeu exterieur', 'jouet plein air', 'petite voiture',
      'voiture telecommandee', 'drone jouet', 'jeu societe', 'jeu carte', 'jeu plateau', 'jeu echec', 'dessin enfant',
      'peinture enfant', 'modelisme enfant', 'maquette enfant', 'deguisement enfant', 'costume enfant', 'masque deguisement', 'maquillage enfant',
      'fete enfant', 'anniversaire enfant', 'decoration fete', 'ballon fete', 'pinata', 'balle jouet',
      'bille jouet', 'toupie', 'yo-yo', 'diabolo', 'baton sauteur', 'cerceau enfant', 'corde sauter',
      'frisbee', 'ballon enfant', 'raquette enfant', 'jeu quille', 'bowling enfant', 'piscine gonflable', 'pataugeoire',
      'trampoline enfant', 'toboggan enfant', 'balancoire enfant', 'bascule enfant', 'portique jeu', 'cabane enfant', 'tipi enfant',
      'tente enfant', 'dinette', 'cuisine jouet', 'jeu menage', 'caisse enregistreuse', 'jeu magasin', 'jeu docteur', 'kit bricolage',
      'etabli enfant', 'garage jouet', 'maison poupee', 'barbie', 'poupon', 'landau poupee', 'poussette poupee',
      'biberon poupee', 'vetement poupee', 'accessoire poupee', 'cheval bascule', 'cheval baton', 'ferme jouet', 'animaux jouet', 'dinosaure jouet',
      'robot jouet', 'transformers', 'figurine action', 'super-heros jouet', 'marvel jouet', 'dc jouet', 'star wars jouet',
      'pokemon jouet', 'cartes collectionner', 'collection enfant', 'album autocollant', 'vignette', 'autocollant enfant', 'tampon encreur',
      'pate modeler', 'argile enfant', 'poterie enfant', 'perle enfant', 'bracelet enfant', 'bijou enfant', 'kit creatif', 'kit scientifique',
      'experience enfant', 'microscope enfant', 'telescope enfant', 'jeu espace', 'kit astronomie', 'kit chimie', 'exploration nature'
    ],
    en: [
      'children toy', 'kids game', 'children puzzle', 'plush toy', 'doll', 'toy figure', 'building toy',
      'lego', 'playmobil', 'educational toy', 'developmental toy', 'outdoor game', 'toy car',
      'remote control car', 'toy drone', 'board game', 'card game', 'chess game', 'children drawing',
      'children paint', 'children modeling', 'toy model', 'children costume', 'dress up outfit', 'costume mask', 'children makeup',
      'children party', 'kids birthday', 'party decoration', 'party balloon', 'pinata', 'toy ball',
      'toy marble', 'spinning top', 'yo-yo', 'diabolo', 'pogo stick', 'children hoop', 'jump rope',
      'frisbee', 'play ball', 'toy racket', 'bowling pins', 'children bowling', 'inflatable pool', 'paddling pool',
      'children trampoline', 'playground slide', 'children swing', 'children seesaw', 'play structure', 'children playhouse', 'play teepee',
      'play tent', 'toy kitchen', 'play housekeeping', 'toy cash register', 'play store', 'doctor kit', 'craft kit',
      'toy workbench', 'toy garage', 'dollhouse', 'barbie doll', 'baby doll', 'doll pram', 'doll stroller',
      'doll bottle', 'doll clothing', 'doll accessory', 'rocking horse', 'stick horse', 'toy farm', 'toy animals', 'toy dinosaur',
      'toy robot', 'transformers', 'action figure', 'superhero toy', 'marvel toy', 'dc toy', 'star wars toy',
      'pokemon toy', 'trading cards', 'toy collection', 'sticker album', 'collectible sticker', 'children sticker', 'stamp pad',
      'play dough', 'children clay', 'children pottery', 'craft bead', 'children bracelet', 'toy jewelry', 'craft kit', 'science kit',
      'children experiment', 'toy microscope', 'toy telescope', 'space toy', 'astronomy kit', 'chemistry kit', 'nature exploration',
      'puppet toy', 'finger puppet', 'stuffed animal', 'teddy bear', 'family board game', 'monopoly game',
      'scrabble game', 'jenga game', 'game dice', 'playing cards', 'children craft kit', 'jigsaw puzzle', 'rubik cube'
    ]
  },

  'Literie': {
    fr: [
      'lit', 'matelas', 'sommier', 'drap lit', 'couette', 'oreiller', 'couverture lit',
      'housse literie', 'traversin', 'taie oreiller', 'alese', 'surmatelas', 'couvre lit', 'plaid lit',
      'edredon', 'duvet', 'protege matelas', 'parure lit', 'linge lit', 'drap housse',
      'drap plat', 'cache sommier', 'tour lit', 'ciel lit', 'baldaquin', 'tete lit',
      'pied lit', 'cadre lit', 'structure lit', 'bois lit', 'lit simple',
      'lit double', 'lit queen size', 'lit king size', 'lit superpose', 'lit mezzanine',
      'lit gigogne', 'lit coffre', 'canape lit', 'clic-clac', 'futon', 'lit convertible',
      'banquette bz', 'lit pliant', 'lit parapluie', 'berceau', 'couffin', 'lit bebe', 'matelas bebe',
      'matelas ressorts', 'matelas mousse', 'matelas memoire forme', 'matelas latex',
      'matelas orthopedique', 'matelas gonflable', 'matelas appoint', 'oreiller plume',
      'oreiller duvet', 'oreiller synthetique', 'oreiller ergonomique', 'oreiller cervical',
      'oreiller memoire forme', 'oreiller anti-acarien', 'traversin plume', 'traversin duvet',
      'traversin synthetique', 'couette plume', 'couette duvet', 'couette synthetique',
      'couette 4 saisons', 'couette ete', 'couette hiver', 'couette legere', 'couette chaude',
      'housse couette', 'fermeture pression', 'fermeture zip', 'fermeture literie', 'traitement anti-acarien', 'textile hypoallergenique',
      'textile impermeable', 'tissu respirant', 'garnissage literie', 'fibres textiles', 'tissage literie', 'percale coton', 'satin literie',
      'flanelle literie', 'jersey literie', 'coton literie', 'lin literie', 'bambou literie', 'soie literie', 'microfibre literie', 'fil literie',
      'densite matelas', 'grammage literie', 'epaisseur matelas', 'confort couchage', 'matelas ferme', 'matelas moelleux', 'gonflant literie',
      'doudou enfant', 'traversin polochon'
    ],
    en: [
      'bed', 'mattress', 'box spring', 'bed sheet', 'duvet', 'pillow', 'bed blanket',
      'bedding cover', 'bolster', 'pillowcase', 'mattress pad', 'mattress topper', 'bedspread', 'bed throw',
      'quilt', 'comforter', 'mattress protector', 'bedding set', 'bed linen', 'fitted sheet',
      'flat sheet', 'bed skirt', 'crib bumper', 'bed canopy', 'four-poster bed', 'headboard',
      'footboard', 'bed frame', 'bed structure', 'bedstead', 'single bed',
      'double bed', 'queen size bed', 'king size bed', 'bunk bed', 'loft bed',
      'trundle bed', 'storage bed', 'sofa bed', 'click-clack bed', 'futon bed', 'convertible bed',
      'daybed', 'folding bed', 'travel cot', 'baby cradle', 'bassinet', 'baby crib', 'crib mattress',
      'spring mattress', 'foam mattress', 'memory foam mattress', 'latex mattress',
      'orthopedic mattress', 'air mattress', 'guest mattress', 'feather pillow',
      'down pillow', 'synthetic pillow', 'ergonomic pillow', 'cervical pillow',
      'memory foam pillow', 'anti-dust mite pillow', 'feather bolster', 'down bolster',
      'synthetic bolster', 'feather duvet', 'down duvet', 'synthetic duvet',
      'all-season duvet', 'summer duvet', 'winter duvet', 'lightweight duvet', 'warm duvet',
      'duvet cover', 'snap closure', 'zipper closure', 'bedding closure', 'anti-dust mite treatment', 'hypoallergenic textile',
      'waterproof textile', 'breathable fabric', 'bedding filling', 'textile fibers', 'bedding weave', 'cotton percale', 'satin bedding',
      'flannel bedding', 'jersey bedding', 'cotton bedding', 'linen bedding', 'bamboo bedding', 'silk bedding', 'microfiber bedding', 'bedding thread',
      'mattress density', 'bedding weight', 'mattress thickness', 'sleeping comfort', 'firm mattress', 'soft mattress', 'bedding fluffiness',
      'comfort object', 'body pillow', 'mattress foundation', 'platform bed', 'adjustable bed',
      'sleep number mattress', 'tempur-pedic mattress', 'casper mattress', 'purple mattress', 'nectar mattress', 'sleep mask', 'bed runner'
    ]
  },

  'Logiciels': {
    fr: [
      'logiciel', 'software', 'programme informatique', 'application logicielle', 'suite logicielle', 'antivirus logiciel',
      'securite informatique', 'suite bureautique', 'microsoft word', 'microsoft excel', 'microsoft office', 'windows os', 'macos',
      'adobe creative', 'photoshop logiciel', 'illustrator logiciel', 'indesign logiciel', 'premiere pro', 'logiciel montage',
      'logiciel video', 'logiciel audio', 'logiciel retouche', 'licence logiciel', 'abonnement logiciel', 'telechargement logiciel', 
      'installation logicielle', 'mise jour logiciel', 'upgrade logiciel', 'patch logiciel', 'version logicielle', 'interface logicielle',
      'systeme exploitation', 'os', 'distribution linux', 'unix', 'driver logiciel', 'pilote logiciel', 'compatibilite logicielle',
      'logiciel compatible', 'microsoft powerpoint', 'microsoft outlook', 'microsoft access', 'microsoft onenote',
      'logiciel tableur', 'traitement texte', 'base donnees logicielle', 'logiciel presentation', 'client courriel',
      'client email', 'logiciel messagerie', 'navigateur gmail', 'client outlook', 'yahoo mail', 'thunderbird', 'navigateur web',
      'chrome browser', 'firefox browser', 'safari browser', 'edge browser', 'internet explorer', 'opera browser', 'extensions navigateur', 'plugin logiciel',
      'add-on logiciel', 'complement logiciel', 'stockage cloud', 'logiciel sauvegarde', 'backup logiciel', 'stockage logiciel', 'serveur logiciel',
      'logiciel reseau', 'partage fichiers', 'synchronisation donnees', 'cryptage logiciel', 'chiffrement donnees', 'pare-feu logiciel',
      'firewall logiciel', 'detection malware', 'anti-spyware', 'anti-ransomware', 'anti-trojan', 'antivirus scan', 'scan antivirus',
      'analyse securite', 'protection logicielle', 'vpn logiciel', 'proxy logiciel', 'anonymat logiciel', 'confidentialite donnees', 'privacy logiciel',
      'logiciel graphisme', 'logiciel CAO', 'logiciel DAO', 'logiciel modelisation', 'logiciel 3D', 'logiciel animation', 'logiciel effets',
      'adobe lightroom', 'after effects', 'final cut pro', 'pro tools audio', 'ableton live', 'cubase audio',
      'logic pro audio', 'fl studio', 'garageband', 'imovie', 'filmora video', 'davinci resolve',
      'autocad logiciel', 'sketchup 3d', 'cinema 4d', 'maya 3d', 'blender 3d', 'revit architecture', 'archicad',
      'logiciel comptabilite', 'logiciel gestion', 'erp logiciel', 'crm logiciel', 'sage comptabilite', 'ciel comptabilite', 'ebp gestion', 'sap erp'
    ],
    en: [
      'software', 'computer program', 'software application', 'software suite', 'antivirus software',
      'computer security', 'office suite', 'microsoft word', 'microsoft excel', 'windows os', 'macos',
      'adobe creative suite', 'photoshop software', 'illustrator software', 'indesign software', 'premiere pro', 'editing software',
      'video software', 'audio software', 'photo editing software', 'software license', 'software subscription', 'software download',
      'software installation', 'software update', 'software upgrade', 'software patch', 'software version', 'software interface',
      'operating system', 'os', 'linux distribution', 'unix', 'software driver', 'device driver', 'software compatibility',
      'compatible software', 'microsoft powerpoint', 'microsoft outlook', 'microsoft access', 'microsoft onenote',
      'spreadsheet software', 'word processing software', 'database software', 'presentation software', 'email client',
      'mail client', 'messaging software', 'gmail client', 'outlook client', 'yahoo mail', 'thunderbird', 'web browser',
      'chrome browser', 'firefox browser', 'safari browser', 'edge browser', 'internet explorer', 'opera browser', 'browser extensions', 'software plugin',
      'software add-on', 'software complement', 'cloud storage', 'backup software', 'storage software', 'server software',
      'network software', 'file sharing software', 'data synchronization', 'encryption software', 'data encryption', 'firewall software',
      'malware detection', 'anti-spyware software', 'anti-ransomware', 'anti-trojan', 'antivirus software', 'security scan',
      'security analysis', 'software protection', 'vpn software', 'proxy software', 'anonymity software', 'data privacy', 'privacy software',
      'graphics software', 'cad software', 'modeling software', '3d software', 'animation software', 'special effects software',
      'adobe lightroom', 'after effects', 'final cut pro', 'pro tools audio', 'ableton live', 'cubase audio',
      'logic pro audio', 'fl studio', 'garageband', 'imovie', 'filmora video', 'davinci resolve',
      'autocad software', 'sketchup 3d', 'cinema 4d', 'maya 3d', 'blender 3d', 'revit architecture', 'archicad',
      'accounting software', 'management software', 'erp software', 'crm software', 'sage accounting', 'quickbooks', 'xero accounting', 'sap erp',
      'developer tools', 'IDE software', 'visual studio', 'xcode', 'android studio', 'eclipse ide',
      'intellij idea', 'jetbrains', 'git software', 'github', 'gitlab', 'bitbucket', 'jira software', 'slack software'
    ]
  },

  'Luminaire': {
    fr: [
      'lampe', 'luminaire', 'eclairage domestique', 'eclairage interieur', 'applique murale', 'plafonnier', 'ampoule eclairage',
      'suspension luminaire', 'spot luminaire', 'lustre', 'lampadaire', 'veilleuse', 'guirlande lumineuse', 'led eclairage',
      'lanterne luminaire', 'abat jour', 'ampoule halogene', 'lampe bureau', 'lampe chevet', 'liseuse luminaire',
      'reglette luminaire', 'tube lumineux', 'neon eclairage', 'tube fluorescent', 'balisage lumineux', 'projecteur luminaire', 'spot encastrable',
      'spot rail', 'spot orientable', 'lampe poser', 'lampe tactile', 'lampe variateur',
      'lampe articulee', 'lampe flexible', 'lampe pince', 'lampe loupe', 'lampe architecte', 'lampe clip', 'lampe industrielle', 'lampe vintage', 'suspension multiple',
      'suspension reglable', 'lustre moderne', 'lustre contemporain', 'lustre baroque', 'lustre cristal',
      'lustre design', 'candelabre', 'chandelier', 'bougeoir luminaire', 'photophore', 'lanterne decorative',
      'lanterne exterieure', 'lanterne solaire', 'eclairage exterieur', 'borne lumineuse', 'potelet lumineux',
      'applique exterieure', 'projecteur exterieur', 'spot exterieur', 'lampadaire exterieur',
      'eclairage paysager', 'eclairage decoratif', 'eclairage allee', 'eclairage piscine',
      'ruban led', 'bandeau led', 'rampe led', 'kit led', 'bande led', 'profil led',
      'transformateur eclairage', 'alimentation led', 'connecteur led', 'variateur lumiere', 'gradateur eclairage', 'interrupteur eclairage',
      'telecommande eclairage', 'detecteur luminaire', 'capteur mouvement', 'detecteur crepusculaire', 'minuterie eclairage', 'eclairage rgb',
      'eclairage multicolore', 'luminaire connecte', 'eclairage intelligent', 'eclairage bluetooth', 'eclairage wifi', 'domotique eclairage', 'philips hue',
      'ampoule filament', 'ampoule Edison', 'luminaire retro', 'ampoule globe', 'ampoule flamme', 'ampoule dichroique',
      'culot ampoule', 'douille luminaire', 'rosace suspension', 'cable luminaire', 'fil eclairage', 'cordon lampe', 'chaine suspension'
    ],
    en: [
      'lamp', 'light fixture', 'home lighting', 'interior lighting', 'wall sconce', 'ceiling light', 'light bulb',
      'pendant light', 'light spotlight', 'chandelier', 'floor lamp', 'night light', 'string lights', 'led lighting',
      'light lantern', 'lampshade', 'halogen bulb', 'desk lamp', 'bedside lamp', 'reading light',
      'light strip', 'light tube', 'neon lighting', 'fluorescent tube', 'marker lighting', 'light projector', 'recessed spotlight',
      'track spotlight', 'adjustable spotlight', 'table lamp', 'touch lamp', 'dimmer lamp',
      'articulated lamp', 'flexible lamp', 'clip-on lamp', 'magnifying lamp', 'architect lamp', 'clip lamp', 'industrial lamp', 'vintage lamp', 'multiple pendant',
      'adjustable pendant', 'modern chandelier', 'contemporary chandelier', 'baroque chandelier', 'crystal chandelier',
      'designer chandelier', 'candelabra', 'candle holder lighting', 'tealight holder', 'decorative lantern',
      'outdoor lantern', 'solar lantern', 'outdoor lighting', 'light bollard', 'light post',
      'outdoor wall light', 'outdoor floodlight', 'outdoor spotlight', 'outdoor floor lamp',
      'landscape lighting', 'decorative lighting', 'pathway lighting', 'pool lighting',
      'led light strip', 'led tape', 'led light bar', 'led kit', 'led band', 'led profile',
      'lighting transformer', 'led power supply', 'led connector', 'light dimmer', 'lighting dimmer', 'lighting switch',
      'lighting remote control', 'light detector', 'motion sensor', 'dusk sensor', 'lighting timer', 'rgb lighting',
      'multicolor lighting', 'smart lighting', 'intelligent lighting', 'bluetooth lighting', 'wifi lighting', 'home automation lighting', 'philips hue',
      'filament bulb', 'Edison bulb', 'retro lighting', 'globe bulb', 'flame bulb', 'dichroic bulb',
      'bulb base', 'light socket', 'pendant canopy', 'lighting cable', 'lighting wire', 'lamp cord', 'suspension chain',
      'downlight', 'uplighter', 'tiffany lamp', 'task lighting', 'light fitting', 'lighting fixture'
    ]
  },

  'Mode et Vêtements': {
    fr: [
      'vetement', 'habillement', 'mode', 'vetement homme', 'vetement femme', 'vetement enfant', 'tshirt',
      'chemise', 'pantalon', 'jean', 'robe', 'jupe', 'manteau', 'veste', 'blouson',
      'pull', 'sweat', 'gilet', 'sous-vetement', 'chaussette', 'collant',
      'pyjama', 'maillot bain', 'echarpe mode', 'bonnet mode', 'gant mode', 'chemisier',
      'polo', 'cravate', 'noeud papillon', 'costume', 'tailleur', 'blazer',
      'short', 'bermuda', 'corsaire', 'legging', 'jogging', 'survetement',
      'debardeur', 'caraco', 'bustier', 'body', 'combinaison', 'salopette',
      'trench', 'imperméable', 'coupe-vent', 'doudoune', 'parka', 'caban',
      'cardigan', 'poncho', 'châle', 'etole', 'foulard', 'ceinture mode', 'bretelle',
      'soutien-gorge', 'culotte', 'slip', 'boxer', 'caleçon', 'string',
      'shorty', 'nuisette', 'déshabillé', 'bas', 'mi-bas', 'collant',
      'chaussure mode', 'basket mode', 'tennis mode', 'mocassin', 'derby', 'richelieu', 'escarpin',
      'bottine', 'botte', 'ballerine', 'sandale mode', 'espadrille', 'mule', 'tong',
      'chausson', 'pantoufle', 'casquette mode', 'chapeau mode', 'béret', 'cagoule', 'bandana',
      'serre-tête', 'bandeau cheveux', 'mitaine', 'moufle', 'lingerie', 'robe chambre',
      'peignoir', 'grenouillère', 'body bébé', 'bavoir', 'barboteuse',
      'maillot corps', 'sac mode', 'sac main', 'pochette mode', 'cartable enfant', 'besace',
      'sacoche mode', 'sac dos', 'portefeuille', 'porte-monnaie', 'bijou mode',
      'montre mode', 'bracelet mode', 'collier mode', 'bague mode', 'boucle oreille', 'lunettes mode'
    ],
    en: [
      'clothing', 'fashion', 'men clothing', 'women clothing', 'children clothing', 'tshirt',
      'shirt', 'pants', 'jeans', 'dress', 'skirt', 'coat', 'jacket',
      'sweater', 'sweatshirt', 'cardigan', 'underwear', 'sock', 'tights',
      'pajamas', 'swimwear', 'fashion scarf', 'fashion hat', 'fashion glove', 'blouse',
      'polo shirt', 'necktie', 'bow tie', 'suit', 'women suit', 'blazer',
      'shorts', 'bermuda shorts', 'capri pants', 'leggings', 'joggers', 'tracksuit',
      'tank top', 'camisole', 'bustier', 'bodysuit', 'jumpsuit', 'overalls',
      'trench coat', 'raincoat', 'windbreaker', 'down jacket', 'parka', 'peacoat',
      'cardigan', 'poncho', 'shawl', 'stole', 'neckerchief', 'fashion belt', 'suspender',
      'bra', 'panty', 'brief', 'boxer shorts', 'boxer brief', 'thong',
      'boyshort', 'negligee', 'robe', 'stocking', 'knee-high', 'pantyhose',
      'fashion shoe', 'fashion sneaker', 'tennis shoe', 'loafer', 'derby shoe', 'oxford shoe', 'pump',
      'ankle boot', 'boot', 'ballet flat', 'fashion sandal', 'espadrille', 'mule', 'flip-flop',
      'slipper', 'house shoe', 'fashion cap', 'fashion hat', 'beret', 'balaclava', 'bandana',
      'headband', 'hair band', 'fingerless glove', 'mitten', 'lingerie', 'dressing gown',
      'bathrobe', 'onesie', 'baby bodysuit', 'bib', 'romper',
      'undershirt', 'fashion bag', 'handbag', 'fashion clutch', 'school bag', 'messenger bag',
      'fashion pouch', 'backpack', 'wallet', 'coin purse', 'fashion jewelry',
      'fashion watch', 'fashion bracelet', 'fashion necklace', 'fashion ring', 'earring', 'fashion glasses',
      'hoodie', 'crop top', 'maxi dress', 'mini skirt', 'pleated skirt', 'denim jacket'
    ]
  },

 'Bijoux et Accessoires': {
    fr: [
      'bijou', 'montre', 'bracelet', 'collier', 'bague', 'boucle', 'oreille',
      'pendentif', 'chaine', 'jonc', 'gourmette', 'diamant', 'or', 'argent',
      'plaqué', 'perle', 'swarovski', 'cristal', 'acier', 'titane', 'maroquinerie',
      'alliance', 'solitaire', 'chevalière', 'créole', 'puces', 'broche', 'épingle',
      'diadème', 'tiare', 'couronne', 'parure', 'gemme', 'pierre précieuse', 'rubis',
      'saphir', 'émeraude', 'topaze', 'améthyste', 'aigue-marine', 'opale', 'grenat',
      'citrine', 'jade', 'turquoise', 'onyx', 'camée', 'chaîne de cheville', 'bracelet de cheville',
      'bracelet manchette', 'bague de fiançailles', 'piercing', 'breloque', 'médaillon',
      'talisman', 'amulette', 'rosaire', 'chapelet', 'crucifix', 'croix', 'étoile',
      'cœur', 'trèfle', 'montre automatique', 'montre quartz', 'montre digitale', 'montre connectée',
      'montre mécanique', 'chronomètre', 'fermoir', 'brillant', 'platine', 'vermeil',
      'rhodium', 'laiton', 'bronze', 'cuivre', 'céramique', 'nacre', 'coquillage',
      'corail', 'ambre', 'porcelaine', 'résine', 'ébène', 'corne', 'os', 'ivoire',
      'écaille', 'plume', 'bijou ethnique', 'bijou fantaisie', 'bijou artisanal', 'bijou vintage',
      'bijou contemporain', 'bijou antique', 'épingle cheveux', 'épingle chignon', 'barrette',
      'épingle à cheveux', 'serre-tête', 'bandeau', 'diadème cheveux', 'bijou de tête', 'ornement'
    ],
    en: [
      'jewelry', 'watch', 'bracelet', 'necklace', 'ring', 'earring',
      'pendant', 'chain', 'bangle', 'id bracelet', 'diamond', 'gold', 'silver',
      'plated', 'pearl', 'swarovski', 'crystal', 'steel', 'titanium', 'leather goods',
      'wedding band', 'solitaire', 'signet ring', 'hoop earring', 'stud earring', 'brooch', 'pin',
      'diadem', 'tiara', 'crown', 'jewelry set', 'gem', 'precious stone', 'ruby',
      'sapphire', 'emerald', 'topaz', 'amethyst', 'aquamarine', 'opal', 'garnet',
      'citrine', 'jade', 'turquoise', 'onyx', 'cameo', 'ankle chain', 'anklet',
      'cuff bracelet', 'engagement ring', 'body piercing', 'charm pendant', 'locket',
      'talisman', 'amulet', 'rosary', 'prayer beads', 'crucifix', 'cross', 'star',
      'heart', 'clover', 'automatic watch', 'quartz watch', 'digital watch', 'smartwatch',
      'mechanical watch', 'chronometer', 'clasp', 'brilliant', 'platinum', 'vermeil',
      'rhodium', 'brass', 'bronze', 'copper', 'ceramic', 'mother of pearl', 'shell',
      'coral', 'amber', 'porcelain', 'resin', 'ebony', 'horn', 'bone', 'ivory',
      'tortoiseshell', 'feather', 'ethnic jewelry', 'costume jewelry', 'handcrafted jewelry', 'vintage jewelry',
      'contemporary jewelry', 'antique jewelry', 'hair pin', 'hair clip', 'barrette',
      'hairpin', 'headband', 'hair band', 'hair piece', 'hair ornament', 'embellishment',
      'cocktail ring', 'promise ring', 'toe ring', 'belly button ring', 'gemstone', 'birthstone'
    ]
  },

  'Chaussures': {
    fr: [
      'chaussure', 'basket', 'sneaker', 'botte', 'bottine', 'escarpin', 'mocassin',
      'sandale', 'ballerine', 'derby', 'richelieu', 'slip-on', 'tong', 'mule',
      'pantoufles', 'soulier', 'orthopédiques', 'chausson',
      'sabot', 'semelle', 'lacet', 'talon', 'compensé', 'plateforme', 'chaussure sport',
      'running', 'jogging', 'trail', 'randonnée', 'marche', 'trekking', 'alpinisme',
      'escalade', 'montagne', 'chaussure ski', 'snowboard', 'après-ski', 'chaussure surf', 'skateboard',
      'roller', 'patin', 'crampon football', 'crampons rugby', 'chaussure tennis', 'chaussure golf', 'basket-ball',
      'handball', 'volley-ball', 'chausson danse', 'chausson ballet', 'gymnastique', 'fitness', 'yoga',
      'pilates', 'aquatique', 'tong plage', 'piscine', 'cuissarde', 'botte cavalière',
      'bottes de pluie', 'bottes en caoutchouc', 'bottes fourrées', 'chelsea boots',
      'desert boots', 'rangers', 'doc martens', 'ugg', 'converse', 'vans', 'adidas',
      'nike', 'puma', 'reebok', 'asics', 'new balance', 'skechers', 'timberland',
      'birkenstock', 'havaianas', 'crocs', 'salomon', 'merrell', 'rieker', 'geox',
      'clarks', 'kickers', 'aigle', 'le coq sportif', 'lacoste', 'chausson intérieur', 'pantoufle',
      'babouche', 'espadrille', 'cuir chaussure', 'daim', 'nubuck', 'toile', 'synthétique',
      'textile', 'mesh', 'gore-tex', 'imperméable', 'membrane', 'respirant', 'amorti',
      'confort', 'orthopédique', 'semelle intérieure', 'voûte plantaire', 'talon aiguille',
      'talon bloc', 'talon kitten', 'talon bottier', 'stiletto', 'wedge', 'semelle corde'
    ],
    en: [
      'shoe', 'sneaker', 'boot', 'pump', 'loafer',
      'sandal', 'ballet flat', 'derby', 'oxford', 'slip-on', 'flip-flop', 'mule',
      'slippers', 'orthopedic shoes',
      'clog', 'insole', 'lace', 'heel', 'wedge', 'platform', 'athletic shoe',
      'running', 'jogging', 'trail', 'hiking', 'walking', 'trekking', 'mountaineering',
      'climbing', 'mountain', 'ski boot', 'snowboard', 'after-ski', 'surf shoe', 'skateboard',
      'roller', 'skate', 'football cleats', 'rugby cleats', 'tennis shoe', 'golf shoe', 'basketball',
      'handball', 'volleyball', 'dance shoe', 'ballet shoe', 'gymnastics', 'fitness', 'yoga',
      'pilates', 'aquatic', 'beach sandal', 'pool', 'thigh-high boot', 'riding boot',
      'rain boot', 'rubber boot', 'fur-lined boot', 'chelsea boot',
      'desert boot', 'combat boot', 'doc martens', 'ugg', 'converse', 'vans', 'adidas',
      'nike', 'puma', 'reebok', 'asics', 'new balance', 'skechers', 'timberland',
      'birkenstock', 'havaianas', 'crocs', 'salomon', 'merrell', 'rieker', 'geox',
      'clarks', 'kickers', 'aigle', 'le coq sportif', 'lacoste', 'house slipper', 'house shoe',
      'babouche', 'espadrille', 'shoe leather', 'suede', 'nubuck', 'canvas', 'synthetic',
      'textile', 'mesh', 'gore-tex', 'waterproof', 'membrane', 'breathable', 'cushioning',
      'comfort', 'orthopedic', 'insole', 'arch support', 'stiletto heel',
      'block heel', 'kitten heel', 'cuban heel', 'stiletto', 'wedge', 'rope sole',
      'high-top', 'low-top', 'moccasin', 'boat shoe', 'driving shoe', 'penny loafer'
    ]
  },

  'Musique et CD': {
    fr: [
      'musique', 'cd', 'vinyle', 'album', 'single', 'compilation', 'coffret',
      'édition', 'limitée', 'collector', 'coffret cd', 'coffret vinyle', 'pop', 'rock', 'metal',
      'jazz', 'classique', 'rap', 'hip-hop', 'electro', 'blues', 'reggae',
      'folk', 'country', 'world music', 'bande originale', 'soundtrack', 'disque',
      '33 tours', '45 tours', 'maxi', 'EP', 'picture disc', 'remix', 'live',
      'concert', 'unplugged', 'acoustique', 'symphonique', 'opéra', 'opérette',
      'chorale', 'vocal', 'chant choral', 'instrumental', 'orchestre', 'philharmonique',
      'symphonie', 'concerto', 'sonate', 'chanson française', 'variété', 'variété française',
      'indie', 'alternative', 'grunge', 'punk', 'hardcore', 'death metal',
      'black metal', 'heavy metal', 'thrash', 'hard rock', 'progressive', 'psychédélique',
      'funk', 'soul', 'r&b', 'disco', 'dance', 'techno', 'house', 'trance',
      'ambient', 'trip-hop', 'downtempo', 'drum and bass', 'dubstep', 'gospel',
      'spiritual', 'new age', 'relaxation', 'méditation', 'musique de film',
      'musique de jeu vidéo', 'musique enfant', 'comptine', 'berceuse', 'karaoké',
      'tropical', 'latino', 'salsa', 'merengue', 'bachata', 'tango', 'flamenco',
      'oriental', 'raï', 'afro', 'celte', 'reggaeton', 'ska', 'dub', 'zouk',
      'K-pop', 'J-pop', 'chansons de Noël', 'musique religieuse', 'musique sacrée',
      'hymne', 'baroque', 'renaissance', 'médiéval', 'contemporain', 'avant-garde',
      'streaming', 'téléchargement', 'édition deluxe', 'remasterisé', 'édition anniversaire'
    ],
    en: [
      'music', 'cd', 'vinyl', 'album', 'single', 'compilation', 'box set',
      'edition', 'limited', 'collector', 'cd box', 'vinyl box', 'pop', 'rock', 'metal',
      'jazz', 'classical', 'rap', 'hip-hop', 'electronic', 'blues', 'reggae',
      'folk', 'country', 'world music', 'original soundtrack', 'soundtrack', 'record',
      'LP', '45 RPM', 'maxi single', 'EP', 'picture disc', 'remix', 'live',
      'concert', 'unplugged', 'acoustic', 'symphonic', 'opera', 'operetta',
      'choral', 'vocal music', 'voice', 'instrumental', 'orchestra', 'philharmonic',
      'symphony', 'concerto', 'sonata', 'french song', 'variety', 'french variety',
      'indie', 'alternative', 'grunge', 'punk', 'hardcore', 'death metal',
      'black metal', 'heavy metal', 'thrash', 'hard rock', 'progressive', 'psychedelic',
      'funk', 'soul', 'r&b', 'disco', 'dance', 'techno', 'house', 'trance',
      'ambient', 'trip-hop', 'downtempo', 'drum and bass', 'dubstep', 'gospel',
      'spiritual', 'new age', 'relaxation', 'meditation', 'film score',
      'video game music', 'children music', 'nursery rhyme', 'lullaby', 'karaoke',
      'tropical', 'latin', 'salsa', 'merengue', 'bachata', 'tango', 'flamenco',
      'oriental', 'rai', 'afro', 'celtic', 'reggaeton', 'ska', 'dub', 'zouk',
      'K-pop', 'J-pop', 'Christmas songs', 'religious music', 'sacred music',
      'hymn', 'baroque', 'renaissance', 'medieval', 'contemporary', 'avant-garde',
      'streaming', 'digital download', 'deluxe edition', 'remastered', 'anniversary edition'
    ]
  },

  'Outils et Bricolage': {
    fr: [
      // Outils électriques et machines
      'perceuse', 'visseuse', 'scie circulaire', 'scie sauteuse', 'scie à onglet', 
      'ponceuse', 'meuleuse', 'défonceuse', 'fraiseuse', 'toupie', 'tour à bois',
      'perforateur', 'burineur', 'chalumeau', 'poste à souder', 'décapeur thermique',
      'compresseur', 'pistolet à peinture', 'agrafeuse pneumatique', 'cloueuse',
      'riveteuse', 'carrelette', 'coupe-carreaux électrique',
      
      // Outils manuels spécialisés
      'tournevis électrique', 'perceuse à colonne', 'scie radiale', 'raboteuse',
      'dégauchisseuse', 'mortaiseuse', 'tronçonneuse', 'meuleuse d\'angle',
      'pistolet à colle chaude', 'pistolet à calfeutrer électrique',
      
      // Outils de mesure professionnels
      'niveau laser', 'télémètre laser', 'détecteur de métaux', 'multimètre',
      'testeur électrique', 'manomètre', 'hygromètre professionnel',
      
      // Outils manuels de précision
      'lime à métaux', 'rabot', 'ciseaux à bois', 'burin', 'pied de biche',
      'clé dynamométrique', 'pince à sertir', 'pince à dénuder',
      'tenaille', 'massette', 'maillet', 'marteau de vitrier',
      
      // Équipement d'atelier
      'établi professionnel', 'étau d\'établi', 'enclume', 'servante d\'atelier',
      'caisse à outils professionnelle', 'armoire d\'atelier', 'panneau à outils',
      
      // Consommables spécialisés
      'foret métal', 'foret béton', 'mèche à bois', 'fraise', 'disque à tronçonner',
      'disque à poncer', 'lame de scie', 'abrasif professionnel',
      'papier de verre grain fin', 'huile de coupe', 'fluide hydraulique',
      
      // Produits chimiques techniques
      'décapant peinture', 'solvant dégraissant', 'antirouille professionnel',
      'lubrifiant technique', 'graisse haute température', 'flux de soudure'
    ],
    en: [
      // Power tools and machines
      'power drill', 'impact driver', 'circular saw', 'jigsaw', 'miter saw',
      'orbital sander', 'angle grinder', 'router', 'mill', 'wood shaper', 'wood lathe',
      'hammer drill', 'demolition hammer', 'welding torch', 'welder', 'heat gun',
      'air compressor', 'paint sprayer', 'pneumatic stapler', 'framing nailer',
      'rivet gun', 'wet tile saw', 'electric tile cutter',
      
      // Specialized manual tools
      'cordless screwdriver', 'drill press', 'radial arm saw', 'thickness planer',
      'jointer', 'mortiser', 'chainsaw', 'angle grinder',
      'hot glue gun', 'electric caulk gun',
      
      // Professional measuring tools
      'laser level', 'laser rangefinder', 'metal detector', 'digital multimeter',
      'electrical tester', 'pressure gauge', 'professional hygrometer',
      
      // Precision hand tools
      'metal file', 'hand plane', 'wood chisel', 'cold chisel', 'pry bar',
      'torque wrench', 'crimping tool', 'wire stripper',
      'lineman pliers', 'dead blow hammer', 'rubber mallet', 'glazing hammer',
      
      // Workshop equipment
      'professional workbench', 'bench vise', 'anvil', 'tool cart',
      'professional toolbox', 'workshop cabinet', 'pegboard',
      
      // Specialized consumables
      'metal drill bit', 'masonry bit', 'wood bit', 'end mill', 'cutting disc',
      'sanding disc', 'saw blade', 'professional abrasive',
      'fine grit sandpaper', 'cutting oil', 'hydraulic fluid',
      
      // Technical chemicals
      'paint stripper', 'degreasing solvent', 'professional rust remover',
      'technical lubricant', 'high temp grease', 'welding flux'
    ]
  },

  'Photographie': {
    fr: [
      'appareil photo', 'objectif', 'boîtier', 'trépied', 'capteur', 'flash', 'numérique',
      'argentique', 'hybride', 'téléobjectif', 'grandangle', 'macro', 'photographie',
      'compact', 'pellicule', 'focale', 'mise au point', 'viseur', 'exposition',
      'obturateur', 'diaphragme', 'ouverture', 'sac photo', 'réflecteur', 'filtre photo',
      'papier photo', 'impression photo', 'tirage photo', 'encre photo', 'papier brillant', 'papier mat',
      'reflex', 'bridge', 'stabilisateur', 'collimateur', 'balance des blancs', 'cadrage photo',
      'profondeur de champ', 'bokeh', 'contre-jour', 'photographie portrait', 'photographie paysage', 'studio photo',
      'lumière continue', 'déclencheur', 'retardateur', 'pied photo', 'monopode photo', 'monopode',
      'correcteur exposition', 'photosensible', 'chimie photo', 'développeur', 'fixateur', 'bain arrêt',
      'agrandisseur', 'chambre noire', 'polaroid', 'instantané', 'lomographie', 'carte mémoire',
      'stockage photo', 'batterie photo', 'chargeur photo', 'logiciel retouche', 'lightroom', 'photoshop',
      'raw', 'jpeg', 'plein format', 'aps-c', 'recadrage', 'résolution', 'pixel', 'mode rafale',
      'flash cobra', 'diffuseur flash', 'pare-soleil', 'bonnette', 'filtre polarisant', 'filtre nd'
    ],
    en: [
      'camera', 'dslr', 'lens', 'mirrorless', 'telephoto', 'stabilizer',
      'photography', 'fisheye', 'viewfinder', 'shutter', 'aperture',
      'iso', 'camera bag', 'lightroom', 'photoshop', 'monopod', 'bracketing',
      'hdr', 'panorama', 'timelapse', 'megapixels', 'lens hood', 'prime lens',
      'landscape', 'portrait', 'photo paper', 'printing', 'glossy paper', 'matte paper',
      'photo ink', 'photo print', 'epson photo', 'canon photo', 'full frame',
      'crop sensor', 'zoom lens', 'wide angle', 'focal length', 'depth of field',
      'exposure triangle', 'white balance', 'raw format', 'jpeg', 'histogram',
      'light meter', 'flash sync', 'hotshoe', 'memory card', 'sd card', 'compact flash',
      'tripod head', 'ball head', 'gimbal', 'polarizing filter', 'neutral density',
      'graduated filter', 'color correction', 'macro photography', 'street photography',
      'wildlife photography', 'studio strobe', 'softbox', 'beauty dish', 'snoot',
      'umbrella reflector', 'backdrop', 'light stand', 'tethering', 'focus stacking', 'exposure bracketing',
      'time-lapse', 'intervalometer', 'golden hour', 'blue hour', 'composition',
      'rule of thirds', 'leading lines', 'symmetry', 'framing', 'spot metering'
    ]
  },

  'Produits Ménagers': {
    fr: [
      'nettoyage', 'entretien', 'ménager', 'savon', 'lessive', 'détergent', 'désinfectant',
      'aspirateur', 'balai', 'serpillière', 'chiffon', 'produit ménager', 'liquide vaisselle', 'rangement ménage',
      'nettoyant', 'désodorisant', 'antipoussière', 'brosse', 'éponge', 'lave-vitre', 'produit sol',
      'nettoyant multi-surface', 'nettoyant sol', 'nettoyant cuisine', 'nettoyant salle de bain',
      'nettoyant sanitaire', 'nettoyant WC', 'nettoyant vitres', 'nettoyant inox',
      'nettoyant tapis', 'nettoyant moquette', 'nettoyant meuble', 'nettoyant bois',
      'nettoyant cuir', 'nettoyant argent', 'nettoyant bijoux', 'nettoyant four',
      'nettoyant plaque', 'nettoyant friteuse', 'débouchoir', 'détartrant', 'anticalcaire',
      'lessive liquide', 'lessive poudre', 'lessive capsule', 'adoucissant', 'assouplissant',
      'eau de javel', 'détachant', 'ammoniaque', 'bicarbonate', 'vinaigre blanc',
      'cristaux de soude', 'pierre d\'argile', 'savon noir', 'savon de Marseille',
      'lessiver', 'décaper', 'récurer', 'frotter', 'brosser', 'essuyer', 'rincer ménage',
      'cirer', 'lustrer', 'polir', 'raviver', 'détacher', 'dégraisser', 'désinfecter',
      'assainir', 'purifier', 'parfumer', 'désodoriser', 'aérer', 'ventiler',
      'aspirer', 'balayer', 'épousseter', 'laver', 'rincer', 'essorer',
      'repasser', 'plier', 'étendre', 'sécher linge', 'ranger ménage', 'trier', 'organiser ménage',
      'classer', 'étiqueter', 'boîte rangement', 'caisse rangement', 'panier', 'corbeille', 'sac poubelle', 'bac',
      'container', 'poubelle', 'collecteur', 'tri sélectif', 'compost', 'recyclage', 'déchet',
      'ordure', 'lingette', 'torchon', 'lavette', 'microfibre', 'gant ménage', 'éponge grattante',
      'grattoir', 'raclette', 'balai ménage', 'balai-brosse', 'balai espagnol', 'pelle', 'balayette',
      'plumeau', 'manche télescopique', 'tête de loup', 'brosse WC', 'balai WC'
    ],
    en: [
      'cleaning', 'maintenance', 'household', 'soap', 'laundry', 'detergent', 'disinfectant',
      'vacuum', 'broom', 'mop', 'cloth', 'household product', 'dish soap', 'cleaning storage',
      'cleaner', 'deodorizer', 'duster', 'brush', 'sponge', 'window cleaner', 'floor product',
      'multi-surface cleaner', 'floor cleaner', 'kitchen cleaner', 'bathroom cleaner',
      'toilet cleaner', 'glass cleaner', 'stainless steel cleaner',
      'carpet cleaner', 'rug cleaner', 'furniture cleaner', 'wood cleaner',
      'leather cleaner', 'silver cleaner', 'jewelry cleaner', 'oven cleaner',
      'stovetop cleaner', 'fryer cleaner', 'drain cleaner', 'descaler', 'limescale remover',
      'liquid detergent', 'powder detergent', 'laundry pod', 'fabric softener', 'conditioner',
      'bleach', 'stain remover', 'ammonia', 'baking soda', 'white vinegar',
      'washing soda', 'cleaning stone', 'black soap', 'Marseille soap',
      'wash', 'strip', 'scour', 'scrub', 'brush', 'wipe', 'rinse clean',
      'wax', 'polish', 'buff', 'revive', 'spot clean', 'degrease', 'disinfect',
      'sanitize', 'purify', 'scent', 'deodorize', 'air out', 'ventilate',
      'vacuum', 'sweep', 'dust', 'wash', 'rinse', 'wring',
      'iron', 'fold', 'hang', 'dry clothes', 'organize cleaning', 'sort', 'arrange cleaning',
      'classify', 'label', 'storage box', 'storage crate', 'basket', 'bin', 'garbage bag', 'container',
      'trash can', 'garbage can', 'collector', 'sorting', 'compost', 'recycling', 'waste',
      'garbage', 'wipe', 'dish towel', 'dishcloth', 'microfiber', 'cleaning glove', 'scrub sponge',
      'scraper', 'squeegee', 'cleaning broom', 'scrub brush', 'push broom', 'dustpan', 'hand brush',
      'feather duster', 'telescopic handle', 'cobweb duster', 'toilet brush', 'toilet cleaner'
    ]
  },

  'Quincaillerie': {
    fr: [
      // Fixations de base
      'vis', 'clou', 'boulon', 'écrou', 'rondelle', 'cheville', 'goujon',
      'rivet', 'agrafe', 'crampon', 'cavalier', 'piton', 'œillet',
      'vis à bois', 'vis inox', 'vis autoforeuse', 'clou acier',
      'cheville molly', 'cheville expansion', 'goujon d\'ancrage',
      
      // Quincaillerie de fermeture
      'serrure', 'verrou', 'loquet', 'cadenas', 'cylindre', 'barillet',
      'gond', 'charnière', 'paumelle', 'pivot', 'ferme-porte', 'ressort de porte',
      'poignée de porte', 'béquille', 'bouton de porte', 'rosace',
      
      // Supports et fixations murales
      'équerre de fixation', 'support étagère', 'console murale', 'taquet',
      'crochet mural', 'anneau de levage', 'œillet à vis', 'piton à vis',
      'rail de suspension', 'glissière tiroir', 'coulisse',
      
      // Roulettes et patins
      'roulette pivotante', 'roulette fixe', 'castor', 'patin feutre',
      'patin caoutchouc', 'butée de porte', 'arrêt coulissant',
      
      // Câbles et chaînes
      'câble acier', 'chaîne inox', 'corde chanvre', 'sangle textile',
      'tendeur', 'serre-câble', 'cosse', 'manchon de serrage',
      
      // Plomberie de base
      'raccord laiton', 'coude PVC', 'té de raccordement', 'réduction',
      'manchon PVC', 'collier de serrage', 'joint torique', 'joint fibre',
      'robinet d\'arrêt', 'vanne à boisseau', 'clapet anti-retour',
      
      // Électricité de base
      'domino électrique', 'bornier', 'connecteur rapide', 'sucre',
      'interrupteur simple', 'prise murale', 'douille E27', 'réglette',
      'gaine électrique', 'boîtier encastrement', 'cache-fil',
      
      // Outils manuels de base
      'tournevis plat', 'tournevis cruciforme', 'marteau menuisier',
      'pince universelle', 'clé plate', 'clé à molette', 'niveau à bulle',
      'mètre ruban', 'équerre', 'règle métallique',
      
      // Adhésifs et joints
      'colle néoprène', 'mastic acrylique', 'silicone sanitaire',
      'mousse polyuréthane', 'joint d\'étanchéité', 'ruban adhésif',
      'scotch double face', 'velcro adhésif',
      
      // Sécurité de base
      'gant latex', 'lunette protection', 'masque poussière',
      'casque chantier', 'gilet haute visibilité'
    ],
    en: [
      // Basic fasteners
      'screw', 'nail', 'bolt', 'nut', 'washer', 'anchor', 'threaded rod',
      'rivet', 'staple', 'brad', 'clip', 'eye screw', 'grommet',
      'wood screw', 'stainless screw', 'self-drilling screw', 'steel nail',
      'toggle bolt', 'expansion anchor', 'concrete anchor',
      
      // Closure hardware
      'door lock', 'deadbolt', 'latch', 'padlock', 'cylinder', 'lock barrel',
      'hinge pin', 'door hinge', 'butt hinge', 'pivot', 'door closer', 'door spring',
      'door handle', 'lever handle', 'door knob', 'escutcheon',
      
      // Brackets and wall mounting
      'mounting bracket', 'shelf bracket', 'wall bracket', 'cleat',
      'wall hook', 'lifting eye', 'screw eye', 'screw hook',
      'hanging rail', 'drawer slide', 'sliding track',
      
      // Casters and pads
      'swivel caster', 'fixed caster', 'furniture caster', 'felt pad',
      'rubber pad', 'door stop', 'sliding stop',
      
      // Cables and chains
      'steel cable', 'stainless chain', 'hemp rope', 'textile strap',
      'turnbuckle', 'cable tie', 'cable lug', 'compression sleeve',
      
      // Basic plumbing
      'brass fitting', 'PVC elbow', 'tee fitting', 'reducer',
      'PVC coupling', 'hose clamp', 'O-ring', 'fiber gasket',
      'shut-off valve', 'ball valve', 'check valve',
      
      // Basic electrical
      'wire nut', 'terminal block', 'quick connector', 'splice connector',
      'light switch', 'wall outlet', 'lamp socket', 'strip light',
      'electrical conduit', 'junction box', 'wire cover',
      
      // Basic hand tools
      'flat screwdriver', 'phillips screwdriver', 'claw hammer',
      'needle nose pliers', 'open end wrench', 'adjustable wrench', 'spirit level',
      'measuring tape', 'try square', 'steel ruler',
      
      // Adhesives and seals
      'contact cement', 'acrylic caulk', 'bathroom silicone',
      'foam sealant', 'weatherstrip', 'duct tape',
      'double sided tape', 'adhesive velcro',
      
      // Basic safety
      'latex glove', 'safety glasses', 'dust mask',
      'hard hat', 'high visibility vest'
    ]
  },

  'Salle de bain': {
    fr: [
      'bain', 'douche', 'lavabo', 'robinet', 'toilette', 'wc', 'serviette',
      'tapis bain', 'armoire toilette', 'brosse dent', 'savon', 'salle eau',
      'sanitaire', 'baignoire', 'vasque', 'miroir salle bain', 'porte serviette', 
      'cabine douche', 'paroi douche', 'receveur douche', 'bonde', 'siphon',
      'mitigeur', 'mélangeur', 'thermostatique', 'douchette', 'pommeau', 'flexible',
      'rideau douche', 'pare-douche', 'porte coulissante', 'abattant WC', 'réservoir',
      'chasse d\'eau', 'bidet', 'lave-mains', 'évier salle bain', 'lavabo double', 'meuble vasque',
      'colonne', 'sous vasque', 'plan de travail', 'carrelage', 'faïence', 'joint carrelage',
      'tablette', 'étagère salle bain', 'niche', 'panier', 'organisateur', 'rangement salle bain', 'placard',
      'armoire', 'meuble haut', 'meuble bas', 'étagère murale', 'étagère d\'angle',
      'porte-serviette chauffant', 'sèche-serviette', 'radiateur', 'chauffage d\'appoint',
      'ventilation', 'VMC', 'grille aération', 'extracteur', 'déshumidificateur',
      'miroir grossissant', 'miroir lumineux', 'éclairage salle bain', 'spot', 'applique', 'plafonnier',
      'distributeur savon', 'porte savon', 'gobelet', 'porte brosse à dents', 'porte papier',
      'brosse WC', 'poubelle salle bain', 'balance salle bain', 'marchepied', 'tabouret', 'siège douche',
      'tapis antidérapant', 'ventouse', 'sèche-cheveux', 'chauffe-eau', 'balai WC', 'raclette',
      'éponge salle bain', 'gant toilette', 'serviette main', 'serviette bain', 'peignoir', 'drap bain',
      'tapis contour WC', 'produit nettoyant', 'gel douche', 'shampoing', 'après-shampoing',
      'dentifrice', 'bain moussant', 'sel de bain', 'cosmétique', 'produit soin', 'maquillage',
      'rasoir', 'mousse à raser', 'after-shave', 'parfum', 'déodorant', 'coton-tige',
      'ventouse salle bain', 'plongoir WC', 'accessoire salle bain', 'panier douche', 'douche vapeur'
    ],
    en: [
      'bath', 'shower', 'sink', 'faucet', 'tap', 'toilet', 'towel',
      'bath mat', 'medicine cabinet', 'toothbrush', 'soap', 'bathroom',
      'sanitary', 'bathtub', 'basin', 'bathroom mirror', 'towel rack',
      'shower enclosure', 'shower screen', 'shower tray', 'drain', 'trap',
      'mixer tap', 'mixing valve', 'thermostatic', 'hand shower', 'shower head', 'flexible hose',
      'shower curtain', 'shower door', 'sliding door', 'toilet seat', 'toilet tank',
      'flush', 'bidet', 'hand basin', 'bathroom sink', 'double sink', 'vanity unit',
      'pedestal', 'under sink cabinet', 'countertop', 'tile', 'ceramic tile', 'tile grout',
      'shelf', 'bathroom shelf', 'niche', 'basket', 'organizer', 'bathroom storage', 'cabinet',
      'cupboard', 'wall cabinet', 'base cabinet', 'wall shelf', 'corner shelf',
      'heated towel rail', 'towel warmer', 'radiator', 'space heater',
      'ventilation', 'extractor fan', 'ventilation grille', 'extractor', 'dehumidifier',
      'magnifying mirror', 'illuminated mirror', 'bathroom lighting', 'spotlight', 'wall light', 'ceiling light',
      'soap dispenser', 'soap dish', 'tumbler', 'toothbrush holder', 'toilet paper holder',
      'toilet brush', 'bathroom trash can', 'bathroom scale', 'step stool', 'stool', 'shower seat',
      'non-slip mat', 'suction cup', 'hair dryer', 'water heater', 'toilet broom', 'squeegee',
      'bathroom sponge', 'washcloth', 'hand towel', 'bath towel', 'bathrobe', 'bath sheet',
      'toilet rug', 'cleaner', 'shower gel', 'shampoo', 'conditioner',
      'toothpaste', 'bubble bath', 'bath salt', 'cosmetic', 'skincare product', 'makeup',
      'razor', 'shaving foam', 'after-shave', 'perfume', 'deodorant', 'cotton swab',
      'bathroom suction cup', 'toilet plunger', 'bathroom accessories', 'shower caddy', 'steam shower'
    ]
  },

  'Santé et Soins personnels': {
    fr: [
      'santé', 'soin personnel', 'hygiène personnelle', 'hygiène', 'médicament', 'vitamine', 'complément',
      'alimentaire', 'parapharmacie', 'brosse à dents', 'dentaire', 'dentifrice', 'savon corps',
      'gel douche', 'produit douche', 'shampooing', 'déodorant', 'rasoir', 'mousse rasage', 'crème',
      'hydratant', 'sérum', 'masque visage', 'lotion corps', 'tonique', 'produit bain', 'huile corporelle',
      'antiseptique', 'désinfectant', 'pansement', 'bandage', 'sparadrap', 'compresse',
      'gaze', 'coton', 'thermomètre', 'tensiomètre', 'test médical', 'diagnostic', 'homéopathie',
      'aromathérapie', 'phytothérapie', 'huile essentielle', 'tisane', 'infusion', 'probiotique',
      'collagène', 'protéine', 'acide hyaluronique', 'rétinol', 'antioxydant', 'oméga-3',
      'zinc', 'magnésium', 'fer', 'calcium', 'potassium', 'vitamine C', 'vitamine D',
      'vitamine B', 'multivitamine', 'antibactérien', 'antifongique', 'antiseptique médical',
      'antihistaminique', 'analgésique', 'anti-inflammatoire', 'antipyrétique', 'laxatif',
      'antidiarrhéique', 'antiacide', 'sirop', 'comprimé', 'gélule', 'pastille', 'ampoule',
      'spray', 'pommade', 'baume', 'gouttes', 'collyre', 'flacon', 'stick', 'roll-on',
      'gommage', 'exfoliant', 'peeling', 'nettoyant visage', 'démaquillant', 'toner', 'après-rasage',
      'mousse à raser', 'cire épilation', 'épilation', 'dépilatoire', 'coupe-ongle', 'lime à ongle',
      'vernis à ongles', 'dissolvant', 'manucure', 'pédicure', 'pince à épiler', 'coton-tige',
      'mouchoir', 'lingette', 'coupe-faim', 'minceur', 'drainage', 'cellulite', 'relaxant',
      'sommeil', 'anti-stress', 'anxiété', 'énergie', 'vitalité', 'mémoire', 'concentration',
      'articulation', 'muscle', 'circulation', 'digestion', 'transit', 'immunité',
      'trousse premiers secours', 'crème solaire', 'écran solaire', 'hydratant corps', 'gel lavant', 'après-shampooing'
    ],
    en: [
      'health', 'personal care', 'personal hygiene', 'hygiene', 'medicine', 'vitamin', 'supplement',
      'dietary', 'pharmacy', 'toothbrush', 'dental', 'toothpaste', 'body soap',
      'shower gel', 'shower product', 'shampoo', 'deodorant', 'razor', 'shaving foam', 'cream',
      'moisturizer', 'serum', 'face mask', 'body lotion', 'toner', 'bath product', 'body oil',
      'antiseptic', 'disinfectant', 'plaster', 'bandage', 'adhesive tape', 'compress',
      'gauze', 'cotton', 'thermometer', 'blood pressure monitor', 'medical test', 'diagnostic', 'homeopathy',
      'aromatherapy', 'herbal medicine', 'essential oil', 'herbal tea', 'infusion', 'probiotic',
      'collagen', 'protein', 'hyaluronic acid', 'retinol', 'antioxidant', 'omega-3',
      'zinc', 'magnesium', 'iron', 'calcium', 'potassium', 'vitamin C', 'vitamin D',
      'vitamin B', 'multivitamin', 'antibacterial', 'antifungal', 'medical antiseptic',
      'antihistamine', 'painkiller', 'anti-inflammatory', 'fever reducer', 'laxative',
      'anti-diarrheal', 'antacid', 'syrup', 'tablet', 'capsule', 'lozenge', 'ampoule',
      'spray', 'ointment', 'balm', 'drops', 'eye drops', 'bottle', 'stick', 'roll-on',
      'scrub', 'exfoliant', 'peeling', 'facial cleanser', 'makeup remover', 'toner', 'aftershave',
      'shaving foam', 'hair removal wax', 'hair removal', 'depilatory', 'nail clipper', 'nail file',
      'nail polish', 'remover', 'manicure', 'pedicure', 'tweezers', 'cotton swab',
      'tissue', 'wipe', 'appetite suppressant', 'slimming', 'drainage', 'cellulite', 'relaxant',
      'sleep', 'stress relief', 'anxiety', 'energy', 'vitality', 'memory', 'concentration',
      'joint', 'muscle', 'circulation', 'digestion', 'transit', 'immunity',
      'first aid kit', 'sunscreen', 'sunblock', 'body moisturizer', 'body wash', 'conditioner'
    ]
  },

  'Sports et Plein air': {
    fr: [
      'sport', 'plein air', 'fitness', 'musculation', 'vélo', 'course à pied', 'running',
      'natation', 'randonnée', 'camping', 'pêche', 'chasse', 'ski', 'snowboard',
      'tennis', 'football', 'basketball', 'rugby', 'golf', 'équitation', 'yoga',
      'pilates', 'crossfit', 'accessoire sport', 'équipement sportif', 'tenue sport', 'chaussure sport',
      'vélo électrique', 'VTT', 'vélo de route', 'vélo de ville', 'BMX', 'trottinette',
      'roller', 'skateboard', 'longboard', 'surf', 'bodyboard', 'planche à voile',
      'kitesurf', 'paddle', 'kayak', 'canoë', 'rafting', 'plongée', 'snorkeling',
      'voile', 'embarcation', 'jet ski', 'escalade', 'alpinisme', 'via ferrata', 'spéléologie',
      'canyoning', 'raquette à neige', 'ski de fond', 'ski alpin', 'ski de randonnée',
      'planche neige', 'motoneige', 'patinage', 'hockey', 'football américain', 'baseball',
      'volleyball', 'handball', 'badminton', 'squash', 'padel', 'ping-pong', 'billard',
      'fléchettes', 'pétanque', 'tir à l\'arc', 'tir sportif', 'escrime', 'boxe',
      'arts martiaux', 'judo', 'karaté', 'taekwondo', 'aikido', 'kung-fu', 'MMA',
      'trail', 'marathon', 'triathlon', 'athlétisme', 'gymnastique', 'danse', 'zumba',
      'aquagym', 'aquabike', 'cardio', 'HIIT', 'haltère', 'kettlebell', 'barre musculation',
      'corde à sauter', 'élastique fitness', 'tapis sport', 'ballon fitness', 'step', 'rameur', 'vélo elliptique',
      'tapis de course', 'appareil abdominaux', 'banc de musculation', 'cage à squat',
      'barre de traction', 'trampoline', 'activité extérieure', 'bivouac', 'tente camping', 'sac de couchage',
      'matelas gonflable', 'réchaud camping', 'gourde sport', 'thermos', 'lampe frontale', 'boussole',
      'GPS', 'jumelles', 'longue-vue', 'drone', 'caméra sportive', 'montre connectée',
      'sac à dos', 'bâton de randonnée', 'gourde hydratation', 'shaker protéine', 'tracker fitness'
    ],
    en: [
      'sports', 'outdoors', 'fitness', 'bodybuilding', 'bike', 'running sport', 'running',
      'swimming', 'hiking', 'camping', 'fishing', 'hunting', 'ski', 'snowboard',
      'tennis', 'soccer', 'basketball', 'rugby', 'golf', 'horse riding', 'yoga',
      'pilates', 'crossfit', 'sports accessory', 'sports equipment', 'sports outfit', 'athletic shoe',
      'electric bike', 'mountain bike', 'road bike', 'city bike', 'BMX', 'scooter',
      'roller skate', 'skateboard', 'longboard', 'surfing', 'bodyboard', 'windsurfing',
      'kitesurfing', 'paddle', 'kayak', 'canoe', 'rafting', 'diving', 'snorkeling',
      'sailing', 'watercraft', 'jet ski', 'climbing', 'mountaineering', 'via ferrata', 'caving',
      'canyoning', 'snowshoe', 'cross-country skiing', 'downhill skiing', 'ski touring',
      'snowboarding', 'snowmobile', 'ice skating', 'hockey', 'american football', 'baseball',
      'volleyball', 'handball', 'badminton', 'squash', 'padel', 'table tennis', 'pool',
      'darts', 'petanque', 'archery', 'sport shooting', 'fencing', 'boxing',
      'martial arts', 'judo', 'karate', 'taekwondo', 'aikido', 'kung fu', 'MMA',
      'trail running', 'marathon', 'triathlon', 'athletics', 'gymnastics', 'dance', 'zumba',
      'aqua aerobics', 'aqua cycling', 'cardio', 'HIIT', 'dumbbell', 'kettlebell', 'weight bar',
      'jump rope', 'resistance band', 'exercise mat', 'fitness ball', 'step', 'rowing machine', 'elliptical trainer',
      'treadmill', 'ab machine', 'weight bench', 'squat rack',
      'pull-up bar', 'trampoline', 'outdoor activity', 'bivouac', 'camping tent', 'sleeping bag',
      'air mattress', 'camping stove', 'sports bottle', 'thermos', 'headlamp', 'compass',
      'GPS', 'binoculars', 'spotting scope', 'drone', 'action camera', 'smartwatch',
      'backpack', 'trekking pole', 'hydration bottle', 'protein shaker', 'fitness tracker'
    ]
  }

  // Suppresion de cette catégorie pour le moment
  //  'Accessoires de lecture': {
//     fr: [
//       'livre', 'roman', 'bande dessinée', 'bd', 'manga', 'biographie', 'autobiographie',
//       'encyclopédie', 'dictionnaire', 'guide lecture', 'récit', 'essai', 'nouvelle', 'conte',
//       'poésie', 'revue', 'magazine', 'journal', 'album lecture', 'partition', 'manuel', 'scolaire',
//       'marque-page', 'signet', 'liseuse', 'kindle', 'kobo', 'e-reader', 'tablette lecture', 
//       'support livre', 'bibliothèque', 'étagère livres', 'lampe lecture', 'loupe lecture',
//       'pupitre', 'lutrin', 'reliure', 'pochette livre', 'housse liseuse', 'protection kindle',
//       'papier lecture', 'cahier lecture', 'carnet notes', 'stylo lecture', 'crayon lecture', 'libraire', 'librairie', 'médiathèque',
//       'littérature', 'fiction', 'thriller', 'polar', 'fantastique', 'science-fiction', 
//       'romance', 'collection livres', 'édition', 'tome', 'volume', 'série', 'saga', 'trilogie',
//       'poche', 'grand format', 'broché', 'relié', 'couverture', 'jaquette', 'auteur',
//       'éditeur', 'publication', 'parution', 'nouveauté', 'bestseller', 'classique',
//       'annales', 'référence', 'étude', 'apprentissage', 'sciences', 'histoire', 'géographie',
//       'livre art', 'livre cuisine', 'livre voyage', 'tourisme', 'pratique', 'livre santé', 'bien-être', 'psychologie',
//       'développement personnel', 'coffret livres', 'numismatique', 'monnaie', 'philatélie', 'timbre',
//       'collection lecture', 'porte-livre', 'tourne-page', 'repose-livre', 'étui lecture', 'organiseur lecture',
//       'reliure livre', 'intercalaire', 'onglet', 'adhésif', 'protège-livre'
//     ],
//     en: [
//       'book', 'novel', 'comic', 'comics', 'manga', 'biography', 'autobiography',
//       'encyclopedia', 'dictionary', 'reading guide', 'story', 'essay', 'short story', 'tale',
//       'poetry', 'magazine', 'journal', 'reading album', 'sheet music', 'textbook', 'educational',
//       'bookmark', 'e-reader', 'kindle', 'kobo', 'reading tablet', 'reading light', 'book stand',
//       'bookshelf', 'book holder', 'reading glasses', 'magnifier', 'book weight', 'book cover',
//       'e-reader case', 'kindle cover', 'kobo case', 'book sleeve', 'reading lamp', 'book rest',
//       'book easel', 'book binding', 'binding machine', 'reading pillow', 'page turner',
//       'bookend', 'library', 'bookstore', 'literature', 'fiction', 'mystery', 'thriller',
//       'fantasy', 'science fiction', 'romance', 'book collection', 'edition', 'volume', 'series',
//       'saga', 'trilogy', 'paperback', 'hardcover', 'dust jacket', 'cover', 'author',
//       'publisher', 'publication', 'release', 'new release', 'bestseller', 'classic',
//       'study guide', 'reference', 'learning', 'academic', 'science', 'history', 'geography',
//       'art book', 'cookbook', 'travel book', 'health', 'well-being', 'psychology', 'self-help',
//       'book box set', 'reading collection', 'numismatics', 'philately', 'book light', 'page holder',
//       'book lamp', 'reading tracker', 'book clip', 'page marker', 'book divider', 'tab',
//       'sticky note', 'book protector', 'reading stand', 'book cart', 'book caddy',
//       'reading chair', 'book tote', 'library card', 'book repair', 'page reinforcement'
//     ]
  //   }
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

/**
 * Détecte la langue de la page Amazon (français ou anglais) en analysant l'URL et les éléments HTML
 * @returns {string} Code de langue ('fr' ou 'en')
 */
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

/**
 * Prétraite un texte pour l'analyse TF-IDF en le normalisant et supprimant les caractères non pertinents
 * @param {string} text - Le texte à prétraiter
 * @returns {string[]} Tableau des mots prétraités
 */
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

/**
 * Extrait le texte pertinent de la page produit Amazon
 * @returns {Object} Objet contenant les différentes sections de texte (titre, description, etc.)
 */
export function extractProductText() {
  // Créer un cache pour les sélecteurs DOM
  const selectors = new Map([
    ['title', '#productTitle'],
    //['description', '#productDescription'],
    //['features', '#feature-bullets'],
    ['details', '#detailBullets_feature_div'],
    ['brand', '.po-brand .po-break-word, #bylineInfo, [id*="brand"]']
  ]);

  const result = {};
  
  selectors.forEach((selector, key) => {
    const element = document.querySelector(selector);
    result[key] = element ? element.textContent.trim() : '';
  });

  // Optimiser la récupération des breadcrumbs
  const breadcrumbs = document.querySelectorAll('#wayfinding-breadcrumbs_feature_div li, .a-breadcrumb li span');
  result.breadcrumbs = Array.from(breadcrumbs)
    .map(item => item.textContent.trim())
    .filter(text => text && text !== '›' && !text.includes('Amazon'))
    .join(' ');

  // Optimiser la récupération de la description
  const features = document.querySelector('#feature-bullets');
  if (features) {
      const bullets = Array.from(features.querySelectorAll('li'))
        .map(el => el.textContent.trim())
        .filter(line => line.length > 20 && !line.toLowerCase().includes('amazon'));
      result.description = bullets.join('. ');
  }

  return result;
}

/**
 * Module TF-IDF pour la classification de produits
 * Contient des méthodes pour préparer les données et classifier les produits
 */
const TfIdfClassifier = {
  // Cache global pour les données préparées
  cache: new Map(),
  
  // Préparation des données optimisée
  prepare(categoryKeywords) {
    // Utiliser une clé unique basée sur le nombre de catégories et mots-clés
    const totalKeywords = Object.values(categoryKeywords)
      .reduce((sum, keywords) => sum + keywords.length, 0);
    const cacheKey = `${Object.keys(categoryKeywords).length}_${totalKeywords}`;
    
    // Vérifier si les données sont déjà en cache
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    console.time('TF-IDF Prepare Optimized');
    
    // Prétraiter tous les mots-clés une seule fois
    const categoryTerms = new Map();
    const termCategories = new Map();
    
    // Collecter tous les termes par catégorie et compter les occurrences
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      const termsForCategory = new Set();
      
      for (const keyword of keywords) {
        const terms = preprocessText(keyword);
        for (const term of terms) {
          termsForCategory.add(term);
          
          // Compter dans combien de catégories ce terme apparaît
          if (!termCategories.has(term)) {
            termCategories.set(term, new Set());
          }
          termCategories.get(term).add(category);
        }
      }
      
      categoryTerms.set(category, termsForCategory);
    }
    
    // Calculer l'IDF pour chaque terme en une seule passe
    const totalCategories = Object.keys(categoryKeywords).length;
    const idf = new Map();
    
    for (const [term, categories] of termCategories.entries()) {
      const categoryCount = categories.size;
      if (categoryCount > 0) {
        idf.set(term, Math.log(totalCategories / categoryCount));
      }
    }
    
    const result = {
      idf,
      categoryTerms,
      termCategories,
      allTerms: Array.from(termCategories.keys())
    };
    
    console.timeEnd('TF-IDF Prepare Optimized');
    
    // Mettre en cache le résultat
    this.cache.set(cacheKey, result);
    return result;
  },

  // Classification d'un produit (optimisée avec debug)
  classify(productText, categoryKeywords, preparedData, debug = false) {
    console.time('Classification Optimized');
    const { idf, categoryTerms } = preparedData;
    const scores = new Map();
    const debugInfo = debug ? new Map() : null;
  
    // Prétraiter tout le texte du produit une seule fois
    const productTerms = new Set(preprocessText(Object.values(productText).join(' ')));
  
    // Prétraitement séparé par champ
    const titleTerms = new Set(preprocessText(productText.title || ''));
    const breadcrumbTerms = new Set(preprocessText(productText.breadcrumbs || ''));
    const brandTerms = new Set(preprocessText(productText.brand || ''));
    const descriptionTerms = new Set(preprocessText(productText.description || ''));
  
    if (debug) {
      console.log('🔍 Termes extraits:');
      console.log('  Titre:', Array.from(titleTerms).slice(0, 10).join(', '));
      console.log('  Breadcrumbs:', Array.from(breadcrumbTerms).join(', '));
      console.log('  Marque:', Array.from(brandTerms).join(', '));
      console.log('  Description (10 premiers):', Array.from(descriptionTerms).slice(0, 10).join(', '));
    }
  
    // Calculer les scores par catégorie
    for (const [category, terms] of categoryTerms.entries()) {
      let score = 0;
      const categoryDebug = debug ? [] : null;
  
      for (const term of terms) {
        if (productTerms.has(term) && idf.has(term)) {
          let termScore = idf.get(term);
          let multiplier = 1;
          let source = 'description';
  
          // Pondération plus forte pour les termes spécifiques
          if (titleTerms.has(term)) {
            multiplier = 4; // Augmenté de 3 à 4
            termScore *= 4;
            source = 'title';
          } else if (breadcrumbTerms.has(term)) {
            multiplier = 3; // Augmenté de 2.5 à 3
            termScore *= 3;
            source = 'breadcrumbs';
          } else if (brandTerms.has(term)) {
            multiplier = 2; // Augmenté de 1.5 à 2
            termScore *= 2;
            source = 'brand';
          } else if (descriptionTerms.has(term)) {
            multiplier = 1.2;
            termScore *= 1.2;
            source = 'description';
          }
  
          // Bonus pour les termes longs (plus spécifiques)
          if (term.length > 8) {
            termScore *= 1.3;
          }
  
          score += termScore;
  
          if (debug && termScore > 0.5) {
            categoryDebug.push({
              term,
              baseScore: idf.get(term).toFixed(3),
              multiplier,
              finalScore: termScore.toFixed(3),
              source,
              length: term.length
            });
          }
        }
      }
  
      if (score > 0) {
        scores.set(category, score);
        if (debug) {
          debugInfo.set(category, {
            totalScore: score.toFixed(3),
            terms: categoryDebug.sort((a, b) => b.finalScore - a.finalScore).slice(0, 5)
          });
        }
      }
    }
  
    if (debug) {
      console.log('\n📊 Top 5 catégories avec scores:');
      const sortedScores = Array.from(scores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      for (const [category, score] of sortedScores) {
        console.log(`\n${category}: ${score.toFixed(3)}`);
        const info = debugInfo.get(category);
        if (info && info.terms.length > 0) {
          console.log('  Top termes:');
          for (const termInfo of info.terms) {
            const lengthBonus = termInfo.length > 8 ? ' (+bonus longueur)' : '';
            console.log(`    ${termInfo.term} (${termInfo.source}): ${termInfo.baseScore} × ${termInfo.multiplier} = ${termInfo.finalScore}${lengthBonus}`);
          }
        }
      }
    }
  
    // Trouver la meilleure catégorie
    let bestCategory = 'default';
    let bestScore = 0;
  
    for (const [category, score] of scores.entries()) {
      if (score > bestScore) {
        bestScore = score;
        bestCategory = category;
      }
    }
  
    console.timeEnd('Classification Optimized');
    return bestCategory;
  }
};

/**
 * Récupère les mots-clés combinés (par défaut + personnalisés) pour une langue donnée
 * @param {string} lang - Le code de langue ('fr' ou 'en')
 * @returns {Promise<Object>} Dictionnaire de mots-clés par catégorie
 */
async function getCombinedKeywords(lang = 'fr') {
  const cacheKey = `keywords_${lang}`;
  if (keywordsCache.has(cacheKey)) {
    return keywordsCache.get(cacheKey);
  }
  
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
    
    keywordsCache.set(cacheKey, combinedKeywords);
    return combinedKeywords;
  } catch (error) {
    console.error('DansMaZone: Erreur lors du chargement des mots-clés personnalisés', error);
    
    // Fallback aux mots-clés par défaut pour la langue spécifiée
    const defaultKeywords = {};
    Object.entries(categoryKeywords).forEach(([category, keywordsByLang]) => {
      defaultKeywords[category] = keywordsByLang[lang] || [];
    });
    
    // On garde quand même le résultat en cache pour éviter de refaire des appels qui échouent
    keywordsCache.set(cacheKey, defaultKeywords);
    return defaultKeywords;
  }
}

/**
 * Classifie la page produit Amazon en utilisant l'algorithme TF-IDF
 * @returns {Promise<string>} La catégorie détectée
 */
export async function classifyPage(combinedSites) {
  console.time('Total Classification');

  const cacheKey = window.location.pathname;
  if (classificationCache.has(cacheKey)) {
    console.timeEnd('Total Classification');
    return classificationCache.get(cacheKey);
  }

  try {
    console.time('Language Detection');
    const lang = detectLanguage();
    console.info('DansMaZone: Langue détectée:', lang);
    console.timeEnd('Language Detection');
    
    console.time('Get Keywords');
    const combinedKeywords = await getCombinedKeywords(lang);
    console.timeEnd('Get Keywords');
    
    console.time('Extract Text');
    const productText = extractProductText();
    console.timeEnd('Extract Text');
    
    console.time('TF-IDF Prepare');
    if (!preparedData) {
      preparedData = TfIdfClassifier.prepare(combinedKeywords);
    }
    console.timeEnd('TF-IDF Prepare');

    console.time('Classification');
    // Activer le debug pour voir les détails
    let category = TfIdfClassifier.classify(productText, combinedKeywords, preparedData, true);
    console.timeEnd('Classification');
    
    if (!category || category === 'Unknown') {
      category = 'default';
    }
    
    console.info('DansMaZone: Category detected:', category);
    
    if (lang === 'en' && category !== 'default') {
      const enCategory = categoryMapping[category] || category;
      return enCategory;
    }
    
    classificationCache.set(cacheKey, category);
    console.timeEnd('Total Classification');
    return category;
  } catch (error) {
    console.timeEnd('Total Classification');
    console.error('DansMaZone: Error in classifyPage:', error);
    return 'default';
  }
}
