import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContextType, EditValues, Values } from "../types/LocalTypes";
import { useAuth, useUser } from "../hooks/apiHooks";
import { User } from "../types/DBTypes";

const UserContext = createContext<AuthContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { postLogin } = useAuth();
  const { getUserByToken, putUser, deleteUser } = useUser();

  const handleLogin = async (values: Values) => {
    try {
      const result = await postLogin(values);
      if (result) {
        AsyncStorage.setItem("token", result.token);
        setUser(result.user);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setUser(null);
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleAutoLogin = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const result = await getUserByToken(token);
        console.log(result.user);
        setUser(result.user);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handleEdit = async (values: EditValues) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await putUser(values, token);
        const result = await getUserByToken(token);
        setUser(result.user);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        await deleteUser(token);
        await AsyncStorage.removeItem("token");
        setUser(null);
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, handleLogin, handleLogout, handleAutoLogin, handleEdit, handleDelete }}
    >
      {children}
    </UserContext.Provider>
  );
};
export { UserProvider, UserContext };
