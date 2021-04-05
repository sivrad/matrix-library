import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export const githubGet = async <T>(url: string): Promise<T> => {
    try {
        return (
            await axios.get(url, {
                headers: {
                    Accept: 'application/vnd.github.mercy-preview+json',
                    Authorization: `token ${process.env.REPO_ACCESS_TOKEN}`,
                },
            })
        ).data as T;
    } catch (e) {
        console.log(e);
        throw e;
    }
};
