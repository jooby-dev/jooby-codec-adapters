# Jooby encoders/decoders adapters


Development:

```sh
git clone --branch v4 git@github.com:jooby-dev/jooby-codec.git jooby-codec-v4
cd jooby-codec-v4
npm i
npm run build:js:watch

cd ..
git clone git@github.com:jooby-dev/jooby-codec-adapters.git
cd jooby-codec-adapters
npm i

# this is not required after `npm install`
#ln -s ../../jooby-codec-v4/dist ./node_modules/jooby-codec

npx webpack -w
npx rollup -c -w

npm run dev
```
