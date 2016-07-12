var fs = require('fs');
var _ = require('underscore');
var superagent = require('superagent');

var step = 90; 
var len = 222;


var data = fs.readFileSync('../resources/al.txt', 'utf-8');
var lines = data.trim().split('\n');

var ixs = (function(total, step){
  var arr = [];
  for(var i=0; i<total; i++){
    if(i%step === 0) {
      arr.push({
        start: i,
        end: i + step
      });
    }
  }
  return arr;
})(lines.length, step);

var lists = _.map(ixs, function(mark){
  return _.map(lines.slice(mark.start, mark.end), function(ele){
    var lola = ele.split(' ');
    return lola[1].trim() + ',' + lola[0].trim();
  }).join('|');
});

var reqList = _.map(lists, function(ele){
  return 'https://maps.googleapis.com/maps/api/elevation/json?locations=' +
    ele + '&key=AIzaSyA9EMQcfqFOpwsJNvxUxEd8S0MP2nBJrpA';
});

var base = 0;

/*
fs.writeFileSync('./tmp/url.' + base + '.' +
  (base + len) + '.json', JSON.stringify(reqList, null, 4), 'utf-8'); //记录下所有的url 
*/

reqList = reqList.slice(base, base + len);
_.each(reqList, function(url, index){
  superagent.get(url)
    .end(function (err, res) {
      fs.writeFileSync('./tmp/' + (base + index) + '.cc', res.text, 'utf-8');
    });
});
