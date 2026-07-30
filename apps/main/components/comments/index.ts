// Generic threaded comment system. Mount `CommentThread` under any entity whose
// type is in the `CommentEntityType` enum:
//
//   <CommentThread entityType="PROJECT_IDEA" entityId={idea.id} />
//
// Nothing here knows about project ideas specifically — projects and blog posts
// mount the identical component with a different entityType.
export { CommentThread } from "./comment-thread";
export { CommentItem } from "./comment-item";
export { CommentComposer } from "./comment-composer";
