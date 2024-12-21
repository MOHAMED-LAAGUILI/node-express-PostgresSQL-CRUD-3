export const createProductModel = async (client) => {
  // Create table query for product
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products (
          id SERIAL NOT NULL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price NUMERIC,
          quantity INTEGER,
          active BOOLEAN,
          category_id INTEGER,                       -- Foreign key to the category
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id)
      );
  `;
  
  // Execute the query to create the table
  await client.query(createTableQuery);
  console.log('Product table created or already exists');

  // Insert default products if the table is empty
  const checkEmptyQuery = 'SELECT COUNT(*) FROM products;';
  const result = await client.query(checkEmptyQuery);

  if (parseInt(result.rows[0].count) === 0) {
    // Insert default products if the table is empty
    const insertDefaultProducts = `
        INSERT INTO products (name, description, price, quantity, active, category_id)
        VALUES
        ('Product A', 'Description for Product A', 10.99, 100, TRUE, 1),
        ('Product B', 'Description for Product B', 15.49, 50, TRUE, 2)
    `;
    
    await client.query(insertDefaultProducts);
    console.log('Default products added.');
  }
};
