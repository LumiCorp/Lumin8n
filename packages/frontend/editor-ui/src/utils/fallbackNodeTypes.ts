/**
 * This file provides fallback node types data in case the API calls fail
 * It includes basic node types to ensure the UI remains functional
 */

import { NodeConnectionType } from 'n8n-workflow';
import type { INodeTypeDescription } from 'n8n-workflow';

export const FALLBACK_NODE_TYPES: INodeTypeDescription[] = [
	{
		name: 'n8n-nodes-base.manualTrigger',
		displayName: 'Manual Trigger',
		icon: 'fa:mouse-pointer',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when you click on it',
		defaults: {
			name: 'Manual Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		properties: [],
	},
	{
		name: 'n8n-nodes-base.webhook',
		displayName: 'Webhook',
		icon: 'fa:link',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when a webhook is called',
		defaults: {
			name: 'Webhook',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		properties: [],
	},
	{
		name: 'n8n-nodes-base.set',
		displayName: 'Set',
		icon: 'fa:pen',
		group: ['transform'],
		version: 1,
		description: 'Sets values on items',
		defaults: {
			name: 'Set',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [],
	},
	{
		name: 'n8n-nodes-base.httpRequest',
		displayName: 'HTTP Request',
		icon: 'fa:globe',
		group: ['output'],
		version: 1,
		description: 'Makes an HTTP request and returns the response',
		defaults: {
			name: 'HTTP Request',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [],
	},
	{
		name: 'n8n-nodes-base.code',
		displayName: 'Code',
		icon: 'fa:code',
		group: ['transform'],
		version: 1,
		description: 'Runs custom JavaScript code',
		defaults: {
			name: 'Code',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [],
	},
	{
		name: 'n8n-nodes-base.if',
		displayName: 'IF',
		icon: 'fa:code-branch',
		group: ['transform'],
		version: 1,
		description: 'Conditional logic to route workflow data',
		defaults: {
			name: 'IF',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main, NodeConnectionType.Main],
		properties: [],
	},
	{
		name: 'n8n-nodes-base.merge',
		displayName: 'Merge',
		icon: 'fa:arrows-alt-h',
		group: ['transform'],
		version: 1,
		description: 'Merges data of multiple streams',
		defaults: {
			name: 'Merge',
		},
		inputs: [NodeConnectionType.Main, NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [],
	},
	// AI nodes
	{
		name: 'n8n-nodes-base.aiTransform',
		displayName: 'AI Transform',
		icon: 'fa:robot',
		group: ['transform', 'ai'],
		version: 1,
		description: 'Use AI to transform your data',
		defaults: {
			name: 'AI Transform',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [],
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Chains'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.aitransform/',
					},
				],
			},
		},
	},
];

/**
 * Use this function to get fallback node types
 * @returns An array of basic node types
 */
export function getFallbackNodeTypes(): INodeTypeDescription[] {
	console.warn('Using fallback node types - API endpoints may be unavailable');
	return FALLBACK_NODE_TYPES;
}
