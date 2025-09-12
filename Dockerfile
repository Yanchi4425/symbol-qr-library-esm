FROM node:22-bookworm
SHELL ["/bin/bash","-lc"]

# Install build dependencies for node-canvas (Cairo, Pango, etc.)
# and common native build toolchain (python3, make, g++, pkg-config)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    python3-pip \
    pkg-config \
    git \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
 && rm -rf /var/lib/apt/lists/*

ENV npm_config_python=/usr/bin/python3 \
    npm_config_build_from_source=true

WORKDIR /work
