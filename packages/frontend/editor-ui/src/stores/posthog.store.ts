import type { Ref } from 'vue';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useStorage } from '@/composables/useStorage';
import { useUsersStore } from '@/stores/users.store';
import { useRootStore } from '@/stores/root.store';
import { useSettingsStore } from '@/stores/settings.store';
import type { FeatureFlags, IDataObject } from 'n8n-workflow';
import { EXPERIMENTS_TO_TRACK, LOCAL_STORAGE_EXPERIMENT_OVERRIDES } from '@/constants';
import { useDebounce } from '@/composables/useDebounce';
import { useTelemetry } from '@/composables/useTelemetry';

const EVENTS = {
	IS_PART_OF_EXPERIMENT: 'User is part of experiment',
};

// Simplified in-memory implementation for internal use
if (typeof window.posthog === 'undefined') {
	window.posthog = {
		init: () => {},
		reset: () => {},
		identify: () => {},
		capture: () => {},
		people: { set: () => {} },
		register: () => {},
		onFeatureFlags: (callback) => callback([], {}),
	};
}

export type PosthogStore = ReturnType<typeof usePostHog>;

export const usePostHog = defineStore('posthog', () => {
	const usersStore = useUsersStore();
	const settingsStore = useSettingsStore();
	const telemetry = useTelemetry();
	const rootStore = useRootStore();
	const { debounce } = useDebounce();

	// Store feature flags locally
	const featureFlags: Ref<FeatureFlags | null> = ref({});
	const trackedDemoExp: Ref<FeatureFlags> = ref({});

	const overrides: Ref<Record<string, string | boolean>> = ref({});

	const reset = () => {
		// No need to reset external service, just clear local state
		featureFlags.value = {};
		trackedDemoExp.value = {};
	};

	const getVariant = (experiment: keyof FeatureFlags): FeatureFlags[keyof FeatureFlags] => {
		return overrides.value[experiment] ?? featureFlags.value?.[experiment];
	};

	const isVariantEnabled = (experiment: string, variant: string) => {
		return getVariant(experiment) === variant;
	};

	/**
	 * Checks if the given feature flag is enabled. Should only be used for boolean flags
	 */
	const isFeatureEnabled = (experiment: keyof FeatureFlags) => {
		return getVariant(experiment) === true;
	};

	if (!window.featureFlags) {
		// for testing and local overrides
		const cachedOverrides = useStorage(LOCAL_STORAGE_EXPERIMENT_OVERRIDES).value;
		if (cachedOverrides) {
			try {
				console.debug('Using locally cached feature flags', cachedOverrides);
				const parsedOverrides = JSON.parse(cachedOverrides);
				if (typeof parsedOverrides === 'object') {
					overrides.value = JSON.parse(cachedOverrides);
				}
			} catch (e) {
				console.debug('Could not load cached experiment overrides', e);
			}
		}

		window.featureFlags = {
			override: (name: string, value: string | boolean) => {
				overrides.value[name] = value;
				try {
					useStorage(LOCAL_STORAGE_EXPERIMENT_OVERRIDES).value = JSON.stringify(overrides.value);
				} catch (e) {}
			},

			getVariant,
			getAll: () => featureFlags.value ?? {},
		};
	}

	// No-op methods that maintain the same interface
	const identify = () => {
		// No actual identification with external service
		console.debug('Posthog identify called (disabled for internal distribution)');
	};

	const trackExperiment = (featFlags: FeatureFlags, name: string) => {
		const variant = featFlags[name];
		if (!variant || trackedDemoExp.value[name] === variant) {
			return;
		}

		// Use local telemetry which is also a no-op
		telemetry.track(EVENTS.IS_PART_OF_EXPERIMENT, {
			name,
			variant,
		});

		trackedDemoExp.value[name] = variant;
	};

	const trackExperiments = (featFlags: FeatureFlags) => {
		EXPERIMENTS_TO_TRACK.forEach((name) => trackExperiment(featFlags, name));
	};
	const trackExperimentsDebounced = debounce(trackExperiments, {
		debounceTime: 2000,
	});

	// This initializes the store but doesn't connect to any external service
	const init = (evaluatedFeatureFlags?: FeatureFlags) => {
		console.debug('Posthog init called (disabled for internal distribution)');

		// Just use the provided feature flags directly
		if (evaluatedFeatureFlags && Object.keys(evaluatedFeatureFlags).length) {
			featureFlags.value = evaluatedFeatureFlags;
			trackExperimentsDebounced(featureFlags.value);
		}
	};

	const capture = (event: string, properties: IDataObject) => {
		// No actual capture, just log for debugging
		console.debug('Posthog capture called (disabled for internal distribution)', {
			event,
			properties,
		});
	};

	const setMetadata = (metadata: IDataObject, target: 'user' | 'events') => {
		// No actual metadata setting
		console.debug('Posthog setMetadata called (disabled for internal distribution)', {
			metadata,
			target,
		});
	};

	return {
		init,
		isFeatureEnabled,
		isVariantEnabled,
		getVariant,
		reset,
		identify,
		capture,
		setMetadata,
		overrides,
	};
});
