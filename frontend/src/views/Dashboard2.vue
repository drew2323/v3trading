<script setup>
import { ref, onMounted } from 'vue';

// Placeholder for future lightweight-charts integration
const chartContainer = ref(null);

onMounted(() => {
    // Chart initialization will go here
    console.log('Dashboard2 mounted - ready for lightweight-charts');
});
</script>

<template>
    <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12">
            <div class="card">
                <h5>Dashboard 2</h5>
                <p class="text-surface-500 dark:text-surface-400">
                    New dashboard with lightweight-charts integration coming soon.
                </p>
            </div>
        </div>

        <div class="col-span-12">
            <div class="card">
                <h5>Chart Area</h5>
                <div ref="chartContainer" class="chart-container">
                    <p class="text-center text-surface-500 dark:text-surface-400 p-8">
                        Lightweight Charts will be displayed here
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chart-container {
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
