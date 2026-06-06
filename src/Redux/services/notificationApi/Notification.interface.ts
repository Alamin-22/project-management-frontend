export interface INotificationPayloadData {
  projectId?: string;
  taskId?: string;
  meta?: string;
}

export interface INotification {
  _id: string;
  targetRole: string;
  recipientId?: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  payload?: INotificationPayloadData;
  isRead: boolean;
  createdAt: string;
}
