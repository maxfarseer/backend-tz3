#!/bin/bash
cd /var/www
echo 'INIT BACKEND'
if [ ! -d "node_modules/yarn" ]; then
  npm i yarn
else
  echo "yarn alredy installed"
fi
npm rebuild
./node_modules/yarn/bin/yarn install
./node_modules/yarn/bin/yarn dev
