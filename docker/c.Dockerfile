# c-executor:11

# Use Ubuntu 22.04 as the base image
FROM ubuntu:22.04

# Set non-interactive mode for apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Install specific GCC version (e.g., GCC 11) only
RUN apt-get update && \
    apt-get -y install gcc-11 && \
    ln -sf /usr/bin/gcc-11 /usr/bin/gcc && \
    rm -rf /var/lib/apt/lists/*

# Open the sh shell on first entry
ENTRYPOINT ["sh", "-c"]
