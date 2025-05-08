import { User } from "better-auth";

export type Author = Pick<User, "id" | "email" | "name" | "image">;
