import { config } from "@/configs";
import { express } from "@/index";
import prismaWithoutSoftDelete from "@/models/baseWithoutSoftDelete.prisma";
import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import request from "supertest";

const prismaMock = {
    post: {
        create: jest.fn(),
    },
} as unknown as PrismaClient;

jest.mock("@/models", () => ({
    prisma: prismaMock,
}));
describe("Suggest API Tests", () => {
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
