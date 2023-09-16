export function getKeyCacheGetAllTodos(
  userId: number,
  skip: number,
  take: number,
): string {
  return `get-all-todos:user-${userId}:skip-${skip}:take-${take}`;
}

export function getKeyPatternGetAllTodos(userId: number): string {
  return `get-all-todos:user-${userId}:*`;
}
