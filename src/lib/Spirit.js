export class Spirit {
    id;
    x;
    y;
    spawnedAt;

    direction;

    opacity = 0;
    speed = 0.3;
    fadeInDuration = 2000; // 2 seconds to fade in

    constructor(id, x, y, spawnedAt) {
        this.x = x;
        this.y = y;
        this.direction = Math.random() * Math.PI * 2; // Random initial direction
        this.spawnedAt = spawnedAt;

        this.id = id;// generateName();
        this.color = 'magenta';
    }

    update(currentTime, canvasWidth, canvasHeight, isConnected) {
        // Update fade-in opacity
        const timeSinceSpawn = currentTime - this.spawnedAt;
        if (timeSinceSpawn < this.fadeInDuration) {
            this.opacity = timeSinceSpawn / this.fadeInDuration;
        } else {
            this.opacity = 1;
        }

        // Slow down when connected
        const currentSpeed = isConnected ? this.speed * 0.2 : this.speed;

        // Detect walls and curve away
        const margin = 50;
        const turnStrength = 0.05;

        // Left wall
        if (this.x < margin) {
            const dist = margin - this.x;
            this.direction += turnStrength * (dist / margin);
        }
        // Right wall
        if (this.x > canvasWidth - margin) {
            const dist = this.x - (canvasWidth - margin);
            this.direction -= turnStrength * (dist / margin);
        }
        // Top wall
        if (this.y < margin) {
            const targetAngle = Math.PI / 2; // Point downward
            const angleDiff = targetAngle - this.direction;
            this.direction += angleDiff * 0.1;
        }
        // Bottom wall
        if (this.y > canvasHeight - margin) {
            const targetAngle = -Math.PI / 2; // Point upward
            const angleDiff = targetAngle - this.direction;
            this.direction += angleDiff * 0.1;
        }

        // Slight random direction change for natural wandering
        this.direction += (Math.random() - 0.5) * 0.05;

        // Move in current direction
        this.x += Math.cos(this.direction) * currentSpeed;
        this.y += Math.sin(this.direction) * currentSpeed;
    }

    draw(p, connected) {
        const size = 7;
        const col = p.color(this.color);

        // Create cached blur graphic once
        if (!this.glowGraphic) {
            this.glowGraphic = p.createGraphics(60, 60);
            this.glowGraphic.noStroke();
            this.glowGraphic.fill(p.red(col), p.green(col), p.blue(col));
            this.glowGraphic.rectMode(p.CENTER);
            this.glowGraphic.rect(30, 30, size * 2, size * 2, 3);
            this.glowGraphic.filter(p.BLUR, 4);
        }

        // Draw cached glow
        p.push();
        p.tint(255, 255 * this.opacity * 0.8);
        p.image(this.glowGraphic, this.x - 30, this.y - 30);
        p.pop();

        // Main rect
        p.noStroke();
        p.fill(p.red(col), p.green(col), p.blue(col), 255 * this.opacity);
        p.rectMode(p.CENTER);
        p.rect(this.x, this.y, size * 2, size * 2, 3);

        // Name
        p.fill(0, 0, 0, 255 * this.opacity);
        p.textStyle(p.SEMIBOLD);
        p.textAlign(p.CENTER);
        p.text(this.id, this.x, this.y + size + 17);

        if (connected) {
            // if connected, pulse ?
        }
    }
}
