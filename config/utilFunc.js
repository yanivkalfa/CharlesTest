
module.exports = {

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
};