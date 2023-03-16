// This big JSON object contains configurable variables, and list of elements for the system to use during generation.

// to-do
// let dimensions use biomes in general
// default search arrays so you can delete them from registry 
// add tagsDisableCategoriesByDefault
// add "mods are dynamically used by infinonaut, and aren't officially support by their authors"

registry = {
  namespace: "infinonaut", // Namespace used in datapack. Like the "minecraft" in "minecraft:overworld"
  numDimensions: 10, // How many dimensions to generate
  numBiomes: [2, 5, 3, 0.75], // How many biomes to generate per dimension
  tags: {
    dimension: {
      waterLevel: {
        normal: { percentageChance: 25, },
        islands: { percentageChance: 75, },
      }
    },
    biome: {
      depth: {
        tagsExclude: ["dimension/waterLevel/islands"],

        normal: { percentageChance: 75, },
        underwater: { percentageChance: 20, },
        high: { percentageChance: 5, }
      },
      depthIslands: {
        tagsInclude: ["dimension/waterLevel/islands"],

        normal: { percentageChance: 20, },
        underwater: { percentageChance: 75, },
        high: { percentageChance: 5, }
      },
    },
  },
  biome: {
    default: {
      depth: [-0.5, 1.75, 0.125, undefined, 3], // The ground level that a biome is generated at.
      depthBiasInfluence: [0, 1.5, 0.75, 0.65, 2], // The amount of bias influence to use for determining depth. High influence means biomes will match more in depth.
      scale: [0.01, 1.75, undefined, 0.75, 3], // The "roughness" of a biome
      scaleBias: [0.001, 0.75, 0.025, 0.85, 3], // What scale value biomes in a dimension should be biased towards. Low scale bias means biomes with be more flatter.

      spawning: {
        altitude: [0, 0.5, 3],
        temperature: [0, 0.5, 3],
        humidity: [0, 0.5, 3],
        weirdness: [0, 0.5, 3],
        offset: [0, 0.5, 3],
      },
    },
    underwaterDepth: {
      tagsInclude: ["biome/depth/underwater", "biome/depthIslands/underwater"],

      depth: [-2, 0, -1, undefined, 3],
      depthBiasInfluence: 0.75,
    },
    highDepth: {
      tagsInclude: ["biome/depth/high", "biome/depthIslands/high"],

      depth: [0.8, 2.25, 1.5, undefined, 3],
      depthBiasInfluence: 0.7,
    },
  },
  featureCategories: {
    // Categories are dynamic, meaning they can be added or removed just by editing the registry. Except the blacklist and misc category.
    blacklist: {
      tagsDisableCategoriesByDefault: [],

      // Use this category to remove any features from potentially generating.
      searchTerms: ["bracken"], // Search for these terms in the feature list to dynamic add them to the blacklist. Mainly for dynamic mod support.
      searchIgnoreTerms: ["peace"], // Ignore these features if they contain these terms, even if they come up during search.
      searchIgnoreSpecific: [], // Ignore these specific features, even if they come up during search.

      specific: [], // Add these specific features to the blacklist.
    },
    misc: {
      // This category represents any features that weren't added to a category.
      percentageChanceOfSpawning: [10, 100, 75, 0.6], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 6, 3, 0.8], // If decided to spawn features from this category, how many should be used?
      featureStep: 8,
    },

    trees: {
      percentageChanceOfSpawning: [1, 90, 50, 0.85], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 3, 1, 0.9], // If decided to spawn features from this category, how many should be used?
      featureStep: 9,

      tagsExclude: ["biome/depth/underwater"],

      searchTerms: ["tree"], // Search for these terms in the feature list to dynamic add them to this category. Mainly for dynamic mod support.
      searchIgnoreTerms: [], // Ignore these features if they contain these terms, even if they come up during search.
      searchIgnoreSpecific: [], // Ignore these specific features even if they come up during search.

      specific: [
        // Add these specific features.
        "minecraft:trees_birch",
        "minecraft:birch_tall",
        "minecraft:trees_badlands",
        "minecraft:trees_birch",
        "minecraft:trees_giant",
        "minecraft:trees_giant_spruce",
        "minecraft:trees_jungle",
        "minecraft:trees_jungle_edge",
        "minecraft:trees_mountain",
        "minecraft:trees_mountain_edge",
        "minecraft:trees_savanna",
        "minecraft:trees_shattered_savanna",
        "minecraft:trees_snowy",
        "minecraft:trees_swamp",
        "minecraft:birch_tall",
        "minecraft:bamboo",
      ],
    },
  },
  database: {
    mobs: {
      peaceful: [
        //"minecraft:ash",
        "minecraft:bat",
        "minecraft:cat",
        "minecraft:cave_spider",
        "minecraft:chicken",
        "minecraft:cow",
        "minecraft:donkey",
        "minecraft:fox",
        "minecraft:goat",
        "minecraft:horse",
        "minecraft:husk",
        "minecraft:llama",
        "minecraft:mooshroom",
        "minecraft:panda",
        "minecraft:parrot",
        "minecraft:pig",
        "minecraft:polar_bear",
        "minecraft:rabbit",
        "minecraft:sheep",
        "minecraft:turtle",
        //"minecraft:white_ash",
        "minecraft:wolf",
      ],
      water: [
        "minecraft:axolotl",
        "minecraft:cod",
        "minecraft:dolphin",
        "minecraft:pufferfish",
        "minecraft:squid",
        "minecraft:glow_squid",
        "minecraft:ocelot",
        "minecraft:salmon",
        "minecraft:tropical_fish",
      ],
      harmful: [
        "minecraft:drowned",
        "minecraft:enderman",
        //"minecraft:hoglin",
        "minecraft:skeleton",
        "minecraft:slime",
        "minecraft:spider",
        "minecraft:stray",
        "minecraft:witch",
        //"minecraft:vex",
        "minecraft:zombie",
        "minecraft:zombie_villager",
        "minecraft:creeper",
        //"minecraft:ravager",
        //"minecraft:vindicator",
      ],
    },
    surfaces: [
      "minecraft:badlands",
      //"minecraft:basalt_deltas",
      //"minecraft:crimson_forest",
      "minecraft:desert",
      //"minecraft:end",
      //"minecraft:eroded_badlands",
      "minecraft:frozen_ocean",
      //"minecraft:full_sand",
      //"minecraft:giant_tree_taiga",
      "minecraft:grass",
      "minecraft:gravelly_mountain",
      "minecraft:ice_spikes",
      "minecraft:mountain",
      "minecraft:mycelium",
      //"minecraft:nether",
      //"minecraft:nope",
      //"minecraft:ocean_sand",
      "minecraft:shattered_savanna",
      //"minecraft:soul_sand_valley",
      //"minecraft:stone",
      "minecraft:swamp",
      //"minecraft:warped_forest",
      "minecraft:wooded_badlands",
    ],
    features: [
      "minecraft:trees_birch",
      "minecraft:birch_tall",
      "minecraft:trees_badlands",
      "minecraft:trees_birch",
      "minecraft:trees_giant",
      "minecraft:trees_giant_spruce",
      "minecraft:trees_jungle",
      "minecraft:trees_jungle_edge",
      "minecraft:trees_mountain",
      "minecraft:trees_mountain_edge",
      "minecraft:trees_savanna",
      "minecraft:trees_shattered_savanna",
      "minecraft:trees_snowy",
      "minecraft:trees_swamp",
      "minecraft:birch_tall",
      "minecraft:bamboo",

      "minecraft:disk_clay",
      "minecraft:disk_gravel",
      "minecraft:disk_sand",
      "minecraft:ore_andesite",
      "minecraft:ore_clay",
      "minecraft:ore_coal",
      "minecraft:ore_copper",
      "minecraft:ore_deepslate",
    ],
  },
};
