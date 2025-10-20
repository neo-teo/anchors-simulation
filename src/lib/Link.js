export class Link {
    static draw(p, a, b) {
        const alpha = 255 * 0.2;
        const width = 1.5;

        p.stroke(100, 100, 100, alpha);
        p.strokeWeight(width);
        p.line(a.x, a.y, b.x, b.y);
    }
}
