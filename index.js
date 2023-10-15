debugMode = false

// Begins universe generation. Runs when the "Generate Universe" button is hit
function begin() {
    processCategories(registry.database.features, registry.featureCategories)

    // Generate a name for the universe
    universeName = nameGen(randomNumber(2,4), [])
    
    // Make the datapack zip and make the pack.mcmeta file for it.
    var datapack = new JSZip()
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
        })
    }
    
}

// Generate and insert a dimension into the given datapack zip
function generateDimension(zip, nameHistory) {
    // Make a JSON object that contains properties that the biome will need to know. Like name, sky color, etc
    dimensionProperties = {}

    // Tags
    dimensionProperties.tags = processTags(registry.tags, "dimension")

    // Generation Settings
    dimensionProperties.biomeDepthBiasInfluence = regValue(registry.biome.default.depthBiasInfluence)
    dimensionProperties.biomeScaleBias = regValue(registry.biome.default.scaleBias)

    // Names
    // Set the dimension's name
    dimensionProperties.dimensionName = nameGen(randomBiasedNumber(1, 4, 2, 0.65), nameHistory)
    // Make a name history array for preventing duplicate names, and for adding biomes to the dimension JSON
    dimensionProperties.biomeNameHistory = []

    // Colors
    // Generate a base color for sky color, then set it to the sky and fog color. We also increase the brightness for the fog color.
    baseSkyColor = randomColor()
    dimensionProperties.skyColor = convertColorToMC(baseSkyColor)
    dimensionProperties.fogColor = convertColorToMC(changeBrightness(randomNumber(0.05, 0.5, 2), baseSkyColor)) //original brightness increase: 0.35
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
    dimension = JSON.parse(JSON.stringify(dimensionBase))

    // Change the seed of the dimension
    dimension.generator.seed = randomNumber(-100000000, 100000000)

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
              altitude: regValue(registry.biome.default.spawning.altitude),
              temperature: regValue(registry.biome.default.spawning.temperature),
              humidity: regValue(registry.biome.default.spawning.humidity),
              weirdness: regValue(registry.biome.default.spawning.weirdness),
              offset: regValue(registry.biome.default.spawning.offset),
            },
        })
    }

    console.log(dimensionProperties)

    // Adds the dimension to the zip file provided
    zip.folder("data")
        .folder(registry.namespace)
        .folder("dimension")
        .file(dimensionProperties.dimensionName + ".json", JSON.stringify(dimension))
}

// Generate and insert a biome into the given datapack zip
function generateBiome(zip, dimensionProperties) {
    // Generate a name for the biome
    biomeName = nameGen(randomBiasedNumber(1, 4, 2, 0.65), dimensionProperties.biomeNameHistory)

    // Copy the biome template object onto the object we'll be editing
    biome = JSON.parse(JSON.stringify(biomeBase))

    // Process tags and include tags contained in the dimension
    biome.tags = dimensionProperties.tags.concat(processTags(registry.tags, "biome", dimensionProperties.tags))

    // Check all biome settings and apply them
    for (const settings in registry.biome) {
        // Define the settings object that will be used
        const settingsObj = registry.biome[settings]

        // Check if tag conditions are met
        if (settings !== "default" && !tagTest(biome.tags, settingsObj)) { continue }

        let dimensionPropertiesObj = settingsObj
        if (settings == "default") {
            dimensionPropertiesObj = dimensionProperties
        }

        // Biome Terrain

        // Because depth's bias influence is seperate, we need to include it in.
        // This is set up in a way to prevent the default biome settings from ignoring the already defined biomeDepthBiasInfluence
        // This does mean however that depth will be re-randomized for every biome setting iteration, 
        // but it doesn't matter as the default values are still used.
        biomeDepthEdited = overwriteCheck(settingsObj.depth, biome.depth) 
        if (settings == "default") {
            biomeDepthEdited[3] = dimensionProperties.biomeDepthBiasInfluence
        } else{
            biomeDepthEdited[3] = overwriteCheck(regValue(dimensionPropertiesObj.biomeDepthBiasInfluence), dimensionProperties.biomeDepthBiasInfluence)
        }
        biome.depth = regValue(biomeDepthEdited)

        // Same procedure as above, but for biome scale instead.
        biomeScaleEdited = overwriteCheck(settingsObj.scale, biome.scale)
        if (settings == "default") {
            biomeScaleEdited[2] = dimensionProperties.biomeScaleBias
        } else {
            biomeScaleEdited[2] = overwriteCheck(regValue(dimensionPropertiesObj.biomeScaleBias), dimensionProperties.biomeScaleBias)
        }
        biome.scale = regValue(biomeScaleEdited)

        // Set the temperature of the biome, this is used for biome placement.
        biome.temperature = overwriteCheck(regValue(settingsObj?.spawning?.temperature), biome.temperature)

        // Colors
        biome.effects.sky_color = overwriteCheck(dimensionPropertiesObj.skyColor, biome.effects.sky_color)
        biome.effects.fog_color = overwriteCheck(dimensionPropertiesObj.fogColor, biome.effects.fog_color)

        biome.effects.water_color = overwriteCheck(dimensionPropertiesObj.waterColor, biome.effects.water_color)
        biome.effects.water_fog_color = overwriteCheck(dimensionPropertiesObj.waterFogColor, biome.effects.water_fog_color)

        biome.effects.grass_color = convertColorToMC(randomColor())
        biome.effects.foliage_color = convertColorToMC(randomColor())
    }

    // Features 
    // dimensionPropertiesCategory is an array containing the category name and the chance percentage deciding in dimension gen
    // Honestly not the most effiecent way to do this but, I think it's good enough.
    for (const dimensionPropertiesCategory of dimensionProperties.featureCategories) {
        const category = registry.featureCategories[dimensionPropertiesCategory[0]]
        const categoryName = dimensionPropertiesCategory[0]
        const categoryDimensionBasedChance = dimensionPropertiesCategory[1]

        // Check if tag conditions are met
        if (!tagTest(biome.tags, category)) { continue }

        // Ignore blacklist
        if (categoryName == "blacklist") { continue }

        // Randomize a percentage and check if the dimension-based category chance wins
        if (randomNumber(0, 100) <= categoryDimensionBasedChance) {
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

                biome.features[featureStep - 1].push(mutableItemList[randomItemIndex])
                mutableItemList.splice(randomItemIndex, 1)
            }
        }
    }

    console.log(biome)
    
    // Adds the biome to the zip file provided
    fileName = dimensionProperties.dimensionName + "_" + biomeName + ".json"
    zip.folder("data").folder(registry.namespace).folder("worldgen") .folder("biome").file(fileName, JSON.stringify(biome))
}

// Process arrays into their respective categories set in the registry
function processCategories(database, categories) {
    // Define our mutableDatabase array that we will manipulate
    let mutableDatabase = [].concat(database)

    // Remove features from mutableDatabase that are specified in categories (including blacklist)
    for (const categoryName in categories) {
        // Ignore the misc category.
        if (categoryName == "misc") { continue }

        mutableDatabase = mutableDatabase.filter((el) => !categories[categoryName].specific.includes(el))
    }

    // Add items to categories using search
    for (const categoryName in categories) {
        // Ignore the misc category.
        if (categoryName == "misc") { continue }

        // Copy the category object to this variable for readability
        const category = categories[categoryName]

        const specific = overwriteCheck(category.specific, [])
        const searchTerms = overwriteCheck(category.searchTerms, [])
        const searchIgnoreTerms = overwriteCheck(category.searchIgnoreTerms, [])
        const searchIgnoreSpecific = overwriteCheck(category.searchIgnoreSpecific, [])

        // Get search of results of search terms
        let searchResults = []
        for (const item of mutableDatabase) {
            for (const searchTerm of searchTerms) {
                if (item.includes(searchTerm)) {
                    searchResults.push(item)
                } 
            }
        }

        // Remove search results containing search ignore terms
        for (const item of searchResults) {
            for (const searchIgnoreTerm of searchIgnoreTerms) {
                if (item.includes(searchIgnoreTerm)) {
                    //searchResults = searchResults.filter(item => item !== item)
                    searchResults.splice(searchResults.indexOf(item), 1)
                }
            }
        }

        // Remove specific items mentioned in searchIgnoreSpecific
        searchResults = searchResults.filter((el) => !searchIgnoreSpecific.includes(el))
        // Remove items already in the categories' specified items list
        searchResults = searchResults.filter((el) => !specific.includes(el))

        // Combine both search results and specific items mentioned to form the categories' final items list.
        category.items = [].concat(specific, searchResults)
        
        // Remove items that we added to categories from the general mutableDatabase, unless said not to by the category
        if (category.keepItemsInDatabase !== true) {
            mutableDatabase = mutableDatabase.filter((el) => !category.items.includes(el))
        }
    }

    // Add everything else to the misc category
    categories.misc.items = mutableDatabase
}

// Processes tags and returns a list of the decided tags
function processTags(tagsObject, tagSetListName, compareTagList) {
    // Define the tag list that we will return
    let tagList = []
    let tagSets = tagsObject[tagSetListName]

   // Go through each tag set, and pick a tag in the set using the determined probabilities
    for (const tagSet in tagSets) {
        // As we will edit tagSetObj, we will duplicate it to prevent reflection
        const tagSetObj = Object.assign({}, tagSets[tagSet])

        // If given a tag list to compare, check tag conditions
        if (compareTagList !== undefined) {
            if (!tagTest(compareTagList, tagSetObj)) { continue }
        }
        // Remove tag entries so they're not mixed up in later code (and skip if they don't exist already)
        delete tagSetObj.tagsInclude
        delete tagSetObj.tagsExclude
        delete tagSetObj.tagsIncludeAll
        delete tagSetObj.tagsExcludeAll

        // This string will be the name decided tag from the tag set
        let decidedTag = ""

        // --- edited chatgpt lol ---
        // Calculate total percentage of all entries
        const totalPercentage = Object.values(tagSetObj).reduce((acc, curr) => acc + curr.percentageChance, 0)
        
        // Generate a random number between 0 and totalPercentage
        const randomNum = Math.random() * totalPercentage
        
        // Iterate over entries and check if random number falls within their percentage range
        let currPercentage = 0
        for (const [key, value] of Object.entries(tagSetObj)) {
            currPercentage += value.percentageChance
            if (randomNum <= currPercentage) {
                decidedTag = key
                break
            }
        }
        // ---

        // Generate and add the final tag label to the tag list
        tagLabel = tagSetListName + "/" + tagSet + "/" + decidedTag
        tagList.push(tagLabel)
    }

    return tagList
}

// Returns true or false if a tag list meets the conditions of a given object with conditions
function tagTest(tagList, conditionObject) {
    //console.warn(tagList)
    //console.warn(conditionObject)

    // Default values, also letting the function return true if no values are there.
    const tagsInclude = overwriteCheck(conditionObject.tagsInclude, [])
    const tagsExclude = overwriteCheck(conditionObject.tagsExclude, [])
    const tagsIncludeAll = overwriteCheck(conditionObject.tagsIncludeAll, false)
    const tagsExcludeAll = overwriteCheck(conditionObject.tagsExcludeAll, false)

    // Get the amount of overlap between given tag list, and the include and exclude lists
    includeOverlap = tagList.filter(i => tagsInclude.includes(i)).length
    excludeOverlap = tagList.filter(i => tagsExclude.includes(i)).length
    
    if ((   
        // Compare with tag include list
        tagsInclude.length == 0 ||
        !tagsIncludeAll && includeOverlap > 0 ||
        tagsIncludeAll && includeOverlap == tagList.length
    ) && (
        // Compare with tag exclude list
        tagsExclude.length == 0 ||
        !tagsExcludeAll && excludeOverlap == 0 ||
        tagsExcludeAll && excludeOverlap < tagList.length
    )) {
        return true
    }
    return false
}