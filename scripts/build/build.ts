// Build Script File
// March 2021

import { getCollectionRepositories } from './repositories';
import {
    updateREADME,
    createSourceDirectory,
    createIndexFile,
    createCollectionNamesFile,
} from './files';

const build = async (): Promise<void> => {
    console.log('Building the Sivrad Knowledgebase Library');
    // Get the repositories
    const repositories = await getCollectionRepositories();

    // Root dir './'
    Promise.all([
        // Update './package.json'
        // updatePackageJSON(repositories),
        // Update './README.md'
        updateREADME(repositories),
        // Update Collection Names
        createCollectionNamesFile(repositories),
        // Source dir './src/'
        // Ensure existance
        createSourceDirectory().then(() =>
            Promise.all([
                // Create './src/index.ts'
                createIndexFile(repositories),
            ]),
        ),
    ]);
};

build();
