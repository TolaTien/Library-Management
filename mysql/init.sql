-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (x86_64)
--
-- Host: localhost   
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
INSERT INTO `products` VALUES ('24e96aa4-57b5-4077-9827-a9543fd83d12','uploads/products/1753791873669.jpg','LỮ KHÁCH VEN ĐƯỜNG - Tâm An','Cuốn sách giúp bạn tìm thấy bình yên trong tâm hồn giữa dòng đời hối hả.',50,'soft',2021,260,'Tiếng Việt','Tâm An','NXB Trẻ',NOW(),NOW()),
('9a3c4f9d-6b42-4c7e-b8a1-1d93d5d8c101','uploads/products/1753791873670.jpg','Bí Mật Của May Mắn','Câu chuyện truyền cảm hứng về việc tạo ra vận may bằng chính nỗ lực của bản thân.',80,'hard',2019,220,'Tiếng Việt','Alex Rovira','NXB Lao Động',NOW(),NOW()),
('a45b9d12-03cf-4c22-9e67-2bb20f4a6123','uploads/products/1753791873671.jpg','Đắc Nhân Tâm','Tác phẩm kinh điển về nghệ thuật giao tiếp và thấu hiểu con người.',100,'hard',2018,320,'Tiếng Việt','Dale Carnegie','NXB Trẻ',NOW(),NOW()),
('b84b2aa1-1139-4f9f-8894-1ab0e1fda32c','uploads/products/1753791873672.webp','Nhà Giả Kim','Câu chuyện về hành trình đi tìm ước mơ và định mệnh của mỗi con người.',70,'soft',2020,250,'Tiếng Việt','Paulo Coelho','NXB Văn Học',NOW(),NOW()),
('cc43df01-6c9d-4707-b0d5-9cc5c24b7114','uploads/products/1753791873673.jpg','Tuổi Trẻ Đáng Giá Bao Nhiêu','Cuốn sách dành cho những người trẻ đang tìm hướng đi cho cuộc đời.',90,'soft',2017,300,'Tiếng Việt','Rosie Nguyễn','NXB Hội Nhà Văn',NOW(),NOW()),
('d19e9c0a-9fa3-44d7-9088-8b4e9c5f6125','uploads/products/1753791873674.jpg','Tôi Thấy Hoa Vàng Trên Cỏ Xanh','Một tác phẩm nổi tiếng của Nguyễn Nhật Ánh, gợi nhớ tuổi thơ tươi đẹp.',60,'soft',2016,350,'Tiếng Việt','Nguyễn Nhật Ánh','NXB Trẻ',NOW(),NOW()),
('e39a7f77-2e33-4b25-93aa-2a1d8dcd3199','uploads/products/1753791873675.jpg','Dám Bị Ghét','Tác phẩm triết học ứng dụng khuyến khích bạn sống đúng với bản thân.',75,'hard',2022,280,'Tiếng Việt','Ichiro Kishimi','NXB Lao Động',NOW(),NOW()),
('f7d69a13-0183-4b3f-88e7-8d9f812d729a','uploads/products/1753791873676.jpg','Hành Trình Về Phương Đông','Cuốn sách nổi tiếng về tâm linh và triết học phương Đông.',55,'soft',2020,400,'Tiếng Việt','Baird T. Spalding','NXB Văn Hóa - Thông Tin',NOW(),NOW()),
('045b8e9c-7339-4d47-b3f8-f718c3a971bc','uploads/products/1753791873677.jpg','Không Gia Đình','Câu chuyện cảm động về tình người và nghị lực sống.',65,'hard',2019,450,'Tiếng Việt','Hector Malot','NXB Kim Đồng',NOW(),NOW()),
('31fce8c5-9e8b-4a1b-9b67-9a6a56b841bb','uploads/products/1753791873680.jpg','Muôn Kiếp Nhân Sinh','Tác phẩm tâm linh và nhân quả của Nguyễn Phong.',90,'hard',2020,420,'Tiếng Việt','Nguyên Phong','NXB Hồng Đức',NOW(),NOW()),
('4b9a13fd-ec4c-4d26-9d7c-0e2b37f618e1','uploads/products/1753791873681.jpg','Thép Đã Tôi Thế Đấy','Cuốn tiểu thuyết về ý chí kiên cường và lý tưởng sống cao đẹp.',95,'hard',2017,360,'Tiếng Việt','Nikolai Ostrovsky','NXB Văn Học',NOW(),NOW()),
('5d8ce6b1-7185-4b74-bb27-4f12e0a991d2','uploads/products/1753791873682.jpg','Người Giàu Có Nhất Thành Babylon','Bí quyết tài chính trường tồn qua thời gian.',100,'soft',2019,240,'Tiếng Việt','George S. Clason','NXB Lao Động',NOW(),NOW());

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