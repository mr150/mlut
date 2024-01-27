export class Logger {
	private readonly sign = '[mlut]';

	info(message: unknown, ...args: unknown[]) {
		console.log(this.sign, message, ...args);
	}

	warn(message: unknown, ...args: unknown[]) {
		console.warn(this.sign, message, ...args);
	}

	error(message: unknown, ...args: unknown[]) {
		console.error(this.sign, message, ...args);
	}
}

export const logger = new Logger();
