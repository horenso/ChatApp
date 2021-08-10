export enum NotificationType {
  success,
  info,
  error,
}

export interface Notification {
  type: NotificationType;
  message: string;
}
