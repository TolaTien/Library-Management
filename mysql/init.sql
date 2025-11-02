-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (x86_64)
--
-- Host: localhost    Database: books
-- ------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--\

--
-- Table structure for table `historyBooks`
--

DROP TABLE IF EXISTS `historyBooks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historyBooks` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `bookId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `borrowDate` datetime NOT NULL,
  `returnDate` datetime DEFAULT NULL,
  `status` enum('pending','success','cancel') NOT NULL DEFAULT 'pending',
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historyBooks`
--

LOCK TABLES `historyBooks` WRITE;
/*!40000 ALTER TABLE `historyBooks` DISABLE KEYS */;
/*!40000 ALTER TABLE `historyBooks` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `image` varchar(255) NOT NULL,
  `nameProduct` varchar(255) NOT NULL,
  `description` text,
  `stock` int NOT NULL,
  `covertType` enum('hard','soft') NOT NULL,
  `publishYear` int NOT NULL,
  `pages` int NOT NULL,
  `language` varchar(255) NOT NULL,
  `publisher` varchar(255) NOT NULL,
  `publishingCompany` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('24e96aa4-57b5-4077-9827-a9543fd83d12','uploads/products/1753791873669.webp','LỮ KHÁCH VEN ĐƯỜNG - Tâm An'),
('9a3c4f9d-6b42-4c7e-b8a1-1d93d5d8c101','uploads/products/1753791873670.webp','Bí Mật Của May Mắn'),
('a45b9d12-03cf-4c22-9e67-2bb20f4a6123','uploads/products/1753791873671.webp','Đắc Nhân Tâm'),
('b84b2aa1-1139-4f9f-8894-1ab0e1fda32c','uploads/products/1753791873672.webp','Nhà Giả Kim'),
('cc43df01-6c9d-4707-b0d5-9cc5c24b7114','uploads/products/1753791873673.webp','Tuổi Trẻ Đáng Giá Bao Nhiêu'),
('d19e9c0a-9fa3-44d7-9088-8b4e9c5f6125','uploads/products/1753791873674.webp','Tôi Thấy Hoa Vàng Trên Cỏ Xanh'),
('e39a7f77-2e33-4b25-93aa-2a1d8dcd3199','uploads/products/1753791873675.webp','Dám Bị Ghét'),
('f7d69a13-0183-4b3f-88e7-8d9f812d729a','uploads/products/1753791873676.webp','Hành Trình Về Phương Đông'),
('045b8e9c-7339-4d47-b3f8-f718c3a971bc','uploads/products/1753791873677.webp','Không Gia Đình'),
('17bc27e1-1e25-4fb8-8135-52c37fbc629d','uploads/products/1753791873678.webp','Chiến Binh Cầu Vồng'),
('23d41a60-9479-4ff3-b17b-2d5b0c3d82c3','uploads/products/1753791873679.webp','Sapiens - Lược Sử Loài Người'),
('31fce8c5-9e8b-4a1b-9b67-9a6a56b841bb','uploads/products/1753791873680.webp','Muôn Kiếp Nhân Sinh'),
('4b9a13fd-ec4c-4d26-9d7c-0e2b37f618e1','uploads/products/1753791873681.webp','Thép Đã Tôi Thế Đấy'),
('5d8ce6b1-7185-4b74-bb27-4f12e0a991d2','uploads/products/1753791873682.webp','Người Giàu Có Nhất Thành Babylon'),
('6a3a2bc4-35b3-46d7-9c4a-88276df931f0','uploads/products/1753791873683.webp','Đi Tìm Lẽ Sống'),
('7e9c4d23-8efb-4a49-b1b9-1c32b9e4c9f3','uploads/products/1753791873684.webp','Bố Già'),
('8f3c1e22-2c46-4d2c-bc5f-15b6d46b1b24','uploads/products/1753791873685.webp','Những Tù Nhân Của Địa Lý'),
('92b5cf41-3a88-49b0-a55c-5f1dcd72e231','uploads/products/1753791873686.webp','Tâm Lý Học Thành Công'),
('a06d3b31-409b-43c1-83b1-84c7b4d6b9e8','uploads/products/1753791873687.webp','Sức Mạnh Của Thói Quen'),
('b28e1f3a-8a2b-4cde-9042-f12d37e941cd','uploads/products/1753791873688.webp','Trí Tuệ Do Thái'),
('c8e2b71b-19d3-4c24-9b53-4a7b39e51a9e','uploads/products/1753791873689.webp','Thiên Tài Bên Trái, Kẻ Điên Bên Phải');

/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `idStudent` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29 19:36:50

