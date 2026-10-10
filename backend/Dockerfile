FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd -r -m -u 10001 hrms && mkdir -p /app/data/uploads && chown -R hrms:hrms /app/data
COPY --from=build /app/target/*.jar /app/app.jar
USER hrms
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
