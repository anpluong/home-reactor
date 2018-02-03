/* 
This script helps to allow developers that don't care about the live thumbnail data
to just have to make the devmodules folder - then we will dynamically add the route
file to the other folder for them. As long as all files have unique names it should work
easy enough
- should make it easier to develop on our platform
*/

/* ----------------NOTE TO SELF
small bug if the file already exists because it's not checking for "thumb"
need to do toLowerCase() on both arrays. then slice last 5 (Thumb) fromeach thumbnail item
then check the differences
*/
const fs = require('fs');
const path = require('path');
const devmodulesFolder = '../src/devmodules';
const devthumbnailsFolder = '../src/devthumbnails';

// first, IF devmodules directory exists , check to see if devthumbnails exists
if(fs.existsSync(devmodulesFolder)){ // if neither folder exists, just proceed to exit script.
  // if not, make devthumbnails.
  if(!fs.existsSync(devthumbnailsFolder)){
    fs.mkdirSync(path.join(__dirname,devthumbnailsFolder))
  }
  const getDirectories = (srcPath, outputFolders, outputFiles) => {
    fs.readdirSync(srcPath).filter(file => {
      if(fs.statSync(path.join(srcPath, file)).isDirectory() === true){
        outputFolders.push(file)
      }else if(fs.statSync(path.join(srcPath, file)).isFile() === true){
        if(!file.includes('.png'||'.PNG'||'.css')){
          outputFiles.push(file)
        }
      }else{
        console.log('neither file or folder, the fuck\' did you give me? :)' )
      }
    })
    outputFolders.concat(outputFiles);
  }
  let modFolders = []; let modFiles = []; let thumbFolders = []; let thumbFiles = [];
  //check the # of folders in devmodules
  // also log the name of each in a devmodulesArr
  getDirectories(devmodulesFolder, modFolders, modFiles)
  // check the # of folders in devthumbnails + # of files in devthumbnails
  // also log the name of each in a devthumbnailsArr
  getDirectories(devthumbnailsFolder, thumbFolders, thumbFiles)
  let modLength = modFolders.length;
  let thumbLength = thumbFolders.length;
  // perform above section for both the Sample and Developers files/folders
    // if the numbers match - exit
  if(modLength !== thumbLength){
    // if the numbers don't match, loop through the arrays 
    modFolders.forEach(folder =>{
      let fileToAdd = folder.charAt(0).toUpperCase() + folder.slice(1); 
      let fileToAddThumb = fileToAdd+'Thumb';
      console.log('fileToAdd: ', folder, '\n');
      if(thumbFolders.indexOf(folder)=== -1){
         // create a .jsx file with that devmodulesArr[i] name
        fs.writeFile(path.join(__dirname, devthumbnailsFolder,fileToAddThumb+'.jsx'),
`import React, { Component } from 'react'

class ${fileToAddThumb} extends Component {

  render() {
    return(
      <div className="default-thumb">
        <h2 className="default-thumb-h">${fileToAdd}</h2>
      </div>
      )
    }
  }
export default ${fileToAddThumb}
`
            ,function(err){
                if(err) throw err;
        });
      }
    })
  }

    // make it a makes react component with 
    // let fileToAdd = devmodulesArr[i]
}