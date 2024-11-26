// get a blogpost given an specific blogpost id
import prisma from '@/prisma'; // Ensure this is the path to your Prisma client

/**
 * Fetch a blog post by its ID.
 * @param {number} id - The ID of the blog post.
 * @returns {Promise<Object | null>} - Returns the blog post object if found, otherwise null.
 */
export async function getBlogPostById(id: number) {
    try {
        const blogPost = await prisma.blogPost.findUnique({
            where: {
                id: id,
            },
            include: {
                user: true, // Include user relation
                comments: true, // Include comments relation if applicable
                tags: true, // Include tags if it's a relation
            },
        });

        return blogPost;
    } catch (error) {
        console.error('Error fetching blog post by ID:', error);
        throw new Error('Unable to fetch blog post');
    }
}
