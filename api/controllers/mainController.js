/**
 * SongsController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    index : function(req, res) {
        return res.view();
    },


    search : function(req, res) {
        var search = req.param('search');
        if(!search) return res.json({data : "", status : false});
        search = search.toLowerCase().match(/\S+/g);
        if(!Array.isArray(search) || search.length <= 0) return res.json({data : "", status : false});

        var results = {"brands" : [], "clothingTypes" : []};

        Brands.find({nameToLower : search}).then(function(brands){
            ClothingTypes.find({nameToLower : search}).then(function(clothingTypes){

                results.brands = brands.map(function(brand){
                    return brand.nameToLower;
                });

                results.clothingTypes = clothingTypes.map(function(clothingType){
                    return clothingType.nameToLower;
                });

                return res.json({data : results, status : true});

            }).catch(function(err){
                console.log("ClothingTypes",err);
                if(err) return res.json({data : "", status : false});
            });
        }).catch(function(err){
            console.log("Brands",err);
            if(err) return res.json({data : "", status : false});
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to UserController)
     */
    _config: {}


};
