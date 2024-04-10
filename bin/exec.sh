#!/bin/sh

# exit on error
set -e

echo '===================='
echo 'ChirpStack v3 (Otto)'
echo '===================='

ls -l ./dist/chirpstack3/analog

echo '\n[FULL]' && ./bin/otto ./dist/chirpstack3/analog/full.js
echo '\n[FULL MIN]' && ./bin/otto ./dist/chirpstack3/analog/full.min.js

echo '\n[TEST]' && ./bin/otto ./dist/chirpstack3/analog/test.js
echo '\n[TEST MIN]' && ./bin/otto ./dist/chirpstack3/analog/test.min.js

echo '\n'


echo '======================='
echo 'ChirpStack v4 (QuickJS)'
echo '======================='

ls -l ./dist/chirpstack4/analog

echo '\n[FULL]' && ./bin/qjs ./dist/chirpstack4/analog/full.js
echo '\n[FULL MIN]' && ./bin/qjs ./dist/chirpstack4/analog/full.min.js

echo '\n[TEST]' && ./bin/qjs ./dist/chirpstack4/analog/test.js
echo '\n[TEST MIN]' && ./bin/qjs ./dist/chirpstack4/analog/test.min.js

echo '\n'


echo '==========='
echo 'ThingsBoard'
echo '==========='

ls -l ./dist/thingsboard/analog

echo '\nok'
