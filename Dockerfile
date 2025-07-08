FROM eclipse-temurin:17-jdk

# Cài Node.js & Maven
RUN apt-get update && apt-get install -y curl git maven && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Làm việc trong thư mục app
WORKDIR /app

# Copy toàn bộ source vào image
COPY . .

# Cài frontend + build frontend + backend
RUN npm install && npm run webapp:build && mvn clean package -Pprod -DskipTests

# Khai báo PORT (Render sẽ ghi đè)
ENV PORT=8080

# Chạy ứng dụng (dùng đúng tên file JAR)
CMD ["java", "-jar", "target/aolangfarm-0.0.1-SNAPSHOT.jar"]
