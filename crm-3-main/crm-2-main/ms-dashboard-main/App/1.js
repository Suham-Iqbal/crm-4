document.addEventListener('DOMContentLoaded', () => {
  
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    window.location.href = 'login.html';
    return;
  }

  const modulesData = {
    "modules": [
      {
        "id": "dashboard", "name": "Dashboard", "icon": "bi-speedometer2",
        "subSections": [
          { "id": "overview", "name": "Overview" }, 
          { "id": "reports", "name": "Reports" }, 
          { "id": "analytics", "name": "Analytics" },
          { "id": "system-overview", "name": "System Overview" },
          { "id": "analytics-reports", "name": "Analytics Reports" },
          { "id": "quick-actions", "name": "Quick Actions & Features" },
          { "id": "team-chat-dash", "name": "Team Chat" },
          { "id": "private-messages", "name": "Private Messages" },
          { "id": "activities-dash", "name": "Activities" },
          { "id": "notifications", "name": "Notifications" },
          { "id": "calendar", "name": "Calendar" },
          { "id": "file-manager", "name": "File Manager" },
          { "id": "time-tracking", "name": "Time Tracking" },
          { "id": "project-management", "name": "Project Management" }
        ]
      },
      {
        "id": "chat", "name": "Team Chat", "icon": "bi-people-fill",
        "subSections": [{ "id": "general-chat", "name": "General Chat" }]
      },
      {
        "id": "Private Chat", "name": "Chat", "icon": "bi bi-chat",
        "subSections": [{ "id": "user-management", "name": "User Management" }, { "id": "integrations", "name": "Integrations" }, { "id": "preferences", "name": "Preferences" }]
      },
      
      {
        "id": "Activity", "name": "Activity", "icon": "bi bi-activity",
        "subSections": [{ "id": "All Activity", "name": "All Activity" }, { "id": " Filter Activity", "name": " Filter Activity" }, { "id": "Mark as Read/Unread", "name": "Mark as Read/Unread" }]
      },
      {
        "id": "deals", "name": "Deals", "icon": "bi-cash-stack",
        "subSections": [{ "id": "active-deals", "name": "Active Deals" }, { "id": "closed-deals", "name": "Closed Deals" }, { "id": "pipeline-view", "name": "Pipeline View" }]
      },
      {
        "id": "tasks", "name": "Tasks", "icon": "bi-check2-square",
        "subSections": [{ "id": "my-tasks", "name": "My Tasks" }, { "id": "team-tasks", "name": "Team Tasks" }, { "id": "calendar", "name": "Calendar" }]
      },
      {
        "id": "campaigns", "name": "Campaigns", "icon": "bi-megaphone-fill",
        "subSections": [{ "id": "active-campaigns", "name": "Active Campaigns" }, { "id": "past-campaigns", "name": "Past Campaigns" }]
      },
      {
        "id": "support", "name": "Support", "icon": "bi-headset",
        "subSections": [{ "id": "open-tickets", "name": "Open Tickets" }, { "id": "knowledge-base", "name": "Knowledge Base" }]
      },
      {
        "id": "customers", "name": "Customers", "icon": "bi bi-telephone",
        "subSections": [{ "id": "all-customers", "name": "All Customers" }, { "id": "leads", "name": "Leads" }, { "id": "accounts", "name": "Accounts" }]
      },
      {
        "id": "settings", "name": "Settings", "icon": "bi-gear-fill",
        "subSections": [ { "id": "integrations", "name": "Integrations" }, { "id": "preferences", "name": "Preferences" },{ "id": "user-management", "name": "User Management" }]
      },
      
    ]
  };

  const state = { activeModuleIcon: null, activeSubSectionItem: null };
  const userManagementModal = new bootstrap.Modal(document.getElementById('userManagementModal'));

  const el = {
    miniSidebar: document.getElementById("miniSidebar"),
    subSidebar: document.getElementById("subSidebar"),
    subList: document.getElementById("subList"),
    searchInput: document.getElementById("searchInput"),
    expandBtn: document.getElementById("expandBtn"),
    mainContent: document.getElementById("mainContent"),
    dragHandle: document.getElementById("dragHandle"),
    dataDisplay: document.getElementById("dataDisplay"),
    mainContentHeader: document.getElementById("mainContentHeader"),
    userName: document.getElementById("userName"),
    logoutBtn: document.getElementById("logoutBtn"),
    appContainer: document.getElementById('app-container'),
    toastContainer: document.querySelector('.toast-container')
  };

  const showToast = (message, type = 'success') => {
    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`;
    el.toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    toastElement.addEventListener('hidden.bs.toast', () => toastElement.remove());
  };

  const renderIcons = (filter = "") => {
    el.miniSidebar.innerHTML = "";
    modulesData.modules.forEach(module => {
      if (module.name.toLowerCase().includes(filter) || module.subSections.some(s => s.name.toLowerCase().includes(filter))) {
        const iconDiv = document.createElement("div");
        iconDiv.className = 'icon-wrapper';
        iconDiv.innerHTML = `<i class="bi ${module.icon} fs-4"></i>`;
        iconDiv.title = module.name;
        iconDiv.addEventListener("click", () => {
          if (state.activeModuleIcon) state.activeModuleIcon.classList.remove('active');
          iconDiv.classList.add('active');
          state.activeModuleIcon = iconDiv;
          loadSubSections(module);
        });
        el.miniSidebar.appendChild(iconDiv);
      }
    });
  };

  const loadSubSections = (module) => {
    el.subSidebar.querySelector("h6").textContent = module.name;
    el.subList.innerHTML = "";
    el.mainContentHeader.textContent = module.name;

    module.subSections.forEach((sub, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.textContent = sub.name;
      li.addEventListener("click", () => {
        if (state.activeSubSectionItem) state.activeSubSectionItem.classList.remove('active');
        li.classList.add('active');
        state.activeSubSectionItem = li;
        renderContent(module, sub);
      });
      el.subList.appendChild(li);
      if (index === 0) li.click();
    });
  };

  const renderContent = (module, sub) => {
    el.mainContentHeader.textContent = `${module.name} → ${sub.name}`;
    el.dataDisplay.className = 'p-4';

    switch (sub.id) {
      case 'user-management':
        renderUserManagement();
        break;
      case 'general-chat':
        renderChatInterface();
        break;
      case 'All Activity':
        renderAllActivities();
        break;
      case ' Filter Activity':
        renderFilterActivities();
        break;
      case 'Mark as Read/Unread':
        renderMarkActivities();
        break;
      case 'overview':
        renderDashboardOverview();
        break;
      case 'reports':
        renderReportsSection();
        break;
      case 'analytics':
        renderAnalyticsSection();
        break;
      case 'system-overview':
        renderSystemOverview();
        break;
      case 'analytics-reports':
        renderAnalyticsReports();
        break;
      case 'quick-actions':
        renderQuickActions();
        break;
      case 'team-chat-dash':
        renderChatInterface();
        break;
      case 'private-messages':
        renderPrivateMessages();
        break;
      case 'activities-dash':
        renderAllActivities();
        break;
      case 'notifications':
        renderNotifications();
        break;
      case 'calendar':
        renderCalendarSection();
        break;
      case 'file-manager':
        renderFileManagerSection();
        break;
      case 'time-tracking':
        renderTimeTrackingSection();
        break;
      case 'project-management':
        renderProjectManagementSection();
        break;
      default:
        renderGenericContent(module, sub);
    }
  };

  const renderGenericContent = (module, sub) => {
    el.dataDisplay.innerHTML = `
      <h3>${sub.name}</h3>
      <p>Data for <strong>${module.name} → ${sub.name}</strong> will be displayed here.</p>
      <p class="text-muted">This is a placeholder for the ${sub.id} section.</p>
    `;
  };

  // New Dashboard Section Renderers
  const renderReportsSection = () => {
    el.dataDisplay.innerHTML = `
      <div class="container-fluid">
        <h3><i class="bi bi-graph-up me-2"></i>Reports</h3>
        <div class="row mt-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5><i class="bi bi-bar-chart me-2"></i>Performance Report</h5>
              </div>
              <div class="card-body text-center">
                <i class="bi bi-graph-up fs-1 text-success mb-3"></i>
                <p>Generate comprehensive performance reports</p>
                <button class="btn btn-success" onclick="showReports()">Generate Report</button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5><i class="bi bi-pie-chart me-2"></i>Usage Analytics</h5>
              </div>
              <div class="card-body text-center">
                <i class="bi bi-pie-chart fs-1 text-info mb-3"></i>
                <p>Detailed usage analytics and insights</p>
                <button class="btn btn-info" onclick="showAnalytics()">View Analytics</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderAnalyticsSection = () => {
    el.dataDisplay.innerHTML = `
      <div class="container-fluid">
        <h3><i class="bi bi-speedometer2 me-2"></i>Analytics</h3>
        <div class="row mt-4">
          <div class="col-md-4 text-center">
            <div class="card">
              <div class="card-body">
                <h2 class="text-success">98%</h2>
                <p>System Uptime</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="card">
              <div class="card-body">
                <h2 class="text-info">1.2s</h2>
                <p>Avg Response Time</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="card">
              <div class="card-body">
                <h2 class="text-warning">${JSON.parse(localStorage.getItem('users') || '[]').length}</h2>
                <p>Active Users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderSystemOverview = () => {
    el.dataDisplay.innerHTML = `
      <div class="container-fluid">
        <h3><i class="bi bi-gear-wide-connected me-2"></i>System Overview</h3>
        <div class="row mt-4">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5>System Health</h5>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <span>CPU Usage</span>
                  <span class="text-success">45%</span>
                </div>
                <div class="progress mb-2">
                  <div class="progress-bar bg-success" style="width: 45%"></div>
                </div>
                <div class="d-flex justify-content-between">
                  <span>Memory Usage</span>
                  <span class="text-warning">62%</span>
                </div>
                <div class="progress">
                  <div class="progress-bar bg-warning" style="width: 62%"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5>System Status</h5>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span>Database</span>
                  <span class="badge bg-success">Online</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span>API Server</span>
                  <span class="badge bg-success">Running</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span>Cache Server</span>
                  <span class="badge bg-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderAnalyticsReports = () => {
    el.dataDisplay.innerHTML = `
      <div class="container-fluid">
        <h3><i class="bi bi-bar-chart me-2"></i>Analytics Reports</h3>
        <div class="row mt-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5>Generate Custom Reports</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4">
                    <label class="form-label">Report Type</label>
                    <select class="form-select">
                      <option>User Activity Report</option>
                      <option>Performance Report</option>
                      <option>System Usage Report</option>
                      <option>Financial Report</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Date Range</label>
                    <select class="form-select">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Custom Range</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label">Format</label>
                    <select class="form-select">
                      <option>PDF</option>
                      <option>Excel</option>
                      <option>CSV</option>
                    </select>
                  </div>
                  <div class="col-md-2 d-flex align-items-end">
                    <button class="btn btn-primary w-100">Generate</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderQuickActions = () => {
    showQuickActionsModal();
  };

  const renderPrivateMessages = () => {
    renderUserManagement();
  };

  const renderNotifications = () => {
    showNotificationCenter();
  };

  const renderCalendarSection = () => {
    showCalendarView();
  };

  const renderFileManagerSection = () => {
    showFileManager();
  };

  const renderTimeTrackingSection = () => {
    showTimeTracker();
  };

  const renderProjectManagementSection = () => {
    el.dataDisplay.innerHTML = `
      <div class="container-fluid">
        <h3><i class="bi bi-kanban me-2"></i>Project Management</h3>
        <div class="row mt-4">
          <div class="col-md-4">
            <div class="card">
              <div class="card-header bg-info text-white">
                <h6>To Do</h6>
              </div>
              <div class="card-body" style="min-height: 300px;">
                <div class="card mb-2">
                  <div class="card-body p-2">
                    <small>Setup new CRM module</small>
                  </div>
                </div>
                <div class="card mb-2">
                  <div class="card-body p-2">
                    <small>Review user feedback</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <div class="card-header bg-warning text-white">
                <h6>In Progress</h6>
              </div>
              <div class="card-body" style="min-height: 300px;">
                <div class="card mb-2">
                  <div class="card-body p-2">
                    <small>Database optimization</small>
                  </div>
                </div>
                <div class="card mb-2">
                  <div class="card-body p-2">
                    <small>UI improvements</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card">
              <div class="card-header bg-success text-white">
                <h6>Completed</h6>
              </div>
              <div class="card-body" style="min-height: 300px;">
                <div class="card mb-2">
                  <div class="card-body p-2">
                    <small>Login system setup</small>
                  </div>
                </div>
                <div class="card mb-2">
                  <div class="card-body p-2">
                    <small>Dashboard design</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderDashboardOverview = () => {
    const isAdmin = loggedInUser.role === 'admin';
    el.dataDisplay.innerHTML = `
      <div class="dashboard-container">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3>Dashboard Overview</h3>
          <span class="badge ${isAdmin ? 'bg-warning text-dark' : 'bg-primary'}">
            <i class="bi ${isAdmin ? 'bi-shield-check' : 'bi-person'} me-1"></i>
            ${isAdmin ? 'Administrator' : 'Regular User'}
          </span>
        </div>
        
        <!-- Quick Stats Cards -->
        <div class="row mb-4" id="dashboard-stats">
          <div class="col-md-3">
            <div class="card bg-primary text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4 id="activities-count">0</h4>
                    <p class="mb-0">My Activities</p>
                  </div>
                  <i class="bi bi-activity fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-success text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4 id="completed-count">0</h4>
                    <p class="mb-0">Completed</p>
                  </div>
                  <i class="bi bi-check-circle fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-warning text-dark">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4 id="pending-count">0</h4>
                    <p class="mb-0">Pending</p>
                  </div>
                  <i class="bi bi-clock fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card bg-info text-white">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <div>
                    <h4 id="messages-count">0</h4>
                    <p class="mb-0">Messages</p>
                  </div>
                  <i class="bi bi-chat fs-1 opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Dashboard Sections -->
        <div class="row mb-4">
          <!-- Overview -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-speedometer2 me-2"></i>Overview</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-primary">Dashboard</span>
                  </div>
                  <p class="text-muted small">Get a complete overview of your CRM system performance and key metrics.</p>
                  <button class="btn btn-sm btn-primary" onclick="openFeature('dashboard-overview')">View Overview</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reports -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-graph-up me-2"></i>Reports</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-success">Analytics</span>
                  </div>
                  <p class="text-muted small">Generate detailed reports and track your business performance metrics.</p>
                  <button class="btn btn-sm btn-success" onclick="showReports()">Generate Reports</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-pie-chart me-2"></i>Analytics</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-info">Insights</span>
                  </div>
                  <p class="text-muted small">Deep dive into your data with advanced analytics and business insights.</p>
                  <button class="btn btn-sm btn-info" onclick="showAnalytics()">View Analytics</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <!-- System Overview -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-gear-wide-connected me-2"></i>System Overview</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-secondary">System</span>
                  </div>
                  <p class="text-muted small">Monitor system health, performance metrics, and operational status.</p>
                  <button class="btn btn-sm btn-secondary" onclick="openFeature('system-overview')">System Status</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Reports -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-bar-chart me-2"></i>Analytics Reports</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-warning">Reports</span>
                  </div>
                  <p class="text-muted small">Access comprehensive analytics reports and data visualizations.</p>
                  <button class="btn btn-sm btn-warning" onclick="openFeature('analytics-reports')">View Reports</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions & Features -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-lightning me-2"></i>Quick Actions & Features</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-primary">Actions</span>
                  </div>
                  <p class="text-muted small">Access all quick actions and feature shortcuts for efficient workflow.</p>
                  <button class="btn btn-sm btn-primary" onclick="showQuickActionsModal()">View All Features</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Chat and Additional Features -->
        <div class="row mb-4">
          <!-- Team Chat -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-people-fill me-2"></i>Team Chat</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-success">Communication</span>
                  </div>
                  <p class="text-muted small">Join team conversations and collaborate with your colleagues in real-time.</p>
                  <button class="btn btn-sm btn-success" onclick="openFeature('team-chat')">Open Chat</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Private Messages -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-chat-dots me-2"></i>Private Messages</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-info">Messaging</span>
                  </div>
                  <p class="text-muted small">Send private messages and have one-on-one conversations.</p>
                  <button class="btn btn-sm btn-info" onclick="openFeature('private-chat')">Start Chat</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Activities -->
          <div class="col-md-4 mb-3">
            <div class="card h-100">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-activity me-2"></i>Activities</h5>
              </div>
              <div class="card-body">
                <div class="text-center">
                  <div class="mb-3">
                    <span class="badge bg-warning">Tasks</span>
                  </div>
                  <p class="text-muted small">Manage your activities, tasks, and track your progress efficiently.</p>
                  <button class="btn btn-sm btn-warning" onclick="openFeature('activities')">View Activities</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activities Sidebar -->
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0"><i class="bi bi-clock-history me-2"></i>Recent Activities</h5>
              </div>
              <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                <div id="recent-activities">
                  <!-- Recent activities will be loaded here -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    loadDashboardStats();
    loadDashboardFeatures();
    loadRecentActivities();
  };

  const loadDashboardStats = () => {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const userActivities = activities.filter(activity => 
      activity.assignedTo === loggedInUser.email || activity.assignedTo === 'all'
    );
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    
    document.getElementById('activities-count').textContent = userActivities.length;
    document.getElementById('completed-count').textContent = userActivities.filter(a => a.status === 'completed').length;
    document.getElementById('pending-count').textContent = userActivities.filter(a => a.status === 'pending').length;
    document.getElementById('messages-count').textContent = messages.length;
  };

  const loadDashboardFeatures = () => {
    const isAdmin = loggedInUser.role === 'admin';
    const features = [
      { id: 'team-chat', title: 'Team Chat', icon: 'bi-people-fill', description: 'Join group conversations', color: 'primary' },
      { id: 'private-chat', title: 'Private Messages', icon: 'bi-chat-dots', description: 'Direct messaging', color: 'success' },
      { id: 'activities', title: 'My Activities', icon: 'bi-activity', description: 'View assigned tasks', color: 'info' },
      { id: 'calendar', title: 'Calendar View', icon: 'bi-calendar3', description: 'Schedule overview', color: 'warning' },
      { id: 'notifications', title: 'Notifications', icon: 'bi-bell', description: 'Alert center', color: 'danger' },
      { id: 'profile', title: 'Profile Settings', icon: 'bi-person-gear', description: 'Account management', color: 'secondary' },
      { id: 'reports', title: 'Reports', icon: 'bi-graph-up', description: 'Analytics dashboard', color: 'primary' },
      { id: 'file-manager', title: 'File Manager', icon: 'bi-folder2-open', description: 'Document storage', color: 'success' },
      { id: 'search', title: 'Advanced Search', icon: 'bi-search', description: 'Find anything', color: 'info' },
      { id: 'integrations', title: 'Integrations', icon: 'bi-plugin', description: 'Connect apps', color: 'warning' },
      { id: 'backup', title: 'Data Backup', icon: 'bi-cloud-upload', description: 'Secure storage', color: 'danger' },
      { id: 'analytics', title: 'Performance Analytics', icon: 'bi-speedometer2', description: 'Track metrics', color: 'secondary' },
      { id: 'collaboration', title: 'Team Collaboration', icon: 'bi-people', description: 'Work together', color: 'primary' },
      { id: 'time-tracking', title: 'Time Tracker', icon: 'bi-stopwatch', description: 'Log work hours', color: 'success' },
      { id: 'project-management', title: 'Project Manager', icon: 'bi-kanban', description: 'Organize projects', color: 'info' },
      { id: 'video-calls', title: 'Video Conferencing', icon: 'bi-camera-video', description: 'Virtual meetings', color: 'warning' },
      { id: 'screen-share', title: 'Screen Sharing', icon: 'bi-display', description: 'Share your screen', color: 'danger' },
      { id: 'whiteboard', title: 'Digital Whiteboard', icon: 'bi-easel', description: 'Collaborative drawing', color: 'secondary' },
      { id: 'polls', title: 'Polls & Surveys', icon: 'bi-bar-chart', description: 'Gather feedback', color: 'primary' },
      { id: 'knowledge-base', title: 'Knowledge Base', icon: 'bi-book', description: 'Documentation hub', color: 'success' },
      { id: 'task-automation', title: 'Task Automation', icon: 'bi-gear-wide-connected', description: 'Workflow automation', color: 'info' },
      { id: 'expense-tracker', title: 'Expense Tracker', icon: 'bi-cash-stack', description: 'Financial tracking', color: 'warning' },
      { id: 'crm-tools', title: 'CRM Tools', icon: 'bi-person-lines-fill', description: 'Customer management', color: 'danger' },
      { id: 'help-desk', title: 'Help Desk', icon: 'bi-headset', description: 'Support tickets', color: 'secondary' },
      { id: 'security-center', title: 'Security Center', icon: 'bi-shield-check', description: 'Security management', color: 'primary', adminOnly: true }
    ];

    const container = document.getElementById('dashboard-features');
    container.innerHTML = features
      .filter(feature => !feature.adminOnly || isAdmin)
      .map(feature => `
        <div class="col-md-6">
          <div class="card feature-card h-100" onclick="openFeature('${feature.id}')" style="cursor: pointer;">
            <div class="card-body d-flex align-items-center">
              <div class="feature-icon me-3">
                <i class="bi ${feature.icon} fs-2 text-${feature.color}"></i>
              </div>
              <div>
                <h6 class="card-title mb-1">${feature.title}</h6>
                <small class="text-muted">${feature.description}</small>
              </div>
            </div>
          </div>
        </div>
      `).join('');
  };

  const loadRecentActivities = () => {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const userActivities = activities
      .filter(activity => activity.assignedTo === loggedInUser.email || activity.assignedTo === 'all')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const container = document.getElementById('recent-activities');
    
    if (userActivities.length === 0) {
      container.innerHTML = '<div class="text-center text-muted p-3">No recent activities</div>';
      return;
    }

    container.innerHTML = userActivities.map(activity => {
      const statusColor = {
        pending: 'secondary',
        'in-progress': 'primary',
        completed: 'success'
      }[activity.status] || 'secondary';

      const isOverdue = new Date(activity.assignedDate) < new Date() && activity.status !== 'completed';
      
      return `
        <div class="d-flex align-items-center mb-3 p-2 rounded ${isOverdue ? 'bg-danger bg-opacity-10' : ''}">
          <div class="me-3">
            <span class="badge bg-${statusColor}">${activity.status.replace('-', ' ').toUpperCase()}</span>
          </div>
          <div class="flex-grow-1">
            <h6 class="mb-1">${activity.title}</h6>
            <small class="text-muted">
              <i class="bi bi-calendar me-1"></i>
              ${new Date(activity.assignedDate).toLocaleDateString()}
              ${isOverdue ? '<i class="bi bi-exclamation-triangle text-danger ms-2"></i>' : ''}
            </small>
          </div>
        </div>
      `;
    }).join('');
  };

  window.openFeature = (featureId) => {
    const featureMap = {
      'team-chat': () => {
        // Navigate to team chat
        const chatModule = modulesData.modules.find(m => m.id === 'chat');
        if (chatModule) {
          loadSubSections(chatModule);
          document.querySelector('[data-module="chat"]')?.click();
        }
        showToast('Opening Team Chat...');
      },
      'private-chat': () => {
        const chatModule = modulesData.modules.find(m => m.id === 'Private Chat');
        if (chatModule) {
          loadSubSections(chatModule);
        }
        showToast('Opening Private Chat...');
      },
      'activities': () => {
        const activityModule = modulesData.modules.find(m => m.id === 'Activity');
        if (activityModule) {
          loadSubSections(activityModule);
        }
        showToast('Opening Activities...');
      },
      'notifications': () => {
        showNotificationCenter();
      },
      'calendar': () => {
        showCalendarView();
      },
      'profile': () => {
        showProfileSettings();
      },
      'file-manager': () => {
        showFileManager();
      },
      'search': () => {
        showAdvancedSearch();
      },
      'reports': () => {
        showReports();
      },
      'analytics': () => {
        showAnalytics();
      },
      'time-tracking': () => {
        showTimeTracker();
      },
      'video-calls': () => {
        showVideoCall();
      },
      'security-center': () => {
        if (loggedInUser.role === 'admin') {
          showSecurityCenter();
        }
      }
    };

    const handler = featureMap[featureId];
    if (handler) {
      handler();
    } else {
      showToast('Feature coming soon!', 'info');
    }
  };

  function renderUserTable(users, filter = "") {
    const userTableContainer = document.getElementById('userTableContainer');
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(filter) ||
      user.email.toLowerCase().includes(filter)
    );
    userTableContainer.innerHTML = `
      <table class="table table-hover">
        <thead><tr><th>Username</th><th>Email</th><th>Action</th></tr></thead>
        <tbody>
          ${filteredUsers.length
            ? filteredUsers.map(user => `
              <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                  ${user.email !== loggedInUser.email
                    ? `<button class="btn btn-sm btn-primary start-chat-btn" data-email="${user.email}" data-username="${user.username}">Chat</button>`
                    : `<span class="text-muted">You</span>`
                  }
                </td>
              </tr>
            `).join('')
            : `<tr><td colspan="3" class="text-center text-muted">No users found.</td></tr>`
          }
        </tbody>
      </table>
    `;

    document.querySelectorAll('.start-chat-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const otherUser = {
          email: this.getAttribute('data-email'),
          username: this.getAttribute('data-username')
        };
        openPrivateChat(otherUser);
      });
    });
  }

  const renderUserManagement = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const modalBody = document.getElementById('userManagementModalBody');
    modalBody.innerHTML = `
      <input type="text" id="userSearchInput" class="form-control mb-3" placeholder="Search users by name or email...">
      <div id="userTableContainer"></div>
    `;
    renderUserTable(users);

    document.getElementById('userSearchInput').addEventListener('input', function() {
      renderUserTable(users, this.value.toLowerCase());
    });

    userManagementModal.show();
    renderGenericContent({name: "Settings"}, {name: "User Management", id: "user-management"});
  };

  function openPrivateChat(otherUser) {
    el.dataDisplay.innerHTML = `
      <div class="private-chat-container">
        <div class="d-flex align-items-center mb-2">
          <i class="bi bi-person-circle fs-3 me-2"></i>
          <h5 class="mb-0">${otherUser.username} <span class="badge bg-secondary ms-2">Private Chat</span></h5>
        </div>
        <div class="private-chat-messages border rounded p-2 mb-2" id="private-chat-messages" style="height:250px;overflow-y:auto;background:#f8f9fa"></div>
        <form id="private-chat-form" class="d-flex">
          <input type="text" id="private-chat-input" class="form-control me-2" placeholder="Type a message..." autocomplete="off">
          <button type="submit" class="btn btn-primary"><i class="bi bi-send-fill"></i></button>
        </form>
        <button class="btn btn-link mt-2" id="back-to-users">&larr; Back to Users</button>
      </div>
    `;

    loadPrivateChatMessages(otherUser);

    document.getElementById('private-chat-form').addEventListener('submit', function(e) {
      e.preventDefault();
      sendPrivateChatMessage(otherUser);
    });

    document.getElementById('back-to-users').addEventListener('click', function() {
      renderUserManagement();
    });
  }

  function getChatKey(user1, user2) {
    return 'privateChat_' + [user1.email, user2.email].sort().join('_');
  }

  function loadPrivateChatMessages(otherUser) {
    const chatKey = getChatKey(loggedInUser, otherUser);
    const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
    const messagesContainer = document.getElementById('private-chat-messages');
    if (!messages.length) {
      messagesContainer.innerHTML = `<div class="text-center text-muted p-3">No messages yet.</div>`;
      return;
    }
    messagesContainer.innerHTML = messages.map(msg => {
      const isSent = msg.email === loggedInUser.email;
      const msgClass = isSent ? 'sent text-end' : 'received text-start';
      const userDisplay = isSent ? 'You' : otherUser.username;
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="mb-2 ${msgClass}">
          <div class="small text-muted">${userDisplay} <span class="fw-normal opacity-75">${time}</span></div>
          <div class="d-inline-block px-3 py-2 rounded ${isSent ? 'bg-primary text-white' : 'bg-light text-dark'}">${msg.text}</div>
        </div>
      `;
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function sendPrivateChatMessage(otherUser) {
    const input = document.getElementById('private-chat-input');
    if (input.value.trim()) {
      const chatKey = getChatKey(loggedInUser, otherUser);
      const messages = JSON.parse(localStorage.getItem(chatKey)) || [];
      messages.push({
        username: loggedInUser.username,
        email: loggedInUser.email,
        text: input.value.trim(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(chatKey, JSON.stringify(messages));
      loadPrivateChatMessages(otherUser);
      input.value = '';
      input.focus();
    }
  }

  const renderChatInterface = () => {
    const isAdmin = loggedInUser.role === 'admin';
    el.dataDisplay.innerHTML = `
      <div class="chat-container">
        <div class="d-flex justify-content-between align-items-center border-bottom p-3 bg-light">
          <h5 class="mb-0">Team Chat</h5>
          ${isAdmin ? '<span class="badge bg-warning text-dark"><i class="bi bi-shield-check me-1"></i>Admin Mode</span>' : ''}
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <form class="chat-input-form" id="chat-form">
          <input type="text" id="chat-input" class="form-control" placeholder="Type a message..." autocomplete="off">
          <button type="submit" class="btn btn-primary ms-2"><i class="bi bi-send-fill"></i></button>
        </form>
      </div>`;
    el.dataDisplay.className = '';
    document.getElementById('chat-form').addEventListener('submit', sendChatMessage);
    loadChatMessages();
  };

  const loadChatMessages = () => {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const isAdmin = loggedInUser.role === 'admin';

    if(messages.length === 0){
      messagesContainer.innerHTML = `<div class="text-center text-muted p-5">No messages yet. Start the conversation!</div>`;
      return;
    }

    messagesContainer.innerHTML = messages.map(msg => {
      const isSent = msg.email === loggedInUser.email;
      const msgClass = isSent ? 'sent' : 'received';
      const userDisplay = isSent ? 'You' : msg.username;
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const editedText = msg.edited ? '<small class="text-muted">(edited)</small>' : '';
      
      // Show message controls for own messages or admin controls
      const showControls = isSent || isAdmin;
      const controls = showControls ? `
        <div class="message-controls d-none">
          ${isSent ? `<button class="btn btn-sm btn-outline-secondary me-1" onclick="editMessage('${msg.id || Date.now()}', '${msg.text.replace(/'/g, "\\'")}')"><i class="bi bi-pencil"></i></button>` : ''}
          <button class="btn btn-sm btn-outline-danger" onclick="deleteMessage('${msg.id || Date.now()}', ${isAdmin})"><i class="bi bi-trash"></i></button>
        </div>
      ` : '';

      return `
        <div class="message ${msgClass}" onmouseenter="showMessageControls(this)" onmouseleave="hideMessageControls(this)">
            <div class="meta">${userDisplay} <span class="fw-normal opacity-75 small">${time}</span> ${editedText}</div>
            <div class="text" data-message-id="${msg.id || Date.now()}">${msg.text}</div>
            ${controls}
        </div>`;
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const sendChatMessage = (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    if (input.value.trim()) {
      const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
      const newMessage = {
        id: Date.now().toString(),
        username: loggedInUser.username,
        email: loggedInUser.email,
        text: input.value.trim(),
        timestamp: new Date().toISOString(),
        edited: false,
        editedAt: null
      };
      messages.push(newMessage);
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      loadChatMessages();
      input.value = '';
      input.focus();
    }
  };

  // Message control functions
  window.showMessageControls = (messageElement) => {
    const controls = messageElement.querySelector('.message-controls');
    if (controls) controls.classList.remove('d-none');
  };

  window.hideMessageControls = (messageElement) => {
    const controls = messageElement.querySelector('.message-controls');
    if (controls) controls.classList.add('d-none');
  };

  window.editMessage = (messageId, currentText) => {
    const newText = prompt('Edit message:', currentText);
    if (newText && newText.trim() && newText !== currentText) {
      const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1 && messages[messageIndex].email === loggedInUser.email) {
        messages[messageIndex].text = newText.trim();
        messages[messageIndex].edited = true;
        messages[messageIndex].editedAt = new Date().toISOString();
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        loadChatMessages();
        showToast('Message edited successfully');
      }
    }
  };

  window.deleteMessage = (messageId, isAdminDelete = false) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
      const messageIndex = messages.findIndex(m => m.id === messageId);
      if (messageIndex !== -1) {
        const message = messages[messageIndex];
        if (message.email === loggedInUser.email || (isAdminDelete && loggedInUser.role === 'admin')) {
          messages.splice(messageIndex, 1);
          localStorage.setItem('chatMessages', JSON.stringify(messages));
          loadChatMessages();
          showToast('Message deleted successfully');
        }
      }
    }
  };

  // Activities functionality
  const renderAllActivities = () => {
    const isAdmin = loggedInUser.role === 'admin';
    el.dataDisplay.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>All Activities</h3>
        ${isAdmin ? '<button class="btn btn-primary" onclick="showCreateActivityModal()"><i class="bi bi-plus-circle me-2"></i>Create Activity</button>' : ''}
      </div>
      <div id="activities-container">
        <div class="text-center p-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    `;
    loadActivities();
  };

  const renderFilterActivities = () => {
    el.dataDisplay.innerHTML = `
      <h3>Filter Activities</h3>
      <div class="row mb-4">
        <div class="col-md-3">
          <select class="form-select" id="status-filter">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="col-md-3">
          <select class="form-select" id="priority-filter">
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="col-md-3">
          <input type="date" class="form-control" id="date-filter">
        </div>
        <div class="col-md-3">
          <button class="btn btn-primary" onclick="applyActivityFilters()">Apply Filter</button>
        </div>
      </div>
      <div id="filtered-activities-container"></div>
    `;
    loadFilteredActivities();
  };

  const renderMarkActivities = () => {
    el.dataDisplay.innerHTML = `
      <h3>Mark Activities as Read/Unread</h3>
      <div class="mb-3">
        <button class="btn btn-success me-2" onclick="markAllActivitiesAsRead()">Mark All as Read</button>
        <button class="btn btn-secondary" onclick="markAllActivitiesAsUnread()">Mark All as Unread</button>
      </div>
      <div id="mark-activities-container"></div>
    `;
    loadMarkableActivities();
  };

  const loadActivities = () => {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const container = document.getElementById('activities-container');
    
    if (activities.length === 0) {
      container.innerHTML = '<div class="text-center text-muted p-4">No activities found. Create your first activity!</div>';
      return;
    }

    const userActivities = activities.filter(activity => 
      activity.assignedTo === loggedInUser.email || activity.assignedTo === 'all'
    );

    container.innerHTML = userActivities.map(activity => {
      const priorityBadge = {
        low: 'bg-success',
        medium: 'bg-warning',
        high: 'bg-danger'
      }[activity.priority] || 'bg-secondary';

      const statusBadge = {
        pending: 'bg-secondary',
        'in-progress': 'bg-primary',
        completed: 'bg-success'
      }[activity.status] || 'bg-secondary';

      const assignedDate = new Date(activity.assignedDate).toLocaleDateString();
      const isToday = new Date(activity.assignedDate).toDateString() === new Date().toDateString();
      const isPast = new Date(activity.assignedDate) < new Date();

      return `
        <div class="card mb-3 ${isToday ? 'border-warning' : isPast && activity.status !== 'completed' ? 'border-danger' : ''}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title">${activity.title}</h5>
              <div>
                <span class="badge ${priorityBadge} me-1">${activity.priority.toUpperCase()}</span>
                <span class="badge ${statusBadge}">${activity.status.replace('-', ' ').toUpperCase()}</span>
              </div>
            </div>
            <p class="card-text">${activity.description}</p>
            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                <i class="bi bi-calendar me-1"></i>Due: ${assignedDate}
                ${isToday ? '<span class="badge bg-warning text-dark ms-2">TODAY</span>' : ''}
                ${isPast && activity.status !== 'completed' ? '<span class="badge bg-danger ms-2">OVERDUE</span>' : ''}
              </small>
              <div>
                ${activity.status !== 'completed' ? `
                  <button class="btn btn-sm btn-outline-primary me-1" onclick="updateActivityStatus('${activity.id}', 'in-progress')">Start</button>
                  <button class="btn btn-sm btn-success" onclick="updateActivityStatus('${activity.id}', 'completed')">Complete</button>
                ` : '<span class="text-success"><i class="bi bi-check-circle-fill"></i> Completed</span>'}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  const loadFilteredActivities = () => {
    // Implementation for filtered activities
    const container = document.getElementById('filtered-activities-container');
    container.innerHTML = '<div class="text-muted">Apply filters to see activities</div>';
  };

  const loadMarkableActivities = () => {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const readActivities = JSON.parse(localStorage.getItem('readActivities')) || [];
    const container = document.getElementById('mark-activities-container');
    
    const userActivities = activities.filter(activity => 
      activity.assignedTo === loggedInUser.email || activity.assignedTo === 'all'
    );

    container.innerHTML = userActivities.map(activity => {
      const isRead = readActivities.includes(activity.id);
      return `
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom ${isRead ? 'opacity-50' : ''}">
          <div>
            <h6 class="mb-1">${activity.title}</h6>
            <small class="text-muted">${new Date(activity.assignedDate).toLocaleDateString()}</small>
          </div>
          <button class="btn btn-sm ${isRead ? 'btn-outline-secondary' : 'btn-outline-primary'}" 
                  onclick="toggleActivityRead('${activity.id}', ${!isRead})">
            ${isRead ? 'Mark Unread' : 'Mark Read'}
          </button>
        </div>
      `;
    }).join('');
  };

  // Activity management functions
  window.showCreateActivityModal = () => {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create New Activity</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="create-activity-form">
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input type="text" class="form-control" id="activity-title" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" id="activity-description" rows="3" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Assigned Date</label>
                <input type="date" class="form-control" id="activity-date" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Assign To</label>
                <select class="form-select" id="activity-assign">
                  <option value="all">All Users</option>
                  ${JSON.parse(localStorage.getItem('users') || '[]').map(user => 
                    `<option value="${user.email}">${user.username} (${user.email})</option>`
                  ).join('')}
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Priority</label>
                <select class="form-select" id="activity-priority">
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="createActivity()">Create Activity</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
  };

  window.createActivity = () => {
    const title = document.getElementById('activity-title').value;
    const description = document.getElementById('activity-description').value;
    const assignedDate = document.getElementById('activity-date').value;
    const assignedTo = document.getElementById('activity-assign').value;
    const priority = document.getElementById('activity-priority').value;

    if (title && description && assignedDate) {
      const activities = JSON.parse(localStorage.getItem('activities')) || [];
      const newActivity = {
        id: Date.now().toString(),
        title,
        description,
        assignedDate,
        assignedTo,
        priority,
        status: 'pending',
        createdBy: loggedInUser.email,
        createdAt: new Date().toISOString()
      };
      
      activities.push(newActivity);
      localStorage.setItem('activities', JSON.stringify(activities));
      
      showToast('Activity created successfully');
      loadActivities();
      bootstrap.Modal.getInstance(document.querySelector('.modal')).hide();
    }
  };

  window.updateActivityStatus = (activityId, status) => {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const activityIndex = activities.findIndex(a => a.id === activityId);
    if (activityIndex !== -1) {
      activities[activityIndex].status = status;
      localStorage.setItem('activities', JSON.stringify(activities));
      loadActivities();
      showToast(`Activity marked as ${status.replace('-', ' ')}`);
    }
  };

  window.toggleActivityRead = (activityId, isRead) => {
    const readActivities = JSON.parse(localStorage.getItem('readActivities')) || [];
    if (isRead) {
      if (!readActivities.includes(activityId)) {
        readActivities.push(activityId);
      }
    } else {
      const index = readActivities.indexOf(activityId);
      if (index > -1) {
        readActivities.splice(index, 1);
      }
    }
    localStorage.setItem('readActivities', JSON.stringify(readActivities));
    loadMarkableActivities();
  };

  window.markAllActivitiesAsRead = () => {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const userActivities = activities.filter(activity => 
      activity.assignedTo === loggedInUser.email || activity.assignedTo === 'all'
    );
    const readActivities = userActivities.map(a => a.id);
    localStorage.setItem('readActivities', JSON.stringify(readActivities));
    loadMarkableActivities();
    showToast('All activities marked as read');
  };

  window.markAllActivitiesAsUnread = () => {
    localStorage.setItem('readActivities', JSON.stringify([]));
    loadMarkableActivities();
    showToast('All activities marked as unread');
  };

  window.applyActivityFilters = () => {
    const statusFilter = document.getElementById('status-filter').value;
    const priorityFilter = document.getElementById('priority-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    let filteredActivities = activities.filter(activity => 
      activity.assignedTo === loggedInUser.email || activity.assignedTo === 'all'
    );

    if (statusFilter) {
      filteredActivities = filteredActivities.filter(a => a.status === statusFilter);
    }
    if (priorityFilter) {
      filteredActivities = filteredActivities.filter(a => a.priority === priorityFilter);
    }
    if (dateFilter) {
      filteredActivities = filteredActivities.filter(a => 
        new Date(a.assignedDate).toISOString().split('T')[0] === dateFilter
      );
    }

    const container = document.getElementById('filtered-activities-container');
    if (filteredActivities.length === 0) {
      container.innerHTML = '<div class="text-center text-muted p-4">No activities match the selected filters.</div>';
      return;
    }

    container.innerHTML = filteredActivities.map(activity => {
      const priorityBadge = {
        low: 'bg-success',
        medium: 'bg-warning',
        high: 'bg-danger'
      }[activity.priority] || 'bg-secondary';

      const statusBadge = {
        pending: 'bg-secondary',
        'in-progress': 'bg-primary',
        completed: 'bg-success'
      }[activity.status] || 'bg-secondary';

      return `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title">${activity.title}</h5>
              <div>
                <span class="badge ${priorityBadge} me-1">${activity.priority.toUpperCase()}</span>
                <span class="badge ${statusBadge}">${activity.status.replace('-', ' ').toUpperCase()}</span>
              </div>
            </div>
            <p class="card-text">${activity.description}</p>
            <small class="text-muted">
              <i class="bi bi-calendar me-1"></i>Due: ${new Date(activity.assignedDate).toLocaleDateString()}
            </small>
          </div>
        </div>
      `;
    }).join('');
  };

  // Additional Feature Functions
  window.showNotificationCenter = () => {
    showFeatureModal('Notification Center', `
      <div class="text-center p-4">
        <i class="bi bi-bell fs-1 text-warning mb-3"></i>
        <h5>No new notifications</h5>
        <p class="text-muted">You're all caught up!</p>
      </div>
    `);
  };

  window.showCalendarView = () => {
    const today = new Date();
    const calendar = generateCalendar(today);
    showFeatureModal('Calendar View', `
      <div class="calendar-container">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5>${today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h5>
          <div>
            <button class="btn btn-sm btn-outline-primary">Today</button>
          </div>
        </div>
        ${calendar}
      </div>
    `);
  };

  window.showProfileSettings = () => {
    showFeatureModal('Profile Settings', `
      <form>
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" value="${loggedInUser.username}" readonly>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" value="${loggedInUser.email}" readonly>
        </div>
        <div class="mb-3">
          <label class="form-label">Role</label>
          <input type="text" class="form-control" value="${loggedInUser.role === 'admin' ? 'Administrator' : 'Regular User'}" readonly>
        </div>
        <div class="mb-3">
          <label class="form-label">Member Since</label>
          <input type="text" class="form-control" value="${new Date(loggedInUser.createdAt).toLocaleDateString()}" readonly>
        </div>
      </form>
    `);
  };

  window.showFileManager = () => {
    showFeatureModal('File Manager', `
      <div class="text-center p-4">
        <i class="bi bi-folder2-open fs-1 text-primary mb-3"></i>
        <h5>File Storage</h5>
        <p class="text-muted">Document management system coming soon!</p>
        <button class="btn btn-primary" disabled>Upload Files</button>
      </div>
    `);
  };

  window.showAdvancedSearch = () => {
    showFeatureModal('Advanced Search', `
      <div class="mb-3">
        <input type="text" class="form-control" placeholder="Search across all modules...">
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="search-messages" checked>
            <label class="form-check-label" for="search-messages">Messages</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="search-activities" checked>
            <label class="form-check-label" for="search-activities">Activities</label>
          </div>
        </div>
      </div>
      <hr>
      <div class="text-center text-muted">
        <i class="bi bi-search fs-3"></i>
        <p>Enhanced search functionality coming soon!</p>
      </div>
    `);
  };

  window.showReports = () => {
    showFeatureModal('Reports Dashboard', `
      <div class="row">
        <div class="col-md-6">
          <div class="card text-center">
            <div class="card-body">
              <i class="bi bi-graph-up fs-1 text-success"></i>
              <h6>Performance Report</h6>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card text-center">
            <div class="card-body">
              <i class="bi bi-pie-chart fs-1 text-info"></i>
              <h6>Usage Analytics</h6>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="text-center text-muted">
        <p>Detailed reporting system coming soon!</p>
      </div>
    `);
  };

  window.showAnalytics = () => {
    showFeatureModal('Performance Analytics', `
      <div class="text-center p-4">
        <i class="bi bi-speedometer2 fs-1 text-primary mb-3"></i>
        <h5>System Analytics</h5>
        <div class="row mt-4">
          <div class="col-4 text-center">
            <h3 class="text-success">98%</h3>
            <small>Uptime</small>
          </div>
          <div class="col-4 text-center">
            <h3 class="text-info">1.2s</h3>
            <small>Avg Response</small>
          </div>
          <div class="col-4 text-center">
            <h3 class="text-warning">${JSON.parse(localStorage.getItem('users') || '[]').length}</h3>
            <small>Active Users</small>
          </div>
        </div>
      </div>
    `);
  };

  window.showTimeTracker = () => {
    showFeatureModal('Time Tracker', `
      <div class="text-center p-4">
        <i class="bi bi-stopwatch fs-1 text-warning mb-3"></i>
        <h5>Time Tracking</h5>
        <div class="mt-4">
          <button class="btn btn-success me-2">Start Timer</button>
          <button class="btn btn-danger">Stop Timer</button>
        </div>
        <p class="text-muted mt-3">Track your work hours efficiently!</p>
      </div>
    `);
  };

  window.showVideoCall = () => {
    showFeatureModal('Video Conferencing', `
      <div class="text-center p-4">
        <i class="bi bi-camera-video fs-1 text-primary mb-3"></i>
        <h5>Video Meetings</h5>
        <div class="mt-4">
          <button class="btn btn-primary me-2">Start Meeting</button>
          <button class="btn btn-outline-primary">Join Meeting</button>
        </div>
        <p class="text-muted mt-3">Connect with your team face-to-face!</p>
      </div>
    `);
  };

  window.showSecurityCenter = () => {
    if (loggedInUser.role !== 'admin') return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'regular').length;
    
    showFeatureModal('Security Center', `
      <div class="alert alert-warning">
        <i class="bi bi-shield-check me-2"></i>
        <strong>Administrator Access Only</strong>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <h4 class="text-danger">${adminCount}</h4>
              <small>Administrators</small>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card">
            <div class="card-body text-center">
              <h4 class="text-primary">${userCount}</h4>
              <small>Regular Users</small>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div class="text-center">
        <button class="btn btn-outline-danger me-2">Security Logs</button>
        <button class="btn btn-outline-warning">User Permissions</button>
      </div>
    `);
  };

  window.showQuickActionsModal = () => {
    const isAdmin = loggedInUser.role === 'admin';
    const features = [
      { id: 'team-chat', title: 'Team Chat', icon: 'bi-people-fill', description: 'Join group conversations', color: 'primary' },
      { id: 'private-chat', title: 'Private Messages', icon: 'bi-chat-dots', description: 'Direct messaging', color: 'success' },
      { id: 'activities', title: 'My Activities', icon: 'bi-activity', description: 'View assigned tasks', color: 'info' },
      { id: 'calendar', title: 'Calendar View', icon: 'bi-calendar3', description: 'Schedule overview', color: 'warning' },
      { id: 'notifications', title: 'Notifications', icon: 'bi-bell', description: 'Alert center', color: 'danger' },
      { id: 'profile', title: 'Profile Settings', icon: 'bi-person-gear', description: 'Account management', color: 'secondary' },
      { id: 'reports', title: 'Reports', icon: 'bi-graph-up', description: 'Analytics dashboard', color: 'primary' },
      { id: 'file-manager', title: 'File Manager', icon: 'bi-folder2-open', description: 'Document storage', color: 'success' },
      { id: 'search', title: 'Advanced Search', icon: 'bi-search', description: 'Find anything', color: 'info' },
      { id: 'integrations', title: 'Integrations', icon: 'bi-plugin', description: 'Connect apps', color: 'warning' },
      { id: 'backup', title: 'Data Backup', icon: 'bi-cloud-upload', description: 'Secure storage', color: 'danger' },
      { id: 'analytics', title: 'Performance Analytics', icon: 'bi-speedometer2', description: 'Track metrics', color: 'secondary' },
      { id: 'collaboration', title: 'Team Collaboration', icon: 'bi-people', description: 'Work together', color: 'primary' },
      { id: 'time-tracking', title: 'Time Tracker', icon: 'bi-stopwatch', description: 'Log work hours', color: 'success' },
      { id: 'project-management', title: 'Project Manager', icon: 'bi-kanban', description: 'Organize projects', color: 'info' },
      { id: 'video-calls', title: 'Video Conferencing', icon: 'bi-camera-video', description: 'Virtual meetings', color: 'warning' },
      { id: 'screen-share', title: 'Screen Sharing', icon: 'bi-display', description: 'Share your screen', color: 'danger' },
      { id: 'whiteboard', title: 'Digital Whiteboard', icon: 'bi-easel', description: 'Collaborative drawing', color: 'secondary' },
      { id: 'polls', title: 'Polls & Surveys', icon: 'bi-bar-chart', description: 'Gather feedback', color: 'primary' },
      { id: 'knowledge-base', title: 'Knowledge Base', icon: 'bi-book', description: 'Documentation hub', color: 'success' },
      { id: 'task-automation', title: 'Task Automation', icon: 'bi-gear-wide-connected', description: 'Workflow automation', color: 'info' },
      { id: 'expense-tracker', title: 'Expense Tracker', icon: 'bi-cash-stack', description: 'Financial tracking', color: 'warning' },
      { id: 'crm-tools', title: 'CRM Tools', icon: 'bi-person-lines-fill', description: 'Customer management', color: 'danger' },
      { id: 'help-desk', title: 'Help Desk', icon: 'bi-headset', description: 'Support tickets', color: 'secondary' },
      { id: 'security-center', title: 'Security Center', icon: 'bi-shield-check', description: 'Security management', color: 'primary', adminOnly: true }
    ];

    const featuresGrid = features
      .filter(feature => !feature.adminOnly || isAdmin)
      .map(feature => `
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card feature-card h-100" onclick="openFeature('${feature.id}')" style="cursor: pointer;">
            <div class="card-body d-flex align-items-center">
              <div class="feature-icon me-3">
                <i class="bi ${feature.icon} fs-4 text-${feature.color}"></i>
              </div>
              <div>
                <h6 class="card-title mb-1">${feature.title}</h6>
                <small class="text-muted">${feature.description}</small>
              </div>
            </div>
          </div>
        </div>
      `).join('');

    showFeatureModal('Quick Actions & Features', `
      <div class="container-fluid">
        <div class="row g-3">
          ${featuresGrid}
        </div>
      </div>
    `);
  };

  const showFeatureModal = (title, content) => {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${content}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    modal.addEventListener('hidden.bs.modal', () => modal.remove());
  };

  const generateCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    let calendar = '<table class="table table-bordered"><thead><tr>';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => calendar += `<th class="text-center">${day}</th>`);
    calendar += '</tr></thead><tbody>';
    
    let dayCount = 1;
    for (let week = 0; week < 6; week++) {
      calendar += '<tr>';
      for (let day = 0; day < 7; day++) {
        if (week === 0 && day < firstDay) {
          calendar += '<td></td>';
        } else if (dayCount > daysInMonth) {
          calendar += '<td></td>';
        } else {
          const isToday = dayCount === new Date().getDate() && 
                          month === new Date().getMonth() && 
                          year === new Date().getFullYear();
          calendar += `<td class="text-center ${isToday ? 'bg-primary text-white' : ''}">${dayCount}</td>`;
          dayCount++;
        }
      }
      calendar += '</tr>';
      if (dayCount > daysInMonth) break;
    }
    calendar += '</tbody></table>';
    return calendar;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = 'login.html';
  };

  const setupEventListeners = () => {
    el.logoutBtn.addEventListener('click', handleLogout);
    el.searchInput.addEventListener("input", (e) => renderIcons(e.target.value.toLowerCase()));

    let isExpanded = false;
    el.expandBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      el.miniSidebar.classList.toggle('hide', isExpanded);
      el.subSidebar.classList.toggle('hide', isExpanded);
      el.dragHandle.classList.toggle('hide', isExpanded);
      el.mainContent.style.width = isExpanded ? "100%" : "auto";
      el.expandBtn.innerHTML = isExpanded ? `<i class="bi bi-arrows-collapse"></i>` : `<i class="bi bi-arrows-fullscreen"></i>`;
    });

    let isDragging = false;
    el.dragHandle.addEventListener("mousedown", () => {
      isDragging = true;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      let newWidth = e.clientX - el.miniSidebar.offsetWidth;
      if (newWidth < 150) newWidth = 150;
      if (newWidth > 500) newWidth = 500;
      el.subSidebar.style.width = `${newWidth}px`;
    });
    document.addEventListener("mouseup", () => {
      isDragging = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    });

    window.addEventListener('storage', (event) => {
      // For group chat
      if (event.key === 'chatMessages' && document.querySelector('.chat-container')) {
        loadChatMessages();
      }
      // For private chat
      if (event.key && event.key.startsWith('privateChat_') && document.querySelector('.private-chat-container')) {
        // Find the other user from the chatKey
        const chatKey = event.key;
        const emails = chatKey.replace('privateChat_', '').split('_');
        const otherEmail = emails.find(email => email !== loggedInUser.email);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const otherUser = users.find(u => u.email === otherEmail);
        if (otherUser) loadPrivateChatMessages(otherUser);
      }
    });
  };

  // --- INIT ---
  const init = () => {
    el.userName.textContent = loggedInUser.username;
    renderIcons();
    setupEventListeners();
    if (el.miniSidebar.firstChild) el.miniSidebar.firstChild.click();

    if (sessionStorage.getItem('login_success')) {
      showToast(`Welcome back, ${loggedInUser.username}!`);
      sessionStorage.removeItem('login_success');
    }
  };

  init();
});