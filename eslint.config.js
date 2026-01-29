import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['dist/**', 'node_modules/**'],
	},
	js.configs.recommended,
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			...tseslint.configs.recommendedTypeChecked,
		],
		plugins: {
			'import': importPlugin,
		},
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			...tseslint.configs.recommended.rules,
			semi: ['warn', 'always'],
			quotes: ['warn', 'single'],
			indent: ['warn', 'tab'],
			'arrow-body-style': ['warn', 'as-needed'],
			'no-restricted-imports': [
				'error',
				{
					patterns: ['../*', './*']
				}
			],
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrors: 'all',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-unused-expressions': [
				'error',
				{
					allowShortCircuit: true,
					allowTernary: true,
				},
			],
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],
			'@typescript-eslint/consistent-type-exports': [
				'warn',
				{
					fixMixedExportsWithInlineTypeSpecifier: true,
				},
			],
			'import/order': [
				'warn',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'type',
					],
					'newlines-between': 'never',
					alphabetize: { 
						order: 'asc', 
						caseInsensitive: true,
					}
				},
			],
		}
	}
);
