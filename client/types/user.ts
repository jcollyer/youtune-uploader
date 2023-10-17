export interface User {
  user: {
    firstName: string;
    lastName: string;
    bio: string;
    profilePic: string;
    createdAt: string;
    id: string;
    user: number;
    username: string;
    usernameCase: string;
  }
}

export interface UserAuth {
  username: string;
  password: string;
}
