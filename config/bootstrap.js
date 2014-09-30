/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    var brands = [
        {name : "Gap"},
        {name : "Banana Republic"},
        {name : "Boss"},
        {name : "Hugo Boss"},
        {name : "Taylor"},
        {name : "Rebecca Taylor"}
    ];

    var clothTypes = [
        {name : "Denim"},
        {name : "Pants"},
        {name : "Sweaters"},
        {name : "Skirts"},
        {name : "Dresses"}
    ];

    Brands.find().then(function(bands){
        if(bands.length <= 0){
            Brands.creat(brands).then(function(Brand){
               console.log(Brand);
            });

            ClothingTypes.creat(clothTypes).then(function(ClothingType){
                console.log(ClothingType);
            });
        }
    }).catch(function(err){
        if(err) console.log(err);
    });


    cb();
};
