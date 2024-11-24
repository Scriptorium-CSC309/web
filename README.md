## Getting Started

After cloning the repository, follow these steps:
1. Create a `.env` file under the root directory using the template from the provided `.env.template`.
2. Populate the `.env` file with correct environment variables
3. Build required docker images in the @/Docker folder
   For example, if building the dockerfile for CPP, you can execute the following in the terminal
   `docker buildx build --tag cpp-executor:11 -f ./docker/cpp.Dockerfile ./docker`
4. add image tags from .env.template into .env

(commands for running other dockerfiles)
```
docker buildx build --tag java-executor:20 -f ./docker/java.Dockerfile ./docker
docker buildx build --tag c-executor:11 -f ./docker/c.Dockerfile ./docker
docker buildx build --tag nodejs-executor:20 -f ./docker/js.Dockerfile ./docker
docker buildx build --tag ts-executor:20 -f ./docker/ts.Dockerfile ./docker
docker buildx build --tag python-executor:3.10 -f ./docker/js.Dockerfile ./docker
```
 
Then you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


**Other info**

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
