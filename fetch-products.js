const fetch = require('node-fetch');

async function fetchProducts() {
  try {
    const response = await fetch('https://skjsilvers-tarframework.aws-eu-west-1.turso.io/v2/pipeline', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDM3NzU0MTYsImlkIjoiNTFjYzk4YjAtYmRhOS00OWFlLTkyNWMtNjFlODFjYWEzNmUxIiwicmlkIjoiZDlhYjQ3YTUtM2M3ZS00MmM3LTllOTYtM2U5OGViMGZlY2M5In0.azmz6E8-tfuyVF_pyju0ikZLhTF_KRDzmFh3SmESdBvzUdT1jaXTuxk4oLW67Finvt-lNiQtDW-6p7208Kp2DQ',
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

    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

fetchProducts();
