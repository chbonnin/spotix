#increment build number in data.js and compile project
cp data.js data.js.bak
perl -ne 'if (/^(var strBuild=")([0-9]+)(";)/){print $1.($2+1).$3."\n";} else {print $_;}' data.js.bak >data.js

cordova build
