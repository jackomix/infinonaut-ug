// Define variables that will be able to be configured
// NOTE: Move these variables to the registry JSON object. Then settings can just be editing the JSON object,
numDimensions = 10


// Begins universe generation. Runs when the "Generate Universe" button is hit
function begin() {
    // Generate a name for the universe
    universeName = nameGen(rn(2,4), [])
    
    // Make the datapack zip and make the pack.mcmeta file for it.
    var datapack = new JSZip();
    datapack.file("pack.mcmeta", `{
        "pack": {
            "pack_format": 6,
            "description": "` + universeName + ` universe"
        }
    }`);

    // Run a loop, generate
    dimensionNameHistory = []
    for (var i = 0; i < numDimensions; i++) {
        generateDimension(datapack, nameGen(rn(2,4), dimensionNameHistory))
    }

    // Export the .zip
    datapack.generateAsync({type:"blob"})
    .then(function (blob) {
        saveAs(blob, universeName + " universe.zip");
    });
}


// Generate and insert a dimension into the given datapack zip
function generateDimension(zip, name) {
    console.log()
}

