//timestamp shim for cross browser compatibility
if(!Date.now){
    Date.now = function() { return new Date().getTime(); }
}

// Function from David Walsh: http://davidwalsh.name/css-animation-callback
function whichTransitionEvent(){
  var t,
      el = document.createElement("fakeelement");
  var transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  }
  for (t in transitions){
    if (el.style[t] !== undefined){
      return transitions[t];
    }
  }
}
var transitionEvent = whichTransitionEvent();


//global variables
var orig = new Date("Jan 1 00:00:00 +0000 2014"); //fixme this is out by an hour FOR SMALL NUMBERS ONLY e.g. set to 10am and view at 11:15, difference is 15 mins, not an hour 15 - but from start of year timing is accurate
var $time = $('#time');
var time = {'year':'00','month':'00','day':'00','hour':'00','minute':'00','second':'00'};
var prevtime = {'year':'00','month':'00','day':'00','hour':'00','minute':'00','second':'00'};
var limits = {'year':10000,'month':11,'day':366,'hour':23,'minute':59,'second':59};
var currentscale = 0;
var timer;

var timeline = [
    {
        'date':"Jan 1 00:00:00 +0000 2014",
        'title':'This is a test item',
        'content':'<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p>'
    },
    {
        'date':"Feb 1 00:00:00 +0000 2014",
        'title':'This is another test item',
        'content':'<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p><p>And what if it does, and that causes a huge space problem?</p>'
    },
    {
        'date':"Mar 1 00:00:00 +0000 2015",
        'title':'This is another test item',
        'content':'<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p>'
    },
    {
        'date':"Mar 3 00:00:00 +0000 2015",
        'title':'This is another test item',
        'content':'<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p>'
    }
];

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
        //do the clock
        showDiff: function(){
            lenny.general.resetTime();
            var now = Date.now();
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

                    if(time[key] != prevtime[key] || (digit == '00' && key == 'seconds')){ //only animate if num changed or unit is 0 and seconds. Otherwise at 0 on minutes etc. just animates forever
                        digits.attr('class','digits animate'); //in theory this is quicker than addClass
                    }
                    else {
                        digits.attr('class','digits');
                    }
                }
            }
            lenny.general.backupTime();
        }
    },
    timeline: {

    }

};
window.lenny = lenny;
})(window);


$(function() {
    /*
    var currentdate = new Date();
    var datetime = "Now: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
    console.log(datetime);
    */

    var wait = 1;
    //in theory if we start on an exact second the js should be in sync with the css animation. In theory.
    while(wait){
        if(Date.now() % 1000 === 0){
            wait = 0;
            $('#trigger').addClass('active');
        }
    }

    //since CSS animation and JS timing of 1 second seems to differ, we trigger the next loop of the JS after a trigger element's transition is complete
    $('.trigger').on(transitionEvent,function(event) {
        // Do something when the transition ends
        clearTimeout(timer);
        timer = setTimeout(function(){
            lenny.general.showDiff();
            if($('#trigger').hasClass('active')){
                $('#trigger').removeClass('active');
            }
            else {
                $('#trigger').addClass('active');
            }
        },0);
    });
    
    //do the timeline
    var $tl = $('#timelinecontent');
    var origin = Date.parse(orig)
    var tllength = Date.now() - origin; //base the length of the timeline on the time difference
    tllength = Math.floor((tllength / 10000000) / 2);
    $tl.css('width', tllength + 'px');

    //this code positions the 'view' to the far right of the timeline
    //due to a quirk of how the plugin works, this only works on elements that are floated left. It won't work on absolutely positioned elements or elements with an offset using a margin
    //SO! to position the viewport we have two DIVs in the markup with zero height and floated left. The first is given the width of how far along the view we want to start at,
    //and the second is the startAtElementId element used to initialise the plugin below. A bit hacky but it's the only way I can get it to work and still allow the user to scroll back in time
    $('#buffer').css('width',tllength - ($(window).outerWidth() / 1.5));

    for(var i = 0; i < timeline.length; i++){
        var date = new Date(timeline[i]['date']);
        var pos = Date.parse(date) - origin;
        pos = Math.floor((pos / 10000000) / 2);
        pos = (pos / tllength) * 100;
        var humandate = timeline[i]['date'];
        humandate = humandate.split(' ');
        humandate = humandate[0] + ' ' + humandate[1] + ', ' + humandate[4];
        var html = '<div class="date">' + humandate + '</div><div class="content"><h2>' + timeline[i]['title'] + '</h2>' + timeline[i]['content'] + '</div>';
        $('<div/>').addClass('tlitem').css('left',pos + '%').html(html).appendTo($tl);
    }

    //initiate smooth scroller plugin for mouse/touch
    $("#timeline").smoothTouchScroll({
        startAtElementId:'starthere'
    });
    
    $('body').on('click',function(){
        $('.tlitem').removeClass('active');
    });
    
    $('.tlitem').on('click',function(e){
        e.stopPropagation();
        $('.tlitem').removeClass('active');
        $(this).addClass('active');
    });
});
