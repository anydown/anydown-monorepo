module.exports = {
  input: "./components/Anydown.vue",
  output: {
    format: ["esm", "umd"],
    moduleName: "anydown",
    fileName({ format }) {
      if (format === "esm") {
        return "anydown-core.es.js";
      }
      return "anydown-core.js";
    },
    extractCSS: true
  },
  plugins: {
    vue: true
  }
};
