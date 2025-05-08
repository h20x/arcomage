export class CommandQueue {
  private commands: Command[] = [];

  private isExecuting: boolean = false;

  constructor() {}

  async add(command: Command): Promise<void> {
    this.commands.push(command);

    if (this.isExecuting) {
      return;
    }

    this.isExecuting = true;

    while (this.commands.length) {
      await this.commands.shift()!.execute();
    }

    this.isExecuting = false;
  }

  clear(): void {
    this.commands.length = 0;
  }
}

export interface Command {
  execute(): Promise<void>;
}
