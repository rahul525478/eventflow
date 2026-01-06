const eventController = require('./eventController'); // To access events if needed, or we just mock

// Mock Data Stores

// MOCK ATTENDEES (Linked to Events)
const attendees = [
    { id: 101, name: "Isabella Chen", email: "isabella@tech.com", event: "Tech Summit 2025", ticketType: "VIP", status: "Confirmed" },
    { id: 102, name: "Liam Johnson", email: "liam.j@music.net", event: "Music Festival", ticketType: "General", status: "Confirmed" },
    { id: 103, name: "Sophia Williams", email: "sophia.w@art.org", event: "Art Gallery Opening", ticketType: "Early Bird", status: "Checked In" },
    { id: 104, name: "Noah Brown", email: "noah.b@startup.io", event: "Tech Summit 2025", ticketType: "General", status: "Pending" },
    { id: 105, name: "Emma Jones", email: "emma.j@design.co", event: "Art Gallery Opening", ticketType: "VIP", status: "Confirmed" },
    { id: 106, name: "Oliver Garcia", email: "oliver.g@music.net", event: "Music Festival", ticketType: "General", status: "Cancelled" },
    { id: 107, name: "Ava Miller", email: "ava.m@tech.com", event: "Tech Summit 2025", ticketType: "Speaker", status: "Confirmed" },
    { id: 108, name: "William Davis", email: "will.d@finance.com", event: "Tech Summit 2025", ticketType: "VIP", status: "Confirmed" }
];

// MOCK FINANCIAL DATA
const financialData = {
    revenue: [
        { month: "Jan", amount: 12000, expenses: 5000, profit: 7000 },
        { month: "Feb", amount: 15000, expenses: 6000, profit: 9000 },
        { month: "Mar", amount: 18000, expenses: 7000, profit: 11000 },
        { month: "Apr", amount: 14000, expenses: 5500, profit: 8500 },
        { month: "May", amount: 22000, expenses: 8000, profit: 14000 },
        { month: "Jun", amount: 25000, expenses: 9000, profit: 16000 }
    ],
    growth: [
        { period: "Q1", rate: "12.5%", details: "Driven by Tech Summit sales" },
        { period: "Q2", rate: "15.3%", details: "Music Festival early bird surge" },
        { period: "Q3", rate: "8.1%", details: "Projected stable growth" }
    ]
};

// MOCK ACTIVITY LOG
const activityLog = [
    { id: 1, action: "New Registration", details: "Isabella registered for Tech Summit", time: "2 mins ago", type: "success" },
    { id: 2, action: "New Registration", details: "Liam registered for Music Festival", time: "15 mins ago", type: "success" },
    { id: 3, action: "Payment Received", details: "$299 from Isabella", time: "2 mins ago", type: "info" },
    { id: 4, action: "Event Created", details: "Art Gallery Opening by Admin", time: "1 hour ago", type: "info" },
    { id: 5, action: "Ticket Cancelled", details: "Oliver cancelled Music Festival", time: "3 hours ago", type: "warning" },
    { id: 6, action: "New Comment", details: "Noah asked about parking at Tech Summit", time: "5 hours ago", type: "neutral" },
    { id: 7, action: "System Update", details: "Dashboard metrics refreshed", time: "1 day ago", type: "system" }
];

exports.getReportData = (req, res) => {
    const { type } = req.params;

    try {
        switch (type) {
            case 'events':
                // We'll fetch from eventController's mock DB via a simple import or just mock again if cleaner
                // For now, let's just make a rigorous call to the endpoint or mock it here for speed
                // Ideally we'd share the source of truth.
                // Let's rely on a fresh mock for the report to ensure format consistency
                const reportEvents = [
                    { title: 'Tech Summit 2025', date: '2025-03-15', location: 'San Francisco', attendees: 120, revenue: '$35,880' },
                    { title: 'Music Festival', date: '2025-07-20', location: 'Austin', attendees: 5000, revenue: '$750,000' },
                    { title: 'Art Gallery Opening', date: '2025-05-10', location: 'New York', attendees: 80, revenue: '$4,000' }
                ];
                return res.json({ title: "Total Events Report", columns: ["Event", "Date", "Location", "Attendees", "Revenue"], data: reportEvents.map(e => [e.title, e.date, e.location, e.attendees, e.revenue]) });

            case 'attendees':
                return res.json({
                    title: "Attendee Detailed Report",
                    columns: ["Name", "Email", "Event", "Ticket Type", "Status"],
                    data: attendees.map(a => [a.name, a.email, a.event, a.ticketType, a.status])
                });

            case 'revenue':
                return res.json({
                    title: "Financial Performance Report",
                    columns: ["Month", "Revenue", "Expenses", "Net Profit"],
                    data: financialData.revenue.map(f => [f.month, `$${f.amount}`, `$${f.expenses}`, `$${f.profit}`])
                });

            case 'growth':
                return res.json({
                    title: "Growth Analysis Report",
                    columns: ["Period", "Growth Rate", "Key Drivers"],
                    data: financialData.growth.map(g => [g.period, g.rate, g.details])
                });

            case 'activity':
                return res.json({
                    title: "Recent Activity Log",
                    columns: ["Action", "Details", "Time", "Type"],
                    data: activityLog.map(a => [a.action, a.details, a.time, a.type])
                });

            default:
                return res.status(400).json({ message: "Invalid report type" });
        }
    } catch (error) {
        console.error("Report Error:", error);
        res.status(500).json({ message: "Error generating report" });
    }
};
