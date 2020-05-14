const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const rootPath = path.join(__dirname, "../");

const oldJsonPath = path.join(rootPath, ".bamboo/old_package-lock.json");
const jsonPath = path.join(rootPath, "package-lock.json");
const varsPath = path.join(rootPath, ".bamboo/vars.txt");
let data;

if (fs.existsSync(oldJsonPath) === false) {
  fs.copyFileSync(jsonPath, oldJsonPath);
  data = new Uint8Array(Buffer.from("changed=true"));
  fs.writeFileSync(varsPath, data);
} else {
  const oldJson = require(oldJsonPath);
  const json = require(jsonPath);
  if (JSON.stringify(oldJson) == JSON.stringify(json)) {
    data = new Uint8Array(Buffer.from("changed=false"));
    fs.writeFileSync(varsPath, data);
  } else {
    data = new Uint8Array(Buffer.from("changed=true"));
    fs.writeFileSync(varsPath, data);
  }
}
process.exit(0);

// const checker = (fileName) => {
//   const filePath = path.join(__dirname, fileName);
//   if (fs.existsSync(filePath) === false) {
//     console.error(`File ${filePath} doesn't exist`);
//     process.exit(1);
//   }

//   const algorithm = "all";

//   let hashes = crypto.getHashes();
//   if (algorithm !== "all") {
//     if (hashes.indexOf(algorithm) === -1) {
//       console.error("Unknown algorithm");
//       process.exit(1);
//     } else {
//       hashes = [algorithm];
//     }
//   }
//   hashes = hashes.filter((hash) => !hash.match(/^.+WithRSAEncryption$/));
//   hashes = hashes.map(
//     (hash) =>
//       new Object({
//         name: hash,
//         object: crypto.createHash(hash),
//       })
//   );

//   const input = fs.createReadStream(filePath);

//   input.on("readable", () => {
//     const data = input.read();
//     if (data) {
//       hashes.forEach((hash) => hash.object.update(data));
//     } else {
//       hashes.forEach((hash) =>
//         console.log(`${hash.name} ${hash.object.digest("hex")}`)
//       );
//     }
//   });
// };

// const checkSum = checker("oldChecksum.txt");

// module.exports = async (Model, path, filter = {}) => {
//   try {
//     const items = await Model.find(filter).lean();
//     const json = JSON.stringify(items);
//     const fileName = `${path}/${Model.collection.name}.data.json`;
//     fs.writeFileSync(fileName, json);
//   } catch (err) {
//     throw err;
//   }
// };
