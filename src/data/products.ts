import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: 'cinnamon',
    name: 'Ceylon Cinnamon',
    description: 'The prized "True Cinnamon", world-renowned for its sweet, delicate notes and ultra-thin quills.',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'pepper',
    name: 'Black Pepper',
    description: 'Bold, pungent black pepper packed with high piperine, harvested from the central highlands.',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'cardamom',
    name: 'Green Cardamom',
    description: 'The "Queen of Spices", hand-picked at optimal maturity, bursting with intense herbal-citrus fragrance.',
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'other',
    name: 'Exotic Harvest',
    description: 'Sovereign-grade Cloves, Nutmeg, Mace, and high-curcumin Turmeric cultivated in forest gardens.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'blends',
    name: 'Curry & Heritage Blends',
    description: 'Artisan hand-roasted heritage blends curated from secret royal recipes of the Kandyan Kingdom.',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800'
  }
];

export const products: Product[] = [
  {
    id: 'cinnamon-alba',
    name: 'Alba Grade Ceylon Cinnamon Quills',
    scientificName: 'Cinnamomum verum',
    category: 'cinnamon',
    price: 48.00,
    rating: 4.9,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'The absolute pinnacle of Ceylon Cinnamon. Hand-peeled into paper-thin, tight golden-brown quills. Characterized by a incredibly refined, sweet fragrance, delicate taste, and negligible coumarin content compared to common cassia.',
    story: 'Cultivated in our exclusive coastal plantation in Negombo, Sri Lanka, where the humid ocean breeze and sandy soils produce cinnamon of unmatched delicacy. Our master cinnamon peelers—inheritors of a 500-year-old art form—shave the inner bark of young shoots into translucent sheets, rolling them into multi-layered quills by hand.',
    flavorProfile: {
      warmth: 85,
      sweetness: 95,
      aroma: 90,
      intensity: 55
    },
    healthBenefits: [
      'Rich in high-potency antioxidants protecting cellular health.',
      'Supports natural blood sugar regulation and insulin sensitivity.',
      'Promotes digestive wellness and gastrointestinal comfort.',
      'Virtually zero toxic coumarin (unlike Cassia cinnamon).'
    ],
    cookingUses: [
      'Infuse whole quills into slow-simmered lamb and beef curries.',
      'Grind freshly to elevate delicate pastries, crumbles, and morning coffee.',
      'Poach in premium red wines with pears for an exquisite dessert.'
    ],
    specifications: {
      origin: 'Negombo, Sri Lanka',
      grade: 'Alba (Diameter < 6mm)',
      moisture: '< 12%',
      organic: true,
      packageType: 'Bespoke Hermetic Brass Jar (100g)'
    },
    certifications: ['USDA Organic', 'GMP Certified', 'HACCP Approved', 'EU Organic'],
    stock: 45
  },
  {
    id: 'black-pepper-kandy',
    name: 'Royal Black Pepper Corns',
    scientificName: 'Piper nigrum',
    category: 'pepper',
    price: 24.00,
    rating: 4.8,
    reviewCount: 96,
    images: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Plump, heavy, oil-rich black peppercorns grown in the misty mountain forests of Kandy. Cultivated under natural canopy shade, this pepper contains exceptionally high piperine content (6-7%), giving it an intense, lingering heat and citrus-pine undertones.',
    story: 'Sourced from legacy biodiverse forest gardens in Kandy, where pepper vines weave up gliricidia shade trees. Hand-picked when the berries are just beginning to blush yellow, they are washed and sun-dried on organic woven linen mats over four days, resulting in deeply wrinkled, dark mahogany spheres packed with volatile oils.',
    flavorProfile: {
      warmth: 90,
      sweetness: 15,
      aroma: 80,
      intensity: 95
    },
    healthBenefits: [
      'Improves nutrient absorption, particularly curcumin from turmeric.',
      'A powerful thermogenic spice that aids metabolism.',
      'Acts as a natural anti-inflammatory agent.'
    ],
    cookingUses: [
      'Crush coarsely over seared wagyu steaks or wild mushroom ragout.',
      'Formulate a true Sri Lankan pepper curry with claypot pork or jackfruit.',
      'Add a surprising, sophisticated warmth to dark chocolate ganache.'
    ],
    specifications: {
      origin: 'Kandy Highlands, Sri Lanka',
      grade: 'Garmbled 550g/l',
      moisture: '< 10%',
      organic: true,
      packageType: 'Amber Glass Vessel (120g)'
    },
    certifications: ['USDA Organic', 'EU Organic', 'Fair Trade Certified'],
    stock: 60
  },
  {
    id: 'cardamom-green',
    name: 'Sovereign Green Cardamom Pods',
    scientificName: 'Elettaria cardamomum',
    category: 'cardamom',
    price: 36.00,
    rating: 4.9,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Extra-large, uniform, deep-green cardamom pods brimming with dark, highly aromatic seeds. Hand-harvested in the pristine Knuckles Forest Range, this spice exudes a captivating, complex perfume of eucalyptus, mint, and sweet pine.',
    story: 'Our cardamom is grown in the wet forest cloudlands of the Knuckles mountain range, at an altitude of 1,200 meters. Harvested carefully pod by pod at perfect maturity to retain their magnificent green color, they are immediately cured in sealed wooden smokehouses to freeze the fresh, cooling essential oils inside.',
    flavorProfile: {
      warmth: 75,
      sweetness: 65,
      aroma: 100,
      intensity: 80
    },
    healthBenefits: [
      'Eases digestive spasms and refreshes oral health naturally.',
      'Contains highly active compounds that support healthy respiration.',
      'Acts as an effective natural detoxifier and diuretic.'
    ],
    cookingUses: [
      'Bruise pods slightly to release fragrance into basmati rice and biryanis.',
      'Infuse into milk-based desserts like panna cotta, creme brulee, or chai.',
      'Add depth to dry rubs for roasted poultry or lamb.'
    ],
    specifications: {
      origin: 'Knuckles Range, Sri Lanka',
      grade: 'LGB (Large Green Bold, 8mm+)',
      moisture: '< 11%',
      organic: true,
      packageType: 'Bespoke Gold Foil Pouch in Hardbox (80g)'
    },
    certifications: ['USDA Organic', 'EU Organic', 'GMP Certified'],
    stock: 30
  },
  {
    id: 'cloves-emperor',
    name: 'Emperor Whole Cloves',
    scientificName: 'Syzygium aromaticum',
    category: 'other',
    price: 22.00,
    rating: 4.8,
    reviewCount: 52,
    images: [
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Fully formed, unblemished, reddish-brown whole cloves featuring prominent, round heads. Rich in pure eugenol oil, these cloves deliver an intense numbing warmth, spicy sweetness, and exceptionally strong woodsy scent.',
    story: 'Our clove trees grow in the rich volcanic soils of Matale. The flower buds are hand-picked from dizzying heights just as they transition from green to a delicate pink, before they bloom. Dried quickly on bamboo trays under the tropical sun to achieve a perfect moisture balance.',
    flavorProfile: {
      warmth: 95,
      sweetness: 40,
      aroma: 85,
      intensity: 100
    },
    healthBenefits: [
      'Nature\'s richest source of eugenol, providing powerful anti-microbial defenses.',
      'Supports dental hygiene and temporarily soothes tooth discomfort.',
      'Highly concentrated polyphenol antioxidants.'
    ],
    cookingUses: [
      'Stud into roasted hams or slow-roasted onions for braises.',
      'Simmer whole in mulled wine, hot ciders, and winter stews.',
      'Crucial component in authentic biryani and garam masala blends.'
    ],
    specifications: {
      origin: 'Matale Valley, Sri Lanka',
      grade: 'Hand-Picked Special (HPS)',
      moisture: '< 8%',
      organic: true,
      packageType: 'Glass Vessel (90g)'
    },
    certifications: ['USDA Organic', 'ISO 22000', 'HACCP Approved'],
    stock: 50
  },
  {
    id: 'nutmeg-mace',
    name: 'Matale Whole Nutmeg with Crimson Mace',
    scientificName: 'Myristica fragrans',
    category: 'other',
    price: 29.00,
    rating: 4.7,
    reviewCount: 41,
    images: [
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Dual-spice offering: premium whole nutmeg seeds wrapped in their gorgeous, vibrant crimson lacy outer aril (Mace). Nutmeg offers warm, woody sweetness, while Mace presents a more delicate, floral, nutmeg-citrus complexity.',
    story: 'Hand-gathered from historical spice orchards in Matale. When the golden-yellow peach-like nutmeg fruit splits open on the tree, the brilliant red mace is visible. Our farmers carefully detach the lacy mace by hand to dry separately into golden blades, preserving the hard seed inside.',
    flavorProfile: {
      warmth: 80,
      sweetness: 50,
      aroma: 90,
      intensity: 75
    },
    healthBenefits: [
      'Contains calming compounds that assist with healthy sleep cycles.',
      'Encourages digestive enzymes and relieves bloating.',
      'Supports cognitive clarity and general mental stamina.'
    ],
    cookingUses: [
      'Grate whole nutmeg fresh into warm bechamel sauce or potato purees.',
      'Use the delicate mace blades in savory broths, cream soups, and seafood stews.',
      'Classic addition to spice cakes, eggnog, and holiday desserts.'
    ],
    specifications: {
      origin: 'Matale, Sri Lanka',
      grade: 'Super Whole 110s',
      moisture: '< 9%',
      organic: true,
      packageType: 'Lined Luxury Tin Box (Nutmeg 50g & Mace 15g)'
    },
    certifications: ['USDA Organic', 'EU Organic', 'GMP Certified'],
    stock: 25
  },
  {
    id: 'turmeric-ella',
    name: 'High-Curcumin Ella Turmeric Powder',
    scientificName: 'Curcuma longa',
    category: 'other',
    price: 19.00,
    rating: 4.9,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Vibrant, deep-orange turmeric powder cultivated in Ella. Known for its remarkable, scientifically-verified Curcumin content (6.5%+), this turmeric has an earthy, slightly bitter, warm peppery flavor and intense coloring power.',
    story: 'Cultivated in the rich, volcanic red soils of Ella, in a microclimate that stimulates the rhizomes to pack maximum Curcumin. Hand-dug, thoroughly boiled to distribute active curcumins, sliced, dried, and cold-milled to prevent heat damage to its organic compounds.',
    flavorProfile: {
      warmth: 70,
      sweetness: 10,
      aroma: 75,
      intensity: 85
    },
    healthBenefits: [
      'Superior anti-inflammatory power from high-curcumin density.',
      'Boosts liver function and natural detoxification cascades.',
      'Promotes radiant skin and powerful cardiovascular support.'
    ],
    cookingUses: [
      'Stir into golden milk lattes paired with Ceyvana black pepper for absorption.',
      'Essential base for vegetable curries, dhal, lentil soups, and rices.',
      'Whisk into oil and vinegar salad dressings for an earthy antioxidant boost.'
    ],
    specifications: {
      origin: 'Ella Highlands, Sri Lanka',
      grade: 'High Curcumin Extra Fine',
      moisture: '< 7%',
      organic: true,
      packageType: 'Amber UV-Glass Jar (150g)'
    },
    certifications: ['USDA Organic', 'EU Organic', 'HACCP Approved', 'Non-GMO'],
    stock: 75
  },
  {
    id: 'blend-royal-kandyan',
    name: 'Royal Kandyan Emperor Curry Blend',
    scientificName: 'Heritage Spice Blend',
    category: 'blends',
    price: 26.00,
    rating: 4.9,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An ancient, roasted spice blend crafted from an authentic royal recipe of the Palace of Kandy. Gently dry-roasted under woodfire and stone-milled, it combines Cinnamon, Cardamom, Cloves, Pepper, Curry Leaves, Lemongrass, and Coriander.',
    story: 'In the ancient Kandyan Kingdom, royal cooks created custom-blended spices to serve the King. This particular formula was preserved by a generational estate family in Kandy. It is dry-roasted at low temperatures in clay pans and hand-pounded to preserve the majestic, sweet-spicy aroma of traditional Sri Lankan curries.',
    flavorProfile: {
      warmth: 90,
      sweetness: 30,
      aroma: 95,
      intensity: 90
    },
    healthBenefits: [
      'Encourages metabolic firing and systemic warmth.',
      'Packed with diverse essential oils that aid liver enzyme production.',
      'Rich in antibacterial, immune-stimulating elements.'
    ],
    cookingUses: [
      'The definitive seasoning for traditional Sri Lankan vegetable and meat curries.',
      'Dust over roasted vegetables, squash, or pumpkin before baking.',
      'Mix with coconut milk to create a rich, luxurious curry sauce.'
    ],
    specifications: {
      origin: 'Kandy Castle Estate, Sri Lanka',
      grade: 'Imperial Heritage Roast',
      moisture: '< 6%',
      organic: true,
      packageType: 'Signature Matte Ceramic Jar (100g)'
    },
    certifications: ['Organic Ingredients', 'GMP Certified', 'HACCP Approved'],
    stock: 40
  },
  {
    id: 'gift-empress-collection',
    name: 'Empress Royal Spices Gift Chest',
    scientificName: 'Bespoke Curated Box',
    category: 'blends',
    price: 135.00,
    rating: 5.0,
    reviewCount: 34,
    images: [
      'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'An ultimate gifting masterpiece. A handmade, velvet-lined solid mahogany wood chest containing four of our finest spices: Alba Cinnamon, Royal Black Pepper, Sovereign Green Cardamom, and Royal Kandyan Emperor Curry Blend.',
    story: 'This collection celebrates Sri Lanka\'s legacy as the crown jewel of the historic spice routes. Each box is handmade by traditional lacquer craftsmen in central Sri Lanka, utilizing sustainably-sourced plantation mahogany and decorated with gold brass accents. A perfect gift for gourmet chefs and luxury food lovers.',
    flavorProfile: {
      warmth: 85,
      sweetness: 50,
      aroma: 95,
      intensity: 80
    },
    healthBenefits: [
      'The perfect starter collection for a health-supportive organic spice cabinet.',
      'Packed with high-potency antioxidants and inflammation-soothing compounds.'
    ],
    cookingUses: [
      'An exquisite, complete spice kit to master high-end South Asian and fusion cuisine.',
      'Includes a hand-bound CEYVANA culinary guide with original palace recipes.'
    ],
    specifications: {
      origin: 'Multi-Region (Handmade Chest from Kandy)',
      grade: 'Sovereign Selection',
      moisture: 'Varies',
      organic: true,
      packageType: 'Solid Mahogany Wood Gift Box with 4 x Glass Jars'
    },
    certifications: ['USDA Organic', 'EU Organic', 'Fair Trade Woodcraft'],
    stock: 15
  }
];
