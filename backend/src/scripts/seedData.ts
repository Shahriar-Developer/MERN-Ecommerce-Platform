import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import Category from '../models/Category';
import Product from '../models/Product';

async function main() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ghorerbazarDB');
  
  await Category.deleteMany({});
  await Product.deleteMany({});
  
  const cats = await Category.insertMany([
    { name: 'Honey & Syrups', description: 'Pure, organic honey and natural syrups from local sources', order: 1 },
    { name: 'Dairy & Ghee', description: 'Fresh organic dairy products and pure desi ghee', order: 2 },
    { name: 'Oils & Extracts', description: 'Cold-pressed organic oils and pure extracts', order: 3 },
    { name: 'Spices & Seasonings', description: 'Handmade and organic spice blends', order: 4 },
    { name: 'Rice & Grains', description: 'Premium organic rice and grains', order: 5 },
    { name: 'Vegetables & Produce', description: 'Fresh organic vegetables and farm produce', order: 6 },
    { name: 'Nuts & Seeds', description: 'Raw organic nuts and seeds', order: 7 },
    { name: 'Herbal Products', description: 'Organic herbal teas and wellness products', order: 8 },
  ]);

  const products = [
    { name: 'Pure Sundarbans Honey 500g', slug: 'pure-sundarbans-honey-500g', price: 650, discountPrice: 580, category: 0, sku: 'HONEY-001', origin: 'Sundarbans', health: ['Boosts immunity', 'Antioxidants', 'Aids digestion'], expiry: '18 months', featured: true, trending: true },
    { name: 'Acacia Flower Honey 250g', slug: 'acacia-flower-honey-250g', price: 380, discountPrice: 340, category: 0, sku: 'HONEY-002', origin: 'Northern Bangladesh', health: ['Pure energy', 'Natural sweetener', 'Throat relief'], expiry: '18 months', featured: true, trending: false },
    { name: 'Litchi Flower Honey 500g', slug: 'litchi-flower-honey-500g', price: 720, discountPrice: 650, category: 0, sku: 'HONEY-003', origin: 'Dinajpur', health: ['Rich flavor', 'Antioxidant rich', 'Natural energy'], expiry: '18 months', featured: true, trending: true },
    { name: 'Organic Honey Mix 1kg', slug: 'organic-honey-mix-1kg', price: 1250, discountPrice: 1100, category: 0, sku: 'HONEY-004', origin: 'Various farms', health: ['Complete nutrition', 'Multiple benefits', 'Pure blend'], expiry: '18 months', featured: false, trending: true },
    { name: 'Date Honey Blend 500g', slug: 'date-honey-blend-500g', price: 680, discountPrice: 610, category: 0, sku: 'HONEY-005', origin: 'Imported blend', health: ['Energy boost', 'Digestive aid', 'Mineral rich'], expiry: '18 months', featured: true, trending: false },
    { name: 'Raw Forest Honey 750g', slug: 'raw-forest-honey-750g', price: 850, discountPrice: 765, category: 0, sku: 'HONEY-006', origin: 'Sundarbans', health: ['Pure natural', 'Unfiltered', 'Maximum benefits'], expiry: '18 months', featured: false, trending: true },

    { name: 'Gawa Ghee 500ml Pure Desi', slug: 'gawa-ghee-500ml-pure-desi', price: 850, discountPrice: 720, category: 1, sku: 'GHEE-001', origin: 'Rajshahi', health: ['Vitamin rich', 'Bone health', 'Improves digestion'], expiry: '24 months', featured: true, trending: true },
    { name: 'Desi Cow Ghee 1L', slug: 'desi-cow-ghee-1l', price: 1650, discountPrice: 1485, category: 1, sku: 'GHEE-002', origin: 'Rajshahi', health: ['Pure fat soluble vitamins', 'Immunity boost', 'Hair health'], expiry: '24 months', featured: true, trending: true },
    { name: 'Buffalo Ghee 500ml', slug: 'buffalo-ghee-500ml', price: 920, discountPrice: 828, category: 1, sku: 'GHEE-003', origin: 'Pabna', health: ['Richer flavor', 'Better digestion', 'Nutrient dense'], expiry: '24 months', featured: false, trending: false },
    { name: 'Premium Bilona Ghee 250g', slug: 'premium-bilona-ghee-250g', price: 550, discountPrice: 495, category: 1, sku: 'GHEE-004', origin: 'Traditional method', health: ['Ancient method', 'Maximum nutrients', 'Purity certified'], expiry: '24 months', featured: true, trending: true },
    { name: 'Organic Milk 1L Fresh', slug: 'organic-milk-1l-fresh', price: 120, discountPrice: 110, category: 1, sku: 'DAIRY-001', origin: 'Local farms', health: ['Calcium rich', 'Protein source', 'Farm fresh'], expiry: '3 days', featured: false, trending: false },
    { name: 'Yogurt Plain Organic 500g', slug: 'yogurt-plain-organic-500g', price: 180, discountPrice: 160, category: 1, sku: 'DAIRY-002', origin: 'Local dairy', health: ['Probiotics', 'Digestive health', 'Calcium rich'], expiry: '10 days', featured: false, trending: false },

    { name: 'Mustard Oil 1L Cold Pressed', slug: 'mustard-oil-1l-cold-pressed', price: 520, discountPrice: 450, category: 2, sku: 'OIL-001', origin: 'Rural Bangladesh', health: ['Omega-3 rich', 'Anti-inflammatory', 'Heart healthy'], expiry: '12 months', featured: true, trending: true },
    { name: 'Coconut Oil 500ml Virgin', slug: 'coconut-oil-500ml-virgin', price: 680, discountPrice: 610, category: 2, sku: 'OIL-002', origin: 'Tropical regions', health: ['MCT oils', 'Brain health', 'Skin care'], expiry: '18 months', featured: true, trending: true },
    { name: 'Sesame Oil 500ml Pure', slug: 'sesame-oil-500ml-pure', price: 450, discountPrice: 405, category: 2, sku: 'OIL-003', origin: 'Traditional press', health: ['Antioxidant rich', 'Joint health', 'Anti-aging'], expiry: '18 months', featured: false, trending: false },
    { name: 'Groundnut Oil 1L', slug: 'groundnut-oil-1l', price: 380, discountPrice: 340, category: 2, sku: 'OIL-004', origin: 'Local farms', health: ['Vitamin E rich', 'Cooking oil', 'Health benefits'], expiry: '12 months', featured: false, trending: false },
    { name: 'Olive Oil Extra Virgin 500ml', slug: 'olive-oil-extra-virgin-500ml', price: 1200, discountPrice: 1050, category: 2, sku: 'OIL-005', origin: 'Imported organic', health: ['Mediterranean diet', 'Heart health', 'Anti-inflammatory'], expiry: '24 months', featured: true, trending: true },

    { name: 'Bengali Masala 250g Handmade', slug: 'bengali-masala-250g-handmade', price: 380, discountPrice: 320, category: 3, sku: 'SPICE-001', origin: 'Dhaka', health: ['Aids digestion', 'Anti-inflammatory', 'Traditional blend'], expiry: '6 months', featured: true, trending: true },
    { name: 'Garam Masala 200g Organic', slug: 'garam-masala-200g-organic', price: 320, discountPrice: 280, category: 3, sku: 'SPICE-002', origin: 'Artisan makers', health: ['Warming spice', 'Digestive aid', 'Antioxidant'], expiry: '6 months', featured: false, trending: true },
    { name: 'Turmeric Powder 250g Pure', slug: 'turmeric-powder-250g-pure', price: 280, discountPrice: 240, category: 3, sku: 'SPICE-003', origin: 'Bangladesh', health: ['Curcumin rich', 'Anti-inflammatory', 'Pain relief'], expiry: '8 months', featured: true, trending: false },
    { name: 'Cinnamon Powder 100g', slug: 'cinnamon-powder-100g', price: 320, discountPrice: 280, category: 3, sku: 'SPICE-004', origin: 'Premium quality', health: ['Blood sugar control', 'Antioxidant', 'Anti-inflammatory'], expiry: '8 months', featured: false, trending: false },
    { name: 'Cumin Seeds 200g Organic', slug: 'cumin-seeds-200g-organic', price: 240, discountPrice: 210, category: 3, sku: 'SPICE-005', origin: 'Organic farm', health: ['Digestive aid', 'Iron source', 'Cooling spice'], expiry: '12 months', featured: false, trending: true },
    { name: 'Coriander Powder 250g', slug: 'coriander-powder-250g', price: 260, discountPrice: 230, category: 3, sku: 'SPICE-006', origin: 'Traditional grind', health: ['Cooling effect', 'Digestive', 'Anti-inflammatory'], expiry: '8 months', featured: true, trending: false },

    { name: 'Premium Basmati Rice 2kg', slug: 'premium-basmati-rice-2kg', price: 680, discountPrice: 600, category: 4, sku: 'RICE-001', origin: 'Northern Bangladesh', health: ['High fiber', 'Good carbs', 'No pesticides'], expiry: '24 months', featured: true, trending: true },
    { name: 'Jasmine Rice 5kg Organic', slug: 'jasmine-rice-5kg-organic', price: 1450, discountPrice: 1300, category: 4, sku: 'RICE-002', origin: 'Fragrant fields', health: ['Aromatic', 'Low glycemic', 'Organic certified'], expiry: '24 months', featured: false, trending: false },
    { name: 'Brown Rice 2kg Whole Grain', slug: 'brown-rice-2kg-whole-grain', price: 520, discountPrice: 460, category: 4, sku: 'RICE-003', origin: 'Organic farms', health: ['High fiber', 'Full nutrition', 'Whole grain'], expiry: '24 months', featured: true, trending: true },
    { name: 'Wheat 5kg Organic Whole', slug: 'wheat-5kg-organic-whole', price: 420, discountPrice: 375, category: 4, sku: 'GRAIN-001', origin: 'Organic fields', health: ['High protein', 'Fiber rich', 'Whole grain'], expiry: '24 months', featured: false, trending: false },
    { name: 'Lentils (Masoor) 1kg Organic', slug: 'lentils-masoor-1kg-organic', price: 280, discountPrice: 250, category: 4, sku: 'GRAIN-002', origin: 'Organic farms', health: ['High protein', 'Iron rich', 'Vegetarian protein'], expiry: '18 months', featured: true, trending: false },
    { name: 'Chickpeas 1kg Organic', slug: 'chickpeas-1kg-organic', price: 320, discountPrice: 280, category: 4, sku: 'GRAIN-003', origin: 'Pulse farms', health: ['Complete protein', 'Fiber source', 'Mineral rich'], expiry: '18 months', featured: false, trending: true },

    { name: 'Mixed Nuts & Seeds 500g', slug: 'mixed-nuts-seeds-500g', price: 750, discountPrice: 650, category: 6, sku: 'NUTS-001', origin: 'Various organic', health: ['High protein', 'Healthy fats', 'Energy boost'], expiry: '9 months', featured: true, trending: true },
    { name: 'Raw Almonds 250g', slug: 'raw-almonds-250g', price: 480, discountPrice: 420, category: 6, sku: 'NUTS-002', origin: 'Organic source', health: ['Vitamin E', 'Heart health', 'Brain food'], expiry: '12 months', featured: true, trending: false },
    { name: 'Cashews Raw 250g Organic', slug: 'cashews-raw-250g-organic', price: 520, discountPrice: 460, category: 6, sku: 'NUTS-003', origin: 'Premium quality', health: ['Mineral rich', 'Heart healthy', 'Natural fat'], expiry: '12 months', featured: false, trending: true },
    { name: 'Walnuts 250g Raw', slug: 'walnuts-250g-raw', price: 450, discountPrice: 405, category: 6, sku: 'NUTS-004', origin: 'Organic farms', health: ['Omega-3 rich', 'Brain health', 'Antioxidant'], expiry: '12 months', featured: true, trending: true },
    { name: 'Sunflower Seeds 300g', slug: 'sunflower-seeds-300g', price: 280, discountPrice: 250, category: 6, sku: 'SEEDS-001', origin: 'Organic fields', health: ['Vitamin E', 'Selenium rich', 'Antioxidant'], expiry: '9 months', featured: false, trending: false },
    { name: 'Pumpkin Seeds 250g Organic', slug: 'pumpkin-seeds-250g-organic', price: 320, discountPrice: 280, category: 6, sku: 'SEEDS-002', origin: 'Organic harvest', health: ['Magnesium rich', 'Prostate health', 'Sleep aid'], expiry: '12 months', featured: true, trending: false },

    { name: 'Green Tea Organic 50g', slug: 'green-tea-organic-50g', price: 380, discountPrice: 320, category: 7, sku: 'HERB-001', origin: 'Tea gardens', health: ['Antioxidant', 'Weight loss', 'Metabolism boost'], expiry: '18 months', featured: true, trending: true },
    { name: 'Chamomile Tea 40g Herbal', slug: 'chamomile-tea-40g-herbal', price: 320, discountPrice: 280, category: 7, sku: 'HERB-002', origin: 'Herbal gardens', health: ['Sleep aid', 'Relaxation', 'Digestive calm'], expiry: '18 months', featured: false, trending: false },
    { name: 'Ginger Turmeric Tea 100g', slug: 'ginger-turmeric-tea-100g', price: 420, discountPrice: 370, category: 7, sku: 'HERB-003', origin: 'Organic blend', health: ['Anti-inflammatory', 'Immune boost', 'Warming'], expiry: '12 months', featured: true, trending: true },
    { name: 'Lemongrass Tea 50g', slug: 'lemongrass-tea-50g', price: 340, discountPrice: 300, category: 7, sku: 'HERB-004', origin: 'Herbal fields', health: ['Digestive aid', 'Detox', 'Refreshing'], expiry: '18 months', featured: false, trending: false },
    { name: 'Moringa Powder 100g', slug: 'moringa-powder-100g', price: 480, discountPrice: 420, category: 7, sku: 'HERB-005', origin: 'Organic source', health: ['Super food', 'High nutrition', 'Energy boost'], expiry: '18 months', featured: true, trending: true },

    { name: 'Organic Tomato 1kg Fresh', slug: 'organic-tomato-1kg-fresh', price: 60, discountPrice: 50, category: 5, sku: 'VEG-001', origin: 'Farm fresh', health: ['Lycopene', 'Vitamin C', 'Fresh produce'], expiry: '7 days', featured: false, trending: false },
    { name: 'Organic Spinach 500g Fresh', slug: 'organic-spinach-500g-fresh', price: 80, discountPrice: 70, category: 5, sku: 'VEG-002', origin: 'Green farms', health: ['Iron rich', 'Leafy green', 'Nutrient dense'], expiry: '4 days', featured: true, trending: false },
    { name: 'Carrot 2kg Organic', slug: 'carrot-2kg-organic', price: 120, discountPrice: 100, category: 5, sku: 'VEG-003', origin: 'Root vegetable', health: ['Beta-carotene', 'Fiber rich', 'Eye health'], expiry: '14 days', featured: false, trending: true },
    { name: 'Broccoli 500g Fresh Organic', slug: 'broccoli-500g-fresh-organic', price: 140, discountPrice: 120, category: 5, sku: 'VEG-004', origin: 'Organic farm', health: ['Sulforaphane', 'Vitamin K', 'Cancer fighter'], expiry: '5 days', featured: true, trending: false },
    { name: 'Cucumber 1kg Fresh', slug: 'cucumber-1kg-fresh', price: 70, discountPrice: 60, category: 5, sku: 'VEG-005', origin: 'Farm fresh', health: ['Hydration', 'Low calorie', 'Refreshing'], expiry: '8 days', featured: false, trending: false },
    { name: 'Organic Onion 2kg', slug: 'organic-onion-2kg', price: 100, discountPrice: 85, category: 5, sku: 'VEG-006', origin: 'Organic fields', health: ['Quercetin', 'Antioxidant', 'Immune boost'], expiry: '30 days', featured: false, trending: true },
    { name: 'Bell Pepper Mix 1kg', slug: 'bell-pepper-mix-1kg', price: 150, discountPrice: 130, category: 5, sku: 'VEG-007', origin: 'Farm fresh', health: ['Vitamin C', 'Colorful nutrients', 'Antioxidant'], expiry: '10 days', featured: true, trending: false },
    { name: 'Potato Organic 3kg', slug: 'potato-organic-3kg', price: 140, discountPrice: 120, category: 5, sku: 'VEG-008', origin: 'Potato farms', health: ['Complex carbs', 'Potassium', 'Satisfying'], expiry: '45 days', featured: false, trending: false },
  ];

  const productsToInsert = products.map(p => ({
    name: p.name,
    slug: p.slug,
    description: `${p.name} - Premium organic product from Ghorer Bazar. Sourced from trusted farms with complete quality assurance. Health benefits: ${p.health.join(', ')}.`,
    shortDescription: `${p.name} from ${p.origin}`,
    price: p.price,
    discountPrice: p.discountPrice,
    category: cats[p.category]._id,
    brand: 'Ghorer Bazar',
    stock: Math.floor(Math.random() * 200) + 50,
    sku: p.sku,
    tags: [p.name.toLowerCase(), 'organic', 'natural', 'certified'],
    ratings: (Math.random() * 0.5) + 4.3,
    numReviews: Math.floor(Math.random() * 80) + 15,
    isFeatured: p.featured,
    isTrending: p.trending,
    isActive: true,
    weight: p.name.includes('kg') ? 1000 : p.name.includes('g') ? 500 : 250,
    images: [{ url: `https://placehold.co/500x500?text=${encodeURIComponent(p.name)}`, public_id: `ghorer_${p.sku.toLowerCase()}` }],
    origin: p.origin,
    healthBenefits: p.health,
    expiryDuration: p.expiry,
    isOrganicCertified: true,
    offerLabel: `${Math.floor((1 - p.discountPrice / p.price) * 100)}% OFF`,
  }));

  await Product.insertMany(productsToInsert);

  console.log('Ghorer Bazar seed complete!');
  console.log('   Categories: 8');
  console.log(`   Products: ${productsToInsert.length} (all organic, all custom fields populated)`);
  console.log('   All products certified organic with health benefits');
  process.exit(0);
}

main().catch(err => { 
  console.error('Seed error:', err); 
  process.exit(1); 
});
