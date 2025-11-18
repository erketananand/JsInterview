# Advanced Node.js Interview Questions

## Core Concepts & Architecture

### 1. Explain Node.js event loop and its phases in detail.
- The event loop is the core mechanism handling asynchronous operations in Node.js. It processes the call stack and multiple queues (timers, I/O callbacks, idle/prepare, poll, check, close callbacks, and microtasks like nextTick/promises). Understanding the event loop's phases is crucial for architecting performant Node.js applications.

### 2. How does Node.js handle child processes and what are their use cases?
- Node.js can spawn child processes using `child_process` module (`spawn`, `exec`, `fork`). Child processes enable parallel computation, running scripts, or managing system-level tasks. Use cases include background workers, image/video processing, or scaling computation-heavy logic.

### 3. What are worker threads, how do they differ from child processes, and when would you use them?
- Worker threads execute JavaScript in parallel on additional threads inside the same process, sharing memory using `SharedArrayBuffer`. Unlike child processes, they have lower overhead and share heap memory. Use for CPU-bound computation, not I/O.

### 4. Compare different module systems in Node.js (CommonJS, ES Modules).
- CommonJS uses `require`, synchronously loads modules, and has `module.exports`. ES Modules use `import`/`export`, are asynchronous, and support top-level await. Mixing systems requires compatibility flags and careful architecture decisions.

---

## Asynchronous Patterns & Performance

### 5. What strategies are available to scale Node.js applications?
- Vertical scaling, horizontal scaling (clustering, load balancing), using the `cluster` module, process managers like PM2, containerization, microservices, and leveraging cloud-native architectures (e.g., serverless).

### 6. What is the role of the `nextTick` queue vs. the microtask queue (`Promise.resolve().then`)?
- `process.nextTick` fires callbacks before the event loop continues; microtasks (`Promise.resolve().then`) run after the current phase but before other event loop queues. Misuse can cause starvation of I/O.

### 7. Explain backpressure in streams and approaches to handle it.
- Backpressure occurs when writable streams can't process incoming data quickly enough from readable streams. Handled via the `.pipe()` method, checking `.write()` return values, using `"drain"` events, and designing throttling systems.

---

## Security, Error Handling & Reliability

### 8. How would you architect a secure Node.js application?
- Input validation, output encoding, using security middleware, HTTPS, proper authentication (JWT/OAuth), rate limiting, CORS configuration, helmet, avoiding eval & unsafe deserialization, updating dependencies, and securing environment variables.

### 9. How do you handle uncaught exceptions and unhandled promise rejections in production?
- Listen to `process.on('uncaughtException')` and `process.on('unhandledRejection')`. Log errors, alert, and exit process gracefully if necessary; design defensive coding, use promises everywhere, employ domain/async_hooks for tracking async errors.

### 10. What is the difference between process exit codes and process signals?
- Exit codes indicate why a process exited (`0` for success, non-zero for error). Signals (`SIGINT`, `SIGTERM`, etc.) are used for controlling and gracefully shutting down processes.

---

## Networking, APIs & Data

### 11. How do you design a RESTful API in Node.js for scalability and maintainability?
- Use modular routing, controllers, middleware, validation, structured error handling, versioning, statelessness, dependency injection, service layers, DTOs, caching, rate limiting, and monitoring.

### 12. What is Server-Sent Events (SSE) and how does it compare with WebSockets?
- SSE enables one-way streaming from server to client (HTTP/1.1), while WebSockets provide full-duplex communication. Use SSE for live updates, notifications, where only server-to-client is needed.

### 13. How would you implement caching in Node.js?
- In-memory caching (Node cache, LRU cache), distributed caching (Redis, Memcached), HTTP-level caching, CDN. Architect for cache invalidation, expiration, and consistency.

---

## Node.js Internals & Optimization

### 14. Describe how garbage collection works in Node.js and strategies to optimize memory usage.
- Node.js uses V8 engine’s garbage collector. Memory is managed automatically but can be optimized by minimizing leaks, monitoring heap snapshots, using Buffer pools, handling large objects carefully, and tuning GC flags (`--max-old-space-size`, etc.).

### 15. How does Node.js handle DNS queries and what are performance considerations?
- Uses the `dns` module (with native OS resolver or JS fallback). Blocking DNS queries can impact performance; prefer asynchronous methods whenever possible.

### 16. What tools and strategies would you use for profiling and debugging Node.js applications?
- Built-in debugger, Chrome DevTools (using `inspect` flag), profiling with `clinic.js`, `node --trace_gc`, `heapdump`, `pm2` monitoring, `newrelic`, `opentracing`, custom logging and metrics, error tracking with Sentry/Rollbar.

---

## Advanced Code Questions

### 17. How would you design a Node.js system to handle millions of concurrent connections?
- Use non-blocking I/O, clustering, stateless design, efficient resource pooling, connection reuse (keep-alive), event-driven patterns, scalable messaging (Redis pub/sub), distributed load balancers (NGINX, AWS ELB), and consideration for hardware/network limits.

### 18. How do you ensure high availability and zero downtime deployments in Node.js?
- Use blue/green deployments, rolling updates, automated health checks, process managers (PM2), container orchestration (Docker/Kubernetes), graceful shutdown handlers.

### 19. Describe the role of streams in Node.js and use cases for custom streams.
- Streams allow processing data chunk-by-chunk. They save memory and boost performance for large files, real-time processing, network communication, and transformation pipelines.

### 20. How does Node.js achieve cross-platform compatibility?
- Uses libuv for abstracting OS interfaces (file, networking, async I/O). Careful use of platform-specific APIs, and conditional code for OS variations ensure compatibility.

---

## References  
- [Node.js Interview Questions by Simplilearn](https://www.simplilearn.com/tutorials/nodejs-tutorial/nodejs-interview-questions)  
- [Node.js Basics - Learning Zone GitHub](https://github.com/learning-zone/nodejs-basics)