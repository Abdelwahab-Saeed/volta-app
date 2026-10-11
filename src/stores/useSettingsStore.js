import { create } from 'zustand';
import { getSettings } from '@/api/settings.api';

// Header (contact bar) and Footer both show the social links from the admin
// settings. Share one in-flight request so they don't fetch them twice.
let inFlight = null;

export const useSettingsStore = create((set, get) => ({
    settings: {},
    loaded: false,

    fetchSettings: async () => {
        if (get().loaded) return get().settings;
        if (inFlight) return inFlight;

        inFlight = (async () => {
            try {
                const response = await getSettings();
                const settings = response.data || {};
                set({ settings, loaded: true });
                return settings;
            } catch (error) {
                console.error('Failed to fetch settings', error);
                return {};
            } finally {
                inFlight = null;
            }
        })();

        return inFlight;
    },
}));
