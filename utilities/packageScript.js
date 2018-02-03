'use strict'
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const packageFile = '../package.json';
const devmodulesDir = '../src/devmodules';
// On DOCKER : 
//const packageDir = './package.json';

/* ----------------------------------------------------------------
This is a script that sets up another script that will npm install any
necessary dev packages that we don't already have. 

1) First we read in the contents of our own package.json dependencies and devDependencies
2) We search how many modules there are in devmodules - for each module we traverse into their
package.json file and grab their dependencides.
3) We push their dependencies into an Array and forEach one we create an 
 `npm install ${dependency} --save`  string
4) We use execSync to create a child process and install each dependency.
5) We run that script file in our docker build process 
*/

// read the contents of package.json 

let contents = fs.readFileSync(packageFile);
let contentObj = JSON.parse(contents);

// Read the dependencies 
let packageList = Object.entries(contentObj.dependencies)

//
let packagesArr = [];
let packagesVersion = [];

// run function that pushes package dependencies into storage arrays
let packageFunction = function(list, packageArr, versionArr){
  for(let i = 0; i < packageList.length; i++){
    packageArr.push(packageList[i][0])
    versionArr.push(packageList[i][1])
  }
}
packageFunction(packageList, packagesArr, packagesVersion)



// create empty DEV arrays - to build their packages folder..
let packagesArrDev = [];
let packagesVersionDev = [];
let newPackages = [];
 // see how many folders in devmodules:
if(fs.existsSync(devmodulesDir)){
  let list = fs.readdirSync(devmodulesDir);
  if(list){
    list.forEach( (item) => {
      let directoryFiles = fs.readdirSync(devmodulesDir+ '/' +item)
      //if files in directory , loop through and see if package.json.
      if(directoryFiles.length){
        directoryFiles.forEach((file)=>{
          if(file === 'package.json'){
            // read the contents of package.json 
            let jsonPath = devmodulesDir+ '/' +item + '/' + file;
            let contentsDev = fs.readFileSync(jsonPath);
            let contentObjDev = JSON.parse(contentsDev);
            let packageListDev = Object.entries(contentObjDev.dependencies)
            // if there are dev modules then run package function for that module too
            if(contentObjDev.dependencies){
              let packageListDev = Object.entries(contentObjDev.dependencies)
              packageListDev.forEach((item) => {
                if(packagesArr.indexOf(item[0]) === -1){  // see if it already exists in our package.json
                  if(Object.entries(newPackages).indexOf(item === -1)){ // makes sure we don't add it twice from another module
                    newPackages.push([item[0],item[1]])
                  }
                }
              })
              console.log('\nnewPackages done: ',newPackages)
              // does duplicates right now
            }
          }
        })
      }
    })
  }
}

// WISH LIST add a better section to : 
// make sure there are no duplicates in the "newPackages array"
// this current technique is trash   -- also doesn't account for version differences
let toInstall = [];
let toInstallUniq = [];
newPackages.forEach((currPackage)=>{
  toInstall.push(currPackage[0]);
})
toInstallUniq = Array.from(new Set(toInstall))

// console.log('\n\n toInstall: ', toInstall)
console.log('\n\n toInstallUniq: ', toInstallUniq)

if(toInstallUniq.length){
  console.log('\n *running npm install -- save for each* \n');
}else{
  console.log('\n *no more dependencies to install* \n');
}

// Set up install file - 
// create a child process to run an npm install for each of the new modules
// let installArr = [];
toInstallUniq.forEach( currPackage => {
  let installStr = `npm install ${currPackage} --save`;
  console.log(`\n *running: "npm install ${currPackage} -- save"  * \n`);
  execSync(installStr,
    {
      cwd: __dirname
    })
})

console.log('\n *FINISHED yo * \n')

