/**
 * 1€ ("One-Euro") filter — an adaptive low-pass filter for noisy interactive
 * signals such as tracked hand/pointer positions.
 *
 * It smooths heavily when the value changes slowly (removing jitter, so a
 * near-still hand produces a near-still value) and lightly when the value
 * changes fast (keeping latency low, so quick movements stay responsive).
 * This avoids the noise amplification you get from differentiating a plain
 * moving-average signal. See https://gery.casiez.net/1euro/
 */
export class OneEuroFilter {
    private minCutoff: number;
    private beta: number;
    private dCutoff: number;

    private xPrev = 0;
    private dxPrev = 0;
    private tPrev = 0;
    private initialized = false;

    /**
     * @param minCutoff Minimum cutoff frequency (Hz). Lower = more smoothing
     *                  (less jitter) when the hand is slow.
     * @param beta      Speed coefficient. Higher = less lag when the hand moves
     *                  fast.
     * @param dCutoff   Cutoff frequency for the derivative (Hz).
     */
    constructor(minCutoff = 1.0, beta = 0.02, dCutoff = 1.0) {
        this.minCutoff = minCutoff;
        this.beta = beta;
        this.dCutoff = dCutoff;
    }

    private alpha(cutoff: number, dt: number): number {
        const tau = 1 / (2 * Math.PI * cutoff);
        return 1 / (1 + tau / dt);
    }

    /** Forget history so the next sample starts a fresh signal. */
    reset(): void {
        this.initialized = false;
        this.dxPrev = 0;
    }

    /**
     * @param x         Raw sample.
     * @param timestamp Sample time in milliseconds (e.g. performance.now()).
     * @returns The filtered value.
     */
    filter(x: number, timestamp: number): number {
        if (!this.initialized) {
            this.initialized = true;
            this.xPrev = x;
            this.dxPrev = 0;
            this.tPrev = timestamp;
            return x;
        }

        let dt = (timestamp - this.tPrev) / 1000; // seconds
        if (dt <= 0) dt = 1 / 60; // guard against duplicate/zero timestamps
        this.tPrev = timestamp;

        // Filter the derivative, then use it to pick an adaptive cutoff.
        const dx = (x - this.xPrev) / dt;
        const dxHat = this.dxPrev + this.alpha(this.dCutoff, dt) * (dx - this.dxPrev);

        const cutoff = this.minCutoff + this.beta * Math.abs(dxHat);
        const xHat = this.xPrev + this.alpha(cutoff, dt) * (x - this.xPrev);

        this.xPrev = xHat;
        this.dxPrev = dxHat;
        return xHat;
    }
}
