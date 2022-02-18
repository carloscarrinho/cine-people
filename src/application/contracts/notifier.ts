export interface Notifier {
  publish(queue: string, message: string): Promise<boolean>;
}