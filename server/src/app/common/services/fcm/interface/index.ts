export interface FcmMessage {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface FcmTopicMessage {
  topic: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}
