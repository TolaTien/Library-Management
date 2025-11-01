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
INSERT INTO `products` VALUES ('24e96aa4-57b5-4077-9827-a9543fd83d12','uploads/products/1753791873669.webp','LỮ KHÁCH VEN ĐƯỜNG - Tâm An','Mỗi một người bước đến cuộc đời mình đều có ý nghĩa và giá trị khác nhau. Họ như là một lữ khách, dù cho có ở lại với mình đến hết cuộc đời hay không. Tâm An cũng vậy, cậu luôn cho mình là một lữ khách. Với bất cứ nơi nào Tâm An đi đến, cậu sẽ góp nhặt từng mảnh chuyện thường ngày trong cuộc hành trình của mình rồi viết nên “Lữ khách ven đường”. ',250,'soft',2019,300,'Tiếng Việt','Nhà Xuất Bản Văn Học','SBOOKS','2025-07-29 12:24:33','2025-07-29 12:24:33'),('281219e4-fca7-4365-8ee2-b8057d2eb4f4','uploads/products/1753791783113.webp','Góc Sân Và Khoảng Trời - Thơ Trần Đăng Khoa (HH)','Nhà thơ Trần Đăng Khoa đã từng được mệnh danh là thần đồng thơ, được Nhà nước trao tặng Giải thưởng Nhà nước đợt I về Văn học nghệ thuật năm 2001 cho ba tập thơ Góc sân và khoảng trời, Bên cửa sổ máy bay và Thơ Trần Đăng Khoa 1966-2000. Tập tuyển này chọn lọc những tác phẩm tiêu biểu nhất trong thời gian Trần Đăng Khoa còn là học sinh phổ thông. Hi vọng cuốn sách sẽ mang đến cho độc giả, nhất là độc giả nhỏ tuổi những cảm nhận thú vị.\n\nThơ của Trần Đăng Khoa tự nhiên, tự nhiên như cuộc sống vốn thế, là tất cả những gì diễn ra hàng ngày dưới con mắt của một cậu bé, rất gần gũi, dung dị nhưng cũng rất tinh tế…\"\nII. THÔNG TIN CHI TIẾT\nMã hàng : 8935095626502\nTên Nhà Cung Cấp: Huy Hoang Bookstore\nTác giả: Trần Đăng Khoa\nNXB: NXB Văn học\nNăm XB: 2018\nTrọng lượng (gr): 400\nKích Thước Bao Bì: 20,5 x 13,5\nSố trang: 227\nHình thức: Bìa Mềm\nXuất xứ: Việt Nam',120,'hard',2020,120,'Tiếng Việt',' Nhà Xuất Bản Văn Học','Huy Hoàng Bookstore','2025-07-29 12:23:03','2025-07-29 12:23:03'),('5842072c-444e-43b1-93e4-99ab547bbf4a','uploads/products/1753791913601.webp','DẪU CÓ RA ĐI VẪN SẼ CƯỜI - Mộc Trầm (Thích Đạo Quang)','\"Chỉ muốn rằng, quyển sách này sẽ chạm đến trái tim của những con người đã từng lạc bước ngoài kia và cả những người trẻ đang chập chững bước vào đời. Mong sao, khi gấp quyển sách lại, người ta sẽ yêu nhiều hơn cái cuộc đời bình sinh ngắn ngủi này. Họ sẽ thương nau hơn, chấp nhận và bao dung hơn những điều còn khiếm khuyết trong cuộc sống. Để cho dù có bất chợt ra đi, họ vẫn sẽ mỉm cười vì không còn gì băn khoăn và nuối tiếc.\n\nGửi đến những người thương, những người đã và đang hiện hữu trong cuộc đời tôi lời nguyện cầu bình an và trân trọng. Xin cúi mình tạ lỗi với những ai tô đã vô tình làm tổn thương họ, đã từng lạc nhau trong khoảnh khắc nào đõ giữa chông chênh kiếp người. Cho dù có chuyện gì xảy ra đi nữa, tôi vẫn sẽ nhìn họ bằng con mắt nguyên sơ như ngày đầu mới gặp. Bởi vì sẽ không biết được rằng, giữa cuộc sống vô thường, tôi, họ, ai sẽ là người tiếp theo bước chân về cõi ấy, nơi của những linh hồn hội tụ.\n\nVậy nên, tôi thật lòng trân trọng.\n\nĐầy trân trọng!\"\n\n- Tác giả Mộc Trầm (Đại Đức Thích Đạo Quang)\n\n\"Dẫu có ra đi vẫn sẽ cười cho ta thấy được một cái kết mà chưa hết. Trong đó, cái chết chỉ là kết thúc một hành trình để bắt đầu cho một hành trình mới thiêng liêng và cao quý hơn nữa trong mỗi chúng ta trên cuộc đời này. Chính vì thế, cho dù cuộc đời này chúng ta có sai bao nhiêu lần đi chăng nữa, thì cuối cùng, nếu ta nhận biết lỗi lầm của mình mà tu sửa thì những gì ta tu sửa đó đáng giá không có gì đổi được. Vì thế, biết lỗi mà sửa lỗi là điều đáng trân trọng vô cùng.\"\n\n- Nguyễn Anh Dũng, Sáng lập SBOOKS.\n\nGiá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....',100,'soft',2020,250,'Tiếng Việt','Nhà Xuất Bản Thế Giới',' SBOOKS','2025-07-29 12:25:13','2025-07-29 12:25:13'),('721a6471-c766-4f26-86a4-15db502fce19','uploads/products/1753791957345.webp','Sách - Và rồi núi vọng (TB 2021) (Nhã Nam HCM)','Abdullah và Pari sống cùng cha, mẹ kế và em khác mẹ trong ngôi làng nhỏ xác xơ Shadbagh, nơi đói nghèo và mùa đông khắc nghiệt luôn chực chờ cướp đi sinh mệnh lũ trẻ. Abdullah yêu thương em vô ngần, còn với Pari, anh trai chẳng khác gì người cha, chăm lo cho nó từng bữa ăn, giấc ngủ. Mùa thu năm ấy hai anh em theo cha băng qua sa mạc tới thành Kabul náo nhiệt, không mảy may hay biết số phận nào đang chờ đón phía trước: một cuộc chia ly sẽ mãi đè nặng lên Abdullah và để lại nỗi trống trải mơ hồ không thể lấp đầy trong tâm hồn Pari…\n\n \n\nTừ một sự kiện duy nhất đó, câu chuyện mở ra nhiều ngã rẽ phức tạp, qua các thế hệ, vượt đại dương, đưa chúng ta từ Kabul tới Paris, từ San Francisco tới hòn đảo Tinos xinh đẹp của Hy Lạp. Với sự uyên thâm, chiều sâu và lòng trắc ẩn, Khaled Hosseini đã viết nên những áng văn tuyệt đẹp về mối dây gắn kết định hình nên con người cũng như cuộc đời, về những quyết định tưởng chừng nhỏ nhoi mà vang vọng qua hàng thế kỷ.\n\n',50,'hard',2021,500,'Tiếng Việt','Nhà Xuất Bản Hội Nhà Văn','Nhã Nam','2025-07-29 12:25:57','2025-07-29 12:25:57'),('97647b3d-8fc9-4742-9913-437bd411e31b','uploads/products/1753792456005.webp','Thuyền','Thuyền là hành trình vượt biển của một người Việt vào những năm 80 của thế kỷ trước. Những dòng hồi ức đan xen cho người đọc hình dung được hoàn cảnh, bối cảnh một người di tản trái phép sau khi đã phải tiêu tốn rất nhiều tiền, vàng để được lên thuyền. Người thanh niên xưng “tôi” và bạn gái anh ta, cùng với khoảng 150 người đồng hành, đã gặp phải những “kiếp nạn điển hình”: bị trấn lột tài sản; bị nhồi nhét trong hầm thuyền chật chội, thiếu tiện nghi; gặp bão tố; bị hư hỏng thuyền; bị đi lạc; bị hải tặc Thái Lan cướp, hãm hiếp, quăng xuống biển; bị chết vì đói khát, tai nạn, bệnh tật... Bạn gái nhân vật “tôi” khi bị bọn cướp biển bắt đi sang thuyền của chúng (để làm nô lệ tình dục hoặc để mua bán) cô đã lao mình xuống biển tự vẫn. Nhân vật “tôi” cùng những người sót lại của cả đoàn, sau mười tám ngày lênh đênh trên chiếc thuyền hỏng nát, may mắn gặp được một thủy tàu đánh cá, kiêm nghề cướp biển cứu giúp, kéo thuyền cập bến một nước nhận tị nạn. Anh lang bạt qua các tại tị nạn ở Đông Nam Á, rồi sang Mỹ, sang Canada và định cư tại đó. Sau mấy chục năm, với những ký ức sang chấn chưa thể nhòa từ cuộc vượt biển khủng khiếp, người đàn ông trở về, đau đáu với những câu hỏi mang theo từ ngày ra đi càng lúc càng trở nên mông lung: Thực chất tự do đúng nghĩa là gì? Có thật ngày đó chỉ có một lựa chọn?\nThuyền gồm 55 chương nhưng đó không phải là tiểu thuyết chương hồi mạch lạc theo kiểu truyền thống mà là những tiểu tự sự phân mảnh đan xen, mỗi chương như một đoản văn vừa có vẻ rời rạc của những mảnh ký ức đơn lẻ vừa có mạch kết nối ngầm xuyên suốt mê cung ký ức đầy những ẩn ức và ám ảnh phức tạp.\nThuyền mang dáng dấp của một tiểu thuyết tự sự đầy trải nghiệm của nhà văn – nhà phê bình Nguyễn Đức Tùng đồng thời cũng là một sự dụng công sáng tạo công phu của tác giả với những câu từ đầy chất thơ và chất xi-nê (điện ảnh), với cấu trúc độc đáo, khác thường.\nThuyền có đau thương, ly tán, đầy máu và nước mắt nhưng không có oán thán, hận thù.\nThuyền có bi kịch, ân hận, sám hối nhưng không có đổ lỗi hay buộc tội.\nThuyền, vì thế không thể đọc nhanh, không dễ đọc liền một mạch, nhưng chắc chắn sẽ khiến bạn phải đọc đi rồi đọc lại, rùng mình, uất nghẹn, ứa nước mắt, xót xa và tha thiết yêu thương về một giai đoạn lịch sử của dân tộc còn cần nhiều sự thấu cảm mà chúng ta không được phép lãng quên…\nTác giả Nguyễn Đức Tùng\nSinh tại Quảng Trị, lớn lên và đi học ở Quảng Trị và Huế. Tốt nghiệp y khoa Đại học McMaster, Nội trú Đại học Toronto, Thường trú Đại học UBC, hiện định cư và hành nghề bác sĩ ở Canada. Làm thơ, dịch thuật, viết truyện, phê bình.\nTác phẩm đã in: Thơ đến từ đâu? (NXB Lao động, 2009), Đối thoại văn chương (NXB Tri thức, 2012); Thơ cần thiết cho ai (NXB Hội Nhà văn, 2015), Cuộc đời yêu dấu (Alice Munro, dịch, NXB Trẻ, 2017), Thư gởi con trai (NXB Phụ nữ Việt Nam, 2023), Thơ buổi sáng (NXB Hội nhà văn, 2023)\n\nGiá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....',20,'hard',2021,140,'Tiếng Việt','Nhà Xuất Bản Phụ Nữ Việt Nam',' Nhà xuất bản Phụ Nữ Việt Nam','2025-07-29 12:34:16','2025-07-29 12:34:16'),('9be83b18-8b8d-49b5-ba0d-95dc8f87bdce','uploads/products/1753792399222.webp','Người Ăn Chay','Câu chuyện bắt đầu với Yeong‑hye, một phụ nữ nội trợ tại Seoul, bình thường đến mức không ai chú ý. Một đêm, bị ám ảnh bởi giấc mơ đầy máu và bạo lực, cô tuyên bố sẽ không ăn thịt nữa. Quyết định nhỏ ban đầu khiến gia đình cô rung chuyển: chồng, bố mẹ, và cả chị gái In‑hye đều bị cuốn vào một biến cố không thể lường trước. Cuốn sách gồm ba màn độc lập, từ góc nhìn chồng, anh rể rồi đến chị gái, nhưng Yeong‑hye là tâm điểm xuyên suốt, người từ chối tất cả để hướng tới sự giải thoát nội tại.\n\n• Liệu việc từ bỏ một phần thân thể có thể trở thành phản kháng mạnh mẽ nhất?\n• Phụ nữ khao khát sự tự do, nhưng khi họ im lặng, người khác có hiểu được?\n• Quyền lực gia trưởng không chỉ định hình bên ngoài mà còn bóp nghẹt bản thể người khác từ bên trong. Yeong‑hye chọn im lặng, đó có phải bản lĩnh lớn hơn tất cả?\n• Và khi một người chọn sống như cây, chỉ quang hợp và tưới nước, liệu đó là sự tự do hay sự từ bỏ cuối cùng?\n\nĐiều Gì Chờ Đón Người Đọc?\n\n• Một tác phẩm văn học xuất sắc, kết hợp đẹp giữa châm biếm xã hội và sự suy tư sâu sắc.',100,'hard',2023,150,'Tiếng Việt',' Nhà Xuất Bản Hà Nội','Nhã Nam','2025-07-29 12:33:19','2025-07-29 12:33:19'),('9d4f6db1-def8-48f3-92f9-dc86da820bc9','uploads/products/1753791995579.webp','Bất Tuần - Tập 3','Có lẽ, khi đã yêu thương thật lòng, chuyện tình cảm không còn là điều có thể giấu cho riêng mình.\nTừ khoảnh khắc những người thân thiết nhất của Trần Dã biết về mối quan hệ giữa cậu và Lục Tuần, đến những ngày Trần Dã vật lộn trong biển kiến thức, cố gắng bắt kịp nhịp học của lớp bồi dưỡng, từng thử thách ập tới khiến cậu không ít lần thấy mình nhỏ bé và bất lực.\n\nChuyện gì đến cũng phải đến. Bí mật mà Trần Dã cố gắng giữ kín cuối cùng cũng bị bà nội phát hiện. Sự thất vọng của người mà cậu yêu thương nhất trở thành giọt nước tràn ly làm Trần Dã gần như gục ngã, khiến cậu hoang mang giữa ranh giới của tình cảm và tình thân.\n\nGiữa những rối ren ấy, liệu cậu có đủ can đảm đối diện với chính mình và với tình cảm của Lục Tuần?\n\nCòn Lục Tuần, người luôn là điểm tựa vững chắc trong những đêm dài học tập và những lần Trần Dã cảm thấy lạc lối — cậu sẽ làm gì khi sóng gió bắt đầu bủa vây?\n\nGiữa muôn trùng khó khăn thử thách, liệu họ có thể cùng nhau bước qua cánh cổng đại học hằng mơ ước?\n\nHãy đón chờ tập cuối của bộ tiểu thuyết “Bất Tuần” cùng Daisy nhé!\n\nGiá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....',140,'hard',2024,300,'Tiếng Việt',' Nhà Xuất Bản Hà Nội','Daisybooks','2025-07-29 12:26:35','2025-07-29 12:26:35'),('a0e2436b-a582-4ea3-8a17-b7b8530661e7','uploads/products/1753792354497.webp','Thế Giới Otome Game Thật Khắc Nghiệt Với Nhân Vật Quần Chúng\" (Tập 13 - tập cuối)','Cuối cùng, chiến tranh với Đế quốc cũng nổ ra.\nHậu duệ của nhân loại cũ và nhân loại mới lao vào trận chiến sinh tử, không bên nào chịu lùi bước.\n\nDưới sự hỗ trợ của Livia và Noelle, Leon cùng đồng đội đã thành công đột nhập vào Arcadia - căn cứ của kẻ địch. Thế nhưng, các hiệp sĩ của Đế quốc đã chặn đường khiến từng người của nhóm Leon ngã xuống.\n\nNhờ sự hy sinh của những đồng đội, Leon đã đến được nơi kẻ địch ẩn náu và phải đối mặt với Finn - hiệp sĩ của Đế quốc, đồng thời là bạn thân của cậu.\n\nTrong cuộc chiến mà không ai có thể rút lui, ngay cả Luxion, bạn đồng hành xuất sắc của Leon, cũng gặp không ít khó khăn...\n\nCâu chuyện ngày một cao trào xảy ra tại thế giới Otome game chính thức đón hồi kết hoành tráng!!\n\nGiá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....\n\n',100,'soft',2021,150,'Tiếng việt',' Nhà Xuất Bản Thế Giới','Tsuki LightNovel','2025-07-29 12:32:34','2025-07-29 12:32:34'),('c7e9d499-2b8e-49a8-a5e1-4d038f86e3dc','uploads/products/1753791830999.webp','Điều Kỳ Diệu Của Tiệm Tạp Hóa NAMIYA (Tái Bản)','Điều Kỳ Diệu Của Tiệm Tạp Hóa\n\nMột đêm vội vã lẩn trốn sau phi vụ khoắng đồ nhà người, Atsuya, Shota và Kouhei đã rẽ vào lánh tạm trong một căn nhà hoang bên con dốc vắng người qua lại. Căn nhà có vẻ khi xưa là một tiệm tạp hóa với biển hiệu cũ kỹ bám đầy bồ hóng, khiến người ta khó lòng đọc được trên đó viết gì. Định bụng nghỉ tạm một đêm rồi sáng hôm sau chuồn sớm, cả ba không ngờ chờ đợi cả bọn sẽ là một đêm không ngủ, với bao điều kỳ bí bắt đầu từ một phong thư bất ngờ gửi đến…\n\nTài kể chuyện hơn người đã giúp Keigo khéo léo thay đổi các mốc dấu thời gian và không gian, chắp nối những câu chuyện tưởng chừng hoàn toàn riêng rẽ thành một kết cấu chặt chẽ, gây bất ngờ từ đầu tới cuối.\n\n \n\nGiá sản phẩm trên Tiki đã bao gồm thuế theo luật hiện hành. Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà có thể phát sinh thêm chi phí khác như phí vận chuyển, phụ phí hàng cồng kềnh, thuế nhập khẩu (đối với đơn hàng giao từ nước ngoài có giá trị trên 1 triệu đồng).....',100,'hard',2018,250,'Tiếng Việt',' Nhà Xuất Bản Hội Nhà Văn','Nhã Nam','2025-07-29 12:23:51','2025-07-29 12:23:51'),('fbff4d7a-7007-48b0-8c47-0b99d336cb3d','uploads/products/1753792040093.webp','Cội Rễ (Bìa Mềm)','Trên tấm thảm rộng lớn của lịch sử nhân loại, có những tác phẩm văn học đã vượt qua các đường biên giới, chạm tới trái tim độc giả ở những thời đại và địa điểm khác nhau. Đó là trường hợp của Cội rễ, một tác phẩm lớn của nhà văn Mỹ, Alex Haley. Được xuất bản lần đầu vào năm 1976, cuốn tiểu thuyết kể về cuộc đời đầy thăng trầm của người nô lệ da đen châu Phi, Kunta Kinte, cùng các thế hệ hậu duệ của mình vật lộn đấu tranh và kiên cường theo đuổi tự do.\n\n\nKhi đắm mình vào cuộc phiêu lưu văn chương trong Cội rễ, bạn sẽ được trải nghiệm văn hóa bản địa Tây Phi đa dạng, rực rỡ, và giàu giá trị truyền thống, ghé thăm những đồn điền rộng lớn ở miền Nam nước Mỹ, và chứng kiến kỷ nguyên hỗn loạn của Nội chiến Hoa Kỳ. Với tài năng kể chuyện của mình, Alex Haley đã vẽ nên một bức tranh sống động về quá khứ, làm sống lại cuộc hành trình phi thường kéo dài hai thế kỷ của Kunta Kinte và sáu đời hậu duệ kế tiếp: Những nô lệ và những người tự do, những chủ trang trại và thợ rèn, những công nhân nhà máy gỗ và phu khuân vác trên các toa tàu Pullman, những luật sư và kiến trúc sư… và một nhà văn.\n\n\nThông qua sự nghiên cứu tỉ mỉ và các cuộc đối thoại với tổ tiên của mình, Alex Haley đã viết nên một câu chuyện không chỉ ghi lại những trải nghiệm đau thương của người Mỹ gốc Phi, mà còn phản ánh niềm khao khát bẩm sinh của con người được khám phá bản thân và xây dựng mối quan hệ ý nghĩa với đồng loại.',100,'hard',2019,150,'TIếng Việt',' Nhà Xuất Bản Văn Học',' Hải Đăng','2025-07-29 12:27:20','2025-07-29 12:27:20');
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
  `typeLogin` enum('google','email') NOT NULL,
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

