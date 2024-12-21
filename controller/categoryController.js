import { pool } from '../db/postgres.js';

export const getAllCategories = async (req, res) => {
 
    const query = `SELECT * FROM categories`;

  try {
    // Execute query to fetch all categories
    const result = await pool.query(query);
    
    // If categories are found, return them in the response
    if (result.rows.length > 0) {
      res.status(200).json({ 
        error: false,
        success: true,
        message: 'Categories fetched successfully',
        categoriesCount: result.rowCount,
        categoriesData: result.rows,
    });
    } else {
      res.status(404).json({
        error: false,
        success: true,
        message: 'No categories found',
        data: []
      });
    }

  } catch (e) {
    console.error('Error fetching categories: ', e.message || e); // Log the error message
    res.status(500).json({
      error: true,
      success: false,
      message: e.message || 'Error fetching all categories' // Improved error message handling
    });
  }
};
export const createCategory = async (req, res) => {
  const { name, description } = req.body;

  // Validate input
  if (!name ) {
    return res.status(400).json({
      error: true,
      success: false,
      message: 'Category name is required ',
    });
  }

  // Check if the category already exists
  const checkCategoryQuery = 'SELECT id FROM categories WHERE name = $1';
  try {
    const checkResult = await pool.query(checkCategoryQuery, [name]);

    if (checkResult.rows.length > 0) {
      // If category already exists, return an error
      return res.status(400).json({
        error: true,
        success: false,
        message: `Category ${name} already exists`,
      });
    }

    // Create the query to insert a new category
    const query = `
      INSERT INTO categories (name)
      VALUES ($1)
      RETURNING *;
    `;

    // Execute the query to insert the new category
    const result = await pool.query(query, [name]);

    // Return the created category data
    res.status(201).json({
      error: false,
      success: true,
      message: 'Category created successfully',
      data: result.rows[0],
    });

  } catch (e) {
    console.error('Error creating category: ', e.message || e); // Log the error message
    res.status(500).json({
      error: true,
      success: false,
      message: e.message || 'Error creating category', // Improved error message handling
    });
  }
};
