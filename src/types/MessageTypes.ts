import {Post, User} from './DBTypes';

type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type LoginResponse = MessageResponse & {
  token: string;
  message: string;
  user: User;
};

type UserResponse = MessageResponse & {
  user: User;
};

type PostResponse = MessageResponse & {
  media: Post | Post[];
};

type UploadResponse = MessageResponse & {
  data: {
    filename: string;
    filesize: number;
    media_type: string;
  };
};

export type {
  MessageResponse,
  ErrorResponse,
  LoginResponse,
  UserResponse,
  UploadResponse,
  PostResponse,
};
