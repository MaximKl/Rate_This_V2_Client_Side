interface ChatMessage {
  messageId: number;
  messageBody: string;
  messageTime: Date;
  messageFrom: number;
  messageTo: number;
  messageIsRead: boolean;
}
