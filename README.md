# 🌟 Reflection - Personal Journal Application

> **"App to live through the memories again"** - A modern, secure journal application built with cutting-edge technology

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-green.svg)](https://www.mongodb.com/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://openjdk.java.net/)
[![Maven](https://img.shields.io/badge/Maven-Build%20Tool-blue.svg)](https://maven.apache.org/)

## 🚀 Overview

**Reflection** is a sophisticated personal journaling application that leverages the power of **MongoDB's document-based architecture** to provide a seamless and scalable experience for managing personal memories and thoughts. Built with modern Spring Boot technology, this application demonstrates enterprise-grade development practices while maintaining simplicity and elegance.

### 🎯 Why MongoDB?

This project showcases the incredible capabilities of **MongoDB** as a NoSQL database solution:

- **🔥 Document-Oriented Storage**: Perfect for journal entries with flexible schema requirements
- **⚡ High Performance**: Lightning-fast read/write operations for seamless user experience  
- **🔄 ACID Transactions**: Full transactional support ensuring data consistency across operations
- **📈 Horizontal Scalability**: Built to handle growing amounts of personal data effortlessly
- **🎨 Rich Data Models**: Native support for complex data structures and relationships
- **🔍 Powerful Querying**: Advanced querying capabilities for searching through memories

## ✨ Features

### 🔐 **Robust Authentication & Authorization**
- Secure user registration and login system
- Role-based access control (USER/ADMIN roles)
- Spring Security integration with custom authentication
- Protected endpoints with JWT-like security context

### 📝 **Advanced Journal Management**
- Create, read, update, and delete personal journal entries
- Automatic timestamp management for entries
- User-specific journal isolation and security
- Rich content support for detailed memories

### 👥 **User Management System**
- Complete user profile management
- Secure password handling
- User data integrity with MongoDB transactions
- Admin panel for user oversight

### 🛡️ **Enterprise-Grade Security**
- Spring Security configuration
- Protected API endpoints
- User context awareness
- Secure data validation

## 🏗️ Architecture Highlights

### **MongoDB Integration Excellence**
```java
@Document(collection = "journals")
@Data
public class Journal {
    @Id
    private ObjectId id;
    private String title;
    private String content;
    private LocalDate date;
}
```

- **Document Collections**: Optimized collections for `users` and `journals`
- **Database References**: Smart `@DBRef` relationships between users and their journals
- **Transaction Management**: Full ACID compliance with `@Transactional` operations
- **Indexing Strategy**: Unique indexing on usernames for optimal performance

### **Modern Spring Boot Stack**
- **Spring Boot 3.5.0**: Latest enterprise framework
- **Spring Data MongoDB**: Seamless database integration
- **Spring Security**: Comprehensive security framework
- **Lombok**: Clean, boilerplate-free code
- **Maven**: Robust dependency management

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Java** | 21 | Core programming language |
| **Spring Boot** | 3.5.0 | Application framework |
| **MongoDB** | Latest | NoSQL database |
| **Spring Security** | Latest | Security framework |
| **Spring Data MongoDB** | Latest | Database abstraction |
| **Lombok** | Latest | Code generation |
| **Maven** | Latest | Build automation |

## 📁 Project Structure

```
src/main/java/com/geto/suguru/reflection/
├── 📱 controller/          # REST API endpoints
│   ├── JournalsController  # Journal CRUD operations
│   ├── UsersController     # User management
│   ├── AdminController     # Admin functionality
│   └── PublicController    # Public endpoints
├── 🗃️ model/              # MongoDB document models
│   ├── User               # User entity with roles
│   ├── Journal            # Journal document
│   ├── UserProfile        # Security user details
│   └── ERole              # Role enumeration
├── 🔧 service/            # Business logic layer
│   ├── JournalService     # Journal operations
│   └── UserService        # User operations
├── 📦 repo/               # MongoDB repositories
├── 🛡️ config/            # Security configuration
├── 📋 payload/            # DTOs and request/response objects
└── ⚠️ exception/          # Custom exception handling
```

## 🚀 Getting Started

### Prerequisites
- **Java 21** or higher
- **MongoDB** instance (local or cloud)
- **Maven 3.6+**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Reflection
   ```

2. **Configure MongoDB**
   ```properties
   # application.properties
   spring.data.mongodb.uri=mongodb://localhost:27017/reflection
   ```

3. **Build the application**
   ```bash
   ./mvnw clean install
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

## 📚 API Documentation

### 🔓 Public Endpoints
- `GET /api/public/health` - Health check
- `POST /api/public/create` - User registration

### 🔐 Authenticated Endpoints
- `GET /api/journals/all` - Get all user journals
- `POST /api/journals/create` - Create new journal
- `PUT /api/journals/update/{id}` - Update journal
- `DELETE /api/journals/delete/{id}` - Delete journal

### 👑 Admin Endpoints
- `GET /api/admin/all-users` - Get all users (Admin only)

## 🎯 Current Status

This project represents a **work in progress** with a solid foundation already in place. The core functionality is implemented and demonstrates:

- ✅ **Complete MongoDB integration** with transactions
- ✅ **Robust authentication system**
- ✅ **Full CRUD operations** for journals
- ✅ **Role-based access control**
- ✅ **Enterprise-grade architecture**

### 🔮 Future Enhancements
- Frontend user interface
- Advanced search and filtering
- File attachments for journal entries
- Social features and sharing
- Mobile application
- Advanced analytics and insights

## 🤝 Contributing

This project showcases modern development practices and MongoDB's powerful capabilities. While currently in development, the foundation demonstrates enterprise-ready code quality and architecture.

## 📄 License

This project is part of a portfolio demonstrating advanced Spring Boot and MongoDB integration skills.

---

**Built with ❤️ using MongoDB's incredible NoSQL capabilities and Spring Boot's enterprise framework**

> *"Every memory deserves to be preserved with the best technology available"*
