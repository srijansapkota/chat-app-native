export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatListItem {
  user: User;
  lastMessage: Message | null;
}