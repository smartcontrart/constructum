require('dotenv').config()
const fs = require('fs')

module.exports = async function() {

    var fs = require('fs');
    var files = fs.readdirSync('./ContractData/Art/visuals');
    console.log(files)

    // Inner/Outer/Decoration

    var mapping = {
        inner:{
            'black': '0',
            'white': '1',
            'blue': '2',
            'green': '3',
            'pink': '4'
        },
        outer:{
            '6d': '0',
            '10d': '1',
            '10r': '2',
            '15d': '3',
            'donut': '4',
        },
        decoration: {
            'circles': '0',
            'flow': '1',
            'intersection': '2',
            'spheres': '3',
            'squares': '4',
        }
    }

    // for(let fileCounter = 0; fileCounter < files.length; fileCounter ++){
    //     let ext = files[fileCounter].split('.')[1]
    //     if( ext === 'jpg'){
    //         console.log('ASSHOLE')
    //     }
    // }



    // let renameCounter = 0
    for(let fileCounter = 0; fileCounter < files.length; fileCounter ++){
        let fileName = files[fileCounter].split('.')[0]
        let ext = files[fileCounter].split('.')[1]
        if(ext !== 'mp4'){
            console.log(`${fileName} is not an mp4`)
        }else{
            let outer = fileName.split('_')[0]
            let inner = fileName.split('_')[1]
            let decoration = fileName.split('_')[2]
            if(mapping['inner'][inner] && mapping['outer'][outer] && mapping['decoration'][decoration]){
                let newName = mapping['inner'][inner] + mapping['outer'][outer] + mapping['decoration'][decoration] + '.' + ext
                fs.rename(`./ContractData/Art/visuals/${files[fileCounter]}`, `./ContractData/Art/visuals/${newName}`, ()=>{console.log(`file renamed`)})
            }
        }
    }
        // if(ext === 'png' || ext === 'jpg'){
            // 
            // renameCounter++;
        // }
    // }



}

