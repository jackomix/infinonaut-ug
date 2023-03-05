debugMode = false

// Begins universe generation. Runs when the "Generate Universe" button is hit
function begin() {
    // Generate a name for the universe
    universeName = nameGen(randomNumber(2,4), [])
    
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

    // Export the .zip
    if (debugMode !== true) {
        datapack.generateAsync({type:"blob"})
        .then(function(blob) {
            saveAs(blob, universeName + " universe.zip")
        });
    }
    
}


// Generate and insert a dimension into the given datapack zip
function generateDimension(zip, nameHistory) {
    // Make a JSON object that contains properties that the biome will need to know. Like name, sky color, etc
    dimensionProperties = {}

    // Names
    // Set the dimension's name
    dimensionProperties.dimensionName = nameGen(randomBiasedNumber(1, 4, 2, 0.65), nameHistory)
    // Make a name history array for preventing duplicate names, and for adding biomes to the dimension JSON
    dimensionProperties.biomeNameHistory = []

    // Colors
    // Generate a base color for sky color, then set it to the sky and fog color. We also increase the brightness for the fog color.
    baseSkyColor = randomColor()
    dimensionProperties.skyColor = convertColorToMC(baseSkyColor)
    dimensionProperties.fogColor = convertColorToMC(changeBrightness(0.5, baseSkyColor))

    // Do the same for water
    baseWaterColor = randomColor()
    dimensionProperties.waterColor = convertColorToMC(baseWaterColor)
    dimensionProperties.waterFogColor = convertColorToMC(changeBrightness(-0.25, baseWaterColor))

    // Copy the dimension template object onto the object we'll be editing
    dimension = JSON.parse(JSON.stringify(dimensionBase));

    // Generate biomes and add them to the biome_source list in the dimension object
    numBiomes = regValue(registry.numBiomes)
    for (var i = 0; i < numBiomes; i++) {
        // Generate the biome
        generateBiome(zip, dimensionProperties)

        // Get the last generated biome's name
        lastBiomeName = dimensionProperties.biomeNameHistory[dimensionProperties.biomeNameHistory.length - 1]
        // Add the biome to the dimension object
        dimension.generator.biome_source.biomes.push({
            biome: registry.namespace + ":" + dimensionProperties.dimensionName + "_" + lastBiomeName,
            parameters: {
              altitude: regValue(registry.biome.spawning.altitude),
              temperature: regValue(registry.biome.spawning.temperature),
              humidity: regValue(registry.biome.spawning.humidity),
              weirdness: regValue(registry.biome.spawning.weirdness),
              offset: regValue(registry.biome.spawning.offset),
            },
        })

    }

    /*
    {
          biome: "minecraft:plains",
          parameters: {
            altitude: 0,
            temperature: 0,
            humidity: 0,
            weirdness: 0,
            offset: 0,
          },
        },
        */

    // Adds the dimension to the zip file provided
    zip.folder("data")
        .folder(registry.namespace)
        .folder("dimension")
        .file(dimensionProperties.dimensionName + ".json", JSON.stringify(dimension));
}

function generateBiome(zip, dimensionProperties) {
    // Generate a name for the biome
    biomeName = nameGen(randomBiasedNumber(1, 4, 2, 0.65), dimensionProperties.biomeNameHistory)

    // Copy the biome template object onto the object we'll be editing
    biome = JSON.parse(JSON.stringify(biomeBase))



    // Biome Terrain
    biome.depth = regValue(registry.biome.depth)
    biome.scale = regValue(registry.biome.scale)

    // Colors
    biome.effects.sky_color = dimensionProperties.skyColor
    biome.effects.fog_color = dimensionProperties.fogColor

    biome.effects.water_color = dimensionProperties.waterColor
    biome.effects.water_fog_color = dimensionProperties.waterFogColor

    biome.effects.grass_color = convertColorToMC(randomColor())
    biome.effects.foliage_color = convertColorToMC(randomColor())

    // Adds the biome to the zip file provided
    fileName = dimensionProperties.dimensionName + "_" + biomeName + ".json"
    zip.folder("data").folder(registry.namespace).folder("worldgen") .folder("biome").file(fileName, JSON.stringify(biome));
}