// Tenant Management for Multi-Organization SaaS
class TenantManager {
    constructor() {
        this.currentTenant = null;
        this.tenants = [];
        this.init();
    }

    init() {
        this.loadTenants();
        this.setupTenantEventListeners();
        this.initializeTenantSwitcher();
    }

    async loadTenants() {
        try {
            // Simulate API call to load tenants
            this.tenants = await this.fetchTenants();
            this.currentTenant = this.tenants[0];
            this.renderTenantSwitcher();
        } catch (error) {
            console.error('Failed to load tenants:', error);
        }
    }

    async fetchTenants() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'acmi',
                        name: 'ACMI Education',
                        subdomain: 'acmi',
                        plan: 'professional',
                        status: 'active',
                        users: 15,
                        storage: '2.3GB',
                        compliance_score: 87,
                        created_at: '2023-01-15'
                    },
                    {
                        id: 'global',
                        name: 'Global Skills Institute',
                        subdomain: 'global',
                        plan: 'enterprise',
                        status: 'active',
                        users: 42,
                        storage: '5.1GB',
                        compliance_score: 92,
                        created_at: '2023-03-20'
                    },
                    {
                        id: 'metro',
                        name: 'Metro College',
                        subdomain: 'metro',
                        plan: 'basic',
                        status: 'trial',
                        users: 8,
                        storage: '1.2GB',
                        compliance_score: 78,
                        created_at: '2023-06-10'
                    }
                ]);
            }, 500);
        });
    }

    setupTenantEventListeners() {
        // Tenant switcher
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tenant-switch')) {
                const tenantId = e.target.dataset.tenantId;
                this.switchTenant(tenantId);
            }
        });

        // Add tenant modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'saveTenant') {
                this.createTenant();
            }
        });
    }

    initializeTenantSwitcher() {
        const switcher = document.getElementById('tenantSwitcher');
        if (switcher) {
            switcher.addEventListener('show.bs.dropdown', () => {
                this.renderTenantSwitcher();
            });
        }
    }

    renderTenantSwitcher() {
        const container = document.getElementById('tenantList');
        if (!container) return;

        container.innerHTML = this.tenants.map(tenant => `
            <li>
                <a class="dropdown-item tenant-switch ${tenant.id === this.currentTenant?.id ? 'active' : ''}" 
                   href="#" data-tenant-id="${tenant.id}">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${tenant.name}</strong>
                            <div class="small text-muted">${tenant.plan} • ${tenant.users} users</div>
                        </div>
                        <span class="badge bg-${this.getPlanBadgeColor(tenant.plan)}">${tenant.plan}</span>
                    </div>
                </a>
            </li>
        `).join('') + `
            <li><hr class="dropdown-divider"></li>
            <li>
                <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#addTenantModal">
                    <i class="fas fa-plus me-2"></i>Add New Organization
                </a>
            </li>
        `;
    }

    async switchTenant(tenantId) {
        const tenant = this.tenants.find(t => t.id === tenantId);
        if (!tenant) return;

        try {
            // Show loading state
            this.showLoadingState(true);

            // Simulate API call to switch tenant context
            await this.updateTenantContext(tenantId);

            this.currentTenant = tenant;
            this.updateUITenant(tenant);
            this.renderTenantSwitcher();

            // Refresh dashboard data
            if (window.dashboardManager) {
                window.dashboardManager.refreshDashboard();
            }

            this.showNotification(`Switched to ${tenant.name}`, 'success');

        } catch (error) {
            this.showNotification('Failed to switch organization', 'error');
        } finally {
            this.showLoadingState(false);
        }
    }

    async updateTenantContext(tenantId) {
        // Simulate API call to update tenant context
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem('currentTenant', tenantId);
                resolve();
            }, 1000);
        });
    }

    updateUITenant(tenant) {
        // Update current tenant display
        const tenantDisplays = document.querySelectorAll('.current-tenant');
        tenantDisplays.forEach(display => {
            display.textContent = tenant.name;
        });

        // Update plan badge
        const planBadges = document.querySelectorAll('.tenant-plan-badge');
        planBadges.forEach(badge => {
            badge.textContent = tenant.plan;
            badge.className = `badge bg-${this.getPlanBadgeColor(tenant.plan)} tenant-plan-badge`;
        });

        // Update tenant-specific data
        this.updateTenantSpecificData(tenant);
    }

    updateTenantSpecificData(tenant) {
        // Update metrics and data specific to current tenant
        const metrics = document.querySelectorAll('[data-tenant-metric]');
        metrics.forEach(metric => {
            const metricType = metric.getAttribute('data-tenant-metric');
            switch (metricType) {
                case 'compliance-score':
                    metric.textContent = `${tenant.compliance_score}%`;
                    break;
                case 'user-count':
                    metric.textContent = tenant.users;
                    break;
                case 'storage-usage':
                    metric.textContent = tenant.storage;
                    break;
            }
        });
    }

    async createTenant() {
        const form = document.getElementById('addTenantForm');
        const formData = new FormData(form);

        const tenantData = {
            name: formData.get('tenantName'),
            subdomain: formData.get('tenantSubdomain'),
            plan: formData.get('tenantPlan'),
            admin_email: formData.get('adminEmail'),
            max_users: parseInt(formData.get('maxUsers')),
            storage_limit: formData.get('storageLimit')
        };

        try {
            const newTenant = await this.saveTenant(tenantData);
            this.tenants.push(newTenant);
            this.renderTenantSwitcher();
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('addTenantModal')).hide();
            
            this.showNotification(`Organization ${newTenant.name} created successfully`, 'success');
            
            // Reset form
            form.reset();
            
        } catch (error) {
            this.showNotification('Failed to create organization', 'error');
        }
    }

    async saveTenant(tenantData) {
        // Simulate API call to create tenant
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: tenantData.subdomain,
                    name: tenantData.name,
                    subdomain: tenantData.subdomain,
                    plan: tenantData.plan,
                    status: 'active',
                    users: 1,
                    storage: '0GB',
                    compliance_score: 0,
                    created_at: new Date().toISOString().split('T')[0]
                });
            }, 1500);
        });
    }

    getPlanBadgeColor(plan) {
        const colors = {
            trial: 'warning',
            basic: 'secondary',
            professional: 'primary',
            enterprise: 'success'
        };
        return colors[plan] || 'secondary';
    }

    showLoadingState(show) {
        const loader = document.getElementById('tenantLoading');
        if (loader) {
            loader.style.display = show ? 'block' : 'none';
        }
    }

    showNotification(message, type) {
        // Use existing notification system or create simple alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 20px; right: 20px; z-index: 1060; min-width: 300px;';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    // Admin functions for super admins
    async suspendTenant(tenantId) {
        // Implementation for suspending a tenant
    }

    async updateTenantPlan(tenantId, newPlan) {
        // Implementation for updating tenant subscription plan
    }

    async getTenantUsage(tenantId) {
        // Implementation for getting tenant usage statistics
    }

    async exportTenantData(tenantId) {
        // Implementation for exporting tenant data
    }
}

// Initialize tenant manager
document.addEventListener('DOMContentLoaded', () => {
    window.tenantManager = new TenantManager();
});