// import globals from "globals";
// import pluginJs from "@eslint/js";
// import pluginVue from "eslint-plugin-vue";

// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   { files: ["**/*.{js,mjs,cjs,vue}"] },
//   { files: ["**/*.js"], languageOptions: { sourceType: "module" } }, // Enforce ES Module syntax for .js files
//   { languageOptions: { globals: globals.browser } },
//   pluginJs.configs.recommended,
//   ...pluginVue.configs["flat/essential"],
//   {
//     languageOptions: {
//       globals: {
//         // Define global variables here if necessary
//         node: true, // For Node.js global variables
//         es2020: true // If using ES2020 syntax/features
//       }
//     },
//     rules: {
//       "no-undef": "off" // Disable 'no-undef' rule for the moment
//     }
//   }
// ];

import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,vue}"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module", // Ensure we're using ES Module syntax
      globals: {
        // Define any global variables here (e.g., window for browser code)
        ...globals.browser // You can specify specific globals here if necessary
      }
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    languageOptions: {
      globals: {
        // Define global variables here if necessary
        node: true, // For Node.js global variables
        es2020: true // If using ES2020 syntax/features
      }
    },
    rules: {
      "no-undef": "off" // Disable 'no-undef' rule for the moment
    }
  }
];


