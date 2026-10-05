-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dau_portfolio
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_first_time` tinyint(1) NOT NULL DEFAULT '1',
  `email_sent` tinyint(1) NOT NULL DEFAULT '0',
  `auto_reply_sent` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_created` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
INSERT INTO `contacts` VALUES (1,'John Doe','john.doe.test@gmail.com','Project Inquiry','Hello Mudrik, this is a test message to verify the backend works. I would like to discuss a web project with you.','::1','PostmanRuntime/7.56.1',1,1,1,'2026-10-05 18:08:38'),(2,'John Doe','john.doe.test@gmail.com','Freelance Work','Hi again, I have another question about a freelance project.','::1','PostmanRuntime/7.56.1',0,1,1,'2026-10-05 18:10:39'),(3,'Mudy Dau','mudydau@icloud.com','Freelance Work','Hi again, I have another question about a freelance project.','::1','PostmanRuntime/7.56.1',1,1,1,'2026-10-05 18:11:55'),(4,'Mr.Mudy','mudydau@icloud.com.com','Project Inquiry','Hi Mudrik, this is a real test from my second email account to verify the automated welcome email works.','::1','PostmanRuntime/7.56.1',1,1,1,'2026-10-05 18:18:23'),(5,'Mr.Mudy','mudydau@icloud.com.com','Project Inquiry','Hi Mudrik, this is a real test from my second email account to verify the automated welcome email works.','::1','PostmanRuntime/7.56.1',0,1,1,'2026-10-05 18:44:19');
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_log`
--

DROP TABLE IF EXISTS `email_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `contact_id` int DEFAULT NULL,
  `recipient` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `error` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_contact` (`contact_id`),
  KEY `idx_type` (`type`),
  CONSTRAINT `email_log_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_log`
--

LOCK TABLES `email_log` WRITE;
/*!40000 ALTER TABLE `email_log` DISABLE KEYS */;
INSERT INTO `email_log` VALUES (1,1,'mudrikdau@gmail.com','admin','sent',NULL,'2026-10-05 18:08:42'),(2,1,'john.doe.test@gmail.com','welcome','sent',NULL,'2026-10-05 18:08:46'),(3,2,'mudrikdau@gmail.com','admin','sent',NULL,'2026-10-05 18:10:51'),(4,2,'john.doe.test@gmail.com','thankyou','sent',NULL,'2026-10-05 18:10:55'),(5,3,'mudrikdau@gmail.com','admin','sent',NULL,'2026-10-05 18:12:00'),(6,3,'mudydau@icloud.com','welcome','sent',NULL,'2026-10-05 18:12:06'),(7,4,'mudrikdau@gmail.com','admin','sent',NULL,'2026-10-05 18:18:26'),(8,4,'mudydau@icloud.com.com','welcome','sent',NULL,'2026-10-05 18:18:29'),(9,5,'mudrikdau@gmail.com','admin','sent',NULL,'2026-10-05 18:44:23'),(10,5,'mudydau@icloud.com.com','thankyou','sent',NULL,'2026-10-05 18:44:26');
/*!40000 ALTER TABLE `email_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-05 21:52:10
