import { Product, Category } from '../types';

// Mock product images - in a real app, these would be actual image imports
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
    name: 'earrings',
    image: mockImage,
    productCount: 100,
  },
  {
    id: '2',
    name: 'rings',
    image: mockImage,
    productCount: 100,
  },
  {
    id: '3',
    name: 'bracelets',
    image: mockImage,
    productCount: 100,
  },
  {
    id: '4',
    name: 'necklaces & pendants',
    image: mockImage,
    productCount: 100,
  },
  {
    id: '5',
    name: 'wedding',
    image: mockImage,
    productCount: 100,
  },
];
