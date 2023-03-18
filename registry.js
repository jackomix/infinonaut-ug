// This big JSON object contains configurable variables, and list of elements for the system to use during generation.

// to-do
// let dimensions use biomes in general
// default search arrays so you can delete them from registry 
// add tagsDisableCategoriesByDefault
// add "mods are dynamically used by infinonaut, and aren't officially support by their authors"
// tag based biome settings `depthbiasinfluence` isn't static across biomes of a dimension

/*

trees
treesExotic
foliage
flowers
lakes
ores
stone_clusters
underground
nether
end
underwater

*/

registry = {
  namespace: "infinonaut", // Namespace used in datapack. Like the "minecraft" in "minecraft:overworld"
  numDimensions: 10, // How many dimensions to generate
  numBiomes: [2, 5, 3, 0.75], // How many biomes to generate per dimension
  tags: {
    dimension: {
      waterLevel: {
        normal: { percentageChance: 90 },
        islands: { percentageChance: 10 },
      },
    },
    biome: {
      depth: {
        tagsExclude: ["dimension/waterLevel/islands"],

        normal: { percentageChance: 85 },
        underwater: { percentageChance: 10 },
        high: { percentageChance: 5 },
      },
      depthIslands: {
        tagsInclude: ["dimension/waterLevel/islands"],

        normal: { percentageChance: 30 },
        underwater: { percentageChance: 65 },
        high: { percentageChance: 5 },
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
      searchTerms: [], // Search for these terms in the feature list to dynamic add them to the blacklist. Mainly for dynamic mod support.

      specific: [
        "minecraft:bonus_chest",
        
        "minecraft:oak",
        "minecraft:birch",
        "minecraft:dark_oak",
        "minecraft:birch",
        "minecraft:spruce",
        "minecraft:pine",

        "minecraft:birch_other",
        "minecraft:spruce_snowy",

        "minecraft:birch_bees_0002",
        "minecraft:birch_bees_002",
        "minecraft:birch_bees_005",
        "minecraft:end_gateway",
        "minecraft:end_gateway_delayed",
        "minecraft:forest_flower_trees",
        "minecraft:fancy_oak_bees_0002",
        "minecraft:fancy_oak_bees_002",
        "minecraft:fancy_oak_bees_005",
        "minecraft:oak_bees_0002",
        "minecraft:oak_bees_002",
        "minecraft:oak_bees_005",
        "minecraft:super_birch_bees_0002",
        "minecraft:trees_water",

        "minecraft:ore_infested",
      ],
    },
    misc: {
      // This category represents any features that weren't added to a category.
      percentageChanceOfSpawning: [10, 100, 75, 0.6], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 6, 3, 0.8], // If decided to spawn features from this category, how many should be used?
      featureStep: 8,
    },

    groundClusters: {
      percentageChanceOfSpawning: [1, 70, 20, 0.85], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 3, 1, 0.85], // If decided to spawn features from this category, how many should be used?
      featureStep: 7,

      searchTerms: ["disk", "andesite", "diorite", "granite"], // Search for these terms in the feature list to dynamic add them to this category. Mainly for dynamic mod support.

      specific: [
        "minecraft:ore_andesite",
        "minecraft:ore_diorite",
        "minecraft:ore_dirt",
        "minecraft:ore_granite",
        "minecraft:ore_gravel",

        "minecraft:disk_clay",
        "minecraft:disk_gravel",
        "minecraft:disk_sand",
      ],
    },
    ores: {
      percentageChanceOfSpawning: [1, 80, 40, 0.8], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 4, 1, 0.9], // If decided to spawn features from this category, how many should be used?
      featureStep: 7,

      searchTerms: ["ore"], // Search for these terms in the feature list to dynamic add them to this category. Mainly for dynamic mod support.

      specific: [
        "minecraft:ore_coal",
        "minecraft:ore_copper",
        "minecraft:ore_diamond",
        "minecraft:ore_emerald",
        "minecraft:ore_gold",
        "minecraft:ore_gold_extra",
        "minecraft:ore_iron",
        "minecraft:ore_lapis",
        "minecraft:ore_redstone",
      ],
    },

    lakes: {
      percentageChanceOfSpawning: [1, 30, 10, 0.8], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 2, 1, 0.95], // If decided to spawn features from this category, how many should be used?
      featureStep: 2,

      searchTerms: ["lake"], // Search for these terms in the feature list to dynamic add them to this category. Mainly for dynamic mod support.

      specific: [
        "minecraft:lake_lava",
        "minecraft:lake_water",
      ],
    },

    trees: {
      percentageChanceOfSpawning: [1, 90, 50, 0.85], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 3, 1, 0.9], // If decided to spawn features from this category, how many should be used?
      featureStep: 9,

      tagsExclude: ["biome/depth/underwater", "biome/depthIslands/underwater"],

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
      ],
    },
    foliage: {
      percentageChanceOfSpawning: [1, 90, 60, 0.80], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 3, 1, 0.85], // If decided to spawn features from this category, how many should be used?
      featureStep: 9,

      tagsExclude: ["biome/depth/underwater", "biome/depthIslands/underwater"],

      searchTerms: ["patch"],

      specific: [
        "minecraft:dark_forest_vegetation_brown",
        "minecraft:dark_forest_vegetation_red",
        "minecraft:forest_flower_vegetation",
        "minecraft:forest_flower_vegetation_common",
        "minecraft:patch_grass_badlands",
        "minecraft:patch_grass_forest",
        "minecraft:patch_grass_jungle",
        "minecraft:patch_grass_normal",
        "minecraft:patch_grass_plain",
        "minecraft:patch_grass_savanna",
        "minecraft:patch_grass_taiga",
        "minecraft:patch_grass_taiga_2",
        "minecraft:patch_taiga_grass",
        "minecraft:patch_tall_grass",
        "minecraft:patch_tall_grass_2",
        "minecraft:plain_vegetation",
        "minecraft:taiga_vegetation",
      ],
    },
    foliageExotic: {
      percentageChanceOfSpawning: [1, 70, 20, 0.9], // Applied to all biomes within one dimension, what are the chances that this feature category will spawn?
      selectionAmount: [1, 2, 1, 0.8], // If decided to spawn features from this category, how many should be used?
      featureStep: 9,

      tagsExclude: ["biome/depth/underwater", "biome/depthIslands/underwater"],

      searchTerms: ["flower"], // Search for these terms in the feature list to dynamic add them to this category. Mainly for dynamic mod support.

      specific: [
        "minecraft:bamboo_vegetation",
        "minecraft:crimson_forest_vegetation",
        "minecraft:flower_default",
        "minecraft:flower_forest",
        "minecraft:flower_plain",
        "minecraft:flower_plain_decorated",
        "minecraft:flower_swamp",
        "minecraft:flower_warm",
        "minecraft:mushroom_field_vegetation",
        "minecraft:nether_sprouts",
        "minecraft:patch_berry_bush",
        "minecraft:patch_berry_decorated",
        "minecraft:patch_berry_sparse",
        "minecraft:patch_cactus",
        "minecraft:patch_cactus_decorated",
        "minecraft:patch_cactus_desert",
        "minecraft:patch_dead_bush",
        "minecraft:patch_dead_bush_2",
        "minecraft:patch_dead_bush_badlands",
        "minecraft:patch_crimson_roots",
        "minecraft:patch_large_fern",
        "minecraft:patch_melon",
        "minecraft:patch_pumpkin",
        "minecraft:patch_sugar_cane",
        "minecraft:patch_sugar_cane_badlands",
        "minecraft:patch_sugar_cane_desert",
        "minecraft:patch_sugar_cane_swamp",
        "minecraft:patch_sunflower",
        "minecraft:pile_hay",
        "minecraft:pile_melon",
        "minecraft:pile_pumpkin",
        "minecraft:twisting_vines",
        "minecraft:vines",
        "minecraft:warped_forest_vegetation",
      ],
    },
  },
  database: {
    mobs: {
      peaceful: [
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
        "minecraft:hoglin",
        "minecraft:skeleton",
        "minecraft:slime",
        "minecraft:spider",
        "minecraft:stray",
        "minecraft:witch",
        "minecraft:vex",
        "minecraft:zombie",
        "minecraft:zombie_villager",
        "minecraft:creeper",
        "minecraft:ravager",
        "minecraft:vindicator",
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
      "minecraft:acacia",
      "minecraft:amethyst_geode",
      "minecraft:bamboo",
      "minecraft:bamboo_light",
      "minecraft:bamboo_vegetation",
      "minecraft:basalt_blobs",
      "minecraft:basalt_pillar",
      "minecraft:birch",
      "minecraft:birch_bees_0002",
      "minecraft:birch_bees_002",
      "minecraft:birch_bees_005",
      "minecraft:birch_other",
      "minecraft:birch_tall",
      "minecraft:blackstone_blobs",
      "minecraft:blue_ice",
      "minecraft:bonus_chest",
      "minecraft:brown_mushroom_giant",
      "minecraft:brown_mushroom_nether",
      "minecraft:brown_mushroom_normal",
      "minecraft:brown_mushroom_swamp",
      "minecraft:brown_mushroom_taiga",
      "minecraft:chorus_plant",
      "minecraft:crimson_forest_vegetation",
      "minecraft:crimson_fungi",
      "minecraft:crimson_fungi_planted",
      "minecraft:dark_forest_vegetation_brown",
      "minecraft:dark_forest_vegetation_red",
      "minecraft:dark_oak",
      "minecraft:delta",
      "minecraft:desert_well",
      "minecraft:disk_clay",
      "minecraft:disk_gravel",
      "minecraft:disk_sand",
      "minecraft:dripstone_cluster",
      "minecraft:end_gateway",
      "minecraft:end_gateway_delayed",
      "minecraft:end_island",
      "minecraft:end_island_decorated",
      "minecraft:end_spike",
      "minecraft:fancy_oak",
      "minecraft:fancy_oak_bees_0002",
      "minecraft:fancy_oak_bees_002",
      "minecraft:fancy_oak_bees_005",
      "minecraft:flower_default",
      "minecraft:flower_forest",
      "minecraft:flower_plain",
      "minecraft:flower_plain_decorated",
      "minecraft:flower_swamp",
      "minecraft:flower_warm",
      "minecraft:forest_flower_trees",
      "minecraft:forest_flower_vegetation",
      "minecraft:forest_flower_vegetation_common",
      "minecraft:forest_rock",
      "minecraft:fossil",
      "minecraft:freeze_top_layer",
      "minecraft:glowstone",
      "minecraft:glowstone_extra",
      "minecraft:huge_brown_mushroom",
      "minecraft:huge_red_mushroom",
      "minecraft:ice_patch",
      "minecraft:ice_spike",
      "minecraft:iceberg_blue",
      "minecraft:iceberg_packed",
      "minecraft:jungle_bush",
      "minecraft:jungle_tree",
      "minecraft:jungle_tree_no_vine",
      "minecraft:kelp_cold",
      "minecraft:kelp_warm",
      "minecraft:lake_lava",
      "minecraft:lake_water",
      "minecraft:large_basalt_columns",
      "minecraft:large_dripstone",
      "minecraft:mega_jungle_tree",
      "minecraft:mega_pine",
      "minecraft:mega_spruce",
      "minecraft:monster_room",
      "minecraft:mushroom_field_vegetation",
      "minecraft:nether_sprouts",
      "minecraft:oak",
      "minecraft:oak_badlands",
      "minecraft:oak_bees_0002",
      "minecraft:oak_bees_002",
      "minecraft:oak_bees_005",
      "minecraft:ore_andesite",
      "minecraft:ore_blackstone",
      "minecraft:ore_coal",
      "minecraft:ore_copper",
      "minecraft:ore_debris_large",
      "minecraft:ore_debris_small",
      "minecraft:ore_diamond",
      "minecraft:ore_diorite",
      "minecraft:ore_dirt",
      "minecraft:ore_emerald",
      "minecraft:ore_gold",
      "minecraft:ore_gold_deltas",
      "minecraft:ore_gold_extra",
      "minecraft:ore_gold_nether",
      "minecraft:ore_granite",
      "minecraft:ore_gravel",
      "minecraft:ore_gravel_nether",
      "minecraft:ore_infested",
      "minecraft:ore_iron",
      "minecraft:ore_lapis",
      "minecraft:ore_magma",
      "minecraft:ore_quartz_deltas",
      "minecraft:ore_quartz_nether",
      "minecraft:ore_redstone",
      "minecraft:ore_soul_sand",
      "minecraft:patch_berry_bush",
      "minecraft:patch_berry_decorated",
      "minecraft:patch_berry_sparse",
      "minecraft:patch_brown_mushroom",
      "minecraft:patch_cactus",
      "minecraft:patch_cactus_decorated",
      "minecraft:patch_cactus_desert",
      "minecraft:patch_crimson_roots",
      "minecraft:patch_dead_bush",
      "minecraft:patch_dead_bush_2",
      "minecraft:patch_dead_bush_badlands",
      "minecraft:patch_fire",
      "minecraft:patch_grass_badlands",
      "minecraft:patch_grass_forest",
      "minecraft:patch_grass_jungle",
      "minecraft:patch_grass_normal",
      "minecraft:patch_grass_plain",
      "minecraft:patch_grass_savanna",
      "minecraft:patch_grass_taiga",
      "minecraft:patch_grass_taiga_2",
      "minecraft:patch_large_fern",
      "minecraft:patch_melon",
      "minecraft:patch_pumpkin",
      "minecraft:patch_red_mushroom",
      "minecraft:patch_soul_fire",
      "minecraft:patch_sugar_cane",
      "minecraft:patch_sugar_cane_badlands",
      "minecraft:patch_sugar_cane_desert",
      "minecraft:patch_sugar_cane_swamp",
      "minecraft:patch_sunflower",
      "minecraft:patch_taiga_grass",
      "minecraft:patch_tall_grass",
      "minecraft:patch_tall_grass_2",
      "minecraft:patch_waterlilly",
      "minecraft:pile_hay",
      "minecraft:pile_ice",
      "minecraft:pile_melon",
      "minecraft:pile_pumpkin",
      "minecraft:pile_snow",
      "minecraft:pine",
      "minecraft:plain_vegetation",
      "minecraft:red_mushroom_giant",
      "minecraft:red_mushroom_nether",
      "minecraft:red_mushroom_normal",
      "minecraft:red_mushroom_swamp",
      "minecraft:red_mushroom_taiga",
      "minecraft:sea_pickle",
      "minecraft:seagrass_cold",
      "minecraft:seagrass_deep",
      "minecraft:seagrass_deep_cold",
      "minecraft:seagrass_deep_warm",
      "minecraft:seagrass_normal",
      "minecraft:seagrass_river",
      "minecraft:seagrass_simple",
      "minecraft:seagrass_swamp",
      "minecraft:seagrass_warm",
      "minecraft:small_basalt_columns",
      "minecraft:small_dripstone",
      "minecraft:spring_closed",
      "minecraft:spring_closed_double",
      "minecraft:spring_delta",
      "minecraft:spring_lava",
      "minecraft:spring_lava_double",
      "minecraft:spring_open",
      "minecraft:spring_water",
      "minecraft:spruce",
      "minecraft:spruce_snowy",
      "minecraft:super_birch_bees_0002",
      "minecraft:swamp_tree",
      "minecraft:taiga_vegetation",
      "minecraft:trees_birch",
      "minecraft:trees_giant",
      "minecraft:trees_giant_spruce",
      "minecraft:trees_jungle",
      "minecraft:trees_jungle_edge",
      "minecraft:trees_mountain",
      "minecraft:trees_mountain_edge",
      "minecraft:trees_savanna",
      "minecraft:trees_shattered_savanna",
      "minecraft:trees_water",
      "minecraft:twisting_vines",
      "minecraft:vines",
      "minecraft:void_start_platform",
      "minecraft:warm_ocean_vegetation",
      "minecraft:warped_forest_vegetation",
      "minecraft:warped_fungi",
      "minecraft:warped_fungi_planted",
      "minecraft:weeping_vines",
    ],
  },
};
