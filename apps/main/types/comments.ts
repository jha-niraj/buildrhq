// Shared types for the generic comment system. Consumed by the server actions in
// actions/(main)/comments.action.ts and by components/comments/*.

/**
 * Entities that can carry a comment thread. Must stay in sync with the
 * `CommentEntityType` pgEnum in packages/db/src/schema/comments.ts - adding a
 * value there without adding it here (and to ENTITY_TABLES in the action file)
 * makes the new type unreachable from the app.
 */
export type CommentEntityType = "PROJECT_IDEA" | "PROJECT";

export interface CommentAuthor {
    id: string;
    name: string | null;
    image: string | null;
}

/** One comment plus its replies. `replies` nests without limit. */
export interface CommentNode {
    id: string;
    entityType: CommentEntityType;
    entityId: string;
    parentId: string | null;
    /** Empty string when `isDeleted` - the server never returns a deleted body. */
    body: string;
    isDeleted: boolean;
    isEdited: boolean;
    createdAt: Date;
    updatedAt: Date;
    author: CommentAuthor;
    /** True only when a session exists and owns this comment. */
    isMine: boolean;
    replies: CommentNode[];
}

/**
 * A comment inserted locally before the server has confirmed it. `pendingId` is
 * the temporary client key, swapped for the real row once the action returns.
 */
export interface OptimisticCommentNode extends CommentNode {
    pending?: boolean;
    failed?: boolean;
}

export interface GetCommentsResult {
    success: boolean;
    data?: CommentNode[];
    /** Non-deleted comment count for the entity - matches `projectIdeas.commentCount`. */
    count?: number;
    error?: string;
}

export interface AddCommentInput {
    entityType: CommentEntityType;
    entityId: string;
    parentId?: string | null;
    body: string;
}

export interface MutateCommentResult {
    success: boolean;
    data?: CommentNode;
    /** The entity's non-deleted comment count after the write. */
    count?: number;
    error?: string;
}

export interface DeleteCommentResult {
    success: boolean;
    count?: number;
    error?: string;
}

// ── Shared constraints, used by both the action and the composer UI so the
//    client can disable Submit for input the server is going to reject anyway.
export const COMMENT_MIN_LENGTH = 2;
export const COMMENT_MAX_LENGTH = 2000;

/** Depth at which visual indentation stops. Nesting in the DATA is unlimited. */
export const COMMENT_MAX_INDENT_DEPTH = 3;
