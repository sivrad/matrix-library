import axios from 'axios';
import { DEFAULT_PACKAGE_SOURCE } from './constants';
import { PackageSource } from './types';
import packageSourceConfig from './packageSources';

/**
 * Return the latest package version from a source.
 * @param {string} name Name of the package.
 * @param {PackageSource} source Source of the package version.
 * @returns {string} The latest package version.
 */
const getLatestPackageVersionFromSource = async (
    name: string,
    source: PackageSource = DEFAULT_PACKAGE_SOURCE,
): Promise<string> => {
    const packageConfig = Object.values(packageSourceConfig)[
        Object.keys(packageSourceConfig).indexOf(source)
    ];
    const packageURL = packageConfig.url(name);
    return packageConfig.callback((await axios.get(packageURL)).data);
};

/**
 * Return the latest package version from NPM then GITHUB.
 * @param {string} name Name of the packge.
 * @returns {Promise<[string, boolean]>} Version and if package is published.
 */
export const getLatestPackageVersion = async (
    name: string,
): Promise<[string, boolean]> => {
    try {
        return [await getLatestPackageVersionFromSource(name, 'NPM'), true];
    } catch (e) {
        return [await getLatestPackageVersionFromSource(name, 'GITHUB'), true];
    }
};
