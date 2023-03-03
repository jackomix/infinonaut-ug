// Define variables that will be able to be configured
numDimensions = 10


// Runs when the "Generate Universe" button is hit
function begin() {
    console.log("Beginning generation...")

    // Make the datapack zip and make the pack.mcmeta file for it.
    var datapack = new JSZip();
    datapack.file("pack.mcmeta", `
    {
        "pack": {
            "pack_format": 6,
            "description": "Infinonaut Universe"
        }
    }
    `);

    // Run a loop, generate
    dimensionNameHistory = []
    for (var i = 0; i < numDimensions; i++) {
        generateDimension(datapack, nameGen(rn(2,4), dimensionNameHistory))
    }
}


// Begin to generate dimensions
function generateDimension(zip, name) {
    console.log()
}

