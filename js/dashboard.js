// Dashboard-specific JavaScript
class DashboardManager {
    constructor() {
        this.charts = {};
        this.initCharts();
        this.setupWidgetManagement();
    }

    initCharts() {
        this.initComplianceTrendChart();
        this.initTaskStatusChart();
    }

    initComplianceTrendChart() {
        const ctx = document.getElementById('complianceTrendChart').getContext('2d');
        this.charts.complianceTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Compliance Score',
                    data: [72, 75, 78, 82, 80, 85, 83, 87, 85, 87],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 60,
                        max: 100
                    }
                }
            }
        });
    }

    initTaskStatusChart() {
        const ctx = document.getElementById('taskStatusChart').getContext('2d');
        this.charts.taskStatus = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: [
                        '#27ae60',
                        '#3498db',
                        '#f39c12',
                        '#e74c3c'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    setupWidgetManagement() {
        // Widget drag and drop functionality
        this.makeWidgetsDraggable();
        
        // Add widget functionality
        document.querySelectorAll('.add-widget').forEach(button => {
            button.addEventListener('click', (e) => {
                const widgetType = e.target.dataset.widget;
                this.addWidget(widgetType);
            });
        });
    }

    makeWidgetsDraggable() {
        // Simple drag and drop implementation
        const widgets = document.querySelectorAll('.widget');
        widgets.forEach(widget => {
            widget.setAttribute('draggable', 'true');
            
            widget.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', widget.dataset.widget);
                widget.classList.add('dragging');
            });
            
            widget.addEventListener('dragend', () => {
                widget.classList.remove('dragging');
                this.saveWidgetLayout();
            });
        });

        const container = document.getElementById('dashboard-widgets');
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(container, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                container.appendChild(draggable);
            } else {
                container.insertBefore(draggable, afterElement);
            }
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.widget:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    addWidget(widgetType) {
        // Implementation for adding new widgets
        console.log('Adding widget:', widgetType);
        // This would create and add a new widget to the dashboard
    }

    saveWidgetLayout() {
        const widgets = Array.from(document.querySelectorAll('.widget')).map(w => w.dataset.widget);
        localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    }

    updateChartData(chartId, newData) {
        if (this.charts[chartId]) {
            this.charts[chartId].data = newData;
            this.charts[chartId].update();
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});