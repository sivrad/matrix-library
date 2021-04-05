// Types

export interface GithubRepository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    collectionName: string;
    private: boolean;
    description: string;
    version: string;
    isPublished: boolean;
    excludeFromPackage: boolean;
}
export interface GithubRepositoryTopics {
    names: string[];
}
export type PackageSource = 'GITHUB' | 'NPM';
