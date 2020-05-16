const fs = require('fs');
const path = require('path');

const check = () => {
  const rootPath = path.join(__dirname, '../');
  const oldJsonPath = path.join(rootPath, '.bamboo/old_package-lock.json');
  const jsonPath = path.join(rootPath, 'package-lock.json');
  const varsPath = path.join(rootPath, '.bamboo/vars.txt');
  let data = new Uint8Array(Buffer.from('needRebuild=true'));

  if (fs.existsSync(oldJsonPath) || fs.existsSync(path.join(rootPath, 'node_modules'))) {
    const oldJson = require(oldJsonPath);
    const json = require(jsonPath);
    if (JSON.stringify(oldJson) === JSON.stringify(json)) {
      data = new Uint8Array(Buffer.from('needRebuild=false'));
      fs.writeFileSync(varsPath, data);
      return;
    }
  }
  fs.copyFileSync(jsonPath, oldJsonPath);
  fs.writeFileSync(varsPath, data);
};

check();
