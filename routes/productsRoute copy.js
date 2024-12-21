import express from 'express';
import { createProduct, getAllProducts } from '../controller/productsController.js';

const productsRoute = express.Router();

// Route to render the form page (index) and display users
productsRoute.get('/get-all-products', getAllProducts); // Call getAllUsers to fetch users and render the page with users
productsRoute.post('/create-new-product', createProduct); // Call getAllUsers to fetch users and render the page with users



export default productsRoute;
