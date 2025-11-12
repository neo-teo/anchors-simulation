import { Spirit } from './Spirit.js';
import { Link } from './Link.js';
import { ConnectionManager } from './ConnectionManager.js';
import { generateName } from './utils/name.js';

export class Web {
    spirits = [];
    seed = [];

    connectionManager = new ConnectionManager();
    lastSpawnTime = 0;
    spawnInterval = 5000; // 5 seconds
    maxSpirits = 20;
    shouldRemoveNext = false;

    constructor(p, centerX, centerY) {
        this.p = p;
        this.centerX = centerX;
        this.centerY = centerY;
        this.seed = this.createSeedSpirits(12, 250, centerX, centerY);
        this.spirits.push(...this.seed);
        this.lastSpawnTime = 0;
    }

    createSeedSpirits(count, radius, centerX, centerY) {
        const spirits = [];
        const angleStep = (Math.PI * 2) / count;

        for (let i = 0; i < count; i++) {
            const angle = angleStep * i;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // const letter = String.fromCharCode(97 + i); // 97 is 'a' in ASCII
            // spirits.push(new Spirit(letter, x, y, 0));

            spirits.push(new Spirit(generateName(), x, y, 0));
        }

        return spirits;
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
