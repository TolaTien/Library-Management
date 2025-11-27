--
-- Table structure for table `historyBooks`
--

DROP TABLE IF EXISTS `historyBooks`;
CREATE TABLE `historyBooks` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `bookId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `borrowDate` datetime NOT NULL,
  `returnDate` datetime DEFAULT NULL,
  `status` enum('pending','success','cancel','returned') NOT NULL DEFAULT 'pending',
  `quantity` int NOT NULL DEFAULT '1',
  `fine` DECIMAL(10,2) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `image` varchar(255) NOT NULL,
  `nameProduct` varchar(255) NOT NULL,
  `description` text,
  `stock` int NOT NULL,
  `publishYear` int NOT NULL,
  `pages` int NOT NULL,
  `language` varchar(255) NOT NULL,
  `publisher` varchar(255) NOT NULL,
  `publishingCompany` varchar(255) NOT NULL,
  `category` VARCHAR(255) NOT NULL, 
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `products` VALUES ('24e96aa4-57b5-4077-9827-a9543fd83d12','uploads/products/1753791873669.jpg','LỮ KHÁCH VEN ĐƯỜNG - Tâm An','Cuốn sách giúp bạn tìm thấy bình yên trong tâm hồn giữa dòng đời hối hả.',50,2021,260,'Tiếng Việt','Tâm An','NXB Trẻ','test',NOW(),NOW());
--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `idStudent` varchar(255) DEFAULT NULL,
  `borrowed` INT NOT NULL DEFAULT 0,
  `returned` INT NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


