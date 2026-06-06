export interface IComment {
  _id: string;
  task: string;
  author: {
    _id: string;
    email: string;
    role: string;
    profile?: {
      name: string;
      designation?: string;
      profileImg?: {
        url: string;
        publicId: string;
      };
    };
  };
  content: string;
  parentComment?: string | null;
  replies?: IComment[];
  createdAt: string;
  updatedAt: string;
}
