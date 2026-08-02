# Cloudflare Container image for the ShipItHQ code executor.
# A real Linux sandbox with the language runtimes; the executor server runs code
# here via child_process (safe — the container itself is the isolation boundary).
FROM node:20-bookworm-slim

# Language runtimes: Python, C/C++ (gcc/g++), Java (JDK). TypeScript runs via tsx.
RUN apt-get update && apt-get install -y --no-install-recommends \
	python3 \
	gcc \
	g++ \
	default-jdk \
	ca-certificates \
	&& rm -rf /var/lib/apt/lists/* \
	&& npm install -g tsx@4.19.2

# Run the executor as a non-root user for a little extra hardening.
RUN useradd -m runner
WORKDIR /app
COPY container/server.mjs ./server.mjs
RUN chown -R runner:runner /app
USER runner

EXPOSE 8080
CMD ["node", "server.mjs"]
