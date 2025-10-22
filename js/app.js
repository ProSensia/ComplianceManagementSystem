// Main Application JavaScript
class ComplianceSaaS {
    constructor() {
        this.currentOrg = 'acmi';
        this.userRole = 'admin';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
        this.checkTrialStatus();
    }

    setupEventListeners() {
        // Organization switcher
        document.getElementById('org-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-item') && e.target.dataset.org) {
                e.preventDefault();
                this.switchOrganization(e.target.dataset.org);
            }
        });

        // Live support toggle
        document.getElementById('liveSupport').addEventListener('click', () => {
            this.toggleSupportPanel();
        });

        document.getElementById('closeSupport').addEventListener('click', () => {
            this.toggleSupportPanel(false);
        });

        // Refresh dashboard
        document.getElementById('refreshDashboard').addEventListener('click', () => {
            this.refreshDashboard();
        });
    }

    switchOrganization(orgId) {
        this.currentOrg = orgId;
        document.getElementById('current-org').textContent = 
            document.querySelector(`[data-org="${orgId}"]`).textContent;
        
        // Update active state in dropdown
        document.querySelectorAll('#org-list .dropdown-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-org="${orgId}"]`).classList.add('active');

        // Reload dashboard data for new organization
        this.refreshDashboard();
        
        // Show notification
        this.showNotification(`Switched to ${orgId} organization`, 'success');
    }

    toggleSupportPanel(show) {
        const panel = document.getElementById('supportPanel');
        if (show === undefined) {
            panel.classList.toggle('show');
        } else {
            panel.classList.toggle('show', show);
        }
    }

    refreshDashboard() {
        const dashboard = document.getElementById('dashboard-widgets');
        dashboard.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            dashboard.classList.remove('loading');
            this.showNotification('Dashboard updated', 'info');
        }, 1000);
    }

    loadUserPreferences() {
        // Load saved widget preferences
        const savedWidgets = localStorage.getItem('dashboardWidgets');
        if (savedWidgets) {
            this.restoreWidgetLayout(JSON.parse(savedWidgets));
        }
    }

    saveWidgetLayout(widgets) {
        localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    }

    restoreWidgetLayout(widgets) {
        // Implementation for restoring widget layout
        console.log('Restoring widget layout:', widgets);
    }

    checkTrialStatus() {
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 15); // 15 days remaining
        
        const daysRemaining = Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysRemaining <= 0) {
            document.getElementById('trialBanner').innerHTML = `
                <div class="alert alert-danger">
                    <strong>Trial Expired:</strong> Please upgrade to continue using RIO Safe
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0`;
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove toast after hide
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.complianceApp = new ComplianceSaaS();
});