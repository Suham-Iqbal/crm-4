// Dashboard API - Connects to existing CRM system
const express = require('express');
const router = express.Router();

// Mock data structure that would come from your existing CRM
let mockCRMData = {
    users: [
        { id: 1, username: 'john_doe', email: 'john@example.com', status: 'active', lastLogin: new Date(), userType: 'regular' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', status: 'active', lastLogin: new Date(), userType: 'admin' },
        { id: 3, username: 'bob_wilson', email: 'bob@example.com', status: 'inactive', lastLogin: new Date(Date.now() - 86400000), userType: 'regular' },
        { id: 4, username: 'alice_brown', email: 'alice@example.com', status: 'active', lastLogin: new Date(), userType: 'regular' },
        { id: 5, username: 'charlie_davis', email: 'charlie@example.com', status: 'active', lastLogin: new Date(), userType: 'regular' }
    ],
    chats: [
        { id: 1, type: 'general', participants: ['john_doe', 'jane_smith'], lastMessage: new Date(), messageCount: 15 },
        { id: 2, type: 'private', participants: ['john_doe', 'bob_wilson'], lastMessage: new Date(), messageCount: 8 },
        { id: 3, type: 'general', participants: ['alice_brown', 'charlie_davis'], lastMessage: new Date(), messageCount: 23 }
    ],
    activities: [
        { id: 1, type: 'login', user: 'john_doe', timestamp: new Date(), details: 'User logged in' },
        { id: 2, type: 'chat_message', user: 'jane_smith', timestamp: new Date(), details: 'Sent message in general chat' },
        { id: 3, type: 'signup', user: 'new_user', timestamp: new Date(), details: 'New user registered' },
        { id: 4, type: 'private_chat', user: 'john_doe', timestamp: new Date(), details: 'Started private chat with bob_wilson' }
    ],
    deals: [
        { id: 1, title: 'Enterprise Deal', value: 50000, status: 'active', assignedTo: 'john_doe', probability: 75 },
        { id: 2, title: 'SMB Contract', value: 15000, status: 'closed', assignedTo: 'jane_smith', probability: 100 },
        { id: 3, title: 'Startup Partnership', value: 25000, status: 'pending', assignedTo: 'alice_brown', probability: 60 }
    ],
    tasks: [
        { id: 1, title: 'Follow up with client', assignedTo: 'john_doe', status: 'pending', dueDate: new Date(Date.now() + 86400000) },
        { id: 2, title: 'Prepare proposal', assignedTo: 'jane_smith', status: 'in_progress', dueDate: new Date(Date.now() + 172800000) },
        { id: 3, title: 'Review contracts', assignedTo: 'alice_brown', status: 'completed', dueDate: new Date() }
    ],
    campaigns: [
        { id: 1, name: 'Q1 Email Campaign', status: 'active', participants: 150, conversionRate: 12.5 },
        { id: 2, name: 'Social Media Push', status: 'completed', participants: 300, conversionRate: 8.3 },
        { id: 3, name: 'Webinar Series', status: 'planned', participants: 0, conversionRate: 0 }
    ]
};

// Dashboard Statistics API
router.get('/api/dashboard-stats', (req, res) => {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 86400000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 86400000);

        // Calculate real-time statistics
        const totalUsers = mockCRMData.users.length;
        const activeUsers = mockCRMData.users.filter(user => 
            user.status === 'active' && 
            user.lastLogin > oneDayAgo
        ).length;
        
        const totalChats = mockCRMData.chats.filter(chat => 
            chat.lastMessage > oneDayAgo
        ).length;
        
        const newSignups = mockCRMData.activities.filter(activity => 
            activity.type === 'signup' && 
            activity.timestamp > oneDayAgo
        ).length;

        // Chat analytics
        const generalChats = mockCRMData.chats.filter(chat => chat.type === 'general').length;
        const privateChats = mockCRMData.chats.filter(chat => chat.type === 'private').length;
        const totalChatMessages = mockCRMData.chats.reduce((sum, chat) => sum + chat.messageCount, 0);

        // Performance metrics
        const systemLoad = Math.floor(Math.random() * 30) + 50; // 50-80%
        const memoryUsage = Math.floor(Math.random() * 40) + 30; // 30-70%
        const networkUsage = Math.floor(Math.random() * 50) + 40; // 40-90%

        // AI Insights
        const insights = generateAIInsights(mockCRMData);

        const stats = {
            totalUsers,
            activeUsers,
            totalChats,
            newSignups,
            chatAnalytics: {
                general: generalChats,
                private: privateChats,
                totalMessages: totalChatMessages
            },
            performance: {
                systemLoad,
                memoryUsage,
                networkUsage
            },
            insights,
            recentActivities: mockCRMData.activities
                .slice(-5)
                .map(activity => ({
                    ...activity,
                    timestamp: activity.timestamp.toISOString()
                })),
            deals: mockCRMData.deals,
            tasks: mockCRMData.tasks,
            campaigns: mockCRMData.campaigns
        };

        res.json({
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard statistics',
            message: error.message
        });
    }
});

// User Activity Chart Data
router.get('/api/user-activity-chart', (req, res) => {
    try {
        // Generate 24-hour activity data
        const hours = [];
        const activityData = [];
        
        for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0') + ':00';
            hours.push(hour);
            
            // Simulate realistic activity patterns
            let activity = 0;
            if (i >= 9 && i <= 17) {
                // Business hours - higher activity
                activity = Math.floor(Math.random() * 40) + 30;
            } else if (i >= 18 && i <= 22) {
                // Evening - moderate activity
                activity = Math.floor(Math.random() * 20) + 10;
            } else {
                // Night - low activity
                activity = Math.floor(Math.random() * 10) + 2;
            }
            activityData.push(activity);
        }

        res.json({
            success: true,
            data: {
                labels: hours,
                datasets: [{
                    label: 'Active Users',
                    data: activityData,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch activity chart data',
            message: error.message
        });
    }
});

// AI Chat API
router.post('/api/ai-chat', (req, res) => {
    try {
        const { message, context } = req.body;
        
        // Simple AI response logic based on keywords
        let response = generateAIResponse(message, context);
        
        res.json({
            success: true,
            data: {
                response,
                timestamp: new Date().toISOString(),
                confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to process AI chat request',
            message: error.message
        });
    }
});

// Real-time Updates WebSocket endpoint
router.get('/api/realtime-updates', (req, res) => {
    // This would be implemented with Socket.IO for real-time updates
    res.json({
        success: true,
        message: 'Real-time updates endpoint - implement with Socket.IO'
    });
});

// Helper Functions

function generateAIInsights(data) {
    const insights = [];
    
    // Analyze user activity patterns
    const activeUsers = data.users.filter(user => user.status === 'active').length;
    const totalUsers = data.users.length;
    const activityRate = (activeUsers / totalUsers) * 100;
    
    if (activityRate > 80) {
        insights.push({
            type: 'success',
            icon: 'trending-up',
            title: 'High User Engagement',
            description: `User engagement is excellent with ${activityRate.toFixed(1)}% of users active.`,
            confidence: 95
        });
    }
    
    // Analyze chat patterns
    const generalChats = data.chats.filter(chat => chat.type === 'general').length;
    const privateChats = data.chats.filter(chat => chat.type === 'private').length;
    
    if (generalChats > privateChats) {
        insights.push({
            type: 'info',
            icon: 'users',
            title: 'Community-Focused Activity',
            description: 'Users prefer general chat over private conversations, indicating strong community engagement.',
            confidence: 88
        });
    }
    
    // Analyze recent signups
    const recentSignups = data.activities.filter(activity => 
        activity.type === 'signup' && 
        activity.timestamp > new Date(Date.now() - 7 * 86400000)
    ).length;
    
    if (recentSignups > 5) {
        insights.push({
            type: 'warning',
            icon: 'user-plus',
            title: 'Growth Opportunity',
            description: `${recentSignups} new users joined this week. Consider implementing onboarding strategies.`,
            confidence: 92
        });
    }
    
    return insights;
}

function generateAIResponse(message, context) {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based responses
    if (lowerMessage.includes('user') || lowerMessage.includes('users')) {
        return `Currently, there are ${mockCRMData.users.length} total users in the system, with ${mockCRMData.users.filter(u => u.status === 'active').length} active users.`;
    }
    
    if (lowerMessage.includes('chat') || lowerMessage.includes('message')) {
        return `There are ${mockCRMData.chats.length} active chat sessions, with ${mockCRMData.chats.reduce((sum, chat) => sum + chat.messageCount, 0)} total messages exchanged.`;
    }
    
    if (lowerMessage.includes('activity') || lowerMessage.includes('recent')) {
        return `In the last 24 hours, there have been ${mockCRMData.activities.filter(a => a.timestamp > new Date(Date.now() - 86400000)).length} user activities.`;
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('system')) {
        return `System performance is optimal. Current load is moderate, and all services are running smoothly.`;
    }
    
    if (lowerMessage.includes('trend') || lowerMessage.includes('growth')) {
        return `User growth is trending positively with a 23% increase in new registrations this week compared to last week.`;
    }
    
    // Default response
    return `I understand you're asking about "${message}". Let me analyze the current data and provide you with relevant insights. Based on the available information, the system is performing well with healthy user engagement.`;
}

// Export the router
module.exports = router;
