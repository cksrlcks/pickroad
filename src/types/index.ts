export type ServerActionResult<T = undefined> =
  | { success: true; message: string; payload?: T }
  | { success: false; message: string };

export type targetType = "roadmap" | "comment";
