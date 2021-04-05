import { GITHUB_PACKAGE_URL, NPM_PACKAGE_URL } from './constants';
import { PackageSource } from './types';

// Package Version
export default <
    Record<
        PackageSource,
        {
            url: (n: string) => string;
            callback: (d: Record<string, unknown>) => string;
        }
    >
>{
    GITHUB: {
        url: (n: string) => `${GITHUB_PACKAGE_URL}${n}/main/package.json`,
        callback: (d: Record<string, unknown>) => d.version as string,
    },
    NPM: {
        url: (n: string) => `${NPM_PACKAGE_URL}${n}`,
        callback: (d: Record<string, unknown>) =>
            (d as any)['dist-tags']['latest'] as string, // TODO: fix the any
    },
};
