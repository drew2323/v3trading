import { computed, reactive, watch } from 'vue';

const STORAGE_KEY = 'v3trading-layout-settings';

const defaultConfig = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkTheme: false,
    menuMode: 'static',
    menuTheme: 'dark',
    colorScheme: 'light',
    cardStyle: 'filled'
};

// Load settings from localStorage or use defaults
const loadSettings = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...defaultConfig, ...parsed };
        }
    } catch (error) {
        console.error('Error loading settings from localStorage:', error);
    }
    return { ...defaultConfig };
};

// Save settings to localStorage
const saveSettings = (config) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
        console.error('Error saving settings to localStorage:', error);
    }
};

const layoutConfig = reactive(loadSettings());

// Apply dark theme class if needed on load
if (layoutConfig.darkTheme) {
    document.documentElement.classList.add('app-dark');
}

// Watch for changes and save to localStorage
let saveTimeout;
watch(
    layoutConfig,
    (newConfig) => {
        // Debounce saves to avoid excessive writes
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveSettings(newConfig);
        }, 300);
    },
    { deep: true }
);

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
    activeMenuItem: null,
    sidebarActive: false
});

export function useLayout() {
    const setActiveMenuItem = (item) => {
        layoutState.activeMenuItem = item.value || item;
    };

    const toggleDarkMode = () => {
        if (!document.startViewTransition) {
            executeDarkModeToggle();

            return;
        }

        document.startViewTransition(() => executeDarkModeToggle());
    };

    const executeDarkModeToggle = () => {
        layoutConfig.darkTheme = !layoutConfig.darkTheme;
        document.documentElement.classList.toggle('app-dark');
    };

    const toggleMenu = () => {
        if (layoutConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        } else if (layoutConfig.menuMode === 'drawer') {
            layoutState.sidebarActive = !layoutState.sidebarActive;
        } else if (layoutConfig.menuMode === 'reveal') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;
        }
    };

    const isSidebarActive = computed(() => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive);

    const isDarkTheme = computed(() => layoutConfig.darkTheme);

    const getPrimary = computed(() => layoutConfig.primary);

    const getSurface = computed(() => layoutConfig.surface);

    return {
        layoutConfig,
        layoutState,
        toggleMenu,
        isSidebarActive,
        isDarkTheme,
        getPrimary,
        getSurface,
        setActiveMenuItem,
        toggleDarkMode
    };
}
