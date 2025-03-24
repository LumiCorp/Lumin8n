/**
 * Simplified i18n implementation for internal distribution
 * This provides basic functions needed by components but without external language features
 */

import type { App } from 'vue';
// Import all translations from en.json
import enTranslations from './i18n/locales/en.json';

export type BaseTextKey = string | { key: string; fallback: string };

export interface I18nOptions {
	interpolate?: Record<string, string | number>;
	adjustToNumber?: number;
}

// Process the imported translations
// Flatten any nested objects to make them accessible with dot notation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const flattenTranslations = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
	return Object.keys(obj).reduce((acc: Record<string, string>, k) => {
		const pre = prefix.length ? `${prefix}.` : '';
		if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			Object.assign(acc, flattenTranslations(obj[k] as Record<string, any>, `${pre}${k}`));
		} else {
			// For pipe-separated pluralization strings, just use as is
			acc[`${pre}${k}`] = String(obj[k]);
		}
		return acc;
	}, {});
};

// Convert the imported translations to a flat structure
const importedTranslations = flattenTranslations(enTranslations);

// Default translations for common UI elements - merge with imported ones
// We'll keep the existing manually defined ones as a fallback
const defaultTranslations: Record<string, string> = {
	// Main sidebar
	'mainSidebar.workflows': 'Workflows',
	'mainSidebar.executions': 'Executions',
	'mainSidebar.credentials': 'Credentials',
	'mainSidebar.variables': 'Variables',
	'mainSidebar.settings': 'Settings',
	'mainSidebar.audit': 'Audit Log',
	'mainSidebar.community': 'Community',
	'mainSidebar.api': 'API',

	// Workflow-related
	'workflowHelpers.showMessage.title': 'Info',
	'workflowRun.showError.title': 'Error',
	'workflowActivator.workflowIsActive': 'Workflow is active',
	'nodeView.showMessage.stopExecutionTry.title': 'Execution stopped',

	// Credential-related
	'credentialEdit.credentialConfig.pleaseCheckTheErrorsBelow': 'Please check the errors below',
	'credentialEdit.credentialConfig.couldntConnectWithTheseSettings':
		"Couldn't connect with these settings",
	'credentialEdit.credentialConfig.retry': 'Retry',
	'credentialEdit.credentialConfig.retrying': 'Retrying',
	'credentialEdit.credentialConfig.accountConnected': 'Account connected',
	'credentialEdit.credentialConfig.reconnect': 'Reconnect',
	'credentialEdit.credentialConfig.connectionTestedSuccessfully': 'Connection tested successfully',
	'credentialEdit.credentialConfig.needHelpFillingOutTheseFields':
		'Need help filling out these fields?',
	'credentialEdit.credentialConfig.openDocs': 'Open docs',
	'credentialEdit.credentialConfig.theServiceYouReConnectingTo': "the service you're connecting to",
	'credentialEdit.credentialConfig.oAuthRedirectUrl': 'OAuth Redirect URL',
	'credentialEdit.credentialConfig.clickToCopy': 'Click to copy',
	'credentialEdit.credentialConfig.redirectUrlCopiedToClipboard':
		'Redirect URL copied to clipboard',
	'credentialEdit.credentialConfig.subtitle': 'Enter this URL in your {appName} App configuration',
	'credentialEdit.credentialConfig.retryCredentialTest': 'Retry credential test',
	'credentialEdit.credentialConfig.reconnectOAuth2Credential': 'Reconnect OAuth2 credential',
	'credentialEdit.credentialConfig.externalSecrets':
		'Use environment variables to securely store credentials',
	'credentialEdit.credentialConfig.externalSecrets.moreInfo': 'Learn more',
	'credentialEdit.credentialConfig.missingCredentialType': 'Missing credential type information',

	// Generic texts
	error: 'Error',
	'generic.workflow': 'Workflow',
	'generic.credential': 'Credential',
	'generic.variable_plural': 'Variables',
	'generic.tag_plural': 'Tags',
	'generic.upgrade': 'Upgrade',
	'generic.enterprise': 'Enterprise',
	'generic.unsavedWork.confirmMessage.message':
		'You have unsaved changes. Are you sure you want to leave?',
	'generic.unsavedWork.confirmMessage.headline': 'Unsaved Changes',
	'generic.unsavedWork.confirmMessage.confirmButtonText': 'Leave Page',
	'generic.unsavedWork.confirmMessage.cancelButtonText': 'Stay on Page',

	// Node-related
	'nodeView.showMessage.showMaxNodeTypeError.message':
		'Maximum of {adjustToNumber} nodes of this type allowed',
	'nodeViewV2.showError.failedToCreateNode': 'Failed to create node',
	'nodeView.showError.nodeNodeCompatible.title': 'Nodes not compatible',
	'nodeView.showError.nodeNodeCompatible.message':
		'The nodes "{sourceNodeName}" and "{targetNodeName}" are not compatible',
	'nodeView.noNodesGivenToAdd': 'No nodes to add',
	'nodeView.showError.importWorkflowData.title': 'Error importing workflow data',
	'nodeView.showError.getWorkflowDataFromUrl.title': 'Error getting workflow data from URL',
	'nodeView.showError.openExecution.title': 'Error opening execution',
	'nodeIssues.input.missing': 'Required input "{inputName}" is missing',
	'nodeIssues.credentials.notSet': 'Credentials for "{type}" are not set',
	'nodeHelpers.credentialsUnset': 'Credentials {type} are not set',

	// Settings related
	'settings.externalSecrets.docs':
		'https://docs.n8n.io/hosting/environment-variables/external-secrets/',

	// Execution related
	'executionsList.waiting': 'Waiting',
	'executionsList.canceled': 'Canceled',
	'executionsList.running': 'Running',
	'executionsList.new': 'New',
	'executionsList.succeeded': 'Succeeded',
	'executionsList.error': 'Error',
	'executionsList.started': '{time} on {date}',
	'executionsList.showMessage.stopExecution.message': 'Execution was canceled',

	// AI Assistant
	'aiAssistant.name': 'AI Assistant',

	// Node Creator Panel
	'nodeCreator.triggerHelperPanel.selectATrigger': 'Select a Trigger',
	'nodeCreator.triggerHelperPanel.selectATriggerDescription':
		'Select a trigger to start your workflow',
	'nodeCreator.triggerHelperPanel.manualTriggerDisplayName': 'Manual Trigger',
	'nodeCreator.triggerHelperPanel.manualTriggerDescription':
		'Start workflow manually by clicking a button',
	'nodeCreator.triggerHelperPanel.manualTriggerTag': 'Simple',
	'nodeCreator.triggerHelperPanel.webhookTriggerDisplayName': 'Webhook',
	'nodeCreator.triggerHelperPanel.webhookTriggerDescription':
		'Start workflow when data is received on a webhook URL',
	'nodeCreator.triggerHelperPanel.scheduleTriggerDisplayName': 'Schedule',
	'nodeCreator.triggerHelperPanel.scheduleTriggerDescription':
		'Start workflow at regular intervals',

	// Merge in all imported translations, but keep our existing translations as priority
	...importedTranslations,
};

// Storage for translations and headers
const translations: Record<string, Record<string, string>> = {};
const headers: Record<string, Record<string, string>> = {};
const credentialTranslations: Record<string, Record<string, string>> = {};

/**
 * Add translation for a node
 */
export function addNodeTranslation(
	nodeTranslation: Record<string, Record<string, string>>,
	locale: string,
): void {
	// Store node translation
	Object.entries(nodeTranslation).forEach(([nodeType, texts]) => {
		if (!translations[nodeType]) {
			translations[nodeType] = {};
		}
		Object.assign(translations[nodeType], texts);
	});
}

/**
 * Add translation for a credential
 */
export function addCredentialTranslation(
	credentialTranslation: Record<string, Record<string, string>>,
	locale: string,
): void {
	// Store credential translation
	Object.entries(credentialTranslation).forEach(([credentialType, texts]) => {
		if (!credentialTranslations[credentialType]) {
			credentialTranslations[credentialType] = {};
		}
		Object.assign(credentialTranslations[credentialType], texts);
	});
}

/**
 * Add headers for translations
 */
export function addHeaders(
	newHeaders: Record<string, Record<string, string>>,
	locale: string,
): void {
	// Store headers
	Object.entries(newHeaders).forEach(([category, texts]) => {
		if (!headers[category]) {
			headers[category] = {};
		}
		Object.assign(headers[category], texts);
	});
}

class I18nClass {
	// Default locale is always English
	locale = 'en';
	defaultLocale = 'en';
	fallbackLocale = 'en';
	availableLocales = ['en'];

	// Basic text functionality that returns a translation or the key itself
	baseText(key: BaseTextKey, options?: I18nOptions): string {
		// Check if input is already an object with fallback property
		if (typeof key === 'object' && key !== null && 'fallback' in key) {
			return key.fallback;
		}

		// First check if we have a translation for this key
		let text = defaultTranslations[key as string] || key;

		// Handle case where text might be a JSON string with fallback info
		// This handles cases where we see: { "key": "headers.n8n-nodes-base.dateTime.displayName", "fallback": "Date & Time"}
		if (typeof text === 'string') {
			// Check if it looks like a JSON string with fallback property
			if (text.includes('"fallback"')) {
				try {
					const parsed = JSON.parse(text);
					if (parsed && typeof parsed === 'object' && parsed.fallback) {
						text = parsed.fallback;
					}
				} catch (e) {
					// Not valid JSON or couldn't extract fallback, just use as is
					console.debug('Failed to parse potential fallback text:', text);
				}
			}
		}

		if (options?.interpolate) {
			// Simple interpolation for variables
			Object.entries(options.interpolate).forEach(([varName, value]) => {
				text = text.replace(new RegExp(`{${varName}}`, 'g'), String(value));
			});
		}

		// Handle pluralization
		if (options?.adjustToNumber !== undefined && options.adjustToNumber !== null) {
			// This is very simplified plural handling - would need to be expanded for proper pluralization
			if (options.adjustToNumber === 1) {
				text = text.replace(/_plural/g, '');
			}
		}

		return text;
	}

	// Alias for baseText to maintain compatibility with compiled code
	// However, handle the case where we get already stringified JSON objects,
	// which seems to happen specifically with node headers translations
	headerText(key: BaseTextKey, options?: I18nOptions): string {
		// Check if input is already an object with fallback property
		if (typeof key === 'object' && key !== null && 'fallback' in key) {
			return key.fallback;
		}

		// First get the result from baseText
		const text = this.baseText(key, options);

		// Check if this text looks like a stringified JSON object with fallback
		if (
			typeof text === 'string' &&
			text.startsWith('{') &&
			text.includes('"key"') &&
			text.includes('"fallback"')
		) {
			try {
				const parsed = JSON.parse(text);
				if (parsed && typeof parsed === 'object' && parsed.fallback) {
					return parsed.fallback;
				}
			} catch (e) {
				// If JSON parsing fails, just return the original text
				console.debug('Failed to parse potential fallback JSON in headerText:', text);
			}
		}

		return text;
	}

	// Method for node type translations specifically
	nodeTranslation(key: string | { key: string; fallback: string }): string {
		// Check if input is already an object with fallback property
		if (typeof key === 'object' && key !== null && 'fallback' in key) {
			return key.fallback;
		}

		let text = defaultTranslations[key as string] || key;

		// Handle node translation fallbacks which are often in JSON format
		if (typeof text === 'string' && text.includes('"fallback"')) {
			try {
				const parsed = JSON.parse(text);
				if (parsed && typeof parsed === 'object' && parsed.fallback) {
					text = parsed.fallback;
				}
			} catch (e) {
				// Not valid JSON or couldn't extract fallback, just use as is
			}
		}

		return text;
	}

	// Check if a translation exists
	exists(key: string): boolean {
		return key in defaultTranslations;
	}

	// Helper methods that components might use
	shortNodeType(name: string): string {
		return name;
	}

	localizeNodeName(name: string, type: string): string {
		return name;
	}

	nodeText(): {
		eventTriggerDescription: (desc: string) => string;
	} {
		return {
			eventTriggerDescription: (desc: string) => desc,
		};
	}

	displayTimer(milliseconds: number): string {
		const seconds = Math.floor(milliseconds / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
		}
		if (minutes > 0) {
			return `${minutes}m ${seconds % 60}s`;
		}
		return `${seconds}s`;
	}
}

// Create singleton instance
export const i18n = new I18nClass();

// Create Vue plugin
export const i18nInstance = {
	install(app: App) {
		app.config.globalProperties.$i18n = i18n;
	},
};

// Composable for use in components
export function useI18n() {
	return i18n;
}
