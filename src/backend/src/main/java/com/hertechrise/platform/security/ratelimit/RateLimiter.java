package com.hertechrise.platform.security.ratelimit;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiter {

    private static final long CLEANUP_INTERVAL_MS = 60_000;

    private record Window(long start, long length, int count) {
        boolean expired(long now) {
            return now - start >= length;
        }
    }

    private final Map<String, Window> windows = new ConcurrentHashMap<>();
    private volatile long lastCleanup = System.currentTimeMillis();

    public boolean tryAcquire(String key, int limit, Duration window) {
        long now = System.currentTimeMillis();
        cleanup(now);
        Window current = windows.compute(key, (k, w) -> w == null || w.expired(now)
                ? new Window(now, window.toMillis(), 1)
                : new Window(w.start(), w.length(), w.count() + 1));
        return current.count() <= limit;
    }

    public boolean isBlocked(String key, int limit) {
        Window w = windows.get(key);
        return w != null && !w.expired(System.currentTimeMillis()) && w.count() >= limit;
    }

    public void reset(String key) {
        windows.remove(key);
    }

    private void cleanup(long now) {
        if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
        lastCleanup = now;
        windows.values().removeIf(w -> w.expired(now));
    }
}
