import { Product } from '../types';

const API_URL = 'https://skjsilvers-tarframework.aws-eu-west-1.turso.io/v2/pipeline';
const API_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDM3NzU0MTYsImlkIjoiNTFjYzk4YjAtYmRhOS00OWFlLTkyNWMtNjFlODFjYWEzNmUxIiwicmlkIjoiZDlhYjQ3YTUtM2M3ZS00MmM3LTllOTYtM2U5OGViMGZlY2M5In0.azmz6E8-tfuyVF_pyju0ikZLhTF_KRDzmFh3SmESdBvzUdT1jaXTuxk4oLW67Finvt-lNiQtDW-6p7208Kp2DQ';

export interface ApiResponse {
  baton: null;
  base_url: null;
  results: Result[];
}

export interface Result {
  type: string;
  response: Response;
}

export interface Response {
  type: string;
  result: ResultData;
}

export interface ResultData {
  cols: Col[];
  rows: any[][];
  affected_row_count: number;
  last_insert_rowid: null;
  replication_index: null;
  rows_read: number;
  rows_written: number;
  query_duration_ms: number;
}

export interface Col {
  name: string;
  decltype: string;
}

export interface ApiProduct {
  id: number;
  storeid: string | null;
  name: string;
  f1: string; // main image
  f2: string | null;
  f3: string | null;
  f4: string | null;
  f5: string | null;
  type: string | null;
  category: string;
  collection: string | null;
  unit: string | null;
  price: number | null;
  stock: number | null;
  vendor: string | null;
  brand: string;
  options: string; // JSON string with designs and sizes
  modifiers: string | null;
  metafields: string; // JSON string with melting_point and weight
  channels: string | null;
  notes: string | null;
}

/**
 * Fetch all products from the API
 */
export const fetchProducts = async (): Promise<ApiProduct[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            type: 'execute',
            stmt: {
              sql: 'SELECT * FROM products'
            }
          }
        ]
      })
    });

    const data: ApiResponse = await response.json();
    
    if (data.results && data.results.length > 0 && data.results[0].type === 'ok') {
      const rows = data.results[0].response.result.rows;
      const cols = data.results[0].response.result.cols;
      
      // Transform rows into products
      return rows.map(row => {
        const product: any = {};
        
        // Map each column to its corresponding value
        cols.forEach((col, index) => {
          const cell = row[index];
          product[col.name] = cell.type === 'null' ? null : cell.value;
        });
        
        return product as ApiProduct;
      });
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Transform API product to app product format
 */
export const transformApiProductToAppProduct = (apiProduct: ApiProduct): Product => {
  // Parse JSON strings
  let options;
  let metafields;
  
  try {
    options = JSON.parse(apiProduct.options);
  } catch (e) {
    options = {};
  }
  
  try {
    metafields = JSON.parse(apiProduct.metafields);
  } catch (e) {
    metafields = {};
  }
  
  // Get the first design image or main image
  let mainImage = apiProduct.f1;
  let designs = [];
  
  if (options.designs && options.designs.length > 0) {
    designs = options.designs;
  } else if (options.design && options.design.length > 0) {
    designs = options.design;
  }
  
  // Get sizes
  let sizes: number[] = [];
  if (options.sizes && options.sizes.length > 0) {
    sizes = options.sizes.map((size: string) => parseFloat(size));
  } else if (options.size && options.size.length > 0) {
    sizes = options.size.map((size: string) => {
      // Handle ranges like "20-100"
      if (size.includes('-')) {
        return parseFloat(size.split('-')[0]);
      }
      return parseFloat(size);
    }).filter((size: number) => !isNaN(size));
  }
  
  return {
    id: apiProduct.id.toString(),
    name: apiProduct.name.toLowerCase(),
    price: 140, // Default price since API doesn't have consistent pricing
    image: { uri: mainImage },
    category: apiProduct.category.toLowerCase(),
    description: `Beautiful ${apiProduct.name} made with premium silver.`,
    materials: metafields.melting_point ? `Silver (${metafields.melting_point})` : 'Sterling Silver',
    sizes: sizes,
    weight: metafields.weight || null,
    designs: designs,
  };
};

/**
 * Fetch and transform all products
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const apiProducts = await fetchProducts();
    return apiProducts.map(transformApiProductToAppProduct);
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};
