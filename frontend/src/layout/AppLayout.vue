<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/authStore';
import { computed, ref, watch, onMounted } from 'vue';
import AppFooter from './AppFooter.vue';
import AppMenu from './AppMenu.vue';
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();
const authStore = useAuthStore();

// Fetch user on mount to check authentication status
onMounted(async () => {
    try {
        await authStore.fetchUser();
    } catch (error) {
        // User not authenticated, that's okay
        console.log('User not authenticated');
    }
});

const outsideClickListener = ref(null);

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    const classes = {
        // Base layout modes
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-slim': layoutConfig.menuMode === 'slim',
        'layout-compact': layoutConfig.menuMode === 'compact',
        'layout-reveal': layoutConfig.menuMode === 'reveal',
        'layout-drawer': layoutConfig.menuMode === 'drawer',
        'layout-horizontal': layoutConfig.menuMode === 'horizontal',
        
        // Active states
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'layout-sidebar-active': layoutState.sidebarActive
    };
    
    console.log('Current menu mode:', layoutConfig.menuMode);
    console.log('Container classes:', classes);
    
    return classes;
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        
        <!-- Horizontal Menu (when horizontal mode) -->
        <div v-if="layoutConfig.menuMode === 'horizontal'" class="layout-horizontal-menu">
            <app-menu></app-menu>
        </div>
        
        <!-- Sidebar Menu (for all other modes) -->
        <app-sidebar v-else></app-sidebar>
        
        <!-- Drawer Menu (when drawer mode) -->
        <Drawer 
            v-if="layoutConfig.menuMode === 'drawer'"
            v-model:visible="layoutState.sidebarActive"
            position="left"
            class="layout-drawer-menu"
            :style="{ width: '20rem' }"
        >
            <app-menu></app-menu>
        </Drawer>
        
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div>
    <Toast />
</template>
