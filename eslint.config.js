import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
	{
		files: ['src/**/*.{js,jsx,ts,tsx}', '*.{js,ts,mjs,cjs}'],
		plugins: {
			js,
			'@typescript-eslint': tsPlugin,
			'import': importPlugin,
		},
		languageOptions: {
			parser: tseslint.parser,
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		extends: ['js/recommended'],
		rules: {
			semi: ['error', 'always'],
			quotes: ['error', 'single'],
			indent: ['error', 'tab'],
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					args: 'none',
				},
			],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'inline-type-imports',
				},
			],
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'sibling',
						'parent',
						'object',
						'type',
						'index',
					],
					alphabetize: { order: 'asc', caseInsensitive: false },
					'newlines-between': 'never',
					pathGroups: [
						{
							pattern: '@storybook/**',
							group: 'external',
							position: 'before',
						},
					],
				},
			],
		}
	});