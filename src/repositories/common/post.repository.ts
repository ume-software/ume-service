import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, Post } from "@prisma/client";
import { EUrlType } from "@/enums/urlType";
export type PostAndCountLikeAndCountCommentType = Post & {
  _count?: {
    likePosts?: number;
    commentPosts?: number;
  };
}
export class PostRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: PostAndCountLikeAndCountCommentType[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.post.findMany(query),
      this.prisma.post.count({
        where: query?.where,
      }),
    ]);
    return {
      row,
      count,
    };
  }
  async getUrlThumnailsByUserIdAndUrlType(userId: string, urlType: string = EUrlType.IMAGE, limit?: number, offset?: number) {
    const query = `
      FROM post, LATERAL unnest(post.thumbnails::jsonb[]) AS thumbnail
      WHERE (thumbnail->>'type') = '${urlType}' 
        AND user_id = '${userId}'
        AND deleted_at IS NULL
    `
    const row = await this.prisma.$queryRawUnsafe(
      `
      SELECT thumbnail->>'url' AS url , id as post_id , created_at , updated_at, deleted_at
      ${query} 
      ORDER BY created_at DESC
      ${limit != undefined ? `LIMIT ${limit}` : ""}
      ${offset != undefined ? `OFFSET ${offset}` : ""}
      `
    ) as any[]
    const countResult: any = await this.prisma.$queryRawUnsafe(`
      SELECT COUNT(*)::int as count
      ${query} 
    `);

    return {
      row: row.map(item => ({
        url: item.url,
        postId: item.post_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        deletedAt: item.deleted_at,
      })),
      count: countResult[0].count
    }
  }
  async suggestForUserId(userId: string, take: number | undefined) {
    const query = `
    SELECT p.id, p.content, p.user_id, p.thumbnails, p.created_at, p.updated_at, p.deleted_at,
        (
            SELECT COUNT(*) 
            FROM like_post lp 
            WHERE lp.post_id = p.id
        )::int  AS like_count,
        (
            SELECT COUNT(*) 
            FROM comment_post cp 
            WHERE cp.post_id = p.id
        )::int  AS comment_count,
        CASE
	        WHEN 
	        	p.user_id = '${userId}' AND 
		        NOT EXISTS (
		            SELECT 1
		            FROM watched_post wp
		            WHERE wp.user_id = '${userId}'
		            AND wp.post_id = p.id
                    AND wp.deleted_at IS NULL
		        ) 
	        THEN 1
            WHEN EXISTS (
                SELECT 1 
                FROM post author
                WHERE author.user_id = p.user_id
                AND EXISTS (
                    SELECT 1 
                    FROM like_post lp 
                    WHERE lp.user_id = '${userId}' 
                    AND lp.post_id = author.id
                    AND lp.deleted_at IS NULL
                )
                AND EXISTS (
                    SELECT 1 
                    FROM comment_post cp 
                    WHERE cp.user_id = '${userId}' 
                    AND cp.post_id = author.id
                    AND cp.deleted_at IS NULL
                )
                AND NOT EXISTS (
                    SELECT 1
                    FROM watched_post wp
                    WHERE wp.user_id = '${userId}'
                    AND wp.post_id = p.id
                    AND wp.deleted_at IS NULL
                )
                
            ) THEN 2 -- Regularly like and comment on other posts by the author of that article but have not seen the post
            WHEN (
                SELECT COUNT(*) 
                FROM like_post lp 
                WHERE lp.post_id = p.id
                AND lp.deleted_at IS NULL
            ) > 0 
            AND NOT EXISTS (
                SELECT 1 
                FROM like_post lp 
                WHERE lp.user_id = '${userId}' 
                AND lp.post_id = p.id
                AND lp.deleted_at IS NULL        
            ) 
            AND NOT EXISTS (
                    SELECT 1
                    FROM watched_post wp
                    WHERE wp.user_id = '${userId}'
                    AND wp.post_id = p.id
                    AND wp.deleted_at IS NULL
            )
            THEN 3 -- A lot of people like the comment but I haven't seen it myself
            WHEN EXISTS (
                SELECT 1 
                FROM post author
                WHERE author.user_id = p.user_id
                AND EXISTS (
                    SELECT 1 
                    FROM like_post lp 
                    WHERE lp.user_id = '${userId}' 
                    AND lp.post_id = author.id
                    AND lp.deleted_at IS NULL
                )
                AND EXISTS (
                    SELECT 1 
                    FROM comment_post cp 
                    WHERE cp.user_id = '${userId}' 
                    AND cp.post_id = author.id
                    AND cp.deleted_at IS NULL
                )
            ) THEN 4 -- Rarely like and comment on posts other than the author of that article and have seen it
            ELSE 5 -- Rarely like and rarely comment on posts other than those by the author of that article and viewed
        END AS priority,
        CASE WHEN lp.id IS NULL THEN FALSE ELSE TRUE END AS is_like
    FROM post p
    LEFT JOIN
      like_post lp ON lp.post_id = p.id AND lp.user_id = '${userId}'
    WHERE p.deleted_at IS NULL
    ORDER BY priority, p.created_at DESC
    `
    const row = await this.prisma.$queryRawUnsafe(
      `
      ${query} 
      ${take != undefined ? `LIMIT ${take}` : ""}
      `
    )
    const countResult: any = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*)::int  as count FROM post`)
    return {
      row,
      count: countResult[0].count
    }
  }

  async suggestForAnonymous(take: number | undefined) {
    const query = `
      SELECT p.id, p.content, p.user_id, p.thumbnails, p.created_at, p.updated_at, p.deleted_at,
          (
              SELECT COUNT(*)
              FROM like_post lp
              WHERE lp.post_id = p.id
          )::int AS like_count,
          (
              SELECT COUNT(*)
              FROM comment_post cp
              WHERE cp.post_id = p.id
          )::int AS comment_count
      FROM post p
      WHERE p.id IN (
          SELECT p.id
          FROM post p
          LEFT JOIN watched_post wp ON p.id = wp.post_id
          GROUP BY p.id
          ORDER BY
              CASE
                  WHEN (
                      SELECT COUNT(*)
                      FROM like_post lp
                      WHERE lp.post_id = p.id
                  ) > 0
                  AND (
                      SELECT COUNT(*)
                      FROM comment_post cp
                      WHERE cp.post_id = p.id
                  ) > 0
                  AND EXISTS (
                      SELECT 1
                      FROM watched_post wp
                      WHERE wp.post_id = p.id
                  ) THEN 1 -- Many people like and comment and watch
                  WHEN (
                      SELECT COUNT(*)
                      FROM like_post lp
                      WHERE lp.post_id = p.id
                  ) > 0
                  AND (
                      SELECT COUNT(*)
                      FROM comment_post cp
                      WHERE cp.post_id = p.id
                  ) > 0 THEN 2 -- Lots of likes and comments
                  ELSE 3 -- Few people like and comment
              END, p.created_at DESC
           ${take ? "LIMIT " + take : ""} -- Number of suggested posts
      )
      ORDER BY RANDOM();

    `
    const row = await this.prisma.$queryRawUnsafe(query)
    const countResult: any = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*)::int as count FROM post`);

    return {
      row,
      count: countResult[0].count
    }
  }

  async updateById(
    id: string,
    postUpdateInput: Prisma.PostUpdateInput,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.post.update({ data: postUpdateInput, where: { id } });
  }

  async update(
    postUpdateInput: Prisma.PostUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.post.update({
      data: postUpdateInput,
      where: query.where,
    });
  }

  async create(
    postCreateInput: Prisma.PostCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Post> {
    return await tx.post.create({ data: postCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Post | null> {
    return await tx.post.findFirst(query);
  }


  async findById(
    postId: string,
    tx: PrismaTransation = this.prisma
  ): Promise<PostAndCountLikeAndCountCommentType | null> {
    return await tx.post.findFirst({
      where: {
        id: postId
      },

      include: {
        _count: {
          select: {
            commentPosts: true,
            likePosts: true
          }
        }
      }
    });
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Post[]> {
    return await tx.post.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<Post> {
    return await tx.post.delete({ where: { id } });
  }

  async deleteMany(
    postWhereInput: Prisma.PostWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.post.deleteMany({ where: postWhereInput });
  }
}
