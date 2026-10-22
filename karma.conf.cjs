module.exports = function (config) {
  config.set({
    frameworks: ["jasmine"],

    files: ["tests/**/*.spec.js"],

    preprocessors: {
      "tests/**/*.spec.js": ["esbuild"],
    },

    esbuild: {
      singleBundle: true,
      jsx: "automatic",
      loader: {
        ".js": "jsx",
      },
      define: {
        "process.env.NODE_ENV": '"test"',
        // Vite proporciona esta variable; Karma necesita definirla al compilar.
        "import.meta.env.BASE_URL": '"/"',
      },
    },

    browsers: ["ChromeHeadless"],
    reporters: ["progress"],
    singleRun: true,
  });
};
