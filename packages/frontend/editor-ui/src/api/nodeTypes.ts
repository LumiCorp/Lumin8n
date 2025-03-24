import type {
	ActionResultRequestDto,
	OptionsRequestDto,
	ResourceLocatorRequestDto,
	ResourceMapperFieldsRequestDto,
} from '@n8n/api-types';
import { makeRestApiRequest } from '@/utils/apiUtils';
import type { INodeTranslationHeaders, IRestApiContext } from '@/Interface';
import type {
	INodeListSearchResult,
	INodePropertyOptions,
	INodeTypeDescription,
	INodeTypeNameVersion,
	NodeParameterValueType,
	ResourceMapperFields,
} from 'n8n-workflow';
import axios from 'axios';
import { getFallbackNodeTypes } from '@/utils/fallbackNodeTypes';

export async function getNodeTypes(baseUrl: string) {
	try {
		console.log(`Fetching node types from: ${baseUrl}types/nodes.json`);
		const response = await axios.get(baseUrl + 'types/nodes.json', {
			withCredentials: true,
			// Add timeout to ensure we don't hang forever
			timeout: 10000,
		});

		console.log(`Node types fetch successful. Status: ${response.status}`);
		console.log(`Received ${response.data?.length || 0} node types`);

		return response.data;
	} catch (error) {
		console.error('Error fetching node types:', error);

		if (axios.isAxiosError(error)) {
			console.error(`Status: ${error.response?.status}, Message: ${error.message}`);
			console.error('Response data:', error.response?.data);

			// Try alternative endpoint for node types via REST API
			try {
				console.log('Attempting to fetch node types via REST API endpoint');
				const fallbackResponse = await axios.get(baseUrl + 'rest/node-types', {
					withCredentials: true,
					timeout: 10000,
				});

				console.log(`Fallback node types fetch successful. Status: ${fallbackResponse.status}`);
				console.log(`Received ${fallbackResponse.data?.data?.length || 0} node types via fallback`);

				return fallbackResponse.data?.data || [];
			} catch (fallbackError) {
				console.error('Fallback node types request also failed:', fallbackError);
				// Use our hard-coded fallback node types
				console.warn('Using hard-coded fallback node types');
				return getFallbackNodeTypes();
			}
		}

		// Use our hard-coded fallback node types for all other error cases
		console.warn('Using hard-coded fallback node types for unknown error');
		return getFallbackNodeTypes();
	}
}

export async function getNodeTranslationHeaders(
	context: IRestApiContext,
): Promise<INodeTranslationHeaders | undefined> {
	return await makeRestApiRequest(context, 'GET', '/node-translation-headers');
}

export async function getNodesInformation(
	context: IRestApiContext,
	nodeInfos: INodeTypeNameVersion[],
): Promise<INodeTypeDescription[]> {
	return await makeRestApiRequest(context, 'POST', '/node-types', { nodeInfos });
}

export async function getNodeParameterOptions(
	context: IRestApiContext,
	sendData: OptionsRequestDto,
): Promise<INodePropertyOptions[]> {
	return await makeRestApiRequest(context, 'POST', '/dynamic-node-parameters/options', sendData);
}

export async function getResourceLocatorResults(
	context: IRestApiContext,
	sendData: ResourceLocatorRequestDto,
): Promise<INodeListSearchResult> {
	return await makeRestApiRequest(
		context,
		'POST',
		'/dynamic-node-parameters/resource-locator-results',
		sendData,
	);
}

export async function getResourceMapperFields(
	context: IRestApiContext,
	sendData: ResourceMapperFieldsRequestDto,
): Promise<ResourceMapperFields> {
	return await makeRestApiRequest(
		context,
		'POST',
		'/dynamic-node-parameters/resource-mapper-fields',
		sendData,
	);
}

export async function getLocalResourceMapperFields(
	context: IRestApiContext,
	sendData: ResourceMapperFieldsRequestDto,
): Promise<ResourceMapperFields> {
	return await makeRestApiRequest(
		context,
		'POST',
		'/dynamic-node-parameters/local-resource-mapper-fields',
		sendData,
	);
}

export async function getNodeParameterActionResult(
	context: IRestApiContext,
	sendData: ActionResultRequestDto,
): Promise<NodeParameterValueType> {
	return await makeRestApiRequest(
		context,
		'POST',
		'/dynamic-node-parameters/action-result',
		sendData,
	);
}
