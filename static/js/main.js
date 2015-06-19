//timestamp shim for cross browser compatibility
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

$(function() {
    //var orig = new Date("Jun 19 15:30:00 +0000 1979");
    //orig = Math.round(Date.parse(orig) / 1000);
    //var now = Date.now();
    //var diff = now - orig;
    //console.log("Orig: " + orig + ", now: " + now);
    //console.log(diff);

/*
    function isLeapYear(year) {
        var d = new Date(year, 1, 28);
        d.setDate(d.getDate() + 1);
        return d.getMonth() == 1;
    }
    
    function getAge(date) {
        var d = new Date(date), now = new Date();
        var years = now.getFullYear() - d.getFullYear();
        d.setFullYear(d.getFullYear() + years);
        if (d > now) {
            years--;
            d.setFullYear(d.getFullYear() - 1);
        }
        var days = (now.getTime() - d.getTime()) / (3600 * 24 * 1000);
        return years + days / (isLeapYear(now.getFullYear()) ? 366 : 365);
    }
    
    var date = '1977-06-01';
    output = getAge(date);
    remainder = output - Math.floor(output);

    console.log(output + ' years ' + remainder);
*/

    //console.log(moment.preciseDiff(now, orig)); //this is really close
    showDiff();

    function showDiff(){
        var orig = new Date("Jan 1 00:00:00 +0000 2000");
        var now = Date.now();
        $('#output').html(moment.preciseDiff(now, orig)); //fixme this is really close, but oddly not exactly right
        loop = setTimeout(showDiff,1000);
    }
});
