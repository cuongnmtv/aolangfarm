# Sử dụng JDK chính xác
FROM eclipse-temurin:17-jdk

# Cài Node.js nếu cần build frontend (Angular)
RUN apt-get update && apt-get install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Cài Maven
RUN apt-get install -y maven

# Tạo thư mục app
WORKDIR /app

# Copy toàn bộ project vào container
COPY . .

# Cài đặt frontend + build Angular + backend
RUN npm install && npm run webapp:build && mvn clean package -Pprod -DskipTests

# Chạy file jar
CMD ["java", "-jar", "target/*.jar"]
