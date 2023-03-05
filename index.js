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
    }`)

    // Run a loop, generate
    dimensionNameHistory = []
    for (var i = 0; i < registry.numDimensions; i++) {
        // Loop the generate dimension function, we pass the history of dimension names to prevent duplicate names
        generateDimension(datapack, dimensionNameHistory)
    }

    /*
    // Export the .zip
    datapack.generateAsync({type:"blob"})
    .then(function(blob) {
        saveAs(blob, universeName + " universe.zip")
    });
    */
}


// Generate and insert a dimension into the given datapack zip
function generateDimension(zip, nameHistory) {
    // Make a JSON object that contains properties that the biome will need to know. Like name, sky color, etc
    dimensionProperties = {}

    // Set the dimension's name
    dimensionProperties.dimensionName = nameGen(rb(1, 4, 2, 0.65), nameHistory)

    // Generate a base color for sky color, then set it to the sky and fog color. We also increase the brightness for the fog color.
    baseSkyColor = randomColor()
    dimensionProperties.skyColor = convertColorToMC(baseSkyColor)
    dimensionProperties.fogColor = convertColorToMC(changeBrightness(0.5, baseSkyColor))

    // Decide how many biomes to generate
    numBiomes = rbArray(registry.numBiomes)
    for (var i = 0; i < numBiomes; i++) {
        generateBiome(zip, name, dimensionProperties)
    }
}

function generateBiome(zip, name, dimProp) {
    
}