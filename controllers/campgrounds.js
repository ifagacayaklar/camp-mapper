const Campground = require('../models/campground');


module.exports.renderIndex = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds});
}

module.exports.renderCreateCampground = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', `Successfully created`);
    req.flash('success', `${campground.title}`);
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.renderShowCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate : {
            path: 'author'
        }
    }).populate('author');
    if (!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderUpdateCampground = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async (req, res, next) => {
    const {id} = req.params;
    newCamp = req.body.campground;
    const campground = await Campground.findByIdAndUpdate(id, newCamp);
    req.flash('success', `Successfully updated`);
    req.flash('success', `${newCamp.title}`);
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted`);
    req.flash('success', `${campground.title}`);
    res.redirect('/campgrounds');   
}