import { Product, Category } from '../types';

// Local category images from assets/images/categories
const categoryImages = {
  anklets: require('../assets/images/categories/anklets.png'),
  earrings: require('../assets/images/categories/earings.png'),
  rings: require('../assets/images/categories/rings.png'),
  bracelets: require('../assets/images/categories/bracelets.png'),
  necklaces: require('../assets/images/categories/necklace.png'),
  wedding: require('../assets/images/categories/weddings.png'),
};

// Mock product image for products
const mockImage = require('../assets/images/icon.png');

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'croissant dôme ring',
    price: 140,
    image: mockImage,
    category: 'rings',
    description: 'A beautiful silver ring with a croissant dome design.',
    materials: '14k Solid Gold, Diamond',
    sizes: [16.5, 17, 17.5, 18],
  },
  {
    id: '2',
    name: 'twin hoops white',
    price: 275,
    image: mockImage,
    category: 'earrings',
    description: 'Elegant twin hoop earrings in white gold finish.',
    materials: '14k Solid Gold',
    sizes: [],
  },
  {
    id: '3',
    name: 'london dôme ring',
    price: 140,
    image: mockImage,
    category: 'rings',
    description: 'A stunning silver ring with a london dome design.',
    materials: '14k Solid Gold, Diamond',
    sizes: [16.5, 17, 17.5, 18],
  },
  {
    id: '4',
    name: 'silver chain bracelet',
    price: 120,
    image: mockImage,
    category: 'bracelets',
    description: 'A delicate silver chain bracelet.',
    materials: 'Sterling Silver',
    sizes: [],
  },
  {
    id: '5',
    name: 'layered necklace',
    price: 180,
    image: mockImage,
    category: 'necklaces',
    description: 'A beautiful layered necklace in silver.',
    materials: 'Sterling Silver',
    sizes: [],
  },
  {
    id: '6',
    name: 'wedding band',
    price: 320,
    image: mockImage,
    category: 'wedding',
    description: 'A classic wedding band in silver.',
    materials: '14k Solid Gold',
    sizes: [16.5, 17, 17.5, 18, 19],
  },
];

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'anklets',
    image: categoryImages.anklets,
  },
  {
    id: '2',
    name: 'earrings',
    image: categoryImages.earrings,
  },
  {
    id: '3',
    name: 'rings',
    image: categoryImages.rings,
  },
  {
    id: '4',
    name: 'bracelets',
    image: categoryImages.bracelets,
  },
  {
    id: '5',
    name: 'necklaces & pendants',
    image: categoryImages.necklaces,
  },
  {
    id: '6',
    name: 'wedding',
    image: categoryImages.wedding,
  },
];
