const fs = require('fs');
const path = require('path');

// Mock Event Database
let events = [
    { id: 1, title: 'Tech Summit 2025', date: '2025-03-15', location: 'San Francisco', attendees: 120, price: 299, image: 'https://pixabay.com/photos/event-party-events-night-party-3005668/', description: 'The biggest tech conference of the year.' },
    { id: 2, title: 'Music Festival', date: '2025-07-20', location: 'Austin', attendees: 5000, price: 150, image: 'https://www.vecteezy.com/free-photos/live-event-background', description: 'A weekend of live music and fun.' },
    { id: 3, title: 'Art Gallery Opening', date: '2025-05-10', location: 'New York', attendees: 80, price: 50, image: 'https://www.vecteezy.com/free-photos/youth-audience?page=4', description: 'Abstract art showcase.' }
];

// Get all events
exports.getEvents = (req, res) => {
    // Return events with full image URLs if they are local uploads
    const eventsWithImages = events.map(event => {
        if (event.image && !event.image.startsWith('http') && !event.image.startsWith('data:')) {
            // It's a local file, ensure it has the correct path
            // Assuming image stored as 'filename.jpg', we append /uploads/
            return { ...event, image: `http://localhost:5000/uploads/${event.image}` };
        }
        return event;
    });
    res.json(eventsWithImages);
};

// Get single event
exports.getEventById = (req, res) => {
    const event = events.find(e => e.id === parseInt(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Format image if local
    if (event.image && !event.image.startsWith('http') && !event.image.startsWith('data:')) {
        event.image = `http://localhost:5000/uploads/${event.image}`;
    }
    res.json(event);
};

// Create new event
exports.createEvent = (req, res) => {
    console.log("createEvent called. Body:", req.body);
    console.log("createEvent File:", req.file);
    try {
        const { title, date, location, price, description, ...otherData } = req.body;

        // Handle Image Upload
        let image = null;
        if (req.file) {
            image = req.file.filename; // Store just filename
        } else if (req.body.image) {
            image = req.body.image; // Fallback to URL if passed manually (deprecated but safe)
        } else {
            // Default placeholder if no image provided
            image = 'https://www.hpe.com/us/en/events.html';
        }

        const newEvent = {
            id: Date.now(),
            title,
            date,
            location,
            price: Number(price),
            description,
            image,
            attendees: 0,
            ...otherData
        };

        events.push(newEvent);

        // Return with full URL for immediate display
        const responseEvent = { ...newEvent };
        if (req.file) {
            responseEvent.image = `http://localhost:5000/uploads/${req.file.filename}`;
        }

        res.status(201).json(responseEvent);
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: "Server error creating event" });
    }
};

// Delete event
exports.deleteEvent = (req, res) => {
    events = events.filter(e => e.id !== parseInt(req.params.id));
    res.json({ message: "Deleted" });
};
