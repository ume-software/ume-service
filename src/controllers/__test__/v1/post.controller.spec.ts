import { PostResponse } from "@/common/responses";
import { config } from "@/configs";
import { express } from "@/index";
import prismaWithoutSoftDelete from "@/models/baseWithoutSoftDelete.prisma";
import { faker } from "@faker-js/faker";
import request from "supertest";

describe("Suggest Post For Anonymous Users API Tests", () => {
    it("should return the suggested posts", async () => {
        const response = await request(express.app).get(
            encodeURI(
                '/api/v1/post/suggest?limit=10&page=1&select=["$all"]&where={}&order=[]'
            )
        );

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("row");
        expect(Array.isArray(response.body.row)).toBe(true);
        expect(response.body.count).toBeGreaterThan(0);

        for (const post of response.body.row) {
            expect(post).toHaveProperty("id");
            expect(post).toHaveProperty("content");
            expect(post).toHaveProperty("userId");
            expect(Array.isArray(post.thumbnails)).toBe(true);
            expect(post).toHaveProperty("createdAt");
            expect(post).toHaveProperty("updatedAt");
            expect(post.deletedAt).toBeNull();
            expect(typeof post.likeCount).toBe("number");
            expect(typeof post.commentCount).toBe("number");
        }

        expect(response.body).toHaveProperty("pagination");
        const pagination = response.body.pagination;
        expect(pagination).toHaveProperty("currentPage");
        expect(pagination).toHaveProperty("nextPage");
        expect(pagination).toHaveProperty("prevPage");
        expect(pagination).toHaveProperty("limit");
    });
});

describe("Suggest Post For User API Tests", () => {
    it("should return the suggested posts", async () => {
        const response = await request(express.app)
            .get(
                encodeURI(
                    '/api/v1/post/suggest?limit=10&page=1&select=["$all"]&where={}&order=[]'
                )
            )
            .set("Authorization", `Bearer ${config.test.user_token}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("row");
        expect(Array.isArray(response.body.row)).toBe(true);
        expect(response.body.count).toBeGreaterThan(0);

        for (const post of response.body.row) {
            expect(post).toHaveProperty("id");
            expect(post).toHaveProperty("content");
            expect(post).toHaveProperty("userId");
            expect(Array.isArray(post.thumbnails)).toBe(true);
            expect(post).toHaveProperty("createdAt");
            expect(post).toHaveProperty("updatedAt");
            expect(post.deletedAt).toBeNull();
            expect(typeof post.likeCount).toBe("number");
            expect(typeof post.commentCount).toBe("number");
        }

        expect(response.body).toHaveProperty("pagination");
        const pagination = response.body.pagination;
        expect(pagination).toHaveProperty("currentPage");
        expect(pagination).toHaveProperty("nextPage");
        expect(pagination).toHaveProperty("prevPage");
        expect(pagination).toHaveProperty("limit");
    });
});

describe("Create Post API", () => {
    it("should create a new post", async () => {
        const newPostData = {
            content: faker.lorem.paragraph(),
            thumbnails: [
                {
                    url: faker.image.urlPicsumPhotos(),
                    type: "IMAGE",
                },
                {
                    url: faker.image.urlPicsumPhotos(),
                    type: "IMAGE",
                },
                {
                    url: faker.image.urlPicsumPhotos(),
                    type: "IMAGE",
                },
                {
                    url: faker.image.urlPicsumPhotos(),
                    type: "IMAGE",
                },
            ],
        };

        const response = await request(express.app)
            .post("/api/v1/post")
            .set("Authorization", `Bearer ${config.test.user_token}`)
            .send(newPostData);
        // Assertions
        await prismaWithoutSoftDelete.post.delete({
            where: {
                id: response.body.id,
            },
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body).toHaveProperty("userId");
        expect(response.body).toHaveProperty("content");
        expect(response.body).toHaveProperty("thumbnails");
    });
});

describe("watched Post API", () => {
    it("should watched post", async () => {
        const responsePost = await request(express.app)
            .get(
                encodeURI(
                    '/api/v1/post/suggest?limit=10&page=1&select=["$all"]&where={}&order=[]'
                )
            )
            .set("Authorization", `Bearer ${config.test.user_token}`);
        const post: PostResponse = responsePost.body.row[0];
        const responseWatchedPost = await request(express.app)
            .post(encodeURI(`/api/v1/post/${post.id}/watched?select=["$all"]`))
            .set("Authorization", `Bearer ${config.test.user_token}`);
        expect(responseWatchedPost.status).toBe(200);
        expect(responseWatchedPost.body).toHaveProperty("id");
        expect(responseWatchedPost.body).toHaveProperty("userId");
        expect(responseWatchedPost.body).toHaveProperty("postId");
        expect(responseWatchedPost.body.postId).toBe(post.id);
    });
});
