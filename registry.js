// This big JSON object contains configurable variables, and list of elements for the system to use during generation.

registry = {
  namespace: "infinonaut", // Namespace used in datapack. Like the "minecraft" in "minecraft:overworld"
  numDimensions: 10, // How many dimensions to generate
  numBiomes: [2, 5, 3, 0.75], // How many biomes to generate per dimension
  dimension: {
    biomeDepthBiasInfluence: [0, 1.5, 0.75, 2], // The amount of bias influence to use for determining depth. High influence means biomes will match more in depth.
    biomeScaleBias: [0.001, 0.75, 0.025, 0.85, 3], // What scale value biomes in a dimension should be biased towards. Low scale bias means biomes with be more flatter.
  },
  biome: {
    depth: [-0.5, 1.75, 0.125, undefined, 3], // The ground level that a biome is generated at. Influence is decided by registry.dimension.biomeDepthBiasInfluence, set per dimension
    scale: [0.01, 1.75, undefined, 0.75, 3], // The "roughness" of a biome
    
    spawning: {
      altitude: [0, 0.5, 3],
      temperature: [0, 0.5, 3],
      humidity: [0, 0.5, 3],
      weirdness: [0, 0.5, 3],
      offset: [0, 0.5, 3],
    },
  },
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
};
