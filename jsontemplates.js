// Contains template JSON objects for dimensions and biomes

dimensionBase = {
  type: {
    ultrawarm: false,
    natural: true,
    piglin_safe: false,
    respawn_anchor_works: false,
    bed_works: true,
    has_raids: true,
    has_skylight: true,
    has_ceiling: false,
    coordinate_scale: 1,
    ambient_light: 0,
    logical_height: 256,
    infiniburn: "minecraft:infiniburn_overworld",
  },
  generator: {
    type: "minecraft:noise",
    seed: 0,
    settings: {
      bedrock_roof_position: -10,
      bedrock_floor_position: 0,
      sea_level: 63,
      disable_mob_generation: false,
      default_block: {
        Name: "minecraft:stone",
      },
      default_fluid: {
        Name: "minecraft:water",
        Properties: {
          level: "0",
        },
      },
      noise: {
        height: 256,
        density_factor: 1,
        density_offset: -0.46875,
        size_horizontal: 1,
        size_vertical: 2,
        simplex_surface_noise: true,
        random_density_offset: true,
        sampling: {
          xz_scale: 0.9999999814507745,
          y_scale: 0.9999999814507745,
          xz_factor: 80,
          y_factor: 160,
        },
        bottom_slide: {
          target: -30,
          size: 0,
          offset: 0,
        },
        top_slide: {
          target: -10,
          size: 3,
          offset: 0,
        },
      },
      structures: {
        structures: {},
      },
    },
    biome_source: {
      type: "minecraft:multi_noise",
      seed: 0,
      altitude_noise: {
        firstOctave: -7,
        amplitudes: [1, 1],
      },
      temperature_noise: {
        firstOctave: -7,
        amplitudes: [1, 1],
      },
      humidity_noise: {
        firstOctave: -7,
        amplitudes: [1, 1],
      },
      weirdness_noise: {
        firstOctave: -7,
        amplitudes: [1, 1],
      },
      biomes: [
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
      ],
    },
  },
};

biomeBase = {
  surface_builder: "minecraft:grass",
  depth: 0.125,
  scale: 0.05,
  temperature: 0.8,
  downfall: 0.4,
  precipitation: "rain",
  category: "plains",
  player_spawn_friendly: true,
  effects: {
    sky_color: 7907327,
    fog_color: 12638463,
    water_color: 4159204,
    water_fog_color: 329011,
    mood_sound: {},
  },
  starts: [],
  spawners: {
    monster: [],
    creature: [],
    water_creature: [],
    water_ambient: [],
    misc: [],
  },
  spawn_costs: {},
  carvers: {
    air: [],
  },
  features: [[], [], [], [], [], [], [], [], [], []],
};
