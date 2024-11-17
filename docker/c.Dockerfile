FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && \
    apt-get -y install gcc mono-mcs && \
    rm -rf /var/lib/apt/lists/*

# Open the sh shell on first entry
ENTRYPOINT ["sh", "-c"]  
