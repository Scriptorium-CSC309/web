import type { NextApiResponse } from 'next';
import prisma from '@/prisma';
import Joi from 'joi';
import { AuthenticatedRequest } from '@/src/auth/utils';
import { withAuth } from '@/src/auth/middleware';

type Error = {
    error: string;
};

type SuccessResponse = {
    message: string;
    upvotes: number;
    downvotes: number;
};

//validate id
const voteOnBlogPostSchema = Joi.object({
    id: Joi.number().integer().required(),
});

//validate vote type
const bodySchema = Joi.object({
    type: Joi.string().valid('upvote', 'downvote').required(),
});

async function voteOnBlogPost(
    req: AuthenticatedRequest,
    res: NextApiResponse<SuccessResponse | Error>
) {
    // only allow post requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    //validate id
    const { value: params, error: paramsError } = voteOnBlogPostSchema.validate(
        req.query,
        { convert: true }
    );
    if (paramsError) {
        return res.status(400).json({ error: paramsError.details[0].message });
    }

    //validate vote type
    const { value: body, error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
        return res.status(400).json({ error: bodyError.details[0].message });
    }

    const { id } = params;
    const { type } = body;
    const userId = Number(req.user.userId);

    try {
        const blogPost = await prisma.blogPost.findUnique({
            where: { id },
        });
        //check if blog post exists
        if(!blogPost) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        //check if user has already voted on this post
        const existingVote = await prisma.blogPostVote.findUnique({
            where: {
                userId_blogPostId: { userId, blogPostId: id },
            },
        });

        //if user has already voted, update the vote
        if(existingVote){
            if(existingVote.type === type.toUpperCase()){
                return res.status(400).json({ error: 'You have already voted' });
            }
            else {
                await prisma.blogPostVote.update({
                    where: { id: existingVote.id },
                    data: {
                        type: type.toUpperCase(),
                    },
                });

                //update the vote counts
                if (type === 'upvote') {
                    await prisma.blogPost.update({
                        where: { id },
                        data: {
                            upvotes: {
                                increment: 1,
                            },
                            downvotes: {
                                decrement: 1,
                            },
                        },
                    });
                } else {
                    await prisma.blogPost.update({
                        where: { id },
                        data: {
                            upvotes: {
                                decrement: 1,
                            },
                            downvotes: {
                                increment: 1,
                            },
                        },
                    });
                }
                
                return res.status(200).json({
                    message: `Your vote has been changed to ${type}`,
                    upvotes: blogPost.upvotes + (type === 'upvote' ? 1 : -1),
                    downvotes: blogPost.downvotes + (type === 'downvote' ? 1 : -1),
                });
            }
        }
        else {
            //create a new vote
            await prisma.blogPostVote.create({
                data: {
                    type: type.toUpperCase() as 'UPVOTE' | 'DOWNVOTE',
                    userId,
                    blogPostId: id,
                },
            });

            //update the vote counts
            if (type === 'upvote') {
                await prisma.blogPost.update({
                    where: { id },
                    data: {
                        upvotes: {
                            increment: 1,
                        },
                    },
                });
            } else {
                await prisma.blogPost.update({
                    where: { id },
                    data: {
                        downvotes: {
                            increment: 1,
                        },
                    },
                });
            }

            return res.status(200).json({
                message: `Blog post ${type}d successfully`,
                upvotes: blogPost.upvotes + (type === 'upvote' ? 1 : 0),
                downvotes: blogPost.downvotes + (type === 'downvote' ? 1 : 0),
            });
        }
    }
    catch (error) {
        console.error('Error voting on blog post:', error);
        return res.status(500).json({ error: 'Error voting on blog post' });
    }
}
    export default withAuth(voteOnBlogPost);