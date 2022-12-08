export interface LoggerModel {
  level: string;
  type: string;
  message: ErrorMessage;
}

export interface ErrorMessage {
  error: boolean;
  service_name: string;
  description: string;
  metadata: string,
  time: string;
}
