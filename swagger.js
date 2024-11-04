const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scriptorium API',
      version: '1.0.0',
      description: 'API documentation for my Scriptorium',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            isAdmin: { type: 'boolean' },
            avatarId: {
              type: 'integer',
              format: 'int32',
              description: 'Avatar ID between 1 and NUM_AVATARS',
            },
            phoneNumber: { type: 'string' },
            blogPosts: {
              type: 'array',
              items: { $ref: '#/components/schemas/BlogPost' },
            },
            comments: {
              type: 'array',
              items: { $ref: '#/components/schemas/Comment' },
            },
            codeTemplates: {
              type: 'array',
              items: { $ref: '#/components/schemas/CodeTemplate' },
            },
            blogPostReports: {
              type: 'array',
              items: { $ref: '#/components/schemas/BlogPostReport' },
            },
            blogPostVotes: {
              type: 'array',
              items: { $ref: '#/components/schemas/BlogPostVote' },
            },
            commentReports: {
              type: 'array',
              items: { $ref: '#/components/schemas/CommentReport' },
            },
            commentVotes: {
              type: 'array',
              items: { $ref: '#/components/schemas/CommentVote' },
            },
          },
          required: [
            'id',
            'name',
            'email',
            'password',
            'isAdmin',
            'avatarId',
            'phoneNumber',
          ],
        },
        BlogPost: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            postedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'integer', format: 'int32' },
            isHidden: { type: 'boolean' },
            upvotes: { type: 'integer', format: 'int32' },
            downvotes: { type: 'integer', format: 'int32' },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/BlogPostTag' },
            },
            comments: {
              type: 'array',
              items: { $ref: '#/components/schemas/Comment' },
            },
            blogPostReports: {
              type: 'array',
              items: { $ref: '#/components/schemas/BlogPostReport' },
            },
            blogPostVotes: {
              type: 'array',
              items: { $ref: '#/components/schemas/BlogPostVote' },
            },
            user: { $ref: '#/components/schemas/User' },
          },
          required: [
            'id',
            'title',
            'description',
            'content',
            'postedAt',
            'userId',
            'isHidden',
            'upvotes',
            'downvotes',
          ],
        },
        BlogPostVote: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            userId: { type: 'integer', format: 'int32' },
            blogPostId: { type: 'integer', format: 'int32' },
            type: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/User' },
            blogPost: { $ref: '#/components/schemas/BlogPost' },
          },
          required: ['id', 'userId', 'blogPostId', 'type', 'createdAt'],
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            postedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'integer', format: 'int32' },
            postId: { type: 'integer', format: 'int32' },
            content: { type: 'string' },
            isHidden: { type: 'boolean' },
            upvotes: { type: 'integer', format: 'int32' },
            downvotes: { type: 'integer', format: 'int32' },
            user: { $ref: '#/components/schemas/User' },
            blogPost: { $ref: '#/components/schemas/BlogPost' },
            commentReports: {
              type: 'array',
              items: { $ref: '#/components/schemas/CommentReport' },
            },
            commentVotes: {
              type: 'array',
              items: { $ref: '#/components/schemas/CommentVote' },
            },
          },
          required: [
            'id',
            'postedAt',
            'userId',
            'postId',
            'content',
            'isHidden',
            'upvotes',
            'downvotes',
          ],
        },
        CommentVote: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            userId: { type: 'integer', format: 'int32' },
            commentId: { type: 'integer', format: 'int32' },
            type: {
              type: 'string',
              description: 'either UPVOTE or DOWNVOTE',
            },
            createdAt: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/User' },
            comment: { $ref: '#/components/schemas/Comment' },
          },
          required: ['id', 'userId', 'commentId', 'type', 'createdAt'],
        },
        BlogPostReport: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            reporterId: { type: 'integer', format: 'int32' },
            blogPostId: { type: 'integer', format: 'int32' },
            explanation: { type: 'string' },
            reportedAt: { type: 'string', format: 'date-time' },
            reporter: { $ref: '#/components/schemas/User' },
            blogPost: { $ref: '#/components/schemas/BlogPost' },
          },
          required: [
            'id',
            'reporterId',
            'blogPostId',
            'explanation',
            'reportedAt',
          ],
        },
        CommentReport: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            reporterId: { type: 'integer', format: 'int32' },
            commentId: { type: 'integer', format: 'int32' },
            explanation: { type: 'string' },
            reportedAt: { type: 'string', format: 'date-time' },
            reporter: { $ref: '#/components/schemas/User' },
            comment: { $ref: '#/components/schemas/Comment' },
          },
          required: [
            'id',
            'reporterId',
            'commentId',
            'explanation',
            'reportedAt',
          ],
        },
        BlogPostTag: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            name: { type: 'string' },
            blogPosts: {
              type: 'array',
              items: { $ref: '#/components/schemas/BlogPost' },
            },
          },
          required: ['id', 'name'],
        },
        CodeTemplateTag: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            name: { type: 'string' },
            codeTemplates: {
              type: 'array',
              items: { $ref: '#/components/schemas/CodeTemplate' },
            },
          },
          required: ['id', 'name'],
        },
        CodeTemplate: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int32' },
            title: { type: 'string' },
            description: { type: 'string' },
            code: { type: 'string' },
            language: { type: 'string' },
            userId: { type: 'integer', format: 'int32' },
            tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/CodeTemplateTag' },
            },
            user: { $ref: '#/components/schemas/User' },
          },
          required: [
            'id',
            'title',
            'description',
            'code',
            'language',
            'userId',
          ],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./pages/api/**/*.ts'], // Adjust the path according to your project structure
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
