export type Subscriber<T> = (data: T) => void;

export type UnsubscribeFn = () => void;

export interface Subscribable<T> {
  subscribe(sub: Subscriber<T>): UnsubscribeFn;
}

export class Publisher<T> {
  private subscribers: Subscriber<T>[] = [];

  subscribe(sub: Subscriber<T>): UnsubscribeFn {
    this.subscribers.push(sub);

    return () => this.unsubscribe(sub);
  }

  unsubscribe(sub: Subscriber<T>): void {
    this.subscribers = this.subscribers.filter((s) => s !== sub);
  }

  unsubscribeAll(): void {
    this.subscribers = [];
  }

  notify(data: T): void {
    this.subscribers.forEach((s) => s(data));
  }
}
