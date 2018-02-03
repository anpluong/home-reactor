const fs = require('fs');
const path = require('path');
const dir = '../src/modules';
const dirDev = '../src/devmodules';
// create router file
let fileName = 'Main.jsx'
let fullPath = '../src/Main.jsx';
let routerFile = path.join(__dirname, fullPath);

let dirArr = [];
let dirArrDev = [];
// check the modules directory to find any more folders (aka apps) - if true, push to dirArr
const getDirectories = (srcPath, outputArr) => {
  fs.readdirSync(srcPath).filter(file => {
    if(fs.statSync(path.join(srcPath, file)).isDirectory() === true){
      outputArr.push(file)
    }
  })
}
getDirectories(dir, dirArr)
console.log('dirArr before: ', dirArr)

if(fs.existsSync(dirDev)){
  // if there is a folder in dirArrDev - concat into dirArr
  getDirectories(dirDev, dirArrDev)
}
console.log('dirArr after Dev: ',dirArr)

 
// create import strings that will be needed
var strArrStaticImport = [
  "import React, { Component } from 'react'\n",
  "import { Switch, Route, Link } from 'react-router-dom'\n",
  "import StarterApp from './StarterApp'\n"
]

var strArrStaticOpen = [
  "\n",
  "class Router extends Component {\n",
  "  render() {\n",
  "    return(\n",
  "      <Switch>\n",
  "        <Route exact path='/' component={StarterApp}/>\n"
]

// create the "imports" and "Links" statements for the PRELOADED elements

let strArrDynamicImport = [];
let strArrDynamicRoute = [];
for(let i = 0; i < dirArr.length; i++){
  let curr = dirArr[i]
  let uppered = curr.charAt(0).toUpperCase() + curr.slice(1); 
  let currImportStr = `import ${uppered} from './modules/${curr}/${uppered}'\n`
  strArrDynamicImport.push(currImportStr)
  let currRouteStr = `        <Route path='/${curr}' component={${uppered}}/>\n`
  strArrDynamicRoute.push(currRouteStr)
}

// create the "imports" and "Links" statements for the PRELOADED elements
let strArrDynamicImportDev = [];
let strArrDynamicRouteDev = [];
for(let i = 0; i < dirArrDev.length; i++){
  let curr = dirArrDev[i]
  let uppered = curr.charAt(0).toUpperCase() + curr.slice(1); 
  let currImportStrDev = `import ${uppered} from './devmodules/${curr}/${uppered}'\n`
  strArrDynamicImportDev.push(currImportStrDev)
  let currRouteStrDev = `        <Route path='/${curr}' component={${uppered}}/>\n`
  strArrDynamicRouteDev.push(currRouteStrDev)
}
var strArrClose = [
  "      </Switch>\n",
  "    )\n",
  "  }\n",
  "}\n",
  "export default Router\n"
]


// pulling router file location from top of document
console.log('routerFile: ', routerFile);
if (fs.existsSync(routerFile)) {
  fs.unlinkSync(routerFile)
}

// import the first known needed modules;
for(let i = 0; i < strArrStaticImport.length; i++){
  fs.appendFileSync(routerFile, strArrStaticImport[i], function(err){
    if(err) throw err;
  });
}
// import the developer modules
for(let i = 0; i < strArrDynamicImport.length; i++){
  fs.appendFileSync(routerFile, strArrDynamicImport[i], function(err){
    if(err) throw err;
  });
}
// import the developer modules
for(let i = 0; i < strArrDynamicImportDev.length; i++){
  fs.appendFileSync(routerFile, strArrDynamicImportDev[i], function(err){
    if(err) throw err;
  });
}

// being the react router switch statement 
for(let i = 0; i < strArrStaticOpen.length; i++){
  fs.appendFileSync(routerFile, strArrStaticOpen[i], function(err){
    if(err) throw err;
  });
}
// add the developer modules to the switch statement  
console.log(strArrDynamicRoute);
for(let i = 0; i < strArrDynamicRoute.length; i++){
  fs.appendFileSync(routerFile, strArrDynamicRoute[i], function(err){
    if(err) throw err;
  });
}
console.log(strArrDynamicRouteDev);
for(let i = 0; i < strArrDynamicRouteDev.length; i++){
  fs.appendFileSync(routerFile, strArrDynamicRouteDev[i], function(err){
    if(err) throw err;
  });
}

for(let i = 0; i < strArrClose.length; i++){
  fs.appendFileSync(routerFile, strArrClose[i], function(err){
    if(err) throw err;
  });}


fs.readFile(routerFile, 'utf8', function(err,data){
  if(err) throw err;
  console.log('OK ' + routerFile);
  console.log(data)
});