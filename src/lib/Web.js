import { Spirit } from './Spirit.js';
import { Link } from './Link.js';
import { ConnectionManager } from './ConnectionManager.js';

function generateName() {
    const letters = "bcdfghjklmnpqrstvwxyz";
    const vowels = "aeiou";
    let name = "";
    let vowelNext = Math.random() < 0.5;
    const numLetters = Math.random() < 0.5 ? 3 : 4; // e.g. "mel", "tarn"
    for (let i = 0; i < numLetters; i++) {
        if (!vowelNext) name += letters[Math.floor(Math.random() * letters.length)];
        else name += vowels[Math.floor(Math.random() * vowels.length)];

        vowelNext = !vowelNext;
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
}

export class Web {
    spirits = [];
    seed = [
        new Spirit(0, 0, 0),
        new Spirit(0, 0, 0),
        new Spirit(0, 0, 0),
        new Spirit(0, 0, 0),
    ]
    connectionManager = new ConnectionManager();
    lastSpawnTime = 0;
    spawnInterval = 5000; // 5 seconds
    maxSpirits = 20;
    shouldRemoveNext = false;

    constructor(p, centerX, centerY) {
        this.p = p;
        this.centerX = centerX;
        this.centerY = centerY;
        this.spirits.push(new Spirit(generateName(), centerX, centerY, 0));
        this.lastSpawnTime = 0;
    }

    addSpirit(currentTime) {
        const x = this.p.random(50, this.p.width - 50);
        const y = this.p.random(50, this.p.height - 50);
        this.spirits.push(new Spirit(generateName(), x, y, currentTime));
    }

    removeSpirit() {
        if (this.spirits.length > 1) {
            // Remove a random spirit
            const index = Math.floor(Math.random() * this.spirits.length);
            this.spirits.splice(index, 1);
        }
    }

    update() {
        const currentTime = this.p.millis();

        // Add/remove spirits every 5 seconds
        // if (currentTime - this.lastSpawnTime > this.spawnInterval) {
        //     if (this.spirits.length < this.maxSpirits) {
        //         // Still growing, add a spirit
        //         this.addSpirit(currentTime);
        //     } else {
        //         // At max capacity, alternate between add and remove
        //         if (this.shouldRemoveNext) {
        //             this.removeSpirit();
        //         } else {
        //             this.addSpirit(currentTime);
        //         }
        //         this.shouldRemoveNext = !this.shouldRemoveNext;
        //     }
        //     this.lastSpawnTime = currentTime;
        // }

        // Update connections first to know which spirits are connected
        this.connectionManager.update(this.spirits, currentTime);

        // Update spirits with connection info
        for (const spirit of this.spirits) {
            const isConnected = this.connectionManager.getConnectionsFor(spirit).length > 0;
            spirit.update(currentTime, this.p.width, this.p.height, isConnected);
        }
    }

    draw() {
        // Draw links
        for (const conn of this.connectionManager.getAll()) {
            Link.draw(this.p, conn.a, conn.b);
        }

        // Draw spirits
        for (const spirit of this.spirits) {
            const connected = this.connectionManager.getConnectionsFor(spirit).length > 0;
            spirit.draw(this.p, connected);
        }
    }
}
