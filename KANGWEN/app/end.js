/*
    read result json files (*.cc) and merge them 
*/
var fs = require('fs');
var _ = require('underscore');

var re = [];
for(var i = 0; i < 223; i++){
  var filename = 'tmp/' + i + '.cc';
  console.log(filename);
  var str = fs.readFileSync(filename, 'utf-8');

  var obj = JSON.parse(str);
  re = re.concat(_.map(obj.results, function(ele){
    return [ele.location.lng, ele.location.lat, ele.elevation, ele.resolution].join(',') + '\n';
  }));
}

fs.writeFileSync('./tmp/end.cc', re.join(''),  'utf-8');
