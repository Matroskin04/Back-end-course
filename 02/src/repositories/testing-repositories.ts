import {allPosts} from "./posts-repositories";
import {allBlogs} from "./blogs-repositories";

export const testingRepositories = {

    deleteAllPosts() {
        allPosts.length = 0;
        allBlogs.length = 0;

        return true;
    }
}