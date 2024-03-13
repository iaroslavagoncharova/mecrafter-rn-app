import { User } from "./DBTypes";
export type Values = Pick<User, "username" | "password">;
export type EditValues = Pick<User, "username" | "password" | "email">;
export type AuthContextType = {
    user: User | null;
    handleLogin: (values: Values) => void;
    handleLogout: () => void;
    handleAutoLogin: () => void;
    handleEdit: (values: EditValues) => void;
    handleDelete: () => void;
};
export type HabitContextType = {
    handleAddHabit: (habit: Record<string, string>) => void;
    handleAddFrequency: (frequency: Record<string, string>) => void;
};
