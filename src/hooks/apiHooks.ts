import {useEffect, useState} from 'react';
import * as FileSystem from 'expo-file-system';
import {fetchData} from '../lib/functions';
import {Values} from '../types/LocalTypes';
import {
  LoginResponse,
  MessageResponse,
  PostResponse,
  UploadResponse,
  UserResponse,
} from '../types/MessageTypes';
import {
  Comment,
  Like,
  Message,
  Post,
  PostWithOwner,
  Prompt,
  PutUserValues,
  ReflectionWithPrompt,
  User,
  UserHabits,
} from '../types/DBTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUpdateContext from './updateHooks';

const usePost = () => {
  const [postArray, setPostArray] = useState<PostWithOwner[]>([]);
  const {update} = useUpdateContext();

  const getPosts = async () => {
    try {
      const posts = await fetchData<Post[]>(
        process.env.EXPO_PUBLIC_MEDIA_API + '/posts'
      );
      const postsWithOwner: PostWithOwner[] = await Promise.all(
        posts.map(async (post) => {
          const owner = await fetchData<User>(
            process.env.EXPO_PUBLIC_AUTH_API + '/users/' + post.user_id
          );
          const postWithOwner: PostWithOwner = {
            ...post,
            username: owner.username,
          };
          return postWithOwner;
        })
      );
      setPostArray(postsWithOwner);
    } catch (error) {
      console.error('getPosts failed', error);
    }
  };

  useEffect(() => {
    getPosts();
  }, [update]);

  const postPost = (
    file: UploadResponse,
    inputs: Record<string, string>,
    token: string
  ) => {
    const post: Omit<Post, 'post_id' | 'user_id' | 'thumbnail' | 'created_at'> =
      {
        post_title: inputs.post_title,
        post_text: inputs.post_text,
        filename: file.data.filename,
        filesize: file.data.filesize,
        media_type: file.data.media_type,
      };

    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    };
    return fetchData<PostResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/posts',
      options
    );
  };

  const putPost = async (
    id: number,
    inputs: Record<string, string>,
    token: string
  ): Promise<PostResponse> => {
    let post = {};
    if (inputs.post_title && inputs.post_text) {
      post = {
        post_title: inputs.post_title,
        post_text: inputs.post_text,
      };
    } else if (inputs.post_title) {
      post = {
        post_title: inputs.post_title,
      };
    } else if (inputs.post_text) {
      post = {
        post_text: inputs.post_text,
      };
    }
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(post),
    };
    return await fetchData(
      process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + id,
      options
    );
  };

  const deletePost = async (
    id: number,
    token: string
  ): Promise<MessageResponse> => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData(
      process.env.EXPO_PUBLIC_MEDIA_API + '/posts/' + id,
      options
    );
  };

  return {getPosts, postPost, postArray, putPost, deletePost};
};

const useUser = () => {
  const getUserById = async (id: number) => {
    return await fetchData<User>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/' + id
    );
  };

  const getUserByToken = async (token: string) => {
    const options = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<UserResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/token',
      options
    );
  };

  const postUser = async (user: Record<string, string>) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    };
    await fetchData(process.env.EXPO_PUBLIC_AUTH_API + '/users', options);
  };

  const putUser = async (user: PutUserValues, token: string): Promise<UserResponse> => {
    let userObj = {};
    if (user.username && user.password && user.email) {
      userObj = {
        username: user.username,
        password: user.password,
        email: user.email,
      };
    } else if (user.username && user.password) {
      userObj = {
        username: user.username,
        password: user.password,
      };
    } else if (user.username && user.email) {
      userObj = {
        username: user.username,
        email: user.email,
      };
    } else if (user.password && user.email) {
      userObj = {
        password: user.password,
        email: user.email,
      };
    } else if (user.username) {
      userObj = {
        username: user.username,
      };
    } else if (user.password) {
      userObj = {
        password: user.password,
      };
    } else if (user.email) {
      userObj = {
        email: user.email,
      };
    }
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(userObj),
    };
    return await fetchData(process.env.EXPO_PUBLIC_AUTH_API + '/users', options);
  };

  const deleteUser = async (token: string) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };
    await fetchData(process.env.EXPO_PUBLIC_AUTH_API + '/users', options);
  };

  const getUsernameAvailability = async (username: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/username/' + username
    );
  };

  const getEmailAvailability = async (email: string) => {
    return await fetchData<{available: boolean}>(
      process.env.EXPO_PUBLIC_AUTH_API + '/users/email/' + email
    );
  };
  return {
    getUserByToken,
    postUser,
    putUser,
    deleteUser,
    getUsernameAvailability,
    getEmailAvailability,
    getUserById,
  };
};

const useAuth = () => {
  const postLogin = async (values: Values) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    };
    return await fetchData<LoginResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/auth/login',
      options
    );
  };
  return {postLogin};
};

const useFile = () => {
  const postFile = async (file: File, token: string) => {
    const formData = new FormData();
    formData.append('file', file);
    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };
    return await fetchData<UploadResponse>(
      process.env.EXPO_PUBLIC_UPLOAD_SERVER + '/upload',
      options
    );
  };

  const postExpoFile = async (
    imageUri: string,
    token: string
  ): Promise<UploadResponse> => {
    if (!imageUri) {
      throw new Error('Image uri is undefined');
    }
    const result = await FileSystem.uploadAsync(
      process.env.EXPO_PUBLIC_UPLOAD_SERVER + '/upload',
      imageUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    );
    return JSON.parse(result.body);
  };

  return {postFile, postExpoFile};
};

const useHabit = () => {
  const [habits, setHabits] = useState<UserHabits[]>([]);

  const getCreated = async () => {
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + await AsyncStorage.getItem('token'),
        },
      };
      const createdHabits = await fetchData<UserHabits[]>(
        process.env.EXPO_PUBLIC_AUTH_API + '/habits',
        options
      );
      setHabits(createdHabits);
    } catch (error) {
      console.error('getCreated failed', error);
    }
  };

  useEffect(() => {
    getCreated();
  }, []);

  const postHabit = async (habit: Record<string, string>, token: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(habit),
    };
    return await fetchData(
      process.env.EXPO_PUBLIC_AUTH_API + '/habits',
      options
    );
  };

  const postFrequency = async (
    frequency: Record<string, string>,
    token: string
  ): Promise<MessageResponse> => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(frequency),
    };
    return await fetchData(
      process.env.EXPO_PUBLIC_AUTH_API + '/habits/frequency',
      options
    );
  };

  const updateHabit = async (habit: Record<string, string>, token: string): Promise<MessageResponse> => {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(habit),
    };
    const result = await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_AUTH_API + '/habits/habit',
      options
    );
    return result;
  };

  return {getCreated, postHabit, postFrequency, habits, updateHabit};
};

const useLike = () => {
  const postLike = async (post_id: number, token: string) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({post_id}),
    };

    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes',
      options
    );
  };

  const getCountByPost = async (post_id: number) => {
    return await fetchData<{count: number}>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/count/' + post_id
    );
  };

  const getLikeByUser = async (post_id: number, token: string) => {
    const options: RequestInit = {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<Like>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/bypost/user' + post_id,
      options
    );
  };

  const deleteLike = async (like_id: number, token: string) => {
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/likes/' + like_id,
      options
    );
  };
  return {postLike, getCountByPost, getLikeByUser, deleteLike};
};

const useComment = () => {
  const postComment = async (
    comment_text: string,
    post_id: number,
    token: string
  ) => {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({comment_text, post_id}),
    };

    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments',
      options
    );
  };

  const {getUserById} = useUser();

  const getCommentsByPostId = async (post_id: number) => {
    const comments = await fetchData<Comment[]>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments/bypost/' + post_id
    );
    const commentsWithUser = await Promise.all<Comment & {username: string}>(
      comments.map(async (comment) => {
        const user = await getUserById(comment.user_id);
        return {...comment, username: user.username};
      })
    );
    return commentsWithUser;
  };

  const getCommentCount = async (post_id: number) => {
    return await fetchData<{count: number}>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/comments/count/' + post_id
    );
  }

  return {postComment, getCommentsByPostId, getCommentCount};
};
const useReflection = () => {
  const postReflection = async (
    reflection_text: string,
    prompt_id: number,
    token: string
  ) => {
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ reflection_text, prompt_id }),
    };

    console.log(reflection_text);
    return await fetchData<MessageResponse>(
      process.env.EXPO_PUBLIC_MEDIA_API + "/reflections",
      options
    );
  };

  const getReflectionsByUser = async (user_id: number, token: string) => {
    try {
      const options = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const result = await fetchData<ReflectionWithPrompt[]>(
        process.env.EXPO_PUBLIC_MEDIA_API + "/reflections/byuser/" + user_id,
        options
      );
      return result;
    } catch (error) {
      console.error("getReflectionsByUser failed", error);
    }
  };

  return { postReflection, getReflectionsByUser };
};

const usePrompt = () => {
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const getPrompts = async () => {
    const result = await fetchData<Prompt[]>(
      process.env.EXPO_PUBLIC_MEDIA_API + '/reflections/prompts'
    );
    setPromptList(result);
    console.log(result);
    return result;
  };
  useEffect(() => {
    getPrompts();
  }, []);
  return { promptList, getPrompts };
};

const useMessage = () => {
  const [messages, setMessages] = useState<Message | null>(null);
  const getMessages = async () => {
    const result = await fetchData<Message>(
      process.env.EXPO_PUBLIC_MEDIA_API + "/messages"
    );
    setMessages(result);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return { getMessages, messages };
};
export {useUser, useAuth, useFile, useHabit, usePost, useLike, useComment, useReflection, usePrompt, useMessage};
