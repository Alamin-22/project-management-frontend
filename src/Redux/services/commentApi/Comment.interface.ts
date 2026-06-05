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
  createdAt: string;
  updatedAt: string;
}
