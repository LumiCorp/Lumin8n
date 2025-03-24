/**
 * Simplified Telemetry plugin for internal distribution
 * This implementation provides the expected interface but doesn't send any data externally
 */

import type { App } from 'vue';
import type { ITelemetrySettings } from '@n8n/api-types';

// Use any to bypass the complex type requirements since this is just a stub implementation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Telemetry = any;

/**
 * Simplified implementation for internal distribution
 */
class NoOpTelemetry {
	// Common properties that might be accessed
	pageEventQueue: unknown[] = [];
	previousPath: string | null = null;
	rudderStack: null = null;

	// Generic method to handle any function call
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;

	constructor() {
		// Create a proxy to handle any method call
		return new Proxy(this, {
			get(target, prop) {
				// Return properties that exist
				if (prop in target) {
					return target[prop as keyof typeof target];
				}

				// For any method call, return a no-op function that logs the call
				return (...args: unknown[]) => {
					console.debug(`Telemetry ${String(prop)} (disabled for internal distribution)`, args);
					return undefined;
				};
			},
		});
	}

	// Implement commonly used methods
	track(eventName: string, properties?: unknown): void {
		console.debug('Telemetry track (disabled for internal distribution)', {
			eventName,
			properties,
		});
	}

	pageView(path: string, properties?: unknown): void {
		console.debug('Telemetry pageView (disabled for internal distribution)', { path, properties });
		this.previousPath = path;
	}

	init(settings: ITelemetrySettings, context?: Record<string, string | undefined>): void {
		console.debug('Telemetry init (disabled for internal distribution)');
	}

	flushPageEvents(): void {
		console.debug('Telemetry flushPageEvents (disabled for internal distribution)');
		this.pageEventQueue = [];
	}
}

// Export the telemetry instance
export const telemetry = new NoOpTelemetry();

// Vue plugin
export const TelemetryPlugin = {
	install(app: App) {
		app.config.globalProperties.$telemetry = telemetry;
	},
};
