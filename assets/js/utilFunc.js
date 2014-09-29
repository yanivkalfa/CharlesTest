(function($){

    var s =
    {
        oVars :
        {
            /* Holds all sorting init */
            allRows : [],

            /* hold index of current sorting init*/
            currentRow : 0
        },

        /* Object that holds selector for needed elements */
        oBinds :{
            sortingContainer : $('.sortingContainer'),
            addSort : $("#addSort"),
            delSort : $("#delSort")
        },
        oFns : {
            /* Initiate the sorting rule */
            init : function(){
                var rowInit;
                if(typeof emailCentreAndMeta.meta !== 'undefined' && emailCentreAndMeta.meta.length)
                {/* if we have Meta data iterating over it and initiating SortingRule */
                    for(var i=0; i<emailCentreAndMeta.meta.length; i++){
                        rowInit = new SortingRule(s.oVars.allRows.length,emailCentreAndMeta.meta[i].metaKey,emailCentreAndMeta.meta[i].metaValue);
                        s.oVars.allRows.push(rowInit);
                        s.oBinds.sortingContainer.append(rowInit.oHTML);
                        s.oFns.updateIndexing();
                    }
                }
                else
                {/* if we don't have Meta data initiate the first SortingRule */
                    rowInit = new SortingRule(0);
                    s.oVars.allRows.push(rowInit);
                    s.oBinds.sortingContainer.append(rowInit.oHTML);
                    s.oFns.updateIndexing();
                }
                s.oFns.bindControl();
            },

            /* Bind elements to functions. */
            bindControl : function(){
                s.oBinds.addSort.unbind('click').bind('click', function(){
                    s.oFns.addSorting();
                });

                s.oBinds.delSort.unbind('click').bind('click', function(){
                    s.oFns.deleteSorting();
                });
            },

            /* Add sorting row */
            addSorting : function(){
                var rowInit;
                rowInit = new SortingRule(s.oVars.allRows.length);
                s.oVars.allRows.push(rowInit);
                s.oBinds.sortingContainer.append(rowInit.oHTML);
                s.oFns.updateIndexing();
            },

            /* delete sorting row */
            deleteSorting : function(){
                if(s.oVars.currentRow >= 0 && typeof s.oVars.allRows[s.oVars.currentRow] !== 'undefined'){
                    s.oVars.allRows[s.oVars.currentRow].destroy();
                    s.oVars.allRows.splice(s.oVars.currentRow,1);
                    s.oFns.updateIndexing();
                }
            },

            /* Update currentRow according to allowRows.length*/
            updateIndexing : function(){
                s.oVars.currentRow = (s.oVars.allRows.length-1 >= 0) ? s.oVars.allRows.length-1 : 0;
            }
        }
    };


    /*
     * Class
     * Accepts :
     * id - Required - the id of the row.
     * metaKey - optional the selected value for sort by.
     * metaValue - optional the selected Value for look for.
     * */
    var SortingRule = function(id, metaKey, metaValue){
        var _this = this;

        this.iId = id;
        this.sMetaKey = metaKey;
        this.sMetaValue = metaValue;
        this.oEmailCentreMeta = oEmailCentreMeta;
        this.oHTML = $('<div>').addClass('col-lg-12 col-md-12 col-sm-12');

        this.init();
    };

    SortingRule.prototype = {

        /* initiating the row by creating the dom. binding onChange, and selecting sort by if metaKey is supplied*/
        init : function(){
            this.createHTML();
            this.bindControl();
            this.setKeyIndex()
        },

        /* creating the required dom. */
        createHTML : function(){
            var parent, child, div = $('<div>'), select = $('<select>'), __this = this;
            parent = div.clone(true).addClass('col-lg-6 col-md-6 col-sm-12');
            child = select.clone(true).attr({
                "name" : "meta["+__this.iId+"][metaKey]",
                "id" : __this.iId,
                "class" : "metaKey"
            });
            this.addOptions(child, "metaKey");
            parent.append(child);
            this.oHTML.append(parent);

            parent = div.clone(true).addClass('col-lg-6 col-md-6 col-sm-12');
            child = select.clone(true).attr({
                "name" : "meta["+__this.iId+"][metaValue]",
                "id" : __this.iId,
                "class" : "metaValue"
            });
            this.addOptions(child, "metaValue");
            parent.append(child);
            this.oHTML.append(parent);
        },

        /* populating the option for a given select */
        addOptions : function(selector, type){
            var __this = this;
            switch(type){
                case 'metaKey':
                    selector.html('<option value="false" selected="selected">- All - No Filters -</option>');
                    $.each(__this.oEmailCentreMeta,function(key, value){
                        var toAppend = $('<option value="' + key + '">' + value.name + '</option>');
                        selector.append(toAppend);
                    });
                    break;
                case 'metaValue':
                    selector.html('<option value="false" selected="selected">- none selected -</option>');
                    if(typeof __this.oEmailCentreMeta[__this.sMetaKey] !== 'undefined'){
                        $.each(__this.oEmailCentreMeta[__this.sMetaKey].options,function(key, value){
                            var toAppend = $('<option value="' + key + '">' + value + '</option>');
                            selector.append(toAppend);
                        });
                    }
                    break;
            }
        },

        /* set selected value for sort by and trigger change */
        setKeyIndex : function(){
            if(typeof this.sMetaKey !== 'undefined'){
                this.oHTML.find('.metaKey').val(this.sMetaKey).trigger('change');
            }
        },

        /* set selected value for look for */
        setValueIndex : function(){
            if(typeof this.sMetaValue !== 'undefined'){
                if(this.sMetaValue == "false" || this.sMetaKey == "false"){
                    this.oHTML.find('.metaValue').prop('selectedIndex',0);
                }else{
                    this.oHTML.find('.metaValue').val(this.sMetaValue);
                }
            }
        },

        /* Bind elements to functions. */
        bindControl : function(){
            var __this = this;
            this.oHTML.find('.metaKey').unbind('change').bind('change', function(){
                __this.sMetaKey = $(this).val();
                __this.addOptions(__this.oHTML.find('.metaValue'), "metaValue");
                __this.setValueIndex();
            })

        },

        /* Remove row and resetting this. */
        destroy : function(){
            delete this.iId;
            delete this.sMetaKey;
            delete this.sMetaValue;
            delete this.oEmailCentreMeta;
            this.oHTML.remove();
            delete this.oHTML;
        }
    };

    var AlertUser = function(){
        var _this = this;
        this.wrapSelector = $('#alertUser');
        this.msgSelector = $('.textHolder');
        this.init();
        this.bindControls();
    };
    AlertUser.prototype.init = function(){
        this.msgSelector.val('');
        this.hideAlert();
    };

    AlertUser.prototype.bindControls = function(){
        var _this = this;
        this.wrapSelector.click(function(){
            _this.hideAlert();
        });
    };

    AlertUser.prototype.showAlert = function(){
        this.wrapSelector.show();
    };
    AlertUser.prototype.hideAlert = function(){
        $(document).off('scroll', this.rePosition);
        this.wrapSelector.hide();
    };

    AlertUser.prototype.setAlert = function(msg, type){
        if(!msg || !type) return false;

        var _this = this;
        $(document).on('scroll', function(){
            _this.rePosition();
        });
        this.wrapSelector.removeClass('alertUser_warning').removeClass('alertUser_success').removeClass('alertUser_error');
        this.wrapSelector.addClass('alertUser_' + type);
        this.msgSelector.text(msg);
        this.rePosition();
        this.showAlert();
    };

    AlertUser.prototype.rePosition = function(){
        this.wrapSelector.position.top=0;
        this.wrapSelector.css("top" , 0)
    };

    $(document).ready(function()
    {
        /* for a lake of time or better option */
        if(typeof customPage !== "undefined" && customPage === "emailCentreEdit"){
            s.oFns.init();
        }


        alertUser = new AlertUser();
        if(typeof error !== 'undefined' && typeof error[0] !== 'undefined'){
            alertUser.setAlert(error[0].msg,error[0].type);
        }
    });

})(jQuery);