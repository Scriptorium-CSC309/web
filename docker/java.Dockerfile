# java-executor:20

FROM openjdk:20-slim

# Open the sh shell on first entry
ENTRYPOINT ["sh", "-c"]  
