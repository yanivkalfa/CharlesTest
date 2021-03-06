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
        search = search.toLowerCase();
        var found = [];

        Brands.find().then(function(brands){
            ClothingTypes.find().then(function(clothingTypes){
                var i = 0, prevLength = 0,keyword = false;

                for(i = 0; i < brands.length; i++) {
                    if (search.indexOf(brands[i].nameToLower) > -1){
                        if(brands[i].nameToLower.length > prevLength){
                            keyword = brands[i].nameToLower;

                        }
                        prevLength = brands[i].nameToLower.length;
                    }
                }
                if(keyword){
                    found.push({"keyword" : keyword, "type" : "brand"});
                }
                keyword = false;
                prevLength = 0;
                for(i = 0; i < clothingTypes.length; i++) {
                    if (search.indexOf(clothingTypes[i].nameToLower) > -1){
                        if(clothingTypes[i].nameToLower.length > prevLength){
                            keyword = clothingTypes[i].nameToLower;
                        }
                        prevLength = clothingTypes[i].nameToLower.length;
                    }
                }
                if(keyword){
                    found.push({"keyword" : keyword, "type" : "clothingType"});
                }

                return res.json({data : found, status : true});

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
