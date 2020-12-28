const { Router } = require('express');
const ExpressError = require('../utils/ExpressError');

const campgroundRoutes = require('./campgrounds');
const reviewRoutes = require('./reviews'); 
const userRoutes = require('./users');

const router = Router();

router.use('/', userRoutes);
router.use('/campgrounds/:id/reviews', reviewRoutes)
router.use('/campgrounds', campgroundRoutes);


router.get('/', (req, res) => {
    res.status(200).render('home')
})

router.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

router.use((err, req, res, next) => {
    const {message, statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something went Wrong!'
    res.status(statusCode).render('error', {err});
})



module.exports = router;