if(typeof songId !== 'undefined' && songId){
    $(document).ready(function(){
        (function(){
            var selWait = 0.5, selTimeout, flag = true, wavesurfer = Object.create(WaveSurfer),
                handleSelection, songDuration = 0, onePercent = 0, selectedTime = $('#selectedTime');

            handleSelection = function(selection){
                flag = false;
                if(selection.endPosition - selection.startPosition > 30){
                    var newEndPosition = selection.startPercentage + (30 / songDuration);
                    wavesurfer.updateSelection({ startPercentage : selection.startPercentage, endPercentage : newEndPosition });
                }

                if(selection.endPosition - selection.startPosition < 5)
                {
                    alertUser.setAlert('Please mark at least 5 seconds','error');
                }

                $('#timeSelection').val(JSON.stringify(wavesurfer.getSelection()));
                flag = true;
            };

            wavesurfer.init({
                container: document.querySelector('#wavesurferDiv'),
                waveColor: 'violet',
                progressColor: 'purple'
            });

            wavesurfer.on('ready', function () {
                songDuration = wavesurfer.getDuration();
                onePercent = songDuration/100;
                console.log(savedSelection);
                if(savedSelection)
                {
                    wavesurfer.updateSelection({ startPercentage : savedSelection.startPercentage, endPercentage : savedSelection.endPercentage });
                }
                else if(songParams && typeof songParams.timeSelection !== 'undefined')
                {
                    try{
                        var SPSavedSelection = JSON.parse(songParams.timeSelection);
                        wavesurfer.updateSelection({ startPercentage : SPSavedSelection.startPercentage, endPercentage : SPSavedSelection.endPercentage })
                    }catch(err){
                        console.log(err);
                    }
                }

                $('#songLength').val(songDuration);
                $('.songLoader').hide();
            });

            wavesurfer.on('selection-update', function(selection){
                var tempSelTIme = selection.endPosition - selection.startPosition, selTime;
                if(tempSelTIme < 30)
                {
                    selTime = Math.ceil(tempSelTIme);
                }
                else
                {
                    selTime = Math.floor(tempSelTIme);
                }


                if(selTime > 30 || selTime < 5)
                {
                    selectedTime.removeClass('good').addClass('bad');
                }
                else
                {
                    selectedTime.removeClass('bad').addClass('good');
                }

                selectedTime.text(selTime);

                clearTimeout(selTimeout);
                if(flag){
                    selTimeout = setTimeout(function(){
                        clearTimeout(selTimeout);
                        handleSelection(selection);
                    },selWait*1000);
                }
            });

            $('#playSong').click(function(){
                wavesurfer.play();
            });

            $('#pauseSong').click(function(){
                wavesurfer.pause();
            });



            wavesurfer.load('/songs/play?id=' + songId);
        })();

        (function(){
            var keyTimeout, timeout=1, toConnectedParent = $('.toConnectedParent'), toConnected = $('.toConnected'), parentVal = {}, keyPressFunc;


            keyPressFunc = function(_this, e, key){

                var connectTo = $(_this).data('connect-to'), curVal, parent = $('#parent_' + connectTo);
                try{
                    curVal = JSON.parse(parent.val());
                }
                catch(err){
                    console.log(err);
                    curVal = {};
                }
                curVal[$(_this).attr('name')] = $(_this).val();
                parent.val(JSON.stringify(curVal));
                if(key == 13){
                    $('#login-form').submit();
                }
            };

            toConnected.keypress(function(e){
                var _this = this, key = e.which || e.keyCode;

                if(key == 13){
                    e.preventDefault();
                }
                clearTimeout(keyTimeout);
                keyTimeout = setTimeout(function(){
                    keyPressFunc(_this, e, key);
                }, timeout*1000)
            });
        })();

        (function(){
            var timeSelection = $('#timeSelection'), loginForm = $('#login-form'), selectedTime = false;


            loginForm.submit(function(e){

                try{
                    selectedTime = JSON.parse(timeSelection.val());
                }
                catch(err){
                    console.log(err);
                }

                if(!selectedTime){
                    alertUser.setAlert('Please mark a part of the song you want to set as preview','error');
                    e.preventDefault();
                }

                if(selectedTime.endPosition - selectedTime.startPosition < 5){
                    alertUser.setAlert('Please mark at least 5 seconds','error');
                    e.preventDefault();
                }

                if(selectedTime.endPosition - selectedTime.startPosition > 30){
                    alertUser.setAlert('You\'ve selected more then 30 seconds please select again','error');
                    e.preventDefault();
                }


                if($('#trackName').val() == ''){
                    alertUser.setAlert('Please enter track name','error');
                    e.preventDefault();
                }

                if($('#albumName').val() == ''){
                    alertUser.setAlert('Please enter album name','error');
                    e.preventDefault();
                }

                if($('#genreName').val() === 'false'){
                    alertUser.setAlert('Please select a genre','error');
                    e.preventDefault();
                }

                if($('#playListId').val() === 'false'){
                    alertUser.setAlert('Please select play list','error');
                    e.preventDefault();
                }
            })
        })();

    });
}