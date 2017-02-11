#increment build number in data.js and compile project
SPOTIX_DIR=~/Documents/dev/phoneGap/spotix
JS_DIR=$SPOTIX_DIR/www/js 

cp $JS_DIR/data.js $JS_DIR/data.js.bak 
perl -ne 'if (/^(var strBuild=")([0-9]+)(";)/){print $1.($2+1).$3."\n";} else {print $_;}' $JS_DIR/data.js.bak >$JS_DIR/data.js
cp $SPOTIX_DIR/config.xml $SPOTIX_DIR/config.xml.bak
perl -ne 'if (/(.*\.)([0-9]+)(" xmlns=.*)/){print $1.($2+1).$3."\n";} else {print $_;}' $SPOTIX_DIR/config.xml.bak >$SPOTIX_DIR/config.xml

cordova build $*

grep strBuild= $JS_DIR/data.js
