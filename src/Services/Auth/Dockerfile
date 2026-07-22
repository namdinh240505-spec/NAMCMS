FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src/Shared src/Shared
COPY src/Services/Auth src/Services/Auth
RUN mvn -N install
RUN mvn -f src/Shared/pom.xml clean install
RUN mvn -f src/Services/Auth/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/src/Services/Auth/target/auth-service-1.0.0.jar app.jar
EXPOSE 5001
ENTRYPOINT ["java", "-jar", "app.jar"]
