document.addEventListener('DOMContentLoaded', () => {
  // --- User Session ---
  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!loggedInUser) {
    window.location.href = 'login.html';
    return;
  }

  // --- Modules Data ---
  const modulesData = {
    "modules": [
      {
        "id": "dashboard", "name": "Dashboard", "icon": "bi-speedometer2",
        "subSections": [
          { "id": "overview", "name": "Overview" },
          { "id": "modern-dashboard", "name": "Dashboard" },
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
          { "id": "project-management", "name": "Project Management" },
          { "id": "Global Styles", "name": "Global Styles" },
          { "id": "Posts", "name": "Posts" },
          { "id": "Data Source Integration", "name": "Data Source Integration" },
          { "id": "Appearance", "name": "Appearance" },
          { "id": "Navigation", "name": "Navigation" },
          { "id": "Alerts and Notifications", "name": "Alerts and Notifications" },
          { "id": "reports", "name": "Reports" },
          { "id": "analytics", "name": "Analytics" }
        ]
      },
      {
        "id": "chat", "name": "Team Chat", "icon": "bi-people-fill",
        "subSections": [{ "id": "general-chat", "name": "General Chat" }]
      },
      {
        "id": "private-chat", "name": "Private Chat", "icon": "bi bi-chat-dots-fill",
        "subSections": [
          { "id": "find-user", "name": "Find User to Chat" },
          { "id": "active-chats", "name": "Active Chats" },
          { "id": "chat-history", "name": "Chat History" }
        ]
      },
      {
        "id": "Activity", "name": "Activity", "icon": "bi bi-activity",
        "subSections": [
          { "id": "All Activity", "name": "All Activity" },
          { "id": "Filter Activity", "name": "Filter Activity" },
          { "id": "Mark as Read/Unread", "name": "Mark as Read/Unread" }
        ]
      },
      {
        "id": "deals", "name": "Deals", "icon": "bi-cash-stack",
        "subSections": [
          { "id": "active-deals", "name": "Active Deals" },
          { "id": "closed-deals", "name": "Closed Deals" },
          { "id": "pipeline-view", "name": "Pipeline View" }
        ]
      },
      {
        "id": "tasks", "name": "Tasks", "icon": "bi-check2-square",
        "subSections": [
          { "id": "my-tasks", "name": "My Tasks" },
          { "id": "team-tasks", "name": "Team Tasks" },
          { "id": "calendar", "name": "Calendar" }
        ]
      },
      {
        "id": "campaigns", "name": "Campaigns", "icon": "bi-megaphone-fill",
        "subSections": [
          { "id": "active-campaigns", "name": "Active Campaigns" },
          { "id": "past-campaigns", "name": "Past Campaigns" }
        ]
      },
      {
        "id": "support", "name": "Support", "icon": "bi-headset",
        "subSections": [
          { "id": "open-tickets", "name": "Open Tickets" },
          { "id": "knowledge-base", "name": "Knowledge Base" }
        ]
      },
      {
        "id": "customers", "name": "Customers", "icon": "bi bi-telephone",
        "subSections": [
          { "id": "all-customers", "name": "All Customers" },
          { "id": "leads", "name": "Leads" },
          { "id": "accounts", "name": "Accounts" }
        ]
      },
      {
        "id": "settings", "name": "Settings", "icon": "bi-gear-fill",
        "subSections": [
          { "id": "integrations", "name": "Integrations" },
          { "id": "preferences", "name": "Preferences" },
          { "id": "user-management", "name": "User Management" }
        ]
      },
    /*  {
        "id": "admin", "name": "System Admin", "icon": "bi-shield-lock-fill",
        "subSections": [
          { "id": "login-history", "name": "Login History" },
          { "id": "user-export", "name": "User Export" },
          { "id": "system-logs", "name": "System Logs" }
        ]
      }*/
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
    toastContainer: document.querySelector('.toast-container'),
    themeToggle: document.getElementById('theme-toggle')
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
        
        // Add Apple-style hover animations
        iconDiv.addEventListener("mouseenter", function() {
          this.style.transform = 'translateX(8px) scale(1.1)';
          this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          this.style.zIndex = '10';
        });
        
        iconDiv.addEventListener("mouseleave", function() {
          this.style.transform = 'translateX(0) scale(1)';
          this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          this.style.zIndex = '1';
        });
        
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

  function logActivity(type, details) {
    const activity = {
      type,
      details,
      user: loggedInUser.username,
      email: loggedInUser.email,
      timestamp: new Date().toISOString(),
      read: false
    };
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
  }

  function renderAllActivities() {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []).reverse();
    el.dataDisplay.innerHTML = `
      <h3>Activity Log</h3>
      <form id="addActivityForm" class="mb-3 d-flex">
        <input type="text" id="activityInput" class="form-control me-2" placeholder="Add an activity..." required>
        <button type="submit" class="btn btn-primary">Add</button>
      </form>
      <ul id="activityList" class="list-group mb-3">
        ${activities.length ? activities.map((act, idx) => `
          <li class="list-group-item d-flex justify-content-between align-items-center ${act.read ? 'bg-light' : ''}">
            <div>
              <div><strong>${act.user}</strong> (${act.type})</div>
              <div>${typeof act.details === 'string' ? act.details : JSON.stringify(act.details)}</div>
              <div class="text-muted small">${new Date(act.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-success mark-read-btn" data-idx="${idx}">${act.read ? 'Unread' : 'Read'}</button>
              <button class="btn btn-sm btn-outline-danger delete-activity-btn" data-idx="${idx}">Delete</button>
            </div>
          </li>
        `).join('') : `<li class="list-group-item text-muted">No activities yet.</li>`}
      </ul>
      <div class="mb-2">
        <input type="text" id="filterActivityInput" class="form-control" placeholder="Filter activities by keyword...">
      </div>
    `;

    document.getElementById('addActivityForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('activityInput');
      const desc = input.value.trim();
      if (desc) {
        logActivity('custom', desc);
        input.value = '';
        renderAllActivities();
        showToast('Activity added successfully!', 'success');
      }
    });

    document.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        toggleReadActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.getElementById('filterActivityInput').addEventListener('input', function() {
      filterActivities(this.value.trim().toLowerCase());
    });
  }

  function toggleReadActivity(idx) {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []);
    const realIdx = activities.length - 1 - idx;
    if (activities[realIdx]) {
      activities[realIdx].read = !activities[realIdx].read;
      localStorage.setItem('activities', JSON.stringify(activities));
      renderAllActivities();
    }
  }

  function deleteActivity(idx) {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []);
    const realIdx = activities.length - 1 - idx;
    if (activities[realIdx]) {
      activities.splice(realIdx, 1);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderAllActivities();
    }
  }

  function filterActivities(keyword) {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []).reverse();
    const filtered = activities.filter(act =>
      (act.user && act.user.toLowerCase().includes(keyword)) ||
      (act.type && act.type.toLowerCase().includes(keyword)) ||
      (typeof act.details === 'string' && act.details.toLowerCase().includes(keyword))
    );
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = filtered.length
      ? filtered.map((act, idx) => `
        <li class="list-group-item d-flex justify-content-between align-items-center ${act.read ? 'bg-light' : ''}">
          <div>
            <div><strong>${act.user}</strong> (${act.type})</div>
            <div>${typeof act.details === 'string' ? act.details : JSON.stringify(act.details)}</div>
            <div class="text-muted small">${new Date(act.timestamp).toLocaleString()}</div>
          </div>
          <div>
            <button class="btn btn-sm btn-outline-success mark-read-btn" data-idx="${idx}">${act.read ? 'Unread' : 'Read'}</button>
            <button class="btn btn-sm btn-outline-danger delete-activity-btn" data-idx="${idx}">Delete</button>
          </div>
        </li>
      `).join('')
      : `<li class="list-group-item text-muted">No activities found.</li>`;

    document.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        toggleReadActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteActivity(parseInt(this.getAttribute('data-idx')));
      });
    });
  }

  function renderFilterActivity() {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []).reverse();
    el.dataDisplay.innerHTML = `
      <h3>Filter Activities</h3>
      <div class="mb-3">
        <input type="text" id="filterActivityInput" class="form-control" placeholder="Filter activities by keyword...">
      </div>
      <ul id="activityList" class="list-group mb-3">
        ${activities.length ? activities.map((act, idx) => `
          <li class="list-group-item d-flex justify-content-between align-items-center ${act.read ? 'bg-light' : ''}">
            <div>
              <div><strong>${act.user}</strong> (${act.type})</div>
              <div>${typeof act.details === 'string' ? act.details : JSON.stringify(act.details)}</div>
              <div class="text-muted small">${new Date(act.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-success mark-read-btn" data-idx="${idx}">${act.read ? 'Unread' : 'Read'}</button>
              <button class="btn btn-sm btn-outline-danger delete-activity-btn" data-idx="${idx}">Delete</button>
            </div>
          </li>
        `).join('') : `<li class="list-group-item text-muted">No activities yet.</li>`}
      </ul>
    `;

    document.getElementById('filterActivityInput').addEventListener('input', function() {
      filterActivities(this.value.trim().toLowerCase());
    });

    document.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        toggleReadActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteActivity(parseInt(this.getAttribute('data-idx')));
      });
    });
  }

  function renderMarkAsReadUnread() {
    const activities = (JSON.parse(localStorage.getItem('activities')) || []).reverse();
    const unreadCount = activities.filter(act => !act.read).length;
    
    el.dataDisplay.innerHTML = `
      <h3>Mark as Read/Unread</h3>
      <div class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        You have <strong>${unreadCount}</strong> unread activities
      </div>
      <div class="mb-3">
        <button class="btn btn-success me-2" id="markAllRead">
          <i class="bi bi-check-all me-1"></i>Mark All as Read
        </button>
        <button class="btn btn-warning" id="markAllUnread">
          <i class="bi bi-x-circle me-1"></i>Mark All as Unread
        </button>
      </div>
      <ul id="activityList" class="list-group mb-3">
        ${activities.length ? activities.map((act, idx) => `
          <li class="list-group-item d-flex justify-content-between align-items-center ${act.read ? 'bg-light' : ''}">
            <div>
              <div><strong>${act.user}</strong> (${act.type})</div>
              <div>${typeof act.details === 'string' ? act.details : JSON.stringify(act.details)}</div>
              <div class="text-muted small">${new Date(act.timestamp).toLocaleString()}</div>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-success mark-read-btn" data-idx="${idx}">${act.read ? 'Unread' : 'Read'}</button>
              <button class="btn btn-sm btn-outline-danger delete-activity-btn" data-idx="${idx}">Delete</button>
            </div>
          </li>
        `).join('') : `<li class="list-group-item text-muted">No activities yet.</li>`}
      </ul>
    `;

    document.getElementById('markAllRead').addEventListener('click', function() {
      const activities = JSON.parse(localStorage.getItem('activities')) || [];
      activities.forEach(act => act.read = true);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderMarkAsReadUnread();
    });

    document.getElementById('markAllUnread').addEventListener('click', function() {
      const activities = JSON.parse(localStorage.getItem('activities')) || [];
      activities.forEach(act => act.read = false);
      localStorage.setItem('activities', JSON.stringify(activities));
      renderMarkAsReadUnread();
    });

    document.querySelectorAll('.mark-read-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        toggleReadActivity(parseInt(this.getAttribute('data-idx')));
      });
    });

    document.querySelectorAll('.delete-activity-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteActivity(parseInt(this.getAttribute('data-idx')));
      });
    });
  }

  const renderChatInterface = () => {
    el.dataDisplay.innerHTML = `
      <div class="chat-container">
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

  function loadChatMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];

    if (messages.length === 0) {
      messagesContainer.innerHTML = `<div class="text-center text-muted p-5">No messages yet. Start the conversation!</div>`;
      return;
    }

    messagesContainer.innerHTML = messages.map((msg, idx) => {
      const isSent = msg.email === loggedInUser.email;
      const isAdmin = loggedInUser.userType === 'admin';
      const msgClass = isSent ? 'sent' : 'received';
      const userDisplay = isSent ? 'You' : msg.username;
      const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      if (msg.editing) {
        return `
          <div class="message ${msgClass}">
            <div class="meta">${userDisplay} <span class="fw-normal opacity-75 small">${time}</span></div>
            <form class="edit-chat-form d-inline-block w-100" data-idx="${idx}">
              <input type="text" class="form-control form-control-sm d-inline-block" value="${escapeHtml(msg.text)}" style="width:70%">
              <button type="submit" class="btn btn-success btn-sm ms-1">Save</button>
              <button type="button" class="btn btn-secondary btn-sm ms-1 cancel-edit-btn">Cancel</button>
            </form>
          </div>
        `;
      }

      return `
        <div class="message ${msgClass}">
          <div class="meta">${userDisplay} <span class="fw-normal opacity-75 small">${time}</span></div>
          <div class="text d-inline-block px-3 py-2 rounded ${isSent ? 'bg-primary text-white' : 'bg-light text-dark'}">${escapeHtml(msg.text)}</div>
          ${(isSent || isAdmin) ? `
            <button class="btn btn-link btn-sm text-warning edit-btn" data-idx="${idx}" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-link btn-sm text-danger delete-btn" data-idx="${idx}" title="Delete"><i class="bi bi-trash"></i></button>
          ` : ''}
        </div>
      `;
    }).join('');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        startEditChatMessage(parseInt(this.getAttribute('data-idx')));
      });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        deleteChatMessage(parseInt(this.getAttribute('data-idx')));
      });
    });
    document.querySelectorAll('.edit-chat-form').forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const idx = parseInt(this.getAttribute('data-idx'));
        const newText = this.querySelector('input').value.trim();
        saveEditChatMessage(idx, newText);
      });
      form.querySelector('.cancel-edit-btn').addEventListener('click', function() {
        cancelEditChatMessage(parseInt(form.getAttribute('data-idx')));
      });
    });
  }

  const sendChatMessage = (e) => {
    e.preventDefault();
    const input = document.getElementById('chat-input');
    if (input.value.trim()) {
      const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
      messages.push({
        username: loggedInUser.username,
        email: loggedInUser.email,
        text: input.value.trim(),
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      loadChatMessages();
      logActivity('chat', `Sent message: "${input.value.trim()}"`);
      input.value = '';
      input.focus();
    }
  };

  function startEditChatMessage(idx) {
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.forEach((msg, i) => msg.editing = (i === idx));
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    loadChatMessages();
  }

  function saveEditChatMessage(idx, newText) {
    if (!newText) return;
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const isAdmin = loggedInUser.userType === 'admin';
    if (messages[idx] && (messages[idx].email === loggedInUser.email || isAdmin)) {
      messages[idx].text = newText;
      delete messages[idx].editing;
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      loadChatMessages();
      logActivity('chat', `Edited message: "${newText}"`);
    }
  }

  function cancelEditChatMessage(idx) {
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    if (messages[idx]) delete messages[idx].editing;
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    loadChatMessages();
  }

  function deleteChatMessage(idx) {
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const isAdmin = loggedInUser.userType === 'admin';
    if (messages[idx] && (messages[idx].email === loggedInUser.email || isAdmin)) {
      const deletedText = messages[idx].text;
      messages.splice(idx, 1);
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      loadChatMessages();
      logActivity('chat', `Deleted message: "${deletedText}"`);
    }
  }

  function escapeHtml(text) {
    if (!text) return ''; // Return empty string for undefined or null
    return text.replace(/[&<>"']/g, function(m) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[m];
    });
}

  // --- User Management Modal ---
  function renderUserTable(users, filter = "") {
    const userTableContainer = document.getElementById('userTableContainer');
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(filter) ||
      user.email.toLowerCase().includes(filter)
    );
    userTableContainer.innerHTML = `
      <table class="table table-hover">
        <thead><tr><th>Username</th><th>Email</th><th>User Type</th><th>Action</th></tr></thead>
        <tbody>
          ${filteredUsers.length
            ? filteredUsers.map(user => `
              <tr>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                  <span class="badge ${user.userType === 'admin' ? 'bg-danger' : 'bg-secondary'}">
                    ${user.userType || 'regular'}
                  </span>
                </td>
                <td>
                  ${user.email !== loggedInUser.email
                    ? `<button class="btn btn-sm btn-primary start-chat-btn" data-email="${user.email}" data-username="${user.username}">Chat</button>`
                    : `<span class="text-muted">You</span>`
                  }
                </td>
              </tr>
            `).join('')
            : `<tr><td colspan="4" class="text-center text-muted">No users found.</td></tr>`
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

  const renderUserManagement = async () => {
    try {
  
      const localUsers = JSON.parse(localStorage.getItem('users')) || [];
      const allUsers = localUsers;
      
      const modalBody = document.getElementById('userManagementModalBody');
      modalBody.innerHTML = `
        <input type="text" id="userSearchInput" class="form-control mb-3" placeholder="Search users by name or email...">
        <div id="userTableContainer"></div>
      `;
      renderUserTable(allUsers);

      document.getElementById('userSearchInput').addEventListener('input', function() {
        renderUserTable(allUsers, this.value.toLowerCase());
      });

      userManagementModal.show();
      renderGenericContent({name: "Settings"}, {name: "User Management", id: "user-management"});
    } catch (error) {
      console.error('Error loading users:', error);

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
    }
  };

  function openPrivateChat(otherUser) {
    // Mark messages as read when opening chat
    markChatAsRead(otherUser.email);
    
    el.dataDisplay.innerHTML = `
      <div class="private-chat-container">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="user-info">
            <div class="user-avatar">${otherUser.username.charAt(0).toUpperCase()}</div>
            <div class="user-details">
              <h6>${otherUser.username}</h6>
              <div class="user-status">Online</div>
        </div>
          </div>
          <div class="header-actions">
            <button class="action-btn" title="Video Call">
              <i class="bi bi-camera-video"></i>
            </button>
            <button class="action-btn" title="Voice Call">
              <i class="bi bi-telephone"></i>
            </button>
            <button class="action-btn" title="More Options">
              <i class="bi bi-three-dots-vertical"></i>
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="private-chat-messages" id="private-chat-messages">
          <div class="text-center text-muted p-4">Loading messages...</div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input-area">
          <div class="chat-input-container">
            <textarea 
              id="private-chat-input" 
              class="chat-input" 
              placeholder="Type a message..." 
              autocomplete="off"
              rows="1"
            ></textarea>
          </div>
          <button id="private-chat-send" class="chat-send-btn" title="Send Message">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    `;

    loadPrivateChatMessages(otherUser);

    // Auto-resize textarea
    const textarea = document.getElementById('private-chat-input');
    textarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    // Send message on Enter (but allow Shift+Enter for new line)
    textarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendPrivateChatMessage(otherUser);
      }
    });

    // Send button click
    document.getElementById('private-chat-send').addEventListener('click', function() {
      sendPrivateChatMessage(otherUser);
    });

    // Focus on input
    textarea.focus();
  }

  function getChatKey(user1, user2) {
    return 'privateChat_' + [user1.email, user2.email].sort().join('_');
  }

  async function loadPrivateChatMessages(otherUser) {
    try {
      const response = await fetch(`/api/chat/history?user1Email=${loggedInUser.email}&user2Email=${otherUser.email}`);
      const data = await response.json();
      const messages = data.messages || [];
      
    const messagesContainer = document.getElementById('private-chat-messages');
    if (!messages.length) {
        messagesContainer.innerHTML = `
          <div class="text-center text-muted p-4">
            <i class="bi bi-chat-dots fs-1 mb-3"></i>
            <p>No messages yet. Start a conversation!</p>
          </div>
        `;
      return;
    }
      
      // Group messages by date
      const groupedMessages = groupMessagesByDate(messages);
      
      let html = '';
      for (const [date, dayMessages] of Object.entries(groupedMessages)) {
        // Add date separator
        html += `
          <div class="date-separator">
            <span>${formatDate(date)}</span>
          </div>
        `;
        
        // Add messages for this date
        dayMessages.forEach(msg => {
      const isSent = msg.email === loggedInUser.email;
          const time = new Date(msg.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          html += `
            <div class="message-container ${isSent ? 'sent' : 'received'}">
              ${!isSent ? `<div class="message-avatar">${otherUser.username.charAt(0).toUpperCase()}</div>` : ''}
              <div class="message ${isSent ? 'sent' : 'received'}">
                <div class="message-text">${escapeHtml(msg.text)}</div>
                <div class="meta">
                  <span class="message-time">${time}</span>
                  ${isSent ? '<span class="message-status read"></span>' : ''}
                </div>
              </div>
              ${isSent ? `<div class="message-avatar">${loggedInUser.username.charAt(0).toUpperCase()}</div>` : ''}
        </div>
      `;
        });
      }
      
      messagesContainer.innerHTML = html;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
      console.error('Error loading messages:', error);
      const messagesContainer = document.getElementById('private-chat-messages');
      messagesContainer.innerHTML = `
        <div class="text-center text-danger p-4">
          <i class="bi bi-exclamation-triangle fs-1 mb-3"></i>
          <p>Error loading messages</p>
        </div>
      `;
    }
  }

  // Helper function to group messages by date
  function groupMessagesByDate(messages) {
    const grouped = {};
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(msg);
    });
    return grouped;
  }

  // Helper function to format date
  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  }

  // Helper function to generate avatar colors
  function getUserAvatarColor(username) {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #a8caba 0%, #5d4e75 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
    ];
    
    // Use username to consistently assign colors
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  }

  // Helper function to get time ago
  function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    }
  }

  // Unread message counter system
  let unreadCounts = {};

  // Function to get unread count for a specific chat
  function getUnreadCount(otherUserEmail) {
    return unreadCounts[otherUserEmail] || 0;
  }

  // Function to increment unread count
  function incrementUnreadCount(otherUserEmail) {
    if (!unreadCounts[otherUserEmail]) {
      unreadCounts[otherUserEmail] = 0;
    }
    unreadCounts[otherUserEmail]++;
    updateUnreadBadges();
  }

  // Function to clear unread count (when user opens chat)
  function clearUnreadCount(otherUserEmail) {
    unreadCounts[otherUserEmail] = 0;
    updateUnreadBadges();
  }

  // Function to update all unread badges
  function updateUnreadBadges() {
    // Update total unread count in navigation
    const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
    
    // Update private chat menu item badge
    const privateChatMenuItem = document.querySelector('[data-module="private-chat"]');
    if (privateChatMenuItem) {
      let badge = privateChatMenuItem.querySelector('.unread-badge');
      if (totalUnread > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'unread-badge';
          badge.style.cssText = `
            position: absolute;
            top: -5px;
            right: -5px;
            background: #dc3545;
            color: white;
            border-radius: 50%;
            min-width: 18px;
            height: 18px;
            font-size: 11px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
          `;
          privateChatMenuItem.style.position = 'relative';
          privateChatMenuItem.appendChild(badge);
        }
        badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
      } else if (badge) {
        badge.remove();
      }
    }
  }

  // Function to mark messages as read when chat is opened
  function markChatAsRead(otherUserEmail) {
    clearUnreadCount(otherUserEmail);
  }

  // Function to check for new messages periodically
  function startMessagePolling() {
    setInterval(async () => {
      if (!loggedInUser) return;
      
      try {
        // Get all users
      const response = await fetch('/api/users');
      const data = await response.json();
      const users = data.users || [];
      const otherUsers = users.filter(user => user.email !== loggedInUser.email);
      
        // Check for new messages from each user
        for (const user of otherUsers) {
          try {
            const chatResponse = await fetch(`/api/chat/history?user1Email=${loggedInUser.email}&user2Email=${user.email}`);
            const chatData = await chatResponse.json();
            const messages = chatData.messages || [];
            
            if (messages.length > 0) {
              const lastMessage = messages[messages.length - 1];
              const lastMessageTime = new Date(lastMessage.timestamp);
              const now = new Date();
              
              // If message is from other user and less than 30 seconds old, increment unread count
              if (lastMessage.email !== loggedInUser.email && 
                  (now - lastMessageTime) < 30000 && 
                  !currentChatPartner || 
                  currentChatPartner.email !== user.email) {
                incrementUnreadCount(user.email);
              }
            }
          } catch (error) {
            console.error(`Error checking messages for ${user.email}:`, error);
          }
        }
      } catch (error) {
        console.error('Error polling for new messages:', error);
      }
    }, 5000); // Check every 5 seconds
  }

  // Test function to simulate receiving messages (for demonstration)
  window.testUnreadMessages = function() {
    if (!loggedInUser) {
      alert('Please log in first!');
        return;
      }

    // Get all users
    fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        const users = data.users || [];
        const otherUsers = users.filter(user => user.email !== loggedInUser.email);
        
        if (otherUsers.length === 0) {
          alert('No other users found to test with!');
          return;
        }
        
        // Simulate receiving a message from the first other user
        const testUser = otherUsers[0];
        incrementUnreadCount(testUser.email);
        
        showToast(`Test: Unread message from ${testUser.username}`, 'info');
        console.log(`Test: Added unread message from ${testUser.username} (${testUser.email})`);
      })
      .catch(error => {
        console.error('Error testing unread messages:', error);
        alert('Error testing unread messages');
      });
    };

  async function sendPrivateChatMessage(otherUser) {
  // Try modern chat input first, then fallback to classic
  const input = document.getElementById('modernMessageInput') || document.getElementById('private-chat-input');
  if (!input) {
    showToast('Message input not found', 'error');
    return;
  }
  const message = input.value.trim();

  console.log('=== SENDING PRIVATE CHAT MESSAGE ===');
  console.log('Message:', message);
  console.log('Other User:', otherUser);
  console.log('Logged In User:', loggedInUser);

  if (!message) {
    console.log('❌ No message to send');
    return;
  }

  if (!loggedInUser || !loggedInUser.email) {
    console.log('❌ No logged in user or email');
    showToast('Please login first', 'error');
    return;
  }

  if (!otherUser || !otherUser.email) {
    console.log('❌ No other user or email');
    showToast('Invalid user selected', 'error');
    return;
  }

  try {
    // Try modern send button first, then fallback to classic
    const sendBtn = document.getElementById('modernSendBtn') || document.getElementById('private-chat-send');
    const originalContent = sendBtn ? sendBtn.innerHTML : '';
    if (sendBtn) {
      sendBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
      sendBtn.disabled = true;
    }

    const requestBody = {
      senderEmail: loggedInUser.email,
      receiverEmail: otherUser.email,
      message: message,
      username: loggedInUser.username
    };

    console.log('Sending request to server:', requestBody);

    const response = await fetch('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    console.log('Response data:', data);

    if (data.success) {
      console.log('✅ Message sent successfully');
      // Clear input and reset height
      input.value = '';
      input.style.height = 'auto';

      // Reload messages
      if (typeof loadPrivateChatMessages === 'function') {
        await loadPrivateChatMessages(otherUser);
      }
      if (typeof loadModernChatMessages === 'function') {
        await loadModernChatMessages(otherUser);
      }

      // Show success indicator
      if (sendBtn) {
        sendBtn.innerHTML = '<i class="bi bi-check"></i>';
        setTimeout(() => {
          sendBtn.innerHTML = originalContent;
          sendBtn.disabled = false;
        }, 1000);
      }
    } else {
      console.log('❌ Server returned error:', data.message);
      // Show error
      if (sendBtn) {
        sendBtn.innerHTML = '<i class="bi bi-exclamation-triangle"></i>';
        setTimeout(() => {
          sendBtn.innerHTML = originalContent;
          sendBtn.disabled = false;
        }, 2000);
      }
      showToast('Failed to send message: ' + data.message, 'error');
    }
  } catch (error) {
    console.error('❌ Error sending message:', error);
    // Reset button state
    const sendBtn = document.getElementById('modernSendBtn') || document.getElementById('private-chat-send');
    if (sendBtn) {
      sendBtn.innerHTML = '<i class="bi bi-send-fill"></i>';
      sendBtn.disabled = false;
    }
    showToast('Error sending message. Please try again.', 'error');
  }
}

  // --- Private Chat Functions ---
  const renderFindUserToChat = async () => {
    try {
      // Fetch users from server
      const response = await fetch('/api/users');
      const data = await response.json();
      const users = data.users || [];
      const otherUsers = users.filter(user => user.email !== loggedInUser.email);
      
      if (otherUsers.length === 0) {
        el.dataDisplay.innerHTML = `
          <div class="text-center text-muted p-4">
            <i class="bi bi-people fs-1 mb-3"></i>
            <p>No other users found to chat with.</p>
          </div>
        `;
        return;
      }
      
      console.log('Rendering user list with', otherUsers.length, 'users');
      
      el.dataDisplay.innerHTML = `
        <div class="user-list-container">
          <!-- User List Header -->
          <div class="user-list-header">
            <h5>Find User to Chat</h5>
            <div class="user-search">
              <i class="bi bi-search search-icon"></i>
              <input type="text" id="findUserSearchInput" placeholder="Search users" autocomplete="off">
            </div>
          </div>

          <!-- User List -->
          <div class="user-list" id="findUsersList">
            ${otherUsers.map(user => {
              const avatarColor = getUserAvatarColor(user.username || user.email);
              const initials = (user.username || user.email).substring(0, 2).toUpperCase();
              
              console.log('Creating button for user:', user.email);
              
              return `
                <button class="user-item" data-email="${user.email}" data-username="${user.username}" onclick="console.log('Button clicked for ${user.email}'); startModernChat('${user.email}');">
                  <div class="user-avatar" style="background: ${avatarColor};">
                    ${initials}
                  </div>
                  <div class="user-info">
                    <div class="user-name">${user.username || user.email}</div>
                    <div class="user-email">${user.email}</div>
                  </div>
                  <div class="user-action">
                    <i class="bi bi-chat-dots"></i>
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
      
      // Setup search functionality
      const searchInput = document.getElementById('findUserSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase();
          const userItems = document.querySelectorAll('#findUsersList .user-item');
          
          userItems.forEach(item => {
            const userName = item.querySelector('.user-name').textContent.toLowerCase();
            const userEmail = item.querySelector('.user-email').textContent.toLowerCase();
            
            if (userName.includes(searchTerm) || userEmail.includes(searchTerm)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      }
      
    } catch (error) {
      console.error('Error rendering find user to chat:', error);
      showToast('Failed to load users', 'error');
    }
  };

  const renderActiveChats = async () => {
    try {
      // Fetch users from server
      const response = await fetch('/api/users');
      const data = await response.json();
      const users = data.users || [];
      const otherUsers = users.filter(user => user.email !== loggedInUser.email);
      const activeChats = [];

      // Find users with existing chat history from server
      for (const user of otherUsers) {
        try {
          const chatResponse = await fetch(`/api/chat/history?user1Email=${loggedInUser.email}&user2Email=${user.email}`);
          const chatData = await chatResponse.json();
          const messages = chatData.messages || [];
          
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          activeChats.push({
            user: user,
            lastMessage: lastMessage,
            messageCount: messages.length
          });
        }
        } catch (error) {
          console.error(`Error loading chat history for ${user.email}:`, error);
        }
      }

    el.dataDisplay.innerHTML = `
      <div class="user-list-container">
        <!-- User List Header -->
        <div class="user-list-header">
          <h5>Active Chats</h5>
          <div class="user-search">
            <i class="bi bi-search search-icon"></i>
            <input type="text" id="activeChatSearchInput" placeholder="Search active chats" autocomplete="off">
        </div>
              </div>

        <!-- User List -->
        <div class="user-list" id="activeChatsList">
          ${activeChats.length > 0 ? activeChats.map(chat => {
            const lastMessageTime = new Date(chat.lastMessage.timestamp);
            const timeAgo = getTimeAgo(lastMessageTime);
            const messagePreview = chat.lastMessage.text.length > 30 
              ? chat.lastMessage.text.substring(0, 30) + '...' 
              : chat.lastMessage.text;
            
            return `
              <button class="user-item" data-email="${chat.user.email}" data-username="${chat.user.username}">
                <div class="user-avatar" style="background: ${getUserAvatarColor(chat.user.username)};">
                  ${chat.user.username.charAt(0).toUpperCase()}
                </div>
                <div class="user-info">
                  <div class="user-name">${chat.user.username}</div>
                  <div class="message-preview">${messagePreview}</div>
                </div>
                <div class="message-meta">
                  <div class="message-time">${timeAgo}</div>
                  ${getUnreadCount(chat.user.email) > 0 ? `
                    <div class="unread-badge">${getUnreadCount(chat.user.email)}</div>
                  ` : ''}
                </div>
              </button>
            `;
          }).join('') : `
            <div class="text-center text-muted p-4">
              <i class="bi bi-chat-dots fs-1 mb-3"></i>
              <p>No active chats found. Start a conversation with someone!</p>
            </div>
          `}
        </div>
      </div>
    `;

    // Add click handlers for chat buttons
    document.querySelectorAll('.start-chat-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const otherUser = {
          email: this.getAttribute('data-email'),
          username: this.getAttribute('data-username')
        };
        openPrivateChat(otherUser);
      });
    });
  } catch (error) {
    console.error('Error loading active chats:', error);
    el.dataDisplay.innerHTML = `
      <div class="alert alert-danger">
        <h5>Error Loading Active Chats</h5>
        <p>Unable to load active chats. Please try again later.</p>
      </div>
    `;
  }
};

  const renderChatHistory = async () => {
    try {
      // Fetch users from server
      const response = await fetch('/api/users');
      const data = await response.json();
      const users = data.users || [];
      const otherUsers = users.filter(user => user.email !== loggedInUser.email);
      const allChats = [];

      // Get all chat histories from server
      for (const user of otherUsers) {
        try {
          const response = await fetch(`/api/chat/history?user1Email=${loggedInUser.email}&user2Email=${user.email}`);
          const data = await response.json();
          const messages = data.messages || [];
          
        if (messages.length > 0) {
          allChats.push({
            user: user,
            messages: messages,
            totalMessages: messages.length,
            lastActivity: new Date(Math.max(...messages.map(m => new Date(m.timestamp))))
          });
        }
        } catch (error) {
          console.error(`Error loading chat history for ${user.email}:`, error);
        }
      }

    // Sort by last activity (most recent first)
    allChats.sort((a, b) => b.lastActivity - a.lastActivity);

    el.dataDisplay.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h5 class="mb-0">📚 Chat History</h5>
        </div>
        <div class="card-body">
          ${allChats.length > 0 ? allChats.map(chat => `
            <div class="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
              <div class="flex-grow-1">
                <h6 class="mb-1">${chat.user.username}</h6>
                <small class="text-muted">Username: ${chat.user.username}</small>
                <br>
                <small class="text-muted">Total messages: ${chat.totalMessages}</small>
                <br>
                <small class="text-muted">Last activity: ${chat.lastActivity.toLocaleString()}</small>
              </div>
              <div>
                <button class="btn btn-primary btn-sm start-chat-btn me-2" data-email="${chat.user.email}" data-username="${chat.user.username}">
                  💬 Chat
                </button>
                <button class="btn btn-outline-secondary btn-sm view-history-btn" data-email="${chat.user.email}" data-username="${chat.user.username}">
                  📖 View History
                </button>
              </div>
            </div>
          `).join('') : '<p class="text-muted">No chat history found. Start conversations to see them here!</p>'}
        </div>
      </div>
    `;

    // Add click handlers
    document.querySelectorAll('.start-chat-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const otherUser = {
          email: this.getAttribute('data-email'),
          username: this.getAttribute('data-username')
        };
        openPrivateChat(otherUser);
      });
    });

    document.querySelectorAll('.view-history-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const otherUser = {
          email: this.getAttribute('data-email'),
          username: this.getAttribute('data-username')
        };
        openChatHistory(otherUser);
      });
    });
  } catch (error) {
    console.error('Error loading chat history:', error);
    el.dataDisplay.innerHTML = `
      <div class="alert alert-danger">
        <h5>Error Loading Chat History</h5>
        <p>Unable to load chat history. Please try again later.</p>
      </div>
    `;
  }
};

  const openChatHistory = async (otherUser) => {
    try {
      const response = await fetch(`/api/chat/history?user1Email=${loggedInUser.email}&user2Email=${otherUser.email}`);
      const data = await response.json();
      const messages = data.messages || [];

    el.dataDisplay.innerHTML = `
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h5 class="mb-0">📖 Chat History with ${otherUser.username}</h5>
          <button class="btn btn-outline-secondary btn-sm" onclick="renderChatHistory()">← Back to History</button>
        </div>
        <div class="card-body">
          <div class="chat-history-container" style="height: 400px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem; padding: 1rem;">
            ${messages.length > 0 ? messages.map(msg => {
              const isSent = msg.email === loggedInUser.email;
              const msgClass = isSent ? 'text-end' : 'text-start';
              const time = new Date(msg.timestamp).toLocaleString();
              return `
                <div class="mb-3 ${msgClass}">
                  <div class="small text-muted mb-1">${msg.username} - ${time}</div>
                  <div class="d-inline-block px-3 py-2 rounded ${isSent ? 'bg-primary text-white' : 'bg-light text-dark'}">
                    ${escapeHtml(msg.text)}
                  </div>
                </div>
              `;
            }).join('') : '<p class="text-muted text-center">No messages in this conversation</p>'}
          </div>
        </div>
      </div>
    `;
    } catch (error) {
      console.error('Error loading chat history:', error);
      el.dataDisplay.innerHTML = `
        <div class="alert alert-danger">
          <h5>Error Loading Chat History</h5>
          <p>Unable to load chat history. Please try again later.</p>
        </div>
      `;
    }
  };

  // --- Generic Content ---
  const renderGenericContent = (module, sub) => {
    el.dataDisplay.innerHTML = `
      <h3>${sub.name}</h3>
      <p>Data for <strong>${module.name} → ${sub.name}</strong> will be displayed here.</p>
      <p class="text-muted">This is a placeholder for the ${sub.id} section.</p>
    `;
  };

  // --- Admin Functions ---
  const renderLoginHistory = async () => {
    try {
      // Load login history from localStorage only
      const localLoginHistory = JSON.parse(localStorage.getItem('loginRecords')) || [];
      const allLoginHistory = localLoginHistory;
      
      // Sort by login time (newest first)
      allLoginHistory.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));

      el.dataDisplay.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3>Login History</h3>
          <button class="btn btn-outline-primary btn-sm" onclick="exportLoginHistory()">
            <i class="bi bi-download"></i> Export
          </button>
        </div>
        <div class="table-responsive">
          <table class="table table-striped table-hover">
            <thead class="table-dark">
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Login Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${allLoginHistory.map(login => `
                <tr>
                  <td>${login.id}</td>
                  <td>${escapeHtml(login.username)}</td>
                  <td>${escapeHtml(login.email)}</td>
                  <td><span class="badge ${login.userType === 'admin' ? 'bg-danger' : 'bg-secondary'}">${login.userType}</span></td>
                  <td>${new Date(login.loginTime).toLocaleString()}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteLoginRecord(${login.id})">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div class="mt-3">
          <p class="text-muted">Total login records: ${allLoginHistory.length}</p>
        </div>
      `;
    } catch (error) {
      el.dataDisplay.innerHTML = `
        <div class="alert alert-danger">
          <h4>Error Loading Login History</h4>
          <p>${error.message}</p>
        </div>
      `;
    }
  };

  const renderUserExport = () => {
    const localUsers = JSON.parse(localStorage.getItem('signupRecords')) || [];
    
    el.dataDisplay.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>User Export</h3>
        <div>
          <button class="btn btn-success btn-sm me-2" onclick="exportNewUsers()">
            <i class="bi bi-download"></i> Export New Users
          </button>
          <button class="btn btn-outline-primary btn-sm" onclick="exportAllUsers()">
            <i class="bi bi-download"></i> Export All Users
          </button>
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>New Users (Pending Export)</h5>
            </div>
            <div class="card-body">
              ${localUsers.length === 0 ? 
                '<p class="text-muted">No new users to export</p>' :
                `<p class="text-success">${localUsers.length} new user(s) ready for export</p>
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>User Type</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${localUsers.map(user => `
                        <tr>
                          <td>${escapeHtml(user.username)}</td>
                          <td>${escapeHtml(user.email)}</td>
                          <td><span class="badge ${user.userType === 'admin' ? 'bg-danger' : 'bg-secondary'}">${user.userType}</span></td>
                          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>`
              }
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Export Instructions</h5>
            </div>
            <div class="card-body">
              <p><strong>Signup Records Export:</strong> Downloads all signup records as a JSON file</p>
              <p><strong>All Users Export:</strong> Downloads all registered users as a complete JSON file</p>
              <hr>
              <div class="alert alert-info">
                <small>
                  <strong>Note:</strong> Signup records are stored in localStorage and can be exported as JSON files.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderSystemLogs = () => {
    el.dataDisplay.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h3>System Logs</h3>
        <button class="btn btn-outline-primary btn-sm" onclick="exportSystemLogs()">
          <i class="bi bi-download"></i> Export Logs
        </button>
      </div>
      
      <div class="card">
        <div class="card-body">
          <h5>System Information</h5>
          <ul class="list-unstyled">
            <li><strong>Current User:</strong> ${loggedInUser.username} (${loggedInUser.userType})</li>
            <li><strong>Session Start:</strong> ${new Date().toLocaleString()}</li>
            <li><strong>Browser:</strong> ${navigator.userAgent}</li>
            <li><strong>Local Storage:</strong> ${Object.keys(localStorage).length} items</li>
            <li><strong>Session Storage:</strong> ${Object.keys(sessionStorage).length} items</li>
          </ul>
          
          <hr>
          
          <h5>Recent Activities</h5>
          <div class="table-responsive">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${new Date().toLocaleString()}</td>
                  <td>${loggedInUser.username}</td>
                  <td>Accessed System Admin panel</td>
                </tr>
                <tr>
                  <td>${new Date().toLocaleString()}</td>
                  <td>System</td>
                  <td>Login history loaded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  // Modern Dashboard Component
  const renderModernDashboard = () => {
    el.dataDisplay.className = 'p-0';
    el.dataDisplay.innerHTML = `
      <div id="modern-dashboard-container" class="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <!-- Ambient background effects -->
        <div id="ambient-bg" class="fixed w-96 h-96 bg-gray-900/5 rounded-full blur-3xl pointer-events-none transition-all duration-500 ease-out"></div>
        
        <!-- Floating Navigation -->
        <div id="floating-nav" class="fixed right-8 top-1/2 transform -translate-y-1/2 z-50">
          <div class="bg-black/80 backdrop-blur-xl rounded-full p-2 border border-gray-800 shadow-2xl">
            <button class="nav-dot active w-3 h-3 rounded-full m-2 transition-all duration-300 bg-white scale-125" data-view="overview"></button>
            <button class="nav-dot w-3 h-3 rounded-full m-2 transition-all duration-300 bg-gray-600 hover:bg-gray-400 scale-100" data-view="analytics"></button>
            <button class="nav-dot w-3 h-3 rounded-full m-2 transition-all duration-300 bg-gray-600 hover:bg-gray-400 scale-100" data-view="insights"></button>
            <button class="nav-dot w-3 h-3 rounded-full m-2 transition-all duration-300 bg-gray-600 hover:bg-gray-400 scale-100" data-view="performance"></button>
            <button class="nav-dot w-3 h-3 rounded-full m-2 transition-all duration-300 bg-gray-600 hover:bg-gray-400 scale-100" data-view="settings"></button>
          </div>
          
          <!-- Progress bar -->
          <div class="absolute -left-1 top-0 w-1 h-full bg-gray-800 rounded-full">
            <div id="progress-bar" class="bg-white rounded-full w-full transition-all duration-800 ease-out" style="height: 0%"></div>
          </div>
        </div>

        <!-- Gesture Indicator -->
        <div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div class="bg-black/80 backdrop-blur-xl rounded-2xl px-6 py-3 border border-gray-800 shadow-xl">
            <div class="flex items-center space-x-4 text-white text-sm">
              <div class="flex items-center space-x-2">
                <i class="bi bi-mouse"></i>
                <span>Scroll</span>
              </div>
              <div class="w-px h-4 bg-gray-600"></div>
              <div class="flex items-center space-x-2">
                <i class="bi bi-phone"></i>
                <span>Swipe</span>
              </div>
              <div class="w-px h-4 bg-gray-600"></div>
              <div class="flex items-center space-x-2">
                <span class="font-mono text-xs">↑↓</span>
                <span>Keys</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Header -->
        <header class="backdrop-blur-xl bg-white/80 border-b border-gray-200/50 px-8 py-6 sticky top-0 z-40">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="p-3 rounded-2xl bg-black shadow-lg">
                <i class="bi bi-gear-wide-connected text-white text-xl"></i>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-black">NeuralDash 2025</h1>
                <p class="text-gray-600">Scroll-Free Experience</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-6">
              <div class="relative">
                <i class="bi bi-search text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"></i>
                <input 
                  type="text" 
                  placeholder="Neural search..."
                  class="pl-12 pr-6 py-3 rounded-2xl bg-gray-100/80 backdrop-blur-sm border border-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
              </div>
              
              <button class="p-3 rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors">
                <i class="bi bi-bell text-gray-700"></i>
              </button>
              
              <button class="p-3 rounded-2xl bg-gray-100/80 hover:bg-gray-200/80 transition-colors">
                <i class="bi bi-gear text-gray-700"></i>
              </button>
              
              <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <span class="text-white font-semibold">A</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="px-8 py-12 min-h-screen">
          <div class="max-w-7xl mx-auto">
            <!-- Overview View -->
            <div id="overview-view" class="dashboard-view active">
              <div class="space-y-12">
                <div class="text-center">
                  <h1 class="text-6xl font-bold text-black mb-4 tracking-tight">
                    Neural Dashboard
                  </h1>
                  <p class="text-2xl text-gray-600 font-light">
                    Scroll-free analytics experience
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <!-- Revenue Card -->
                  <div class="group relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl transition-all duration-700 hover:scale-[1.02] bg-black text-white border border-gray-800 shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div class="relative z-10">
                      <div class="flex items-center justify-between mb-6">
                        <div class="p-4 rounded-2xl bg-white/10">
                          <i class="bi bi-currency-dollar text-white text-2xl"></i>
                        </div>
                        <div class="flex items-center space-x-1 px-4 py-2 rounded-full bg-gray-900 text-white">
                          <i class="bi bi-arrow-up text-sm"></i>
                          <span class="text-sm font-semibold">34%</span>
                        </div>
                      </div>
                      
                      <div class="text-4xl font-bold mb-3 text-white">
                        $2.4M
                      </div>
                      <div class="text-lg font-medium text-gray-300">
                        Revenue
                      </div>
                    </div>
                    
                    <!-- Micro-interaction dots -->
                    <div class="absolute top-6 right-6 flex space-x-1">
                      <div class="w-2 h-2 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                      <div class="w-2 h-2 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style="animation-delay: 200ms;"></div>
                    </div>
                  </div>

                  <!-- Users Card -->
                  <div class="group relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl transition-all duration-700 hover:scale-[1.02] bg-white/80 text-black border border-gray-200 shadow-xl hover:bg-white">
                    <div class="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div class="relative z-10">
                      <div class="flex items-center justify-between mb-6">
                        <div class="p-4 rounded-2xl bg-gray-100">
                          <i class="bi bi-people text-black text-2xl"></i>
                        </div>
                        <div class="flex items-center space-x-1 px-4 py-2 rounded-full bg-gray-900 text-white">
                          <i class="bi bi-arrow-up text-sm"></i>
                          <span class="text-sm font-semibold">12%</span>
                        </div>
                      </div>
                      
                      <div class="text-4xl font-bold mb-3 text-black">
                        184K
                      </div>
                      <div class="text-lg font-medium text-gray-600">
                        Users
                      </div>
                    </div>
                  </div>

                  <!-- Conversion Card -->
                  <div class="group relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl transition-all duration-700 hover:scale-[1.02] bg-white/80 text-black border border-gray-200 shadow-xl hover:bg-white">
                    <div class="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div class="relative z-10">
                      <div class="flex items-center justify-between mb-6">
                        <div class="p-4 rounded-2xl bg-gray-100">
                          <i class="bi bi-bullseye text-black text-2xl"></i>
                        </div>
                        <div class="flex items-center space-x-1 px-4 py-2 rounded-full bg-gray-100 text-gray-900">
                          <i class="bi bi-arrow-down text-sm"></i>
                          <span class="text-sm font-semibold">2%</span>
                        </div>
                      </div>
                      
                      <div class="text-4xl font-bold mb-3 text-black">
                        12.8%
                      </div>
                      <div class="text-lg font-medium text-gray-600">
                        Conversion
                      </div>
                    </div>
                  </div>

                  <!-- Engagement Card -->
                  <div class="group relative overflow-hidden rounded-3xl p-8 backdrop-blur-xl transition-all duration-700 hover:scale-[1.02] bg-white/80 text-black border border-gray-200 shadow-xl hover:bg-white">
                    <div class="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div class="relative z-10">
                      <div class="flex items-center justify-between mb-6">
                        <div class="p-4 rounded-2xl bg-gray-100">
                          <i class="bi bi-activity text-black text-2xl"></i>
                        </div>
                        <div class="flex items-center space-x-1 px-4 py-2 rounded-full bg-gray-900 text-white">
                          <i class="bi bi-arrow-up text-sm"></i>
                          <span class="text-sm font-semibold">18%</span>
                        </div>
                      </div>
                      
                      <div class="text-4xl font-bold mb-3 text-black">
                        98.2%
                      </div>
                      <div class="text-lg font-medium text-gray-600">
                        Engagement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Analytics View -->
            <div id="analytics-view" class="dashboard-view hidden">
              <div class="space-y-12">
                <h2 class="text-4xl font-bold text-black">Advanced Analytics</h2>
                
                <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
                  <div class="flex items-center justify-between mb-8">
                    <h3 class="text-2xl font-bold text-black">Revenue Flow</h3>
                    <div class="flex items-center space-x-4">
                      <div class="flex items-center space-x-2">
                        <div class="w-3 h-3 bg-black rounded-full animate-pulse"></div>
                        <span class="text-gray-600">Live Data</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="relative h-64 mb-8">
                    <svg class="w-full h-full" viewBox="0 0 800 250">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stop-color="#000000" stop-opacity="0.8"/>
                          <stop offset="50%" stop-color="#4B5563" stop-opacity="0.4"/>
                          <stop offset="100%" stop-color="#9CA3AF" stop-opacity="0.1"/>
                        </linearGradient>
                      </defs>
                      
                      <path
                        d="M 0 200 Q 200 80 400 120 T 800 60"
                        stroke="#000000"
                        stroke-width="4"
                        fill="none"
                        class="drop-shadow-lg"
                      />
                      <path
                        d="M 0 200 Q 200 80 400 120 T 800 60 L 800 250 L 0 250 Z"
                        fill="url(#chartGradient)"
                        opacity="0.3"
                      />
                      
                      <g>
                        <circle cx="200" cy="150" r="6" fill="#000000" class="drop-shadow-lg animate-bounce"></circle>
                        <text x="200" y="165" text-anchor="middle" class="text-xs fill-gray-600 font-semibold">$2.1M</text>
                      </g>
                      <g>
                        <circle cx="350" cy="120" r="6" fill="#000000" class="drop-shadow-lg animate-bounce" style="animation-delay: 300ms;"></circle>
                        <text x="350" y="135" text-anchor="middle" class="text-xs fill-gray-600 font-semibold">$2.4M</text>
                      </g>
                      <g>
                        <circle cx="500" cy="90" r="6" fill="#000000" class="drop-shadow-lg animate-bounce" style="animation-delay: 600ms;"></circle>
                        <text x="500" y="105" text-anchor="middle" class="text-xs fill-gray-600 font-semibold">$2.7M</text>
                      </g>
                      <g>
                        <circle cx="700" cy="60" r="6" fill="#000000" class="drop-shadow-lg animate-bounce" style="animation-delay: 900ms;"></circle>
                        <text x="700" y="75" text-anchor="middle" class="text-xs fill-gray-600 font-semibold">$3.0M</text>
                      </g>
                    </svg>
                  </div>
                  
                  <div class="grid grid-cols-3 gap-8 text-center">
                    <div>
                      <div class="text-3xl font-bold text-black">$847K</div>
                      <div class="text-gray-600">This Month</div>
                    </div>
                    <div>
                      <div class="text-3xl font-bold text-black">+28%</div>
                      <div class="text-gray-600">Growth</div>
                    </div>
                    <div>
                      <div class="text-3xl font-bold text-black">98.2%</div>
                      <div class="text-gray-600">Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Insights View -->
            <div id="insights-view" class="dashboard-view hidden">
              <div class="space-y-12">
                <h2 class="text-4xl font-bold text-black">AI Insights</h2>
                
                <div class="grid md:grid-cols-2 gap-8">
                  <div class="bg-black text-white rounded-3xl p-8 shadow-2xl">
                    <div class="flex items-center space-x-3 mb-6">
                      <div class="p-3 rounded-2xl bg-white/10">
                        <i class="bi bi-cpu text-white text-xl"></i>
                      </div>
                      <h3 class="text-xl font-bold">Neural Analysis</h3>
                    </div>
                    
                    <div class="space-y-6">
                      <div class="bg-white/5 rounded-2xl p-4">
                        <p class="text-white mb-3">Revenue spike detected in mobile segment</p>
                        <div class="flex items-center space-x-3">
                          <div class="flex-1 bg-white/20 rounded-full h-2">
                            <div class="h-full bg-white rounded-full transition-all duration-1000" style="width: 96%"></div>
                          </div>
                          <span class="text-sm text-gray-300">96%</span>
                        </div>
                      </div>
                      <div class="bg-white/5 rounded-2xl p-4">
                        <p class="text-white mb-3">Optimal posting time: 2:30 PM EST</p>
                        <div class="flex items-center space-x-3">
                          <div class="flex-1 bg-white/20 rounded-full h-2">
                            <div class="h-full bg-white rounded-full transition-all duration-1000" style="width: 88%"></div>
                          </div>
                          <span class="text-sm text-gray-300">88%</span>
                        </div>
                      </div>
                      <div class="bg-white/5 rounded-2xl p-4">
                        <p class="text-white mb-3">Predicted 15% increase next week</p>
                        <div class="flex items-center space-x-3">
                          <div class="flex-1 bg-white/20 rounded-full h-2">
                            <div class="h-full bg-white rounded-full transition-all duration-1000" style="width: 92%"></div>
                          </div>
                          <span class="text-sm text-gray-300">92%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 shadow-2xl">
                    <h3 class="text-xl font-bold text-black mb-6">Performance Metrics</h3>
                    <div class="space-y-4">
                      <div class="flex items-center space-x-4">
                        <div class="w-24 text-sm text-gray-600 font-medium">CPU Usage</div>
                        <div class="flex-1 bg-gray-200 rounded-full h-3">
                          <div class="h-full bg-gray-900 rounded-full transition-all duration-1000" style="width: 23%"></div>
                        </div>
                        <div class="w-12 text-sm text-gray-900 font-bold">23%</div>
                      </div>
                      <div class="flex items-center space-x-4">
                        <div class="w-24 text-sm text-gray-600 font-medium">Memory</div>
                        <div class="flex-1 bg-gray-200 rounded-full h-3">
                          <div class="h-full bg-gray-700 rounded-full transition-all duration-1000" style="width: 67%"></div>
                        </div>
                        <div class="w-12 text-sm text-gray-900 font-bold">67%</div>
                      </div>
                      <div class="flex items-center space-x-4">
                        <div class="w-24 text-sm text-gray-600 font-medium">Network</div>
                        <div class="flex-1 bg-gray-200 rounded-full h-3">
                          <div class="h-full bg-gray-500 rounded-full transition-all duration-1000" style="width: 45%"></div>
                        </div>
                        <div class="w-12 text-sm text-gray-900 font-bold">45%</div>
                      </div>
                      <div class="flex items-center space-x-4">
                        <div class="w-24 text-sm text-gray-600 font-medium">Disk I/O</div>
                        <div class="flex-1 bg-gray-200 rounded-full h-3">
                          <div class="h-full bg-gray-400 rounded-full transition-all duration-1000" style="width: 12%"></div>
                        </div>
                        <div class="w-12 text-sm text-gray-900 font-bold">12%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Performance View -->
            <div id="performance-view" class="dashboard-view hidden">
              <div class="space-y-12">
                <h2 class="text-4xl font-bold text-black">System Performance</h2>
                <div class="text-center py-20">
                  <div class="text-6xl mb-4">⚡</div>
                  <p class="text-2xl text-gray-600">Lightning fast performance metrics</p>
                </div>
              </div>
            </div>

            <!-- Settings View -->
            <div id="settings-view" class="dashboard-view hidden">
              <div class="space-y-12">
                <h2 class="text-4xl font-bold text-black">Settings</h2>
                <div class="text-center py-20">
                  <div class="text-6xl mb-4">⚙️</div>
                  <p class="text-2xl text-gray-600">Customize your experience</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    `;

    // Initialize dashboard functionality
    initializeDashboard();
  };

  // Dashboard initialization and event handlers
  const initializeDashboard = () => {
    const views = ['overview', 'analytics', 'insights', 'performance', 'settings'];
    let currentView = 0;
    let isTransitioning = false;

    // Get dashboard elements
    const container = document.getElementById('modern-dashboard-container');
    const ambientBg = document.getElementById('ambient-bg');
    const navDots = document.querySelectorAll('.nav-dot');
    const progressBar = document.getElementById('progress-bar');
    const dashboardViews = document.querySelectorAll('.dashboard-view');

    // Mouse tracking for ambient background
    const handleMouseMove = (e) => {
      if (ambientBg) {
        ambientBg.style.left = (e.clientX - 192) + 'px';
        ambientBg.style.top = (e.clientY - 192) + 'px';
      }
    };

    // Navigation dot click handlers
    navDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        if (isTransitioning) return;
        switchView(index);
      });
    });

    // Switch view function
    const switchView = (newIndex) => {
      if (isTransitioning || newIndex === currentView) return;
      
      isTransitioning = true;
      
      // Update navigation dots
      navDots[currentView].classList.remove('active', 'bg-white', 'scale-125');
      navDots[currentView].classList.add('bg-gray-600', 'scale-100');
      
      navDots[newIndex].classList.add('active', 'bg-white', 'scale-125');
      navDots[newIndex].classList.remove('bg-gray-600', 'scale-100');
      
      // Hide current view
      dashboardViews[currentView].classList.add('hidden');
      dashboardViews[currentView].classList.remove('active');
      
      // Show new view
      dashboardViews[newIndex].classList.remove('hidden');
      dashboardViews[newIndex].classList.add('active');
      
      // Update progress bar
      const progress = (newIndex / (views.length - 1)) * 100;
      progressBar.style.height = progress + '%';
      
      currentView = newIndex;
      
      // Reset transition flag
      setTimeout(() => {
        isTransitioning = false;
      }, 800);
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        const newView = Math.min(views.length - 1, currentView + 1);
        switchView(newView);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newView = Math.max(0, currentView - 1);
        switchView(newView);
      }
    };

    // Touch/swipe navigation
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
      if (!touchStartY) return;
      
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY - touchEndY;
      const deltaX = touchStartX - touchEndX;
      
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        const direction = deltaY > 0 ? 1 : -1;
        const newView = Math.max(0, Math.min(views.length - 1, currentView + direction));
        switchView(newView);
      }
      
      touchStartY = 0;
      touchStartX = 0;
    };

    // Wheel navigation
    const handleWheel = (e) => {
      e.preventDefault();
      if (isTransitioning) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const newView = Math.max(0, Math.min(views.length - 1, currentView + direction));
      switchView(newView);
    };

    // Add event listeners
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('keydown', handleKeyDown);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Initialize progress bar
    progressBar.style.height = '0%';
  };

  // --- Content Switcher ---
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
      case 'find-user':
        renderFindUserToChat();
        break;
      case 'active-chats':
        renderActiveChats();
        break;
      case 'chat-history':
        renderChatHistory();
        break;
      case 'All Activity':
        renderAllActivities();
        break;
      case 'Filter Activity':
        renderFilterActivity();
        break;
      case 'Mark as Read/Unread':
        renderMarkAsReadUnread();
        break;
      case 'activities-dash':
        renderAllActivities();
        break;
      case 'modern-dashboard':
        window.location.href = '/dashboard';
        break;
      case 'login-history':
        renderLoginHistory();
        break;
      case 'user-export':
        renderUserExport();
        break;
      case 'system-logs':
        renderSystemLogs();
        break;
      default:
        renderGenericContent(module, sub);
    }
  };

  // --- Event Listeners ---
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
        const chatKey = event.key;
        const emails = chatKey.replace('privateChat_', '').split('_');
        const otherEmail = emails.find(email => email !== loggedInUser.email);
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const otherUser = users.find(u => u.email === otherEmail);
        if (otherUser) loadPrivateChatMessages(otherUser);
      }
    });

    // --- Theme Toggle ---
    if (el.themeToggle) {
      el.themeToggle.addEventListener('click', () => {
        const body = document.body;
        if (body.classList.contains('light-theme')) {
          body.classList.remove('light-theme');
          body.classList.add('dark-theme');
          localStorage.setItem('theme', 'dark-theme');
          el.themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
          body.classList.remove('dark-theme');
          body.classList.add('light-theme');
          localStorage.setItem('theme', 'light-theme');
          el.themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        }
      });
    }
  };

  // --- Export Functions (Global Scope) ---
  window.exportLoginHistory = async () => {
    try {
      const localLoginHistory = JSON.parse(localStorage.getItem('loginRecords')) || [];
      
      const blob = new Blob([JSON.stringify({ loginRecords: localLoginHistory }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'login_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Login history exported successfully!', 'success');
    } catch (error) {
      showToast('Error exporting login history', 'danger');
    }
  };

  window.exportNewUsers = () => {
    try {
      const signupRecords = JSON.parse(localStorage.getItem('signupRecords')) || [];
      const blob = new Blob([JSON.stringify({ signupRecords: signupRecords }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'signup_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('Signup records exported successfully!', 'success');
    } catch (error) {
      showToast('Error exporting signup records', 'danger');
    }
  };

  window.exportAllUsers = async () => {
    try {
      const localUsers = JSON.parse(localStorage.getItem('users')) || [];
      
      const blob = new Blob([JSON.stringify({ users: localUsers }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all_users_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('All users exported successfully!', 'success');
    } catch (error) {
      showToast('Error exporting all users', 'danger');
    }
  };

  window.exportSystemLogs = () => {
    try {
      const systemInfo = {
        currentUser: loggedInUser,
        sessionStart: new Date().toISOString(),
        browser: navigator.userAgent,
        localStorage: Object.keys(localStorage).length,
        sessionStorage: Object.keys(sessionStorage).length,
        exportTime: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(systemInfo, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'system_logs_export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showToast('System logs exported successfully!', 'success');
    } catch (error) {
      showToast('Error exporting system logs', 'danger');
    }
  };

  window.deleteLoginRecord = (id) => {
    if (confirm('Are you sure you want to delete this login record?')) {
      const localLoginHistory = JSON.parse(localStorage.getItem('loginRecords')) || [];
      const filteredHistory = localLoginHistory.filter(record => record.id !== id);
      localStorage.setItem('loginRecords', JSON.stringify(filteredHistory));
      
      showToast('Login record deleted successfully!', 'success');
      renderLoginHistory(); // Refresh the display
    }
  };

  // --- Modern Scroll Indicators ---
  const setupModernScrollIndicators = () => {
    const scrollableElements = [
      el.miniSidebar,
      el.subSidebar,
      el.dataDisplay
    ];

    scrollableElements.forEach(element => {
      if (!element) return;
      
      let scrollTimeout;
      
      element.addEventListener('scroll', () => {
        // Add scrolling class for visual feedback
        element.classList.add('scrolling');
        
        // Clear existing timeout
        clearTimeout(scrollTimeout);
        
        // Remove scrolling class after scroll ends
        scrollTimeout = setTimeout(() => {
          element.classList.remove('scrolling');
        }, 150);
      });

      // Add smooth scroll behavior
      element.style.scrollBehavior = 'smooth';
    });
  };

  // --- Modern Chat 2025 Functions ---
  function setupModernChat() {
    // Theme toggle for modern chat
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleModernChatTheme);
    }

    // Message input auto-resize
    const messageInput = document.getElementById('modernMessageInput');
    if (messageInput) {
      messageInput.addEventListener('input', autoResizeTextarea);
      messageInput.addEventListener('keydown', handleMessageKeydown);
    }

    // Send button
    const sendBtn = document.getElementById('modernSendBtn');
    if (sendBtn) {
      sendBtn.addEventListener('click', sendModernMessage);
    }

    // Search functionality
    const searchInput = document.getElementById('chatSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', filterModernChats);
    }

    // Emoji and attachment buttons (placeholder functionality)
    const emojiBtn = document.getElementById('emojiBtn');
    const attachmentBtn = document.getElementById('attachmentBtn');
    
    if (emojiBtn) {
      emojiBtn.addEventListener('click', () => {
        showToast('Emoji picker coming soon!', 'info');
      });
    }
    
    if (attachmentBtn) {
      attachmentBtn.addEventListener('click', () => {
        showToast('File attachment coming soon!', 'info');
      });
    }
  }

  function toggleModernChatTheme() {
    const chatContainer = document.querySelector('.private-chat-container .chat-container');
    if (chatContainer) {
      const isDark = chatContainer.getAttribute('data-theme') === 'dark';
      chatContainer.setAttribute('data-theme', isDark ? 'light' : 'dark');
      
      // Update theme toggle icon
      const themeToggleBtn = document.getElementById('themeToggleBtn');
      if (themeToggleBtn) {
        themeToggleBtn.innerHTML = isDark ? 
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' :
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      }
    }
  }

  function autoResizeTextarea() {
    const textarea = this;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  function handleMessageKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendModernMessage();
    }
  }

  async function sendModernMessage() {
    const messageInput = document.getElementById('modernMessageInput');
    const message = messageInput.value.trim();
    
    if (!message || !currentChatPartner) return;
    
    try {
      // Send message using existing function
      await sendPrivateChatMessage(currentChatPartner);
      
      // Clear input and reset height
      messageInput.value = '';
      messageInput.style.height = 'auto';
      
      // Reload messages to show the new message
      await loadModernChatMessages(currentChatPartner);
      
    } catch (error) {
      console.error('Error sending modern message:', error);
      showToast('Failed to send message', 'error');
    }
  }

  async function loadModernChatMessages(otherUser) {
    try {
        const response = await fetch(`/api/chat/history?user1Email=${loggedInUser.email}&user2Email=${otherUser.email}`);
        const data = await response.json();
        console.log('Server response:', data); // Debug log
        const messages = data.messages || [];
        renderModernMessages(messages, otherUser);
    } catch (error) {
        console.error('Error loading modern chat messages:', error);
    }
}

  function renderModernMessages(messages, otherUser) {
    const messagesContainer = document.getElementById('modernMessagesContainer');
    if (!messagesContainer) return;

    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <h3>Start a conversation</h3>
                <p>Send a message to begin chatting with ${otherUser.username || otherUser.email}</p>
            </div>
        `;
        return;
    }

    const groupedMessages = groupMessagesByDate(messages);
    let html = '';

    Object.keys(groupedMessages).forEach(date => {
        html += `<div class="date-separator"><span>${formatDate(date)}</span></div>`;

        groupedMessages[date].forEach(message => {
            const isSent = message.email === loggedInUser.email;
            const messageTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Use message.text instead of message.message, with fallback to empty string
            const messageText = message.text || '';

            html += `
                <div class="message ${isSent ? 'sent' : 'received'}">
                    <div class="message-bubble">
                        <div class="message-text">${escapeHtml(messageText)}</div>
                        <div class="message-time">${messageTime}</div>
                    </div>
                </div>
            `;
        });
    });

    messagesContainer.innerHTML = html;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

  function renderModernChatsList(users) {
    const chatsList = document.getElementById('modernChatsList');
    if (!chatsList) {
      console.error('modernChatsList element not found');
      return;
    }
    
    const otherUsers = users.filter(user => user.email !== loggedInUser.email);
    
    if (otherUsers.length === 0) {
      chatsList.innerHTML = '<div style="text-align: center; padding: 20px; color: var(--text-muted);">No users available</div>';
      return;
    }
    
    let html = '';
    otherUsers.forEach(user => {
      const unreadCount = getUnreadCount(user.email);
      const avatarColor = getUserAvatarColor(user.username || user.email);
      const initials = (user.username || user.email).substring(0, 2).toUpperCase();
      
      html += `
        <div class="chat-item" data-user-email="${user.email}" onclick="openModernChat('${user.email}')" style="cursor: pointer;">
          <div class="chat-avatar" style="background: ${avatarColor}">
            ${initials}
            <div class="status-indicator status-online"></div>
          </div>
          <div class="chat-info">
            <div class="chat-header-row">
              <div class="chat-name">${user.username || user.email}</div>
              <div class="chat-time">${getTimeAgo(new Date())}</div>
            </div>
            <div class="chat-preview">Click to start chatting</div>
          </div>
          ${unreadCount > 0 ? `<div class="unread-badge">${unreadCount}</div>` : ''}
        </div>
      `;
    });
    
    chatsList.innerHTML = html;
    console.log('Modern chats list rendered with', otherUsers.length, 'users');
  }

  async function openModernChat(userEmail) {
    console.log('openModernChat called with:', userEmail);
    try {
      // Find user object
      const response = await fetch('/api/users');
      const data = await response.json();
      const users = data.users || [];
      const otherUser = users.find(user => user.email === userEmail);
      
      if (!otherUser) {
        console.error('User not found:', userEmail);
        showToast('User not found', 'error');
        return;
      }
      
      console.log('Found user:', otherUser);
      
      // Set current chat partner
      currentChatPartner = otherUser;
      
      // Update chat header
      const contactName = document.getElementById('modernContactName');
      const contactStatus = document.getElementById('modernContactStatus');
      const contactAvatar = document.querySelector('.private-chat-container .contact-avatar');
      
      if (contactName) {
        contactName.textContent = otherUser.username || otherUser.email;
        console.log('Updated contact name:', contactName.textContent);
      }
      if (contactStatus) {
        contactStatus.innerHTML = '<span class="status-dot"></span><span>Online</span>';
      }
      
      if (contactAvatar) {
        const avatarColor = getUserAvatarColor(otherUser.username || otherUser.email);
        const initials = (otherUser.username || otherUser.email).substring(0, 2).toUpperCase();
        contactAvatar.style.background = avatarColor;
        contactAvatar.innerHTML = initials;
      }
      
      // Update contact details
      updateModernContactDetails(otherUser);
      
      // Load messages
      await loadModernChatMessages(otherUser);
      
      // Mark as read
      markChatAsRead(otherUser.email);
      
      // Update active state in chat list
      document.querySelectorAll('.private-chat-container .chat-item').forEach(item => {
        item.classList.remove('active');
      });
      document.querySelector(`[data-user-email="${userEmail}"]`)?.classList.add('active');
      
      console.log('Modern chat opened successfully for:', userEmail);
      
    } catch (error) {
      console.error('Error opening modern chat:', error);
      showToast('Failed to open chat', 'error');
    }
  }

  function updateModernContactDetails(user) {
    const contactDetails = document.getElementById('modernContactDetails');
    if (!contactDetails) return;
    
    contactDetails.innerHTML = `
      <div class="detail-item">
        <div class="detail-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        <span class="detail-text">${user.email}</span>
      </div>
      <div class="detail-item">
        <div class="detail-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <span class="detail-text">${user.username || 'No username'}</span>
      </div>
      <div class="detail-item">
        <div class="detail-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="10,8 16,12 10,16 10,8"></polygon>
          </svg>
        </div>
        <span class="detail-text">Online</span>
      </div>
    `;
  }

  function filterModernChats() {
    const searchTerm = this.value.toLowerCase();
    const chatItems = document.querySelectorAll('.private-chat-container .chat-item');
    
    chatItems.forEach(item => {
      const userName = item.querySelector('.chat-name').textContent.toLowerCase();
      if (userName.includes(searchTerm)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Override the existing openPrivateChat function to use modern interface
  const originalOpenPrivateChat = openPrivateChat;
  openPrivateChat = async function(otherUser) {
    // Show modern chat container
    const privateChatContainer = document.getElementById('privateChatContainer');
    const generalChatContainer = document.getElementById('generalChatContainer');
    const activitySection = document.getElementById('activitySection');
    
    if (privateChatContainer) privateChatContainer.style.display = 'block';
    if (generalChatContainer) generalChatContainer.style.display = 'none';
    if (activitySection) activitySection.style.display = 'none';
    
    // Load users for chat list
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      const users = data.users || [];
      renderModernChatsList(users);
    } catch (error) {
      console.error('Error loading users for modern chat:', error);
    }
    
    // Open chat with the selected user
    await openModernChat(otherUser.email);
  };

  // Make openModernChat globally available
  window.openModernChat = openModernChat;
  
  // Test function to verify global availability
  window.testStartModernChat = function() {
    console.log('testStartModernChat called');
    console.log('startModernChat available:', typeof window.startModernChat);
    console.log('openModernChat available:', typeof window.openModernChat);
  };
  
  // Function to start modern chat from user list
  window.startModernChat = async function(userEmail) {
    console.log('startModernChat called with:', userEmail);
    
    try {
      // First, clear the main content area to show the chat container
      el.dataDisplay.innerHTML = '';
      
      // Now get the containers
      const privateChatContainer = document.getElementById('privateChatContainer');
      const generalChatContainer = document.getElementById('generalChatContainer');
      const activitySection = document.getElementById('activitySection');
      
      console.log('Containers found:', {
        privateChatContainer: !!privateChatContainer,
        generalChatContainer: !!generalChatContainer,
        activitySection: !!activitySection
      });
      
      if (privateChatContainer) {
        privateChatContainer.style.display = 'block';
        console.log('Modern chat container displayed');
      } else {
        console.error('privateChatContainer not found!');
        // Try to recreate the container
        console.log('Attempting to recreate privateChatContainer...');
        el.dataDisplay.innerHTML = `
          <div id="privateChatContainer" class="private-chat-container">
            <!-- Modern Chat Interface 2025 -->
            <div class="chat-container">
              <!-- Left Sidebar -->
              <div class="sidebar">
                <div class="sidebar-header">
                  <div class="app-logo">
                    <div class="logo-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <span class="app-name">ChatFlow 2025</span>
                  </div>
                  <div class="search-container">
                    <input type="text" class="search-input" placeholder="Search chats..." id="chatSearchInput">
                    <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                  </div>
                </div>
                <div class="chats-list" id="modernChatsList">
                  <!-- Chat items will be populated here -->
                </div>
              </div>

              <!-- Main Chat Window -->
              <div class="chat-main">
                <div class="chat-header" id="modernChatHeader">
                  <div class="contact-avatar">
                    <div class="avatar-placeholder">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  </div>
                  <div class="contact-info">
                    <div class="contact-name" id="modernContactName">Select a chat</div>
                    <div class="contact-status" id="modernContactStatus">
                      <span class="status-dot"></span>
                      <span>Choose a user to start chatting</span>
                    </div>
                  </div>
                  <div class="header-actions">
                    <button class="action-btn" id="themeToggleBtn">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div class="messages-container" id="modernMessagesContainer">
                  <div class="welcome-message">
                    <div class="welcome-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <h3>Welcome to ChatFlow 2025</h3>
                    <p>Select a user from the sidebar to start chatting</p>
                  </div>
                </div>
                
                <div class="input-area">
                  <div class="input-container">
                    <textarea class="message-input" id="modernMessageInput" placeholder="Type a message..." rows="1"></textarea>
                    <div class="input-actions">
                      <button class="input-btn" id="emojiBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                          <line x1="9" y1="9" x2="9.01" y2="9"></line>
                          <line x1="15" y1="9" x2="15.01" y2="9"></line>
                        </svg>
                      </button>
                      <button class="input-btn" id="attachmentBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                      </button>
                      <button class="send-btn" id="modernSendBtn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22,2 15,22 11,13 2,9"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Sidebar -->
              
        `;
        
        // Now try to get the container again
        const newPrivateChatContainer = document.getElementById('privateChatContainer');
        if (newPrivateChatContainer) {
          console.log('Successfully recreated privateChatContainer');
        } else {
          console.error('Failed to recreate privateChatContainer');
          return;
        }
      }
      
      if (generalChatContainer) generalChatContainer.style.display = 'none';
      if (activitySection) activitySection.style.display = 'none';
      
      // Load users for chat list
      const response = await fetch('/api/users');
      const data = await response.json();
      const users = data.users || [];
      console.log('Users loaded:', users.length);
      
      renderModernChatsList(users);
      console.log('Modern chats list rendered');
      
      // Setup modern chat functionality
      setupModernChat();
      
      // Open chat with the selected user
      await openModernChat(userEmail);
      console.log('Chat opened successfully');
      
    } catch (error) {
      console.error('Error in startModernChat:', error);
      showToast('Failed to open chat: ' + error.message, 'error');
    }
  };

  // --- INIT ---
  const init = () => {
    el.userName.textContent = loggedInUser.username;
    renderIcons();
    setupEventListeners();
    setupModernScrollIndicators();
    setupModernChat(); // Initialize modern chat functionality
    if (el.miniSidebar.firstChild) el.miniSidebar.firstChild.click();

    // Start message polling for unread counts
    startMessagePolling();

    // Theme on load
    if (el.themeToggle) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(savedTheme);
        el.themeToggle.innerHTML = savedTheme === 'dark-theme' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
      } else {
        document.body.classList.add('light-theme');
        el.themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      }
    }

    if (sessionStorage.getItem('login_success')) {
      showToast(`Welcome back, ${loggedInUser.username}!`);
      sessionStorage.removeItem('login_success');
    }
  };

  init();
});