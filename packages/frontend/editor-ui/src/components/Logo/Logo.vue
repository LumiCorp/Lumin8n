<script setup lang="ts">
import type { FrontendSettings } from '@n8n/api-types';
import { computed, onMounted, useCssModule, useTemplateRef } from 'vue';
import { useFavicon } from '@vueuse/core';

import LogoIcon from './logo-icon.svg';
import LogoText from './lumiflow2.svg'; // './logo-text.svg';

const props = defineProps<
	(
		| {
				location: 'authView';
		  }
		| {
				location: 'sidebar';
				collapsed: boolean;
		  }
	) & {
		releaseChannel: FrontendSettings['releaseChannel'];
	}
>();

const { location, releaseChannel } = props;

const showReleaseChannelTag = computed(() => {
	if (releaseChannel === 'stable') return false;
	if (location === 'authView') return true;
	return !props.collapsed;
});

const showLogoText = computed(() => {
	if (location === 'authView') return true;
	return !props.collapsed;
});

const $style = useCssModule();
const containerClasses = computed(() => {
	if (location === 'authView') {
		return [$style.logoContainer, $style.authView];
	}
	return [
		$style.logoContainer,
		$style.sidebar,
		props.collapsed ? $style.sidebarCollapsed : $style.sidebarExpanded,
	];
});

const svg = useTemplateRef<{ $el: Element }>('logo');
onMounted(() => {
	if (releaseChannel === 'stable' || !('createObjectURL' in URL)) return;

	const logoEl = svg.value!.$el;

	// Change the logo fill color inline, so that favicon can also use it
	const logoColor = releaseChannel === 'dev' ? '#838383' : '#E9984B';
	logoEl.querySelector('path')?.setAttribute('fill', logoColor);

	// Reuse the SVG as favicon
	const blob = new Blob([logoEl.outerHTML], { type: 'image/svg+xml' });
	useFavicon(URL.createObjectURL(blob));
});
</script>

<template>
	<div :class="containerClasses" data-test-id="">
		<LogoIcon ref="logo" :class="$style.logo" />
		<LogoText v-if="showLogoText" :class="$style.logoText" />
		<div v-if="showReleaseChannelTag" :class="$style.releaseChannelTag">{{ releaseChannel }}</div>
		<slot />
	</div>
</template>

<style lang="scss" module>
.logoContainer {
	display: flex;
	justify-content: center;
	align-items: center;
}

.logoText {
	margin-left: var(--spacing-xs);
	margin-right: var(--spacing-3xs);
	width: 150px; /* Adjust width to fit */
	height: auto; /* Maintain aspect ratio */
	max-width: 100%; /* Prevent overflow */
	display: block;

	path {
		fill: var(--color-text-dark); /* Maintain color compatibility */
	}
}

.releaseChannelTag {
	color: var(--color-text-dark);
	padding: var(--spacing-5xs) var(--spacing-4xs);
	background-color: var(--color-background-base);
	border: 1px solid var(--color-foreground-base);
	border-radius: var(--border-radius-base);
	font-size: var(--font-size-3xs);
	font-weight: var(--font-weight-bold);
	text-transform: capitalize;
	line-height: var(--font-line-height-regular);
	margin: 8px 0 0 3px;
}

.authView {
	transform: scale(2);
	margin-bottom: var(--spacing-xl);
}

.logo,
.logoText {
	transform: scale(1.3);
}

.logoText {
	margin-left: var(--spacing-xs);
	margin-right: var(--spacing-3xs);
}

.sidebarExpanded .logo {
	margin-left: var(--spacing-3xs);
}

.sidebarCollapsed .logo {
	width: 40px;
	height: 30px;
	padding: 0 var(--spacing-4xs);
}
</style>
