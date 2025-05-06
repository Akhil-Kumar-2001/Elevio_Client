// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   {
//     files: ["**/*.{js,jsx,ts,tsx}"], // 👈 Add this
//     ...compat.extends("next/core-web-vitals", "next/typescript")[0], // Only use the first item (or spread manually)
//   },
// ];

// export default eslintConfig;



import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["**/.next/**"], // 👈 Ignore .next folder
    ...compat.extends("next/core-web-vitals", "next/typescript")[0],
  },
];

export default eslintConfig;
