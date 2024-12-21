export const createCategoryModel = async (client) => {
  // Create table query for category
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
          id SERIAL NOT NULL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
  `;
  
  // Execute the query to create the table 
  await client.query(createTableQuery);
  console.log('Category table created or already exists');

  // Insert default categories if the table is empty
  const checkEmptyQuery = 'SELECT COUNT(*) FROM categories;';
  const result = await client.query(checkEmptyQuery);
  
  if (parseInt(result.rows[0].count) === 0) {
    // Insert default categories if the table is empty
    const insertDefaultCategories = `
        INSERT INTO categories (name)
        VALUES
        ('Electronics'),
        ('Food'),
        ('Books')
    `;
    
    await client.query(insertDefaultCategories);
    console.log('Default categories added.');
  }
};
