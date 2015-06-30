//timestamp shim for cross browser compatibility
if(!Date.now){
    Date.now = function() { return new Date().getTime(); }
}
/* https://gist.github.com/Squeegy/1d99b3cd81d610ac7351 */
(function() {
  window.accurateInterval = function(time, fn) {
    var cancel, nextAt, timeout, wrapper, _ref;
    nextAt = new Date().getTime() + time;
    timeout = null;
    if (typeof time === 'function') _ref = [time, fn], fn = _ref[0], time = _ref[1];
    wrapper = function() {
      nextAt += time;
      timeout = setTimeout(wrapper, nextAt - new Date().getTime());
      return fn();
    };
    cancel = function() {
      return clearTimeout(timeout);
    };
    timeout = setTimeout(wrapper, nextAt - new Date().getTime());
    return {
      cancel: cancel
    };
  };
}).call(this);


//global variables
var orig = new Date("Jun 29 08:01:00 +0000 2015");
var $time = $('#time');
var time = {'year':'00','month':'00','day':'00','hour':'00','minute':'00','second':'00'};
var prevtime = {'year':'00','month':'00','day':'00','hour':'00','minute':'00','second':'00'};
var limits = {'year':10000,'month':11,'day':366,'hour':23,'minute':59,'second':59};
var currentscale = 0;

(function( window, undefined ) {
var lenny = {
    general: {
        //store time for comparison next time round, since it's an object can't do a direct copy
        backupTime: function(){
            for(var y in time){
                prevtime[y] = time[y];
            }
        },
        //set all the values back to zero
        resetTime: function(){
            time = {'year':'00','month':'00','day':'00','hour':'00','minute':'00','second':'00'};
        },
        showDiff: function(){
            lenny.general.resetTime();
            var now = Date.now();
            //console.log(now);
            var output = moment.preciseDiff(now, orig);
            output = output.split(" ");
        
            for(var i = 0; i < output.length; i += 2){
                var num = output[i];
                var unit = output[i + 1];
                if(unit[unit.length - 1] == 's'){ //moment's output can vary e.g. 'seconds' or 'second', to match the array keys in time we need to trim this
                    unit = unit.substring(0, unit.length - 1);
                }
                time[unit] = num; //this only happens if moment returns a value for this digit type, which it doesn't do if it's 0
            }
            var ok = 0;
        
            for(var key in time){
                if(time[key] != '00' || ok){
                    ok = 1;
                    var unit = key;
                    var digit = parseInt(time[key]);
                    if(digit != 1){
                        unit = unit + 's'; //add the s back on
                    }
                    //prev digit might be invalid, need to roll back to zero
                    var prevdigit = digit - 1; //get the next digit, for the animation
                    if(prevdigit < 0){
                        prevdigit = limits[key];
                    }
                    if(prevdigit < 10){
                        prevdigit = '0' + prevdigit;
                    }
                    if(digit < 10){
                        digit = '0' + digit;
                    }
        
                    var wrapper = $time.find('.timeunit[data-name=' + key + ']').attr('class','timeunit shown');//find the relevant element and set it up
                    var digits = wrapper.find('.digits').attr('data-next',digit).attr('data-now',prevdigit);
        
                    digits.find('.next').remove();
                    digits.find('.prev').remove();
        
                    $('<div/>').addClass('next').html(digit).appendTo(digits);
                    $('<div/>').addClass('prev').html(prevdigit).appendTo(digits);
        
                    digits.find('.number').html(digit);
                    wrapper.find('.units').html(unit);

                    if(time[key] != prevtime[key] || (digit == '00' && key == 'seconds')){ //only animate if the number has changed or the unit is 0 and seconds. Otherwise when you hit 0 on minutes etc. it just animates forever
                        digits.attr('class','digits animate'); //in theory this is quicker than addClass
                    }
                    else {
                        digits.attr('class','digits');
                    }
                }
            }
            lenny.general.backupTime();
        }
    }

};
window.lenny = lenny;
})(window);


$(function() {
    var wait = 1;
    //in theory if we start on an exact second the js should be in sync with the css animation. In theory.
    while(wait){
        if(Date.now() % 1000 === 0){
            wait = 0;
            accurateInterval(1000,lenny.general.showDiff);
        }
    }

});
