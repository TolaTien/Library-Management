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


INSERT INTO `products` VALUES ('9a3c4f9d-6b42-4c7e-b8a1-1d93d5d7c202','uploads/products/1753791873672.jpg','Bí Mật Của May Mắn','Câu chuyện truyền cảm hứng về việc tạo ra vận may bằng chính nỗ lực của bản thân.',80,2019,220,'Tiếng Việt','Alex Rovira','NXB Lao Động','test2',NOW(),NOW());
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
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `idStudent` varchar(255) DEFAULT NULL,
  `borrowed` INT NOT NULL DEFAULT 0,
  `returned` INT NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- ---- Table reminder --------- 

DROP TABLE IF EXISTS `reminders`;

CREATE TABLE `reminders` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `historyId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
  )

