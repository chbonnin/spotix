#increment build number in data.js and compile project
JS_DIR=~/Documents/dev/phoneGap/spotix/www/js
cp $JS_DIR/data.js $JS_DIR/data.js.bak
perl -ne 'if (/^(var strBuild=")([0-9]+)(";)/){print $1.($2+1).$3."\n";} else {print $_;}' $JS_DIR/data.js.bak >$JS_DIR/data.js

cordova build $*

grep strBuild= $JS_DIR/data.js
