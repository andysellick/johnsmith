//timestamp shim for cross browser compatibility
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

$(function() {
    showDiff();

    function showDiff(){
        var orig = new Date("Jan 1 00:00:00 +0000 2000");
        var now = Date.now();
        var output = moment.preciseDiff(now, orig);
        var fop = $('<div/>').addClass('timewrap');
        output = output.split(" ");

        for(var i = 0; i < output.length; i += 2){
            var tu = $('<div/>').addClass('timeunit');
            var num = output[i];
            if(num.length < 2){
                num = '0' + num;
            }
            $('<div/>').addClass('digits').html(num).appendTo(tu);
            $('<div/>').addClass('unit').html(output[i + 1]).appendTo(tu);
            tu.appendTo(fop);
        }

        $('#output').html(fop);
        loop = setTimeout(showDiff,1000);
    }
});
