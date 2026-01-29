FROM --platform=linux/amd64 node:12-buster
SHELL ["/bin/bash","-lc"]

# 1. Switch buster mirrors to archive + disable validity check
RUN sed -i -e 's|deb.debian.org/debian|archive.debian.org/debian|g' \
           -e 's|security.debian.org/debian-security|archive.debian.org/debian-security|g' \
           /etc/apt/sources.list \
 && printf 'Acquire::Check-Valid-Until "false";\n' >/etc/apt/apt.conf.d/99no-check-valid

# 2. Install dependencies (including python2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python2 \
    pkg-config \
    git \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
 && ln -sf /usr/bin/python2 /usr/bin/python \
 && npm i -g npm@6 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /work
