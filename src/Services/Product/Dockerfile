FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src/Shared src/Shared
COPY src/Services/Product src/Services/Product
RUN mvn -N install
RUN mvn -f src/Shared/pom.xml clean install
RUN mvn -f src/Services/Product/pom.xml clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/src/Services/Product/target/product-service-1.0.0.jar app.jar
EXPOSE 5002
ENTRYPOINT ["java", "-jar", "app.jar"]
