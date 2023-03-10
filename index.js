debugMode = false

// Begins universe generation. Runs when the "Generate Universe" button is hit
function begin() {
    processCategories(registry.database.features, registry.featureCategories)

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
    for (let i = 0; i < registry.numDimensions; i++) {
        // Loop the generate dimension function, we pass the history of dimension names to prevent duplicate names
        generateDimension(datapack, dimensionNameHistory)
    }

    // Export the .zip
    if (!debugMode) {
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
    for (let i = 0; i < numBiomes; i++) {
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

    // Features
    
    // dimensionPropertiesCategory is the array containing the category name and the chance percentage deciding in dimension gen
    // Honestly not the most effiecent way to do this but, I think it's good enough.
    for (const dimensionPropertiesCategory of dimensionProperties.featureCategories) {
        const category = registry.featureCategories[dimensionPropertiesCategory[0]]
        const categoryName = dimensionPropertiesCategory[0]
        const categoryDimensionBasedChance = dimensionPropertiesCategory[1]

        // Ignore blacklist
        if (categoryName == "blacklist") { continue; }

        // Randomize a percentage and check if the dimension-based category chance wins
        if (categoryDimensionBasedChance <= randomNumber(0, 100)) {
            // Make a mutable list of the categories' items and check how many to take form that list
            const mutableItemList = category.items
            const howManyItemsToTake = regValue(category.selectionAmount)
            const featureStep = regValue(category.featureStep) // regValue if someone wants to randomize this for some reason lol
            let randomItemIndex = 0
            
            // Repeating, take out an item from the categories' item list and put it into the biome's feature step
            // If list runs out before the entire repeating process is complete, just move on
            for (let itemTakingIndex = 0; itemTakingIndex < howManyItemsToTake; itemTakingIndex++) {
                if (mutableItemList.length <= 0) { break }

                randomItemIndex = randomNumber(0, mutableItemList.length - 1)

                console.log(biome.features)
                biome.features[featureStep - 1].push(mutableItemList[randomItemIndex])
                mutableItemList.splice(randomItemIndex, 1)
            }
        }
    }

    console.log(biome)

    // Adds the biome to the zip file provided
    fileName = dimensionProperties.dimensionName + "_" + biomeName + ".json"
    zip.folder("data").folder(registry.namespace).folder("worldgen") .folder("biome").file(fileName, JSON.stringify(biome));
}

// Process arrays into their respective categories set in the registry
function processCategories(database, categories) {
    // Define our mutableDatabase array that we will manipulate
    mutableDatabase = database

    // Remove features from mutableDatabase that are specified in categories (including blacklist)
    for (const categoryName in categories) {
        if (categoryName == "misc") { continue; }
        mutableDatabase = mutableDatabase.filter((el) => !categories[categoryName].specific.includes(el));
    }

    // Add items to categories using search
    for (const categoryName in categories) {
        // Ignore the misc category.
        if (categoryName == "misc") { continue; }

        // Copy the category object to this variable for readability
        const category = categories[categoryName]

        // Get search of results of search terms
        let searchResults = []
        for (const item of mutableDatabase) {
            for (const searchTerm of category.searchTerms) {
                if (item.includes(searchTerm)) {
                    searchResults.push(feature)
                } 
            }
        }

        // Remove search results containing search ignore terms
        for (const item of searchResults) {
            for (const searchIgnoreTerm of category.searchIgnoreTerms) {
                if (item.includes(searchIgnoreTerm)) {
                    searchResults = searchResults.filter(item => item !== item)
                } 
            }
        }

        // Remove specific items mentioned in searchIgnoreSpecific
        searchResults = searchResults.filter((el) => !category.searchIgnoreSpecific.includes(el));
        // Remove items already in the categories' specified items list
        searchResults = searchResults.filter((el) => !category.specific.includes(el));

        // Combine both search results and specific items mentioned to form the categories' final items list.
        category.items = [].concat(category.specific, searchResults)
        
        // Remove items that we added to categories from the general mutableDatabase
        mutableDatabase = mutableDatabase.filter((el) => !category.items.includes(el));
    }

    // Add everything else to the misc category
    categories.misc.items = mutableDatabase
}