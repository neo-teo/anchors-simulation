import { Connection } from './Connection.js';

export class ConnectionManager {
    connections = [];
    connectionMap = new Map(); // spirit -> Set of connections
    hallOfFame = []; // Top 5 longest friendships
    matchDistance = 50;
    stickChance = 0.5;
    disconnectCheckInterval = 5000;
    disconnectChance = 0.2;

    update(spirits, currentTime) {
        this.formNewConnections(spirits, currentTime);
        this.checkDisconnections(currentTime);
    }

    formNewConnections(spirits, currentTime) {
        // Use Set for O(1) lookup
        const connectedPairs = new Set();
        for (const conn of this.connections) {
            connectedPairs.add(`${conn.a.id}-${conn.b.id}`);
        }

        for (let i = 0; i < spirits.length; i++) {
            for (let j = i + 1; j < spirits.length; j++) {
                const a = spirits[i];
                const b = spirits[j];

                // Quick check if already connected
                const pairKey = `${a.id}-${b.id}`;
                if (connectedPairs.has(pairKey)) continue;

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distSq = dx * dx + dy * dy;

                // Use squared distance to avoid sqrt
                if (distSq < this.matchDistance * this.matchDistance) {
                    if (Math.random() < this.stickChance) {
                        const conn = new Connection(a, b, currentTime);
                        this.connections.push(conn);
                        this.addToMap(a, conn);
                        this.addToMap(b, conn);
                    }
                }
            }
        }
    }

    checkDisconnections(currentTime) {
        this.connections = this.connections.filter(conn => {
            if (conn.getDuration(currentTime) > this.disconnectCheckInterval) {
                if (Math.random() < this.disconnectChance) {
                    // Before removing, check if it should go in hall of fame
                    this.addToHallOfFame(conn, currentTime);
                    this.removeFromMap(conn.a, conn);
                    this.removeFromMap(conn.b, conn);
                    return false;
                }
            }
            return true;
        });
    }

    addToHallOfFame(connection, currentTime) {
        const duration = connection.getDuration(currentTime);
        const entry = {
            nameA: connection.a.id,
            nameB: connection.b.id,
            duration: duration
        };

        // Add to hall of fame and keep top 5
        this.hallOfFame.push(entry);
        this.hallOfFame.sort((a, b) => b.duration - a.duration);
        this.hallOfFame = this.hallOfFame.slice(0, 5);
    }

    getHallOfFame() {
        return this.hallOfFame;
    }

    addToMap(spirit, connection) {
        if (!this.connectionMap.has(spirit)) {
            this.connectionMap.set(spirit, new Set());
        }
        this.connectionMap.get(spirit).add(connection);
    }

    removeFromMap(spirit, connection) {
        const conns = this.connectionMap.get(spirit);
        if (conns) {
            conns.delete(connection);
        }
    }

    getConnectionsFor(spirit) {
        const conns = this.connectionMap.get(spirit);
        return conns ? Array.from(conns) : [];
    }

    getAll() {
        return this.connections;
    }
}
