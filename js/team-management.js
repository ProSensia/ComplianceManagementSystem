// Team Management Functionality
class TeamManager {
    constructor() {
        this.teamMembers = [];
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.loadTeamData();
        this.setupEventListeners();
        this.setupRoleTemplates();
    }

    loadTeamData() {
        // Simulate loading team data
        this.teamMembers = [
            {
                id: 'sarah',
                name: 'Sarah Johnson',
                email: 'sarah.j@acmi.edu',
                role: 'compliance-admin',
                department: 'compliance',
                status: 'active',
                tasks: { completed: 12, total: 15, overdue: 0 },
                lastActive: 'Today, 09:24',
                avatar: 'https://via.placeholder.com/40'
            },
            {
                id: 'michael',
                name: 'Michael Chen',
                email: 'michael.c@acmi.edu',
                role: 'manager',
                department: 'academic',
                status: 'active',
                tasks: { completed: 8, total: 12, overdue: 1 },
                lastActive: 'Yesterday, 14:32',
                avatar: 'https://via.placeholder.com/40'
            },
            {
                id: 'david',
                name: 'David Wilson',
                email: 'david.w@acmi.edu',
                role: 'staff',
                department: 'administration',
                status: 'pending',
                tasks: { completed: 3, total: 8, overdue: 3 },
                lastActive: 'Never',
                avatar: 'https://via.placeholder.com/40'
            }
        ];
    }

    setupEventListeners() {
        // Filter application
        document.getElementById('applyFilters')?.addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('resetFilters')?.addEventListener('click', () => {
            this.resetFilters();
        });

        // Search functionality
        document.getElementById('teamSearch')?.addEventListener('input', (e) => {
            this.searchTeamMembers(e.target.value);
        });

        // Bulk actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('bulk-action')) {
                this.handleBulkAction(e.target.dataset.action);
            }
        });
    }

    setupRoleTemplates() {
        this.roleTemplates = {
            'compliance-admin': {
                name: 'Compliance Administrator',
                permissions: {
                    dashboard: true,
                    policies: true,
                    tasks: true,
                    registers: true,
                    reports: true,
                    files: true,
                    admin: true,
                    team: true
                },
                description: 'Full system access with administrative privileges'
            },
            'manager': {
                name: 'Department Manager',
                permissions: {
                    dashboard: true,
                    policies: true,
                    tasks: true,
                    registers: true,
                    reports: true,
                    files: true,
                    admin: false,
                    team: false
                },
                description: 'Department-level management access'
            },
            'auditor': {
                name: 'Compliance Auditor',
                permissions: {
                    dashboard: true,
                    policies: true,
                    tasks: false,
                    registers: true,
                    reports: true,
                    files: true,
                    admin: false,
                    team: false
                },
                description: 'Read-only access for audit purposes'
            },
            'staff': {
                name: 'Staff Member',
                permissions: {
                    dashboard: true,
                    policies: true,
                    tasks: true,
                    registers: false,
                    reports: false,
                    files: false,
                    admin: false,
                    team: false
                },
                description: 'Basic staff access for daily tasks'
            },
            'trainer': {
                name: 'Trainer',
                permissions: {
                    dashboard: true,
                    policies: false,
                    tasks: false,
                    registers: false,
                    reports: false,
                    files: false,
                    admin: false,
                    team: false
                },
                description: 'Limited access for training purposes'
            },
            'viewer': {
                name: 'Viewer',
                permissions: {
                    dashboard: true,
                    policies: true,
                    tasks: false,
                    registers: true,
                    reports: true,
                    files: false,
                    admin: false,
                    team: false
                },
                description: 'Read-only access for viewing reports'
            }
        };
    }

    applyFilters() {
        const department = document.getElementById('departmentFilter').value;
        const role = document.getElementById('roleFilter').value;
        const status = document.getElementById('statusFilter').value;

        this.currentFilters = {
            department: department !== 'all' ? department : null,
            role: role !== 'all' ? role : null,
            status: status !== 'all' ? status : null
        };

        this.filterTeamMembers();
    }

    resetFilters() {
        document.getElementById('departmentFilter').value = 'all';
        document.getElementById('roleFilter').value = 'all';
        document.getElementById('statusFilter').value = 'all';
        
        this.currentFilters = {};
        this.filterTeamMembers();
    }

    filterTeamMembers() {
        const filteredMembers = this.teamMembers.filter(member => {
            let matches = true;

            if (this.currentFilters.department && member.department !== this.currentFilters.department) {
                matches = false;
            }

            if (this.currentFilters.role && member.role !== this.currentFilters.role) {
                matches = false;
            }

            if (this.currentFilters.status && member.status !== this.currentFilters.status) {
                matches = false;
            }

            return matches;
        });

        this.renderTeamMembers(filteredMembers);
    }

    searchTeamMembers(query) {
        if (!query) {
            this.filterTeamMembers();
            return;
        }

        const searchTerm = query.toLowerCase();
        const filteredMembers = this.teamMembers.filter(member => 
            member.name.toLowerCase().includes(searchTerm) ||
            member.email.toLowerCase().includes(searchTerm) ||
            member.department.toLowerCase().includes(searchTerm) ||
            member.role.toLowerCase().includes(searchTerm)
        );

        this.renderTeamMembers(filteredMembers);
    }

    renderTeamMembers(members) {
        // Implementation for rendering members in table/grid view
        console.log('Rendering members:', members);
        // This would update the DOM with the filtered members
    }

    getRolePermissions(role) {
        return this.roleTemplates[role]?.permissions || this.roleTemplates['staff'].permissions;
    }

    updateMemberAccess(memberId, newPermissions) {
        const member = this.teamMembers.find(m => m.id === memberId);
        if (member) {
            member.permissions = newPermissions;
            this.showNotification('Access updated successfully', 'success');
        }
    }

    exportTeamData() {
        const data = {
            exportDate: new Date().toISOString(),
            teamMembers: this.teamMembers,
            filters: this.currentFilters
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `team-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Team data exported successfully', 'success');
    }

    handleBulkAction(action) {
        const selectedMembers = this.getSelectedMembers();
        
        switch (action) {
            case 'invite':
                this.bulkInvite(selectedMembers);
                break;
            case 'deactivate':
                this.bulkDeactivate(selectedMembers);
                break;
            case 'export':
                this.bulkExport(selectedMembers);
                break;
            default:
                console.warn('Unknown bulk action:', action);
        }
    }

    getSelectedMembers() {
        // Implementation for getting selected members from checkboxes
        return this.teamMembers.filter(member => member.selected);
    }

    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-bg-${type} border-0 position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 1080;';
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">${message}</div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }
}

// Initialize team manager
document.addEventListener('DOMContentLoaded', () => {
    window.teamManager = new TeamManager();
});