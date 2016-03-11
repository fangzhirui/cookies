//Minify html templates. Special for arttemplate html.
/*
  var minifyArtt = require('./lib/gulp-minifyartt');
  
  ...
  
  gulp.task('minifyTpl', function(){
    for(var attr in filenames){
      gulp.src(filenames[attr])
        .pipe(minifyArtt())
        .pipe(rename({
          suffix: '.min'
        }))
        .pipe(gulp.dest(distPrefix + '/tpl'));
    }
  });
  
*/

var through2 = require('through2');

var rr = function(str){
  var regex = [];
  regex.push({
    reg:/>[\s\t\n]+/g,
    rep:'>'}
  );
  regex.push({
    reg:/[\s\t\n]+</g,
    rep:'<'}
  );
  regex.push({
    reg: /\}\}[\s\t\n]+</g,
    rep: '}}<'
  });
  regex.push({
    reg: />[\s\t\n]+\{\{/g,
    rep: '>{{'
  });
  regex.push({
    reg: /\}\}[\s\t\n]+\{\{/g,
    rep: '}}{{'
  });
  regex.push({
    reg: /[\n\s\t]+/g,
    rep: ' '
  });
  regex.push({
    reg: /\'/g,
    rep: '"'
  });
  regex.push({
    reg: /"\s/g,
    rep: '"'
  });

  var str2 = str;
  for(var i=0, len=regex.length;i<len;i++){
    str2 = str2.replace(regex[i].reg, regex[i].rep);
  }
  return str2;
};

module.exports = function(){
  return through2.obj(function(file, enc, callback){
    var str = file.contents.toString('utf-8');
    file.contents = new Buffer(rr(str));
    this.push(file);
    callback();
  });
};
