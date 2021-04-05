// Constants
import { PackageSource } from './types';

export const SOURCE_DIR = './src/';
export const INDEX_PATH = `${SOURCE_DIR}index.ts`;
export const PACKAGE_JSON_PATH = 'package.json';
export const README_PATH = 'README.md';
export const COLLECTION_NAMES_PATH = 'collection-names.txt';
export const EXCLUDED_COLLECTION_NAMES = ['example', 'template'];

export const GITHUB_ORGANIZATION_NAME = 'sivrad';
export const COLLECTION_TOPIC_NAME = 'matrix-collection';
export const DEFAULT_PACKAGE_SOURCE: PackageSource = 'GITHUB';

export const GITHUB_URL = 'https://api.github.com';
export const GITHUB_ORGANIZATION_URL = `${GITHUB_URL}/orgs/${GITHUB_ORGANIZATION_NAME}/repos`;

export const GITHUB_PACKAGE_URL = `https://raw.githubusercontent.com/${GITHUB_ORGANIZATION_NAME}/`;

export const NPM_ORGANIZATION_NAME = 'sivrad';
export const NPM_URL = 'http://registry.npmjs.com/';
export const NPM_PACKAGE_URL = `${NPM_URL}@${NPM_ORGANIZATION_NAME}/`;

export const DEBUG = true;

export const README_TEMPLATE = `<p align="center"><img height="220px" src="https://i.imgur.com/UMHxlIV.png" alt="Logo" /><p>
<p align="center">
  <strong>Matrix Library</strong><br />
  <sub>The umbrella library for all Matrix types.</sub>
</p>
<p align="center">
  [ <a href="#installation">Installation 💾</a> | <a href="#usage">Usage 🤓</a> | <a href="https://www.npmjs.com/package/@sivrad/matrix-library">NPM 📦</a> | <a href="https://github.com/sivrad/matrix-library">Github 🕸</a> ]
</p>

# About
The Matrix Library is the library that contains all the Matrix types.
# Packages
{PACKAGE_TABLE}
`;
