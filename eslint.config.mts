import js from "@eslint/js";
import stylistic from '@stylistic/eslint-plugin';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([globalIgnores(["**/.config/"]),
stylistic.configs.all,
{
	files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js, '@stylistic': stylistic }, extends: ["js/recommended"], languageOptions: {
		sourceType: "module", ecmaVersion: 'latest',
		parserOptions: { projectService: true, ecmaVersion: 'latest', tsconfigRootDir: import.meta.dirname, projectFolderIgnoreList: ["**/node_modules/**"], allowDefaultProject: ['eslint.config.mts', '*.js'], ecmaFeatures: { impliedStrict: true } }, globals: globals.node
	},
	rules: { '@stylistic/indent': ['error', 2], 'no-unused-vars': 'warn', 'arrow-parens': ['error', 'as-needed'], 'no-var': 'error', 'prefer-const': 'warn' },
},
tseslint.configs.stylistic,
	prettierConfig,
tseslint.configs.recommended,
tseslint.configs.strictTypeChecked,
tseslint.configs.stylisticTypeChecked,
]);
