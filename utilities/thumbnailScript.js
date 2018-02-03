const fs = require('fs');
const path = require('path');
const dir = '../src/thumbnails';
const dirDev = '../src/devthumbnails';
// create LeftScroll file
let fileName = 'LeftScroll.jsx'
let fullPath = '../src/' + fileName;
let leftScrollFile = path.join(__dirname, fullPath);

let fileArr = [];
let folderArr = [];
let fileArrDev = [];
let folderArrDev = [];

// ------------------------------------------------
/*
Solving the file AND folder possibility problem
1 - readdirSync - count files - push to fileArr
2 - readfileSync? Count folders

*/
const getDirectories = (srcPath, outputFolders, outputFiles) => {
  fs.readdirSync(srcPath).filter(file => {
    if(fs.statSync(path.join(srcPath, file)).isDirectory() === true){
      outputFolders.push(file)
    }else if(fs.statSync(path.join(srcPath, file)).isFile() === true){
      if(!file.includes('.png'||'.css')){
        outputFiles.push(file)
      }
    }else{
      console.log('neither file or folder, the fuck\' did you give me? :)' )
    }
  })
}
// perform above section for both the Sample and Developers files/folders
getDirectories(dir, folderArr, fileArr);
if(fs.existsSync(dirDev)){
  getDirectories(dirDev, folderArrDev, fileArrDev)
}

// create import strings that will be needed
const strArrStaticImport = [
  "import React, { Component } from 'react';\n",
  "import { render } from 'react-dom';\n",
  "import { Switch, Route, Link } from 'react-router-dom';\n",
  "import './thumbnails.css';\n"
]

const strArrStaticOpen = [
  "\n",
  "class LeftScroll extends Component {\n",
  "  render() {\n",
  "    return(\n",
  "      <div>\n",
]

// static closing statements
const strArrClose = [
  "      </div>\n",
  "    )\n",
  "  }\n",
  "}\n",
  "export default LeftScroll;\n"
]

// ---------------------------------------------------------------------
// create the "imports" and "Links" statements for the PRELOADED elements

let strArrDynamicImport = [];
let strArrDynamicLink = [];
// First, do it for all the folders, with embedded .jsx files
// will be of the format: ex: mapsThumb/MapsThumb.jsx
// NOTE TO SELF - add smarts for seeing case (ex: regex see Thumb/ or something)
folderArr.forEach(folder => {  // Slice folder names down to correct import/link formats
  let currThumbFolder = folder.slice(0,folder.length)
  let currThumb = folder.slice(0,folder.length) // name of the .jsx file inside folder
  let curr = folder.slice(0,folder.length-5)
  let currLower = curr.toLowerCase();
  let uppered = currThumb.charAt(0).toUpperCase() + currThumb.slice(1); 
  let currImportStr = `import ${uppered} from './thumbnails/${currThumbFolder}/${uppered}'\n`
  strArrDynamicImport.push(currImportStr)
  let currLinkStr = `        <a><Link to={'/${currLower}'}>\n` +
                     `          <${uppered} />\n` +
                     `        </Link></a>\n`
  strArrDynamicLink.push(currLinkStr)
})
// Then, do it for all the singular .jsx files
fileArr.forEach(file => {  // Slice file names down to correct import/link formats
  let currThumb = file.slice(0,file.length-4)
  let curr = file.slice(0,file.length-9)
  let currLower = curr.toLowerCase();
  let uppered = currThumb.charAt(0).toUpperCase() + currThumb.slice(1); 
  let currImportStr = `import ${uppered} from './thumbnails/${currThumb}'\n`
  strArrDynamicImport.push(currImportStr)
  let currLinkStr = `        <a><Link to={'/${currLower}'}>\n` +
                     `          <${uppered} />\n` +
                     `        </Link></a>\n`
  strArrDynamicLink.push(currLinkStr)
})

// ---------------------------------------------------------------------------
// create the "imports" and "Links" statements for the DEVELOPER added elements
let strArrDynamicImportDev = [];
let strArrDynamicLinkDev = [];
// First, do it for all the folders, with embedded .jsx files
folderArrDev.forEach(folder => {  // Slice folder names down to correct import/link formats
  // let currThumbFolder = folder.slice(0,folder.length-5) // not sure why I was slicing 5 (Thumb?)
  let currThumbFolder = folder.slice(0,folder.length)
  let currThumb = folder.slice(0,folder.length) // name of the .jsx file inside folder
  let curr = folder.slice(0,folder.length-5)
  let currLower = curr.toLowerCase();
  let uppered = currThumbFolder.charAt(0).toUpperCase() + currThumbFolder.slice(1); 
  let currImportStr = `import ${uppered} from './devthumbnails/${currThumbFolder}/${uppered}'\n`
  strArrDynamicImport.push(currImportStr)
  let currLinkStr = `        <a><Link to={'/${currLower}'}>\n` +
                     `          <${uppered} />\n` +
                     `        </Link></a>\n`
  strArrDynamicLink.push(currLinkStr)
})
// Then, do it for all the singular .jsx files
fileArrDev.forEach(fileDev => {  // Slice file names down to correct import/link formats
  let currThumb = fileDev.slice(0,fileDev.length-4)
  let curr = fileDev.slice(0,fileDev.length-9)
  let currLower = curr.toLowerCase();
  let uppered = currThumb.charAt(0).toUpperCase() + currThumb.slice(1); 
  let currImportStrDev = `import ${uppered} from './devthumbnails/${currThumb}'\n`
  strArrDynamicImportDev.push(currImportStrDev)
  let currLinkStrDev = `        <a><Link to={'/${currLower}'}>\n` +
                     `          <${uppered} />\n` +
                     `        </Link></a>\n`
  strArrDynamicLinkDev.push(currLinkStrDev)
})





// getting leftScroll location from top of file
// delete old file if it exists
console.log('leftScrollFile: ', leftScrollFile, '\n');
if (fs.existsSync(leftScrollFile)) {
  fs.unlinkSync(leftScrollFile)
}

// import the first known needed modules;
for(let i = 0; i < strArrStaticImport.length; i++){
  fs.appendFileSync(leftScrollFile, strArrStaticImport[i], function(err){
    if(err) throw err;
  });
}
// import the regular modules
for(let i = 0; i < strArrDynamicImport.length; i++){
  fs.appendFileSync(leftScrollFile, strArrDynamicImport[i], function(err){
    if(err) throw err;
  });
}
// import the developer modules
for(let i = 0; i < strArrDynamicImportDev.length; i++){
  fs.appendFileSync(leftScrollFile, strArrDynamicImportDev[i], function(err){
    if(err) throw err;
  });
}

// being the react router switch statement 
for(let i = 0; i < strArrStaticOpen.length; i++){
  fs.appendFileSync(leftScrollFile, strArrStaticOpen[i], function(err){
    if(err) throw err;
  });
}
// add the developer modules to the switch statement  
console.log(strArrDynamicLink);
for(let i = 0; i < strArrDynamicLink.length; i++){
  fs.appendFileSync(leftScrollFile, strArrDynamicLink[i], function(err){
    if(err) throw err;
  });
}
console.log(strArrDynamicLinkDev);
for(let i = 0; i < strArrDynamicLinkDev.length; i++){
  fs.appendFileSync(leftScrollFile, strArrDynamicLinkDev[i], function(err){
    if(err) throw err;
  });
}

for(let i = 0; i < strArrClose.length; i++){
  fs.appendFileSync(leftScrollFile, strArrClose[i], function(err){
    if(err) throw err;
  });}


fs.readFile(leftScrollFile, 'utf8', function(err,data){
  if(err) throw err;
  console.log('OK \n' + leftScrollFile);
  console.log(data)
});
