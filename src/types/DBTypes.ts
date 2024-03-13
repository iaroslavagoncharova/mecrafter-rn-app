type UserHabits = {
  habit_id: number;
  habit_name: string;
  habit_description: string;
  habit_category: string;
}
type User = {
  user_id: number;
  username: string;
  email: string;
  password: string;
  habit_id: number;
  habit_frequency: number;
  created_at: string;
  habit_name: string;
}
type UnauthorizedUser = Omit<User, 'password'>
type PutUserValues = {
  username?: string | null;
  password?: string | null;
  email?: string | null;
};

type Post = {
  post_id: number;
  user_id: number;
  post_text: string;
  post_title: string;
  created_at: string;
  filename: string;
  thumbnail: string;
  filesize: number;
  media_type: string;
};

type PostWithOwner = Post & Pick<User, 'username'>

type Like = {
  like_id: number;
  post_id: number;
  user_id: number;
  created_at: string;
};

type Comment = {
  comment_id: number;
  user_id: number;
  post_id: number;
  comment_text: string;
  created_at: string;
};

type Reflection = {
  reflection_id: number;
  user_id: number;
  prompt_id: number;
  reflection_text: string;
  created_at: string;
};

type Prompt = {
  prompt_id: number;
  prompt_text: string;
  type: string;
};

type Message = {
  message_id: number;
  message_text: string;
  message_author: string;
  last_used_date: Date;
};

type ReflectionWithPrompt = Reflection & Pick<Prompt, "prompt_text">;

export type { UserHabits, User, UnauthorizedUser, PutUserValues, Post, PostWithOwner, Like, Comment, Reflection, Prompt, Message, ReflectionWithPrompt };
