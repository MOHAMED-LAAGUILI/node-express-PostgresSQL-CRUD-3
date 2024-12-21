import { pool } from '../db/postgres.js';

export const getAllProducts = async (req, res) => {
  const query = `
    SELECT products.*, 
      (SELECT ROW_TO_JSON(cat_obj) 
       FROM (SELECT id, name FROM categories WHERE id = products.category_id) 
       AS cat_obj) AS category FROM products
  `;

  try {
    // Execute query to fetch all products with category details
    const result = await pool.query(query);
    
    // If products are found, return them in the response
    if (result.rows.length > 0) {
      res.status(200).json({ 
        error: false,
        success: true,
        message: 'Products fetched successfully',
        productsCount: result.rowCount,
        productsData: result.rows,
      });
    } else {
      res.status(404).json({
        error: false,
        success: true,
        message: 'No products found',
        data: []
      });
    }

  } catch (e) {
    console.error('Error fetching products: ', e.message || e); // Log the error message
    res.status(500).json({
      error: true,
      success: false,
      message: e.message || 'Error fetching all products' // Improved error message handling
    });
  }
};
export const createProduct = async (req, res) => {
  const { name, description, price, quantity, category_id, active } = req.body;

  // Validate input
  if (!name || !price || !quantity || !category_id) {
    return res.status(400).json({
      error: true,
      success: false,
      message: 'All fields are required ',
    });
  }

 


  // Check if the product already exists
  const checkProductQuery = 'SELECT id FROM products WHERE name = $1';
  try {
    const checkResult = await pool.query(checkProductQuery, [name]);

    if (checkResult.rows.length > 0) {
      // If product already exists, return an error
      return res.status(400).json({
        error: true,
        success: false,
        message: 'Product with this name already exists',
      });
    }

    // Create the query to insert a new product
    const query = `
      INSERT INTO products (name, description, price, quantity, category_id, active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, description, price, quantity, category_id, active;
    `;

    // Execute the query to insert the new product
    const result = await pool.query(query, [name, description, price, quantity, category_id, active]);

    // Return the created product data
    res.status(201).json({
      error: false,
      success: true,
      message: 'Product created successfully',
      data: result.rows[0],
    });

  } catch (e) {
    console.error('Error creating product: ', e.message || e); // Log the error message
    res.status(500).json({
      error: true,
      success: false,
      message: e.message || 'Error creating product', // Improved error message handling
    });
  }
};
