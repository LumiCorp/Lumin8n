import type { Plugin } from 'vue';
import { AxiosError } from 'axios';
import { ResponseError } from '@/utils/apiUtils';
import type { ErrorEvent, EventHint } from '@sentry/vue';

// No-op implementation to maintain API compatibility while disabling external reporting
// Create a simplified Sentry mock
const SentryMock = {
	init: () => {},
	captureException: () => {},
	captureMessage: () => {},
	setTag: () => {},
	setUser: () => {},
	setContext: () => {},
	setExtra: () => {},
	rewriteFramesIntegration: () => ({ root: '' }),
};

// Export the mock for any imports
export * from '@sentry/vue';
export default SentryMock;

const ignoredErrors = [
	{ instanceof: AxiosError },
	{ instanceof: ResponseError, message: /ECONNREFUSED/ },
	{ instanceof: ResponseError, message: "Can't connect to n8n." },
	{ instanceof: ResponseError, message: 'Unauthorized' },
	{ instanceof: RangeError, message: /Position \d+ is out of range for changeset of length \d+/ },
	{ instanceof: RangeError, message: /Invalid change range \d+ to \d+/ },
	{ instanceof: RangeError, message: /Selection points outside of document$/ },
	{ instanceof: Error, message: /ResizeObserver/ },
] as const;

// Keep the beforeSend function for compatibility, but make it a no-op
export function beforeSend(event: ErrorEvent, { originalException }: EventHint) {
	console.debug('Sentry beforeSend called (disabled for internal distribution)', {
		event,
		originalException,
	});
	return null; // Always return null to prevent sending
}

// Create a no-op plugin
export const SentryPlugin: Plugin = {
	install: (app) => {
		console.debug('Sentry plugin install called (disabled for internal distribution)');
		// Do nothing, effectively disabling Sentry
	},
};

// Override captureException to prevent any reporting
export const captureException = (exception: Error | unknown, context?: Record<string, unknown>) => {
	console.debug('Sentry captureException called (disabled for internal distribution)', {
		exception,
		context,
	});
	// Return an empty string as a mock event_id
	return '';
};
