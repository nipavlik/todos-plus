export type CreateTodoProps = {
  title: string;
  content: string;
  userId: number;
};

export type UpdateTodoProps = {
  title: string;
  content: string;
  done: boolean;
};

export type GetAllByUserIdProps = {
  userId: number;
  skip: number;
  take: number;
};
