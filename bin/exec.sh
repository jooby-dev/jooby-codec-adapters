#!/bin/sh

echo '=========='
echo 'ChirpStack'
echo '=========='

ls -l ./dist/chirpstack/analog

echo '\n[FULL]' && ./bin/otto ./dist/chirpstack/analog/full.js
echo '\n[FULL MIN]' && ./bin/otto ./dist/chirpstack/analog/full.min.js

echo '\n[TEST]' && ./bin/otto ./dist/chirpstack/analog/test.js
echo '\n[TEST MIN]' && ./bin/otto ./dist/chirpstack/analog/test.min.js
echo '\n'


echo '==========='
echo 'ThingsBoard'
echo '==========='

ls -l ./dist/thingsboard/analog
