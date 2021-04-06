import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import {
    SOURCE_DIR,
    PACKAGE_JSON_PATH,
    NPM_ORGANIZATION_NAME,
    README_PATH,
    README_TEMPLATE,
    INDEX_PATH,
    COLLECTION_NAMES_PATH,
} from './constants';
import { GithubRepository } from './types';
import { log } from './log';
import { exec } from 'child_process';

export const createSourceDirectory = async (): Promise<void> => {
    if (existsSync(SOURCE_DIR)) return;
    log("Creating  './src/'");
    mkdirSync(SOURCE_DIR);
};

const readPackageJSON = () => {
    return JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));
};

const writePackageJSON = (packageJSON: unknown) => {
    writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJSON, null, 4));
};

const createPackageName = (name: string): string => {
    // Remove 'matrix-' from repo names
    if (name.includes(`${NPM_ORGANIZATION_NAME}-`))
        name = name.replace(`${NPM_ORGANIZATION_NAME}-`, '');
    // Add '@sivrad/'
    return `@sivrad/${name}`;
};

export const updatePackages = async (
    repositories: GithubRepository[],
): Promise<void> => {
    log('Updating packages');
    const packages = repositories.filter(
        (repository) => !repository.excludeFromPackage,
    );
    if (packages.length == 0) return;
    const command = `yarn add ${packages
        .map((repository) => repository.full_name)
        .join(' ')}`;
    try {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updatePackageJSON = async (
    repositories: GithubRepository[],
): Promise<void> => {
    log("Updating  './package.json'");
    const packageJSON = readPackageJSON();
    const dependencies =
        Object.assign({}, packageJSON.defaultDependencies) || {};
    for (const repository of repositories) {
        const packageName = createPackageName(repository.name);
        if (!repository.isPublished) {
            console.warn(
                `'${packageName}' is not published on the NPM registry and will not be added to package.json`,
            );
            continue;
        }

        dependencies[packageName] = repository.version;
    }
    packageJSON['dependencies'] = dependencies;
    writePackageJSON(packageJSON);
};

export const createAdditionalInformation = (
    repository: GithubRepository,
): string => {
    if (repository.excludeFromPackage) return 'Excluded: Not a real package.';
    if (!repository.isPublished) return 'Excluded: Not published.';
    return '';
};

export const updateREADME = async (
    repositories: GithubRepository[],
): Promise<void> => {
    log("Updating  './README.md'");
    let packageTable = `| Name | Description | Version | Note |\n|------|-------------|---------|------|\n`;
    for (const repository of repositories) {
        packageTable += `[${repository.name}](https://github.com/${
            repository.full_name
        }) | ${repository.description} | ${
            repository.version
        } | ${createAdditionalInformation(repository)} |\n`;
    }
    writeFileSync(
        README_PATH,
        README_TEMPLATE.replace('{PACKAGE_TABLE}', packageTable),
    );
};

export const createIndexFile = async (
    repositories: GithubRepository[],
): Promise<void> => {
    log("Creating  './src/index.ts'");
    let sourceCode = '// THIS FILE WAS AUTO GENERATED, DO NOT EDIT DIRECTLY\n';
    const packages = repositories.filter(
        (repository) => !repository.excludeFromPackage,
    );
    if (packages.length == 0) return;
    for (const repository of packages) {
        const packageName = createPackageName(repository.name);
        sourceCode += `export * from '${packageName}';`;
    }
    writeFileSync(INDEX_PATH, `${sourceCode}`);
};

export const createCollectionNamesFile = (
    repositories: GithubRepository[],
): void => {
    writeFileSync(
        COLLECTION_NAMES_PATH,
        repositories.map((repository) => repository.collectionName).join('\n') +
            '\n',
    );
};
