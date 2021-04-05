import {
    GITHUB_ORGANIZATION_URL,
    GITHUB_ORGANIZATION_NAME,
    COLLECTION_TOPIC_NAME,
    EXCLUDED_COLLECTION_NAMES,
} from './constants';
import { GithubRepository, GithubRepositoryTopics } from './types';
import { getLatestPackageVersion } from './packages';
import { githubGet } from './github';

/**
 * Get the organization's repositories.
 * TODO: Implement Pagination.
 * @returns {GithubRepository[]} List of repositories.
 */
const getRepositories = async (): Promise<GithubRepository[]> =>
    await githubGet<GithubRepository[]>(GITHUB_ORGANIZATION_URL);

/**
 * Get the repository topics.
 * @param {string} name Name of the repo.
 * @returns {Promise<GithubRepository>} Topics of the repo.
 */
const getRepositoryTopics = async (
    name: string,
): Promise<GithubRepositoryTopics> =>
    await githubGet<GithubRepositoryTopics>(
        `https://api.github.com/repos/${GITHUB_ORGANIZATION_NAME}/${name}/topics`,
    );

/**
 * Get all the MOT collection repositories.
 * @returns {Promise<GithubRepository[]>} Github repositories with the 'mot-collection' tag.
 */
export const getCollectionRepositories = async (): Promise<
    GithubRepository[]
> => {
    const allRepositories = await getRepositories();
    const collectionRepositories = (
        await Promise.all(
            allRepositories.map((repo) =>
                (async () => {
                    const topics = await getRepositoryTopics(repo.name);
                    return topics.names.indexOf(COLLECTION_TOPIC_NAME) != -1
                        ? repo
                        : null;
                })(),
            ),
        )
    ).filter((repo) => repo != null) as GithubRepository[];

    // Get the latest version for each repo
    return await Promise.all(
        collectionRepositories.map((repo) =>
            (async () => {
                [
                    repo.version,
                    repo.isPublished,
                ] = await getLatestPackageVersion(repo.name);
                repo.collectionName = repo.full_name.split(
                    'matrix-collection-',
                )[1];
                repo.excludeFromPackage =
                    EXCLUDED_COLLECTION_NAMES.indexOf(repo.collectionName) !=
                    -1;
                return repo;
            })(),
        ),
    );
};
