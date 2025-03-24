<script setup lang="ts">
// TabBar import removed as it's no longer used
import WorkflowDetails from '@/components/MainHeader/WorkflowDetails.vue';
import { useI18n } from '@/composables/useI18n';
import { usePushConnection } from '@/composables/usePushConnection';
import {
	LOCAL_STORAGE_HIDE_GITHUB_STAR_BUTTON,
	MAIN_HEADER_TABS,
	PLACEHOLDER_EMPTY_WORKFLOW_ID,
	STICKY_NODE_TYPE,
	VIEWS,
	N8N_MAIN_GITHUB_REPO_URL,
} from '@/constants';
import { useExecutionsStore } from '@/stores/executions.store';
import { useNDVStore } from '@/stores/ndv.store';
// usePostHog removed as it's no longer needed
import { useSettingsStore } from '@/stores/settings.store';
import { useSourceControlStore } from '@/stores/sourceControl.store';
import { useUIStore } from '@/stores/ui.store';
import { useWorkflowsStore } from '@/stores/workflows.store';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { RouteLocation, RouteLocationRaw } from 'vue-router';
import { useRoute, useRouter } from 'vue-router';

import { useLocalStorage } from '@vueuse/core';
import GithubButton from 'vue-github-button';

const router = useRouter();
const route = useRoute();
const locale = useI18n();
const pushConnection = usePushConnection({ router });
const ndvStore = useNDVStore();
const uiStore = useUIStore();
const sourceControlStore = useSourceControlStore();
const workflowsStore = useWorkflowsStore();
const executionsStore = useExecutionsStore();
const settingsStore = useSettingsStore();
// posthogStore removed as it's no longer used after tab removal

const activeHeaderTab = ref(MAIN_HEADER_TABS.WORKFLOW);
const workflowToReturnTo = ref('');
const executionToReturnTo = ref('');
const dirtyState = ref(false);
const githubButtonHidden = useLocalStorage(LOCAL_STORAGE_HIDE_GITHUB_STAR_BUTTON, false);

// Track the routes that are used for the tabs
// This is used to determine which tab to show when the route changes
// TODO: It might be easier to manage this in the router config, by passing meta information to the routes
// This would allow us to specify it just once on the root route, and then have the tabs be determined for children
const testDefinitionRoutes: VIEWS[] = [
	VIEWS.TEST_DEFINITION,
	VIEWS.TEST_DEFINITION_EDIT,
	VIEWS.TEST_DEFINITION_RUNS_DETAIL,
	VIEWS.TEST_DEFINITION_RUNS_COMPARE,
];

const workflowRoutes: VIEWS[] = [VIEWS.WORKFLOW, VIEWS.NEW_WORKFLOW, VIEWS.EXECUTION_DEBUG];

const executionRoutes: VIEWS[] = [
	VIEWS.EXECUTION_HOME,
	VIEWS.WORKFLOW_EXECUTIONS,
	VIEWS.EXECUTION_PREVIEW,
];
// Tabs have been moved to sidebar, this is kept for compatibility
const tabBarItems = computed(() => {
	return [];
});

const activeNode = computed(() => ndvStore.activeNode);
const hideMenuBar = computed(() =>
	Boolean(activeNode.value && activeNode.value.type !== STICKY_NODE_TYPE),
);
const workflow = computed(() => workflowsStore.workflow);
const workflowId = computed(() =>
	String(router.currentRoute.value.params.name || workflowsStore.workflowId),
);
const onWorkflowPage = computed(() => !!(route.meta.nodeView || route.meta.keepWorkflowAlive));
const readOnly = computed(() => sourceControlStore.preferences.branchReadOnly);
const isEnterprise = computed(
	() => settingsStore.isQueueModeEnabled && settingsStore.isWorkerViewAvailable,
);
const showGitHubButton = computed(
	() => !isEnterprise.value && !settingsStore.settings.inE2ETests && !githubButtonHidden.value,
);

watch(route, (to, from) => {
	syncTabsWithRoute(to, from);
});

onBeforeMount(() => {
	pushConnection.initialize();
});

onBeforeUnmount(() => {
	pushConnection.terminate();
});

onMounted(async () => {
	dirtyState.value = uiStore.stateIsDirty;
	syncTabsWithRoute(route);
});

function isViewRoute(name: unknown): name is VIEWS {
	return (
		typeof name === 'string' &&
		[testDefinitionRoutes, workflowRoutes, executionRoutes].flat().includes(name as VIEWS)
	);
}

function syncTabsWithRoute(to: RouteLocation, from?: RouteLocation): void {
	// Map route types to their corresponding tab in the header
	const routeTabMapping = [
		{ routes: testDefinitionRoutes, tab: MAIN_HEADER_TABS.TEST_DEFINITION },
		{ routes: executionRoutes, tab: MAIN_HEADER_TABS.EXECUTIONS },
		{ routes: workflowRoutes, tab: MAIN_HEADER_TABS.WORKFLOW },
	];

	// Update the active tab based on the current route
	if (to.name && isViewRoute(to.name)) {
		const matchingTab = routeTabMapping.find(({ routes }) => routes.includes(to.name as VIEWS));
		if (matchingTab) {
			activeHeaderTab.value = matchingTab.tab;
		}
	}

	// Store the current workflow ID, but only if it's not a new workflow
	if (to.params.name !== 'new' && typeof to.params.name === 'string') {
		workflowToReturnTo.value = to.params.name;
	}

	if (
		from?.name === VIEWS.EXECUTION_PREVIEW &&
		to.params.name === from.params.name &&
		typeof from.params.executionId === 'string'
	) {
		executionToReturnTo.value = from.params.executionId;
	}
}

function onTabSelected(tab: MAIN_HEADER_TABS, event: MouseEvent) {
	const openInNewTab = event.ctrlKey || event.metaKey;

	switch (tab) {
		case MAIN_HEADER_TABS.WORKFLOW:
			void navigateToWorkflowView(openInNewTab);
			break;

		case MAIN_HEADER_TABS.EXECUTIONS:
			void navigateToExecutionsView(openInNewTab);
			break;

		case MAIN_HEADER_TABS.TEST_DEFINITION:
			activeHeaderTab.value = MAIN_HEADER_TABS.TEST_DEFINITION;
			void router.push({ name: VIEWS.TEST_DEFINITION });
			break;

		default:
			break;
	}
}

async function navigateToWorkflowView(openInNewTab: boolean) {
	let routeToNavigateTo: RouteLocationRaw;
	if (!['', 'new', PLACEHOLDER_EMPTY_WORKFLOW_ID].includes(workflowToReturnTo.value)) {
		routeToNavigateTo = {
			name: VIEWS.WORKFLOW,
			params: { name: workflowToReturnTo.value },
		};
	} else {
		routeToNavigateTo = { name: VIEWS.NEW_WORKFLOW };
	}

	if (openInNewTab) {
		const { href } = router.resolve(routeToNavigateTo);
		window.open(href, '_blank');
	} else if (route.name !== routeToNavigateTo.name) {
		if (route.name === VIEWS.NEW_WORKFLOW) {
			uiStore.stateIsDirty = dirtyState.value;
		}
		activeHeaderTab.value = MAIN_HEADER_TABS.WORKFLOW;
		await router.push(routeToNavigateTo);
	}
}

async function navigateToExecutionsView(openInNewTab: boolean) {
	const routeWorkflowId =
		workflowId.value === PLACEHOLDER_EMPTY_WORKFLOW_ID ? 'new' : workflowId.value;
	const executionToReturnToValue = executionsStore.activeExecution?.id || executionToReturnTo.value;
	const routeToNavigateTo: RouteLocationRaw = executionToReturnToValue
		? {
				name: VIEWS.EXECUTION_PREVIEW,
				params: { name: routeWorkflowId, executionId: executionToReturnToValue },
			}
		: {
				name: VIEWS.EXECUTION_HOME,
				params: { name: routeWorkflowId },
			};

	if (openInNewTab) {
		const { href } = router.resolve(routeToNavigateTo);
		window.open(href, '_blank');
	} else if (route.name !== routeToNavigateTo.name) {
		dirtyState.value = uiStore.stateIsDirty;
		workflowToReturnTo.value = workflowId.value;
		activeHeaderTab.value = MAIN_HEADER_TABS.EXECUTIONS;
		await router.push(routeToNavigateTo);
	}
}

function hideGithubButton() {
	githubButtonHidden.value = true;
}
</script>

<template>
	<div :class="$style.container">
		<div
			:class="{ [$style['main-header']]: true, [$style.expanded]: !uiStore.sidebarMenuCollapsed }"
		>
			<div v-show="!hideMenuBar" :class="$style['top-menu']">
				<WorkflowDetails
					v-if="workflow?.name"
					:id="workflow.id"
					:tags="workflow.tags"
					:name="workflow.name"
					:meta="workflow.meta"
					:scopes="workflow.scopes"
					:active="workflow.active"
					:read-only="readOnly"
				/>
			</div>
			<!-- TabBar removed as per requirements to move navigation to sidebar -->
		</div>
	</div>
</template>

<style module lang="scss">
@import './lumiflow-header.scss';
.container {
	display: flex;
	position: relative;
	width: 100%;
	align-items: center;
}

.main-header {
	min-height: var(--navbar--height);
	background-color: var(--color-background-xlight);
	width: 100%;
	box-sizing: border-box;
	border-bottom: var(--border-width-base) var(--border-style-base) var(--color-foreground-base);
}

.top-menu {
	position: relative;
	display: flex;
	align-items: center;
	font-size: 0.9em;
	font-weight: 400;
	overflow: auto;
}

.github-button {
	display: flex;
	align-items: center;
	align-self: stretch;
	padding: var(--spacing-5xs) var(--spacing-m) 0;
	background-color: var(--color-background-xlight);
	border-left: var(--border-width-base) var(--border-style-base) var(--color-foreground-base);
}

.close-github-button {
	display: none;
	position: absolute;
	right: 0;
	top: 0;
	transform: translate(50%, -46%);
	color: var(--color-foreground-xdark);
	background-color: var(--color-background-xlight);
	border-radius: 100%;
	cursor: pointer;

	&:hover {
		color: var(--prim-color-primary-shade-100);
	}
}
.github-button-container {
	position: relative;
}

.github-button:hover .close-github-button {
	display: block;
}
</style>
