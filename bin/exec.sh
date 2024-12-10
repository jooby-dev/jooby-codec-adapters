#!/bin/sh

# exit on error
set -e

echo '==========================='
echo 'ChirpStack v3 analog (Otto)'
echo '==========================='

ls -l ./dist/chirpstack3/analog

echo '\n[FULL]' && ./bin/otto ./dist/chirpstack3/analog/develop/full.js
echo '\n[FULL MIN]' && ./bin/otto ./dist/chirpstack3/analog/full.min.js

echo '\n[TEST]' && ./bin/otto ./dist/chirpstack3/analog/develop/test.js
echo '\n[TEST MIN]' && ./bin/otto ./dist/chirpstack3/analog/test.min.js

echo '\n'


echo '========================'
echo 'ChirpStack v3 MTX (Otto)'
echo '========================'

ls -l ./dist/chirpstack3/mtx1

echo '\n[FULL]' && ./bin/otto ./dist/chirpstack3/mtx1/develop/full.js
echo '\n[FULL MIN]' && ./bin/otto ./dist/chirpstack3/mtx1/full.min.js

echo '\n[TEST]' && ./bin/otto ./dist/chirpstack3/mtx1/develop/test.js
echo '\n[TEST MIN]' && ./bin/otto ./dist/chirpstack3/mtx1/test.min.js

echo '\n'


echo '========================='
echo 'ChirpStack v3 MTX3 (Otto)'
echo '========================='

ls -l ./dist/chirpstack3/mtx3

echo '\n[FULL]' && ./bin/otto ./dist/chirpstack3/mtx3/develop/full.js
echo '\n[FULL MIN]' && ./bin/otto ./dist/chirpstack3/mtx3/full.min.js

echo '\n[TEST]' && ./bin/otto ./dist/chirpstack3/mtx3/develop/test.js
echo '\n[TEST MIN]' && ./bin/otto ./dist/chirpstack3/mtx3/test.min.js

echo '\n'


echo '=============================='
echo 'ChirpStack v4 analog (QuickJS)'
echo '=============================='

ls -l ./dist/chirpstack4/analog

echo '\n[FULL]' && ./bin/qjs ./dist/chirpstack4/analog/develop/full.js
echo '\n[FULL MIN]' && ./bin/qjs ./dist/chirpstack4/analog/full.min.js

echo '\n[TEST]' && ./bin/qjs ./dist/chirpstack4/analog/develop/test.js
echo '\n[TEST MIN]' && ./bin/qjs ./dist/chirpstack4/analog/test.min.js

echo '\n'


echo '==========================='
echo 'ChirpStack v4 MTX (QuickJS)'
echo '==========================='

ls -l ./dist/chirpstack4/mtx1

echo '\n[FULL]' && ./bin/qjs ./dist/chirpstack4/mtx1/develop/full.js
echo '\n[FULL MIN]' && ./bin/qjs ./dist/chirpstack4/mtx1/full.min.js

echo '\n[TEST]' && ./bin/qjs ./dist/chirpstack4/mtx1/develop/test.js
echo '\n[TEST MIN]' && ./bin/qjs ./dist/chirpstack4/mtx1/test.min.js

echo '\n'


echo '============================'
echo 'ChirpStack v4 MTX3 (QuickJS)'
echo '============================'

ls -l ./dist/chirpstack4/mtx3

echo '\n[FULL]' && ./bin/qjs ./dist/chirpstack4/mtx3/develop/full.js
echo '\n[FULL MIN]' && ./bin/qjs ./dist/chirpstack4/mtx3/full.min.js

echo '\n[TEST]' && ./bin/qjs ./dist/chirpstack4/mtx3/develop/test.js
echo '\n[TEST MIN]' && ./bin/qjs ./dist/chirpstack4/mtx3/test.min.js

echo '\n'


echo '==========='
echo 'ThingsBoard'
echo '==========='

ls -l ./dist/thingsboard/analog

echo
date '+%T'
