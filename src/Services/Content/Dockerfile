FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src/Shared src/Shared
COPY src/Services/Content src/Services/Content
RUN mvn -N install
RUN mvn -f src/Shared/pom.xml clean install
RUN mvn -f src/Services/Content/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/src/Services/Content/target/content-service-1.0.0.jar app.jar
EXPOSE 5004
ENTRYPOINT ["java", "-jar", "app.jar"]
