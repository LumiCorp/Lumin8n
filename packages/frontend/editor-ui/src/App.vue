<script setup lang="ts">
import '@/polyfills';

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import LoadingView from '@/views/LoadingView.vue';
import BannerStack from '@/components/banners/BannerStack.vue';
import Modals from '@/components/Modals.vue';
import { APP_MODALS_ELEMENT_ID, VIEWS } from '@/constants';
import { useRootStore } from '@/stores/root.store';
import { useUIStore } from '@/stores/ui.store';
import { useUsersStore } from '@/stores/users.store';
import { useHistoryHelper } from '@/composables/useHistoryHelper';
import { useStyles } from './composables/useStyles';

const route = useRoute();
const rootStore = useRootStore();
const uiStore = useUIStore();
const usersStore = useUsersStore();

const { setAppZIndexes } = useStyles();

// Initialize undo/redo
useHistoryHelper(route);

const loading = ref(true);
const isDemoMode = computed(() => route.name === VIEWS.DEMO);
const hasContentFooter = ref(false);
const appGrid = ref<Element | null>(null);

onMounted(async () => {
	setAppZIndexes();
	loading.value = false;
	window.addEventListener('resize', updateGridWidth);
	await updateGridWidth();
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateGridWidth);
});

const updateGridWidth = async () => {
	await nextTick();
	if (appGrid.value) {
		const { width, height } = appGrid.value.getBoundingClientRect();
		uiStore.appGridDimensions = { width, height };
	}
};

watch(route, (r) => {
	hasContentFooter.value = r.matched.some(
		(matchedRoute) => matchedRoute.components?.footer !== undefined,
	);
});
</script>

<template>
	<LoadingView v-if="loading" />
	<div
		v-else
		id="n8n-app"
		:class="{
			[$style.container]: true,
			[$style.sidebarCollapsed]: uiStore.sidebarMenuCollapsed,
		}"
	>
		<div id="app-grid" ref="appGrid" :class="$style['app-grid']">
			<div id="banners" :class="$style.banners">
				<BannerStack v-if="!isDemoMode" />
			</div>
			<div id="header" :class="$style.header">
				<RouterView name="header" />
			</div>
			<div v-if="usersStore.currentUser" id="sidebar" :class="$style.sidebar">
				<RouterView name="sidebar" />
			</div>
			<div id="content" :class="$style.content">
				<div :class="$style.contentWrapper">
					<RouterView v-slot="{ Component }">
						<KeepAlive v-if="$route.meta.keepWorkflowAlive" include="NodeView" :max="1">
							<component :is="Component" />
						</KeepAlive>
						<component :is="Component" v-else />
					</RouterView>
				</div>
				<div v-if="hasContentFooter" :class="$style.contentFooter">
					<RouterView name="footer" />
				</div>
			</div>
			<div :id="APP_MODALS_ELEMENT_ID" :class="$style.modals">
				<Modals />
			</div>
		</div>
	</div>
</template>

<style lang="scss" module>
// On the root level, whole app is a flex container
.container {
	height: 100vh;
	overflow: hidden;
	display: grid;
	grid-template-columns: 1fr;
}

// App grid is the main app layout including modals and other absolute positioned elements
.app-grid {
	position: relative;
	display: grid;
	height: 100vh;
	grid-template-areas:
		'banners banners'
		'sidebar header'
		'sidebar content';
	grid-template-columns: auto 1fr;
	grid-template-rows: auto auto 1fr;
}

.banners {
	grid-area: banners;
	z-index: var(--z-index-top-banners);
}
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: auto;
	grid-area: content;
}

.contentFooter {
	height: auto;
	z-index: 10;
	width: 100%;
	display: none;

	// Only show footer if there's content
	&:has(*) {
		display: block;
	}
}
.contentWrapper {
	display: flex;
	grid-area: content;
	position: relative;
	overflow: auto;
	height: 100%;
	width: 100%;
	justify-content: center;

	main {
		width: 100%;
		height: 100%;
	}
}

.header {
	grid-area: header;
	z-index: var(--z-index-app-header);
	min-width: 0;
	min-height: 0;
}

.sidebar {
	grid-area: sidebar;
	z-index: var(--z-index-app-sidebar);
}

.modals {
	width: 100%;
}
</style>
