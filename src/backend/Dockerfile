# Etapa de build usando Maven e JDK 21
FROM maven:3.9.6-eclipse-temurin-21 as builder
WORKDIR /app


# Copia arquivos de dependências primeiro (para cache)
 COPY pom.xml .
 COPY mvnw .
 COPY .mvn .mvn
 RUN mvn dependency:go-offline

 # Copia o restante do projeto e faz build
 COPY src ./src
 RUN mvn clean package -DskipTests

# Etapa de execução com JDK 21 mais leve
FROM eclipse-temurin:21-jdk-jammy AS runtime
WORKDIR /app

# Copia o JAR gerado do builder
COPY --from=builder /app/target/*.jar app.jar

# Define a porta que o container vai expor
EXPOSE 8080

# Executa a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
