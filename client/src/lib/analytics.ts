import { nanoid } from 'nanoid';

// Types
export type EventType =
    | 'page_view'
    | 'click'
    | 'scroll_depth'
    | 'add_to_cart'
    | 'checkout_init'
    | 'checkout_complete'
    | 'pilot_signup'
    | 'error'
    | 'location_shared'
    | 'location_denied'
    | 'payment_option_selected';

export interface AnalyticsEvent {
    type: EventType;
    path: string;
    sessionId: string;
    timestamp: number;
    data?: any;
    device?: {
        screen: string;
        agent: string;
    };
}

class AnalyticsEngine {
    private queue: AnalyticsEvent[] = [];
    private sessionId: string;
    private isProcessing = false;
    private BATCH_SIZE = 5;
    private FLUSH_INTERVAL = 5000; // 5 seconds

    constructor() {
        this.sessionId = this.getOrCreateSessionId();
        this.setupAutoFlush();
        this.trackPageView(); // Track initial load
    }

    private getOrCreateSessionId(): string {
        let sid = localStorage.getItem('pilot_session_id');
        if (!sid) {
            sid = nanoid();
            localStorage.setItem('pilot_session_id', sid);
        }
        return sid;
    }

    private setupAutoFlush() {
        setInterval(() => this.flush(), this.FLUSH_INTERVAL);

        // Flush on page unload
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.flush();
            }
        });
    }

    private getDeviceInfo() {
        return {
            screen: `${window.screen.width}x${window.screen.height}`,
            agent: navigator.userAgent,
        };
    }

    public track(type: EventType, data?: any) {
        const event: AnalyticsEvent = {
            type,
            path: window.location.pathname,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            data,
            device: this.getDeviceInfo(),
        };

        console.log(`[Analytics] Tracked: ${type}`, data);
        this.queue.push(event);

        if (this.queue.length >= this.BATCH_SIZE) {
            this.flush();
        }
    }

    public trackPageView() {
        this.track('page_view', { referrer: document.referrer });
    }

    public async flush() {
        if (this.queue.length === 0 || this.isProcessing) return;

        this.isProcessing = true;
        const batch = [...this.queue]; // snapshot
        this.queue = []; // clear queue

        try {
            // We'll update the backend to accept batches
            // For now, we'll send them one by one or a batch endpoint if we make one
            // Let's implement the backend batch endpoint next.

            const response = await fetch('/api/track-batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: batch }),
            });

            if (!response.ok) {
                // Simple retry logic: put them back
                console.warn('[Analytics] Failed to flush, requeuing');
                this.queue = [...batch, ...this.queue];
            }
        } catch (err) {
            console.error('[Analytics] Flush error', err);
            // Requeue on network failure
            this.queue = [...batch, ...this.queue];
        } finally {
            this.isProcessing = false;
        }
    }

    public getSessionId() {
        return this.sessionId;
    }
}

// Singleton instance
export const analytics = new AnalyticsEngine();
