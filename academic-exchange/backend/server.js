require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const os = require('os');

// Routes
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// 1. Serve Uploaded Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. ✅ SERVE FRONTEND AUTOMATICALLY
// This points to the 'frontend' folder one level up
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// Database Init
async function initDB() {
    try {
        const db = await connectDB();
        await db.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT UNIQUE, password_hash TEXT, role TEXT DEFAULT 'user')`);
        await db.exec(`CREATE TABLE IF NOT EXISTS listings (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, title TEXT, price REAL, description TEXT, image_url TEXT, FOREIGN KEY(user_id) REFERENCES users(id))`);
        await db.exec(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT, sender_id INTEGER, sender_name TEXT, content TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        console.log("✅ Database Tables Verified!");
    } catch (error) { console.error("❌ DB Init Failed:", error); }
}
initDB();

// Chat System
io.on('connection', (socket) => {
    socket.on('join_room', async ({ room }) => { socket.join(room); const db = await connectDB(); const history = await db.all("SELECT * FROM messages WHERE room = ? ORDER BY id ASC", [room]); socket.emit('load_history', history); });
    socket.on('get_inbox', async (userId) => {
        if (!userId) return socket.emit('inbox_data', []);
        try {
            const db = await connectDB();
            const allRooms = await db.all("SELECT DISTINCT room FROM messages");
            const myChats = [];
            const targetId = parseInt(userId);
            for (const r of allRooms) {
                const parts = r.room.split('_');
                if (parts.length < 3) continue;
                const u1 = parseInt(parts[1]); const u2 = parseInt(parts[2]);
                if (isNaN(u1) || isNaN(u2)) continue;
                if (u1 === targetId || u2 === targetId) {
                    const otherId = (u1 === targetId) ? u2 : u1;
                    const otherUser = await db.get("SELECT username FROM users WHERE id = ?", [otherId]);
                    const lastMsg = await db.get("SELECT content, timestamp FROM messages WHERE room = ? ORDER BY id DESC LIMIT 1", [r.room]);
                    if (otherUser) { myChats.push({ otherId: otherId, name: otherUser.username, lastMsg: lastMsg ? lastMsg.content : "Start chatting...", time: lastMsg ? lastMsg.timestamp : "" }); }
                }
            }
            socket.emit('inbox_data', myChats);
        } catch (err) { console.error(err); socket.emit('inbox_data', []); }
    });
    socket.on('send_message', async (data) => { const { room, sender_id, sender_name, content } = data; const db = await connectDB(); await db.run("INSERT INTO messages (room, sender_id, sender_name, content) VALUES (?, ?, ?, ?)", [room, sender_id, sender_name, content]); io.to(room).emit('receive_message', data); });
});

// Dynamic IP Helper
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) return iface.address;
        }
    }
    return 'localhost';
}

const PORT = process.env.PORT || 5000;
const localIP = getLocalIP();

server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server is RUNNING!`);
    console.log(`❌ DO NOT open index.html directly.`);
    console.log(`✅ On Laptop, open:   http://localhost:${PORT}`);
    console.log(`✅ On Mobile, open:   http://${localIP}:${PORT}\n`);
});
