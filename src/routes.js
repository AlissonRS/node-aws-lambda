const express = require('express');
const passport = require('passport');
const routes = express.Router();
const Seeder = require('../seed/ProductSeeder');

const ProductsController = require('./controllers/ProductsController');

let seeded = false;

// PUBLIC ROUTES - NOT AUTHORIZATION NEEDED
routes.get('/products', ProductsController.index);
routes.get('/products/:id', ProductsController.show);

// Authentication Midleware
// Any routes defined after this will require authentication
routes.use((req, res, next) => {
    Seeder();     
    if (seeded === false) {
        seeded = true;   
    }
    let response = null;
    if (req.headers.authorization) 
        response = passport.authenticate('bearer', { session: false });
    else
        response = passport.authenticate('cookie', { session: false });
    response(req, res, next);
});

// PROTECTED ROUTES - AUTHORIZATION REQUIRED
routes.post('/products', ProductsController.store);
routes.put('/products/:id', ProductsController.update);
routes.delete('/products/:id', ProductsController.delete);

module.exports = routes;