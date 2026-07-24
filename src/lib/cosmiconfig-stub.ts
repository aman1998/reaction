export function cosmiconfig() {
  return {
    async search() {
      return null;
    },
    async load() {
      return null;
    },
    clearCaches() {},
  };
}

export function cosmiconfigSync() {
  return {
    search() {
      return null;
    },
    load() {
      return null;
    },
    clearCaches() {},
  };
}

export default {
  cosmiconfig,
  cosmiconfigSync,
};
