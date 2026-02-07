// Theme Management
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

// Pricing Constants (INR)
const PRICING = {
    dbuCostStandard: 3.50,  // ₹ per DBU for Standard
    storageCostPerTB: 1650, // ₹ per TB per month
    spotDiscount: 0.75,     // 75% savings
    autoscaleDiscount: 0.30 // 30% savings
};

// Calculator State
const state = {
    edition: 'standard',
    dbuMultiplier: 1,
    clusterType: 'jobs',
    dbuRate: 0.15,
    instanceType: 'm5.2xlarge',
    instanceCost: 0.384,
    nodeCount: 4,
    hoursPerDay: 8,
    daysPerMonth: 22,
    storage: 1,
    useSpot: false,
    useAutoscaling: false
};

// DOM Elements
const elements = {
    // Inputs
    editionButtons: document.querySelectorAll('[data-edition]'),
    clusterType: document.getElementById('clusterType'),
    instanceType: document.getElementById('instanceType'),
    nodeCount: document.getElementById('nodeCount'),
    hoursPerDay: document.getElementById('hoursPerDay'),
    daysPerMonth: document.getElementById('daysPerMonth'),
    storage: document.getElementById('storage'),
    spotInstances: document.getElementById('spotInstances'),
    autoscaling: document.getElementById('autoscaling'),
    
    // Displays
    nodeCountDisplay: document.getElementById('nodeCountDisplay'),
    hoursDisplay: document.getElementById('hoursDisplay'),
    daysDisplay: document.getElementById('daysDisplay'),
    storageDisplay: document.getElementById('storageDisplay'),
    
    // Results
    totalCost: document.getElementById('totalCost'),
    costSubtext: document.getElementById('costSubtext'),
    heroEstimate: document.getElementById('heroEstimate'),
    dbuCost: document.getElementById('dbuCost'),
    computeCost: document.getElementById('computeCost'),
    storageCost: document.getElementById('storageCost'),
    monthlyTotal: document.getElementById('monthlyTotal'),
    costPerHour: document.getElementById('costPerHour'),
    totalHours: document.getElementById('totalHours'),
    
    // UI
    breakdownToggle: document.getElementById('breakdownToggle'),
    costBreakdown: document.getElementById('costBreakdown'),
    comparisonGrid: document.getElementById('comparisonGrid')
};

// Event Listeners
elements.editionButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        elements.editionButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        state.edition = e.target.dataset.edition;
        state.dbuMultiplier = parseFloat(e.target.dataset.dbuMultiplier);
        calculate();
    });
});

elements.clusterType.addEventListener('change', (e) => {
    state.clusterType = e.target.value;
    state.dbuRate = parseFloat(e.target.selectedOptions[0].dataset.dbuRate);
    calculate();
});

elements.instanceType.addEventListener('change', (e) => {
    state.instanceType = e.target.value;
    state.instanceCost = parseFloat(e.target.selectedOptions[0].dataset.cost);
    calculate();
});

elements.nodeCount.addEventListener('input', (e) => {
    state.nodeCount = parseInt(e.target.value);
    elements.nodeCountDisplay.textContent = state.nodeCount;
    calculate();
});

elements.hoursPerDay.addEventListener('input', (e) => {
    state.hoursPerDay = parseFloat(e.target.value);
    elements.hoursDisplay.textContent = state.hoursPerDay;
    calculate();
});

elements.daysPerMonth.addEventListener('input', (e) => {
    state.daysPerMonth = parseInt(e.target.value);
    elements.daysDisplay.textContent = state.daysPerMonth;
    calculate();
});

elements.storage.addEventListener('input', (e) => {
    state.storage = parseFloat(e.target.value);
    elements.storageDisplay.textContent = state.storage.toFixed(1);
    calculate();
});

elements.spotInstances.addEventListener('change', (e) => {
    state.useSpot = e.target.checked;
    calculate();
});

elements.autoscaling.addEventListener('change', (e) => {
    state.useAutoscaling = e.target.checked;
    calculate();
});

elements.breakdownToggle.addEventListener('click', () => {
    elements.costBreakdown.classList.toggle('active');
    elements.breakdownToggle.classList.toggle('active');
});

// Calculation Functions
function calculate() {
    const totalHours = state.hoursPerDay * state.daysPerMonth;
    
    // DBU Cost
    const dbuPerHour = state.dbuRate * state.nodeCount;
    const totalDBUs = dbuPerHour * totalHours;
    let dbuCost = totalDBUs * PRICING.dbuCostStandard * state.dbuMultiplier;
    
    // Compute Cost
    let computeCost = state.instanceCost * state.nodeCount * totalHours;
    
    // Apply spot discount
    if (state.useSpot) {
        computeCost *= (1 - PRICING.spotDiscount);
    }
    
    // Apply autoscaling discount
    if (state.useAutoscaling) {
        dbuCost *= (1 - PRICING.autoscaleDiscount);
        computeCost *= (1 - PRICING.autoscaleDiscount);
    }
    
    // Storage Cost
    const storageCost = state.storage * PRICING.storageCostPerTB;
    
    // Total
    const totalCost = dbuCost + computeCost + storageCost;
    const costPerHour = totalCost / totalHours;
    
    // Update UI
    updateResults({
        totalCost,
        dbuCost,
        computeCost,
        storageCost,
        costPerHour,
        totalHours
    });
    
    // Update chart
    updateChart(dbuCost, computeCost, storageCost);
    
    // Update comparison
    updateComparison();
}

function updateResults(costs) {
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });
    
    const formatterDetailed = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2
    });
    
    // Main displays
    elements.totalCost.textContent = formatter.format(costs.totalCost);
    elements.heroEstimate.textContent = formatter.format(costs.totalCost);
    
    // Breakdown
    elements.dbuCost.textContent = formatter.format(costs.dbuCost);
    elements.computeCost.textContent = formatter.format(costs.computeCost);
    elements.storageCost.textContent = formatter.format(costs.storageCost);
    elements.monthlyTotal.textContent = formatter.format(costs.totalCost);
    
    // Hourly
    elements.costPerHour.textContent = formatterDetailed.format(costs.costPerHour);
    elements.totalHours.textContent = `${costs.totalHours.toFixed(0)}h`;
    
    // Update subtext with savings info
    let subtextParts = [];
    if (state.useSpot) subtextParts.push('Spot instances');
    if (state.useAutoscaling) subtextParts.push('Autoscaling');
    
    if (subtextParts.length > 0) {
        elements.costSubtext.textContent = `With ${subtextParts.join(' + ')} enabled`;
    } else {
        elements.costSubtext.textContent = `Based on current configuration`;
    }
}

function updateComparison() {
    const clusterTypes = [
        { name: 'Jobs Compute', type: 'jobs', dbuRate: 0.15 },
        { name: 'All-Purpose Compute', type: 'all-purpose', dbuRate: 0.40 },
        { name: 'SQL Compute', type: 'sql', dbuRate: 0.22 }
    ];
    
    const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    });
    
    const totalHours = state.hoursPerDay * state.daysPerMonth;
    
    elements.comparisonGrid.innerHTML = clusterTypes.map(cluster => {
        const dbuPerHour = cluster.dbuRate * state.nodeCount;
        const totalDBUs = dbuPerHour * totalHours;
        let dbuCost = totalDBUs * PRICING.dbuCostStandard * state.dbuMultiplier;
        
        let computeCost = state.instanceCost * state.nodeCount * totalHours;
        
        if (state.useSpot) computeCost *= (1 - PRICING.spotDiscount);
        if (state.useAutoscaling) {
            dbuCost *= (1 - PRICING.autoscaleDiscount);
            computeCost *= (1 - PRICING.autoscaleDiscount);
        }
        
        const storageCost = state.storage * PRICING.storageCostPerTB;
        const total = dbuCost + computeCost + storageCost;
        const costPerHour = total / totalHours;
        
        const isRecommended = cluster.type === 'jobs';
        
        return `
            <div class="comparison-card ${isRecommended ? 'recommended' : ''}">
                <div class="comparison-type">${cluster.name}</div>
                <div class="comparison-cost">${formatter.format(total)}</div>
                <div class="comparison-details">
                    <div class="comparison-detail">
                        <span>DBU Rate</span>
                        <span class="comparison-detail-value">${cluster.dbuRate}/hr</span>
                    </div>
                    <div class="comparison-detail">
                        <span>Cost/Hour</span>
                        <span class="comparison-detail-value">${formatter.format(costPerHour)}</span>
                    </div>
                    <div class="comparison-detail">
                        <span>Total DBUs</span>
                        <span class="comparison-detail-value">${totalDBUs.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Chart Setup
let costChart = null;

function updateChart(dbuCost, computeCost, storageCost) {
    const ctx = document.getElementById('costChart');
    
    if (!ctx) return;
    
    const theme = html.getAttribute('data-theme');
    const isDark = theme === 'dark';
    
    const chartColors = {
        dbu: '#06b6d4',
        compute: '#0ea5e9',
        storage: '#22d3ee'
    };
    
    const textColor = isDark ? '#d1d5db' : '#374151';
    
    if (costChart) {
        costChart.data.datasets[0].data = [dbuCost, computeCost, storageCost];
        costChart.update();
        return;
    }
    
    costChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['DBU Cost', 'Compute (EC2)', 'Storage'],
            datasets: [{
                data: [dbuCost, computeCost, storageCost],
                backgroundColor: [
                    chartColors.dbu,
                    chartColors.compute,
                    chartColors.storage
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 15,
                        font: {
                            family: "'Archivo', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: ₹${value.toFixed(0)} (${percentage}%)`;
                        }
                    },
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: isDark ? '#374151' : '#e5e7eb',
                    borderWidth: 1
                }
            }
        }
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
calculate();

// Add Chart.js from CDN
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
script.onload = () => {
    // Reinitialize chart after Chart.js loads
    calculate();
};
document.head.appendChild(script);

// Update nav active state on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
