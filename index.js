debugMode = true

// Begins universe generation. Runs when the "Generate Universe" button is hit
function begin() {
    processFeatureCategories()

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

    // - Generation Settings -
    dimensionProperties.biomeDepthBiasInfluence = regValue(registry.biome.depthBiasInfluence)
    dimensionProperties.biomeScaleBias = regValue(registry.biome.scaleBias)

    // - Names -
    // Set the dimension's name
    dimensionProperties.dimensionName = nameGen(randomBiasedNumber(1, 4, 2, 0.65), nameHistory)
    // Make a name history array for preventing duplicate names, and for adding biomes to the dimension JSON
    dimensionProperties.biomeNameHistory = []

    // - Colors  -
    // Generate a base color for sky color, then set it to the sky and fog color. We also increase the brightness for the fog color.
    baseSkyColor = randomColor()
    dimensionProperties.skyColor = convertColorToMC(baseSkyColor)
    dimensionProperties.fogColor = convertColorToMC(changeBrightness(0.35, baseSkyColor))
    // Do the same for water
    baseWaterColor = randomColor()
    dimensionProperties.waterColor = convertColorToMC(baseWaterColor)
    dimensionProperties.waterFogColor = convertColorToMC(changeBrightness(-0.25, baseWaterColor))

    // Feature Parsing
    // Decide the spawning chance for each category.
    dimensionProperties.featureCategories = []
    for (const categoryName in registry.featureCategories) {
        dimensionProperties.featureCategories.push([categoryName, regValue(registry.featureCategories[categoryName].percentageChanceOfSpawning)])
    }

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

    console.log(dimensionProperties)

    // Adds the dimension to the zip file provided
    zip.folder("data")
        .folder(registry.namespace)
        .folder("dimension")
        .file(dimensionProperties.dimensionName + ".json", JSON.stringify(dimension));
}

// Generate and insert a biome into the given datapack zip
function generateBiome(zip, dimensionProperties) {
    // Generate a name for the biome
    biomeName = nameGen(randomBiasedNumber(1, 4, 2, 0.65), dimensionProperties.biomeNameHistory)

    // Copy the biome template object onto the object we'll be editing
    biome = JSON.parse(JSON.stringify(biomeBase))

    // Biome Terrain
    biomeDepthEdited = regValue(registry.biome.depth)
    biomeDepthEdited[2] = regValue(dimensionProperties.biomeDepthBiasInfluence)
    biome.depth = regValue(biomeDepthEdited)

    biomeScaleEdited = regValue(registry.biome.scale)
    biomeScaleEdited[2] = regValue(dimensionProperties.biomeScaleBias)
    biome.scale = regValue(biomeScaleEdited)

    // Set the temperature of the biome, this is used for biome placement.
    biome.temperature = regValue(registry.biome.spawning.temperature)

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

// Sort the list of features in registry.database into their feature categories 
function processFeatureCategories() {
    // Define our featureDatabase array that we will manipulate
    featureDatabase = registry.database.features

    // Remove specific features mentioned in the blacklist
    featureDatabase = featureDatabase.filter((el) => !registry.featureCategories.blacklist.specificFeatures.includes(el));

    // Go through the categories (besides misc), and add specific features, then add search terms.
    for (const categoryName in registry.featureCategories) {
        // Ignore the misc category.
        if (categoryName == "misc") { continue; }

        // Copy the category object to this variable for readability
        const category = registry.featureCategories[categoryName]

        // Get search of results of search terms
        let searchResults = []
        for (const feature of featureDatabase) {
            for (const searchTerm of category.searchTerms) {
                if (feature.includes(searchTerm)) {
                    searchResults.push(feature)
                } 
            }
        }

        // Remove search results containing search ignore terms
        for (const feature of searchResults) {
            for (const searchIgnoreTerm of category.searchIgnoreTerms) {
                if (feature.includes(searchIgnoreTerm)) {
                    searchResults = searchResults.filter(item => item !== feature)
                } 
            }
        }

        // Remove specific features mentioned in searchIgnoreSpecificFeatures
        searchResults = searchResults.filter((el) => !category.searchIgnoreSpecificFeatures.includes(el));
        // Remove features already in the categories' specified features list
        searchResults = searchResults.filter((el) => !category.specificFeatures.includes(el));

        // Combine both search results and specific features mentioned to form the categories' final features list.
        registry.featureCategories[categoryName].features = [].concat(category.specificFeatures, searchResults)
        
        // Remove features that we added to categories from the general featureDatabase
        featureDatabase = featureDatabase.filter((el) => !registry.featureCategories[categoryName].features.includes(el));
    }

    // Add everything else to the misc category
    registry.featureCategories.misc.features = featureDatabase

    console.log(registry.featureCategories)
}