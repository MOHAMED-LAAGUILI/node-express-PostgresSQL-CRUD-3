import express from 'express';
import { createCategory, getAllCategories } from '../controller/categoryController.js';

const categoriesRoute = express.Router();

// Route to render the form page (index) and display users
categoriesRoute.get('/get-all-categories', getAllCategories); // Call getAllUsers to fetch users and render the page with users
categoriesRoute.post('/create-new-category', createCategory); // Call getAllUsers to fetch users and render the page with users


export default categoriesRoute;
