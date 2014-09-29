
module.exports = {

    routRegistration : function(registrationProcessStatus, req, res, err){
        var msg = 'Please finish your registration before going anywhere else';
        if(err)
            req.flash('finishReg', msg);
        switch(registrationProcessStatus){
            case 1:
                return res.redirect('/user_details');
                break;
            case 2:
                return res.redirect('/package_details');
                break;
            case 3:
                return res.redirect('/');
                break;
            default :
                return res.redirect('/login');
        }
    },

    getValueByKey : function(metaKey, metas){
        if(Array.isArray(metas))
        {
            for(var i = 0; i < metas.length; i++){
                if(metas[i].metaKey == metaKey){
                    return metas[i].metaValue;
                }
            }
        }


        return false;
    },

    inUserMeta : function(metaKey, userMeta){
        if(Array.isArray(userMeta))
        {
            for(var i = 0; i < userMeta.length; i++){
                if(userMeta[i].metaKey == metaKey){
                    return i;
                }
            }
        }

        return -1;
    },

    getSongStatus : function(status){
        var toReturn = false;
        switch(status){
            case 0:
                toReturn = 'Need Editing';
                break;
            case 1:
                toReturn = 'Song Ready';
                break;
            default :
                toReturn = 'Pending';
        }

        return toReturn;
    },

    htmlEscape : function(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    createTrackingOptions : function(savedTrackingOption, SPsongParams){
        var trackOptions = require("../config/constants.js").trackOptions, i, j, tOpt, html = '', opt,isConnected = false,
            connectedHtml = '', enabled = false, statusTest = '', checked, conClass, savedOpt = false;

        savedTrackingOption = (typeof savedTrackingOption !== 'undefined' && savedTrackingOption) ? savedTrackingOption : {};
        SPsongParams = (typeof SPsongParams !== 'undefined' && SPsongParams) ? SPsongParams : {};

        for(i = 0; i < trackOptions.length; i++){
            tOpt = trackOptions[i];
            savedOpt = savedOpt = savedTrackingOption[tOpt.name] || SPsongParams[tOpt.name] || false;
            if(typeof savedOpt !== 'object'){
                try{
                    savedOpt = JSON.parse(savedOpt);
                }catch(err){}
            }

            connectedHtml= '';
            if(tOpt.options.length > 0 ){
                for(j = 0; j < tOpt.options.length; j++){
                    opt = tOpt.options[j];
                    var savedValue = false;
                    if(savedOpt){
                        savedValue = savedOpt[opt.name] || false;
                    }
                    isConnected = true;
                    connectedHtml +=
                    '<div class="hrSpacer"></div>' + "\n" +
                    '<div class="col-lg-12">' + "\n" +
                        '<input value="' + ( savedValue ? savedValue : "")+ '" type="text" data-connect-to="' + tOpt.name + '" class="form-control toConnected" name="' + opt.name + '" placeholder="' + opt.placeholder + '" />' + "\n" +
                    '</div>';
                }
            }

            if(tOpt.enableRequire)
            {
                if(savedOpt)
                {
                    statusTest = 'Enabled';
                    checked = 'checked="checked"';
                }
                else
                {
                    statusTest = 'Enable';
                    checked = '';
                }
            }
            else
            {
                statusTest = 'Always enabled';
                checked = 'checked="checked"';
            }


            conClass = '';
            if(isConnected)
            {
                conClass = 'class="toConnectedParent"';
            }

            html +=
                '<div class="title-bar white">' +
                    '<div class="hrSpacer"></div>' +
                    '<div class="row">' + "\n" +
                        '<div class="col-lg-9">' + "\n" +
                            '<h3 class="toLabel toTeal">' + tOpt.label + '</h3>' + "\n" +
                            '<span class="toDes">' + tOpt.description + '</span>' + "\n" +
                        '</div>' + "\n" +
                        '<div class="col-lg-1 toPagHeight">' + "\n" +
                            '<input id="parent_' + tOpt.name + '" ' + checked + ' type="checkbox" ' + conClass + ' name="trackOptions[' + tOpt.name + ']" value="' + (savedOpt ? this.htmlEscape(JSON.stringify(savedOpt)) : tOpt.name ) + '" />' + "\n" +
                        '</div>' + "\n" +
                        '<div class="col-lg-2 toPagHeight">' + "\n" +
                            '<span class="toDesc toTeal">' + statusTest + '</span>' + "\n" +
                        '</div>'+ "\n"
                        + connectedHtml +
                    '</div>' +
                '</div>'
            ;
        }

        return html;
    },

    createSelect : function(_options, _name, _class, _id, _selectedIndex, _defaultValue){

        /*

        console.log("-------------------------------------------------");
        console.log("_options",_options);
        console.log("_name",_name);
        console.log("_class", _class);
        console.log("_id", _id);
        console.log("_selectedIndex", _selectedIndex);
        console.log("_defaultValue", _defaultValue);

        console.log("-------------------------------------------------");
        */

        if(!_name) return false;
        var select, i, aClass = '', id = '', selected = '' ;

        if(_class){
            aClass = 'class="' + _class + '"';
        }

        if(_id){
            id = 'id="' + _id + '"';
        }

        select = '<select name="' + _name +'" ' + aClass + ' ' + id +'>' + "\n";
        if(_defaultValue){
            select += '<option value="false">' + _defaultValue + '</option>';
        }

        for(i = 0; i < _options.length; i++){
            selected = '';
            if(_selectedIndex && _selectedIndex == _options[i].value){
                selected = 'selected';
            }

            select += '<option ' + selected + ' value="' + _options[i].value + '">' + _options[i].name + '</option>';
        }

        select += '</select>';

        return select;
    },

    songLengthToTime : function(seconds){
        seconds = parseFloat(seconds);
        var m = Math.floor(seconds / 60);
        seconds %= 60;

        return m+":"+ Math.floor(seconds)
    },

    forbidAccess : function(req,res,uf, error){
        var toReturn = {
            user: (typeof req.user !== 'undefined' && req.user) ? req.user : {},
            userMeta : (typeof req.user !== 'undefined' && typeof req.user.userMeta !== 'undefined') ? req.user.userMeta : {},
            uf: uf,
            error : error || 'Something went wrong please go back!'
        };
        return res.view(403,toReturn);
    }
};