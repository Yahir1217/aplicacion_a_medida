-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-06-2025 a las 05:09:53
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aplicacion_a_medida`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'Negocio de ropa', 'Venta de playeras, pantalones, blusas, vestidos etc', '2025-06-11 07:59:56', '2025-06-11 07:59:56'),
(2, 'Tecnología', 'Esta descripción abarca cualquier tipo de tecnologia', '2025-06-16 20:40:34', '2025-06-16 20:40:34');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_negocio`
--

CREATE TABLE `categoria_negocio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `negocio_id` bigint(20) UNSIGNED NOT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categoria_negocio`
--

INSERT INTO `categoria_negocio` (`id`, `negocio_id`, `categoria_id`, `created_at`, `updated_at`) VALUES
(1, 2, 2, '2025-06-16 20:41:06', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_publicacion`
--

CREATE TABLE `categoria_publicacion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `publicacion_id` bigint(20) UNSIGNED NOT NULL,
  `categoria_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horarios_negocio`
--

CREATE TABLE `horarios_negocio` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `negocio_id` bigint(20) UNSIGNED NOT NULL,
  `cumple_con_horario` tinyint(1) NOT NULL DEFAULT 1,
  `abierto` tinyint(1) DEFAULT NULL,
  `dia_semana` tinyint(4) NOT NULL,
  `hora_apertura` time DEFAULT NULL,
  `hora_cierre` time DEFAULT NULL,
  `cerrado` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `horarios_negocio`
--

INSERT INTO `horarios_negocio` (`id`, `negocio_id`, `cumple_con_horario`, `abierto`, `dia_semana`, `hora_apertura`, `hora_cierre`, `cerrado`, `created_at`, `updated_at`) VALUES
(171, 2, 1, 0, 0, NULL, NULL, 1, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(172, 2, 1, 1, 1, '09:00:00', '14:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(173, 2, 1, 1, 1, '16:00:00', '19:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(174, 2, 1, 1, 2, '09:00:00', '14:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(175, 2, 1, 1, 2, '16:00:00', '19:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(176, 2, 1, 1, 3, '09:00:00', '14:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(177, 2, 1, 1, 3, '16:00:00', '19:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(178, 2, 1, 1, 4, '09:00:00', '14:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(179, 2, 1, 1, 4, '16:00:00', '19:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(180, 2, 1, 1, 5, '09:00:00', '14:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(181, 2, 1, 1, 5, '16:00:00', '19:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(182, 2, 1, 1, 6, '09:00:00', '14:00:00', 0, '2025-06-17 06:24:06', '2025-06-17 06:24:06'),
(183, 6, 1, 1, 0, '18:00:00', '00:00:00', 0, '2025-06-20 02:59:08', '2025-06-20 02:59:08'),
(184, 6, 1, 0, 1, NULL, NULL, 1, '2025-06-20 02:59:08', '2025-06-20 02:59:08'),
(185, 6, 1, 0, 2, NULL, NULL, 1, '2025-06-20 02:59:08', '2025-06-20 02:59:08'),
(186, 6, 1, 0, 3, NULL, NULL, 1, '2025-06-20 02:59:08', '2025-06-20 02:59:08'),
(187, 6, 1, 1, 4, '18:00:00', '00:00:00', 0, '2025-06-20 02:59:08', '2025-06-20 02:59:08'),
(188, 6, 1, 1, 5, '18:00:00', '00:00:00', 0, '2025-06-20 02:59:08', '2025-06-20 02:59:08'),
(189, 6, 1, 1, 6, '06:00:00', '00:00:00', 0, '2025-06-20 02:59:08', '2025-06-20 02:59:08'),
(190, 7, 1, 1, 0, '09:00:00', '14:00:00', 0, '2025-06-20 04:11:02', '2025-06-20 04:11:02'),
(191, 7, 1, 1, 1, '09:00:00', '20:00:00', 0, '2025-06-20 04:11:02', '2025-06-20 04:11:02'),
(192, 7, 1, 1, 2, '09:00:00', '20:00:00', 0, '2025-06-20 04:11:02', '2025-06-20 04:11:02'),
(193, 7, 1, 1, 3, '09:00:00', '20:00:00', 0, '2025-06-20 04:11:02', '2025-06-20 04:11:02'),
(194, 7, 1, 1, 4, '09:00:00', '16:00:00', 0, '2025-06-20 04:11:02', '2025-06-20 04:11:02'),
(195, 7, 1, 1, 5, '09:00:00', '20:00:00', 0, '2025-06-20 04:11:02', '2025-06-20 04:11:02'),
(196, 7, 1, 1, 6, '09:00:00', '20:00:00', 0, '2025-06-20 04:11:02', '2025-06-20 04:11:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_publicacion`
--

CREATE TABLE `imagenes_publicacion` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `publicacion_id` bigint(20) UNSIGNED NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `imagenes_publicacion`
--

INSERT INTO `imagenes_publicacion` (`id`, `publicacion_id`, `imagen`, `created_at`, `updated_at`) VALUES
(2, 2, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750111492/Publicidad_3_aq7dkg.png', '2025-06-16 22:05:45', NULL),
(3, 2, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750111795/Publicidad_7_d1w7pu.png', '2025-06-16 22:09:56', NULL),
(6, 4, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750273085/aplicacion_a_medida/SuperAdmin%40gmail.com/Negocios/Codexa/publicaciones/bmcuf2eicso08c9h79an.png', '2025-06-18 18:58:05', '2025-06-18 18:58:05'),
(7, 5, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750273670/aplicacion_a_medida/SuperAdmin%40gmail.com/Negocios/Codexa/publicaciones/ptpuotarasz57jzu4h93.png', '2025-06-18 19:07:50', '2025-06-18 19:07:50'),
(9, 7, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750360380/aplicacion_a_medida/SuperAdmin%40gmail.com/Negocios/Codexa/publicaciones/wwdlf9opcxkte8qnfao3.png', '2025-06-19 19:13:01', '2025-06-19 19:13:01'),
(10, 8, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750360398/aplicacion_a_medida/SuperAdmin%40gmail.com/Negocios/Codexa/publicaciones/fwznd8kaaknz1rr20nf9.png', '2025-06-19 19:13:18', '2025-06-19 19:13:18'),
(11, 9, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750360471/aplicacion_a_medida/SuperAdmin%40gmail.com/Negocios/Codexa/publicaciones/pcsk7lxprzozzfpvfllm.png', '2025-06-19 19:14:31', '2025-06-19 19:14:31'),
(12, 10, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750360522/aplicacion_a_medida/SuperAdmin%40gmail.com/Negocios/Codexa/publicaciones/dnl4jpbf6pbdkzvyzezt.png', '2025-06-19 19:15:23', '2025-06-19 19:15:23'),
(13, 11, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750388465/aplicacion_a_medida/brayan%40gmail.com/Negocios/Spider-Wings/publicaciones/wir5vzslumngap2loep5.jpg', '2025-06-20 03:01:05', '2025-06-20 03:01:05'),
(14, 11, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750388466/aplicacion_a_medida/brayan%40gmail.com/Negocios/Spider-Wings/publicaciones/ccligldimaerdo37urv5.jpg', '2025-06-20 03:01:07', '2025-06-20 03:01:07'),
(15, 12, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750392716/aplicacion_a_medida/luisgokufer%40gmail.com/Negocios/GPtronics/publicaciones/dk7u4he4my5p3x8txgb4.jpg', '2025-06-20 04:11:57', '2025-06-20 04:11:57'),
(16, 13, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750392834/aplicacion_a_medida/luisgokufer%40gmail.com/Negocios/GPtronics/publicaciones/cb9aefwjtdr7fqwi2dxb.jpg', '2025-06-20 04:13:55', '2025-06-20 04:13:55'),
(17, 13, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750392836/aplicacion_a_medida/luisgokufer%40gmail.com/Negocios/GPtronics/publicaciones/seoyrz748bopenhpoa97.jpg', '2025-06-20 04:13:57', '2025-06-20 04:13:57'),
(18, 14, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750393073/aplicacion_a_medida/brayan%40gmail.com/Negocios/Spider-Wings/publicaciones/xeuutd5wv21y7jsrtr6m.jpg', '2025-06-20 04:17:53', '2025-06-20 04:17:53'),
(19, 14, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750393074/aplicacion_a_medida/brayan%40gmail.com/Negocios/Spider-Wings/publicaciones/sublysfrn4trzwjauotw.jpg', '2025-06-20 04:17:55', '2025-06-20 04:17:55'),
(20, 15, 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750455657/aplicacion_a_medida/SuperAdmin%40gmail.com/Publicaciones_sin_negocio/qhoz2fn6taaoc8jq2y9v.jpg', '2025-06-20 21:40:57', '2025-06-20 21:40:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_05_26_195728_create_personal_access_tokens_table', 1),
(5, '2025_06_10_161721_create_roles_table', 1),
(6, '2025_06_10_161916_create_user_roles_table', 1),
(7, '2025_06_10_162726_create_negocios_table', 1),
(8, '2025_06_10_163350_create_negocio_redes_sociales_table', 1),
(9, '2025_06_10_163604_create_categorias_table', 1),
(10, '2025_06_10_163859_create_categoria_negocio_table', 1),
(11, '2025_06_10_164325_create_negocio_correos_table', 1),
(12, '2025_06_10_164818_create_historias_negocio_table', 1),
(13, '2025_06_10_165145_create_historias_imagenes_table', 1),
(14, '2025_06_10_172001_create_horarios_negocio_table', 1),
(15, '2025_06_10_172814_create_publicaciones_table', 1),
(16, '2025_06_10_173603_create_imagenes_publicacion_table', 1),
(17, '2025_06_10_173808_create_categoria_publicacion_table', 1),
(18, '2025_06_16_135443_create_negocio_telefonos_table', 2),
(19, '2025_06_19_114700_create_reportes_publicaciones_table', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocios`
--

CREATE TABLE `negocios` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `servicio_domicilio` tinyint(1) NOT NULL DEFAULT 0,
  `estado` enum('inactivo','vencido','pagado') NOT NULL DEFAULT 'inactivo',
  `fecha_pago` date DEFAULT NULL,
  `fecha_vencimiento` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `negocios`
--

INSERT INTO `negocios` (`id`, `user_id`, `nombre`, `logo_url`, `descripcion`, `direccion`, `servicio_domicilio`, `estado`, `fecha_pago`, `fecha_vencimiento`, `created_at`, `updated_at`) VALUES
(2, 1, 'Codexa', 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750196777/aplicacion_a_medida/SuperAdmin%40gmail.com/Negocios/Codexa/h4wkr00eub48iixbfome.png', 'Empresa de desarrollo creadora de esta paginas', 'Calle 12345, Ciudad', 1, 'pagado', '2025-06-11', '2025-12-11', '2025-06-11 08:49:15', '2025-06-17 21:52:01'),
(6, 7, 'Spider-Wings', 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750388198/aplicacion_a_medida/brayan%40gmail.com/Negocios/Spider-Wings/gf4xoubmw8j0jib3iyx5.jpg', 'Snaks con servicio a domicilio gratis', 'Av. 20 de noviembre a lado del six enfrente de wipizz', 1, 'pagado', '2025-06-19', '2025-08-19', '2025-06-20 02:54:44', '2025-06-20 02:56:39'),
(7, 8, 'GPtronics', 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750392758/aplicacion_a_medida/luisgokufer%40gmail.com/Negocios/GPtronics/zyhduomc9had33frpyut.jpg', 'Venta de aparatos electrónicos Bocinas, cargadores, memorias, audífonos, cigarros electrónicos y mas...', 'Zaragoza en la plazoleta espaldas de la plaza', 0, 'pagado', '2025-06-19', '2025-08-19', '2025-06-20 03:19:13', '2025-06-20 04:12:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocio_correos`
--

CREATE TABLE `negocio_correos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `negocio_id` bigint(20) UNSIGNED NOT NULL,
  `correo` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `negocio_correos`
--

INSERT INTO `negocio_correos` (`id`, `negocio_id`, `correo`, `created_at`, `updated_at`) VALUES
(11, 2, 'codexa.company@gmail.com', '2025-06-19 18:50:22', '2025-06-19 18:50:22'),
(12, 6, 'spider-wings@gmail.com', '2025-06-20 02:58:05', '2025-06-20 02:58:05'),
(25, 7, 'luisgokufer@gmail.com', '2025-06-20 03:38:16', '2025-06-20 03:38:16'),
(26, 7, 'al05-001-0321@utdelacosta.edu.mx', '2025-06-20 03:38:16', '2025-06-20 03:38:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocio_redes_sociales`
--

CREATE TABLE `negocio_redes_sociales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `negocio_id` bigint(20) UNSIGNED NOT NULL,
  `tipo` enum('facebook','whatsapp','instagram','tiktok') NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `negocio_redes_sociales`
--

INSERT INTO `negocio_redes_sociales` (`id`, `negocio_id`, `tipo`, `url`, `created_at`, `updated_at`) VALUES
(14, 2, 'whatsapp', '3231239174', '2025-06-19 18:50:22', '2025-06-19 18:50:22'),
(15, 2, 'facebook', 'https://www.facebook.com/profile.php?id=61576787153920&locale=es_LA', '2025-06-19 18:50:22', '2025-06-19 18:50:22'),
(16, 6, 'whatsapp', '323 144 4895', '2025-06-20 02:58:05', '2025-06-20 02:58:05'),
(17, 6, 'facebook', 'https://www.facebook.com/profile.php?id=100065550607120&locale=es_LA', '2025-06-20 02:58:05', '2025-06-20 02:58:05'),
(36, 7, 'whatsapp', '311 268 7341', '2025-06-20 03:38:16', '2025-06-20 03:38:16'),
(37, 7, 'facebook', 'https://www.facebook.com/profile.php?id=100076225088977&locale=es_LA', '2025-06-20 03:38:16', '2025-06-20 03:38:16'),
(38, 7, 'tiktok', 'https://www.tiktok.com/@gptronics.electrn?_t=ZS-8xLuGQ1q07c&_r=1', '2025-06-20 03:38:16', '2025-06-20 03:38:16'),
(39, 7, 'instagram', 'https://www.instagram.com/gp.tronics?igsh=enNwNXJtNDV3NWsw', '2025-06-20 03:38:16', '2025-06-20 03:38:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `negocio_telefonos`
--

CREATE TABLE `negocio_telefonos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `negocio_id` bigint(20) UNSIGNED NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `negocio_telefonos`
--

INSERT INTO `negocio_telefonos` (`id`, `negocio_id`, `telefono`, `created_at`, `updated_at`) VALUES
(2, 2, '3231239174', '2025-06-19 18:50:22', '2025-06-19 18:50:22'),
(3, 6, '323 144 4895', '2025-06-20 02:58:05', '2025-06-20 02:58:05'),
(10, 7, '311 268 7341', '2025-06-20 03:38:16', '2025-06-20 03:38:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `publicaciones`
--

CREATE TABLE `publicaciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `negocio_id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `descripcion` text NOT NULL,
  `pdf` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `destacado` tinyint(1) DEFAULT 0,
  `orden` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `publicaciones`
--

INSERT INTO `publicaciones` (`id`, `negocio_id`, `user_id`, `descripcion`, `pdf`, `created_at`, `updated_at`, `destacado`, `orden`) VALUES
(2, NULL, 4, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. \nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. \nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n', NULL, '2025-06-16 22:05:04', '2025-06-20 04:33:20', 1, 1),
(4, 2, NULL, '🚀 Impulsa tu negocio con una app hecha a tu medida\r\nEn Codexa desarrollamos aplicaciones web para que vendas más y gestiones mejor tu tienda de ropa, artículos de belleza, gorras, servicios y mucho más.\r\n\r\n✨ Lleva tu negocio al siguiente nivel con tecnología personalizada.\r\n📱 E-commerce, catálogos, gestión de pedidos, pagos en línea y más.\r\n💼 Ideal para emprendedores y empresas en crecimiento.\r\n\r\n🔹 Codexa – Transformamos tu idea en tecnología real\r\n📩 Contáctanos por WhatsApp o redes sociales.', NULL, '2025-06-18 18:58:03', '2025-06-20 04:33:20', 1, 2),
(5, 2, NULL, '🚀 Impulsa tu negocio con una app hecha a tu medida\r\nEn Codexa desarrollamos aplicaciones web para que vendas más y gestiones mejor tu tienda de ropa, artículos de belleza, gorras, servicios y mucho más.\r\n\r\n✨ Lleva tu negocio al siguiente nivel con tecnología personalizada.\r\n📱 E-commerce, catálogos, gestión de pedidos, pagos en línea y más.\r\n💼 Ideal para emprendedores y empresas en crecimiento.\r\n\r\n🔹 Codexa – Transformamos tu idea en tecnología real\r\n📩 Contáctanos por WhatsApp o redes sociales.', 'https://res.cloudinary.com/du6n25rsz/raw/upload/v1750273668/aplicacion_a_medida/SuperAdmin%40gmail.com/Negocios/Codexa/publicaciones/lhmpbrx39pc003ah3kqc', '2025-06-18 19:07:48', '2025-06-18 19:07:48', 0, NULL),
(7, 2, NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\r\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\r\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\r\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, '2025-06-19 19:12:58', '2025-06-19 19:12:58', 0, NULL),
(8, 2, NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, '2025-06-19 19:13:16', '2025-06-19 19:13:16', 0, NULL),
(9, 2, NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\r\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\r\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\r\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, '2025-06-19 19:14:29', '2025-06-19 19:14:29', 0, NULL),
(10, 2, NULL, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\r\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\r\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\r\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, '2025-06-19 19:15:21', '2025-06-19 19:15:21', 0, NULL),
(11, 6, NULL, 'Menu de Spider-Wings', NULL, '2025-06-20 03:01:04', '2025-06-20 03:01:04', 0, NULL),
(12, 7, NULL, '🎉 ¡Convierte tu tele en una Smart TV con el Roku Express! 🎬📺\r\nDisfruta de tus series y películas favoritas en alta definición desde Netflix, HBO Max, Disney+, YouTube ¡y muchas más!\r\n✨ Fácil, rápido y accesible\r\n✅ Wi-Fi rápido\r\n✅ Control incluido\r\n✅ Súper fácil de instalar\r\n💰 Precio: $690 pesos\r\n📍 Disponible en GPTRONICS – Electrónica, accesorios y más\r\n📍 Dirección: Zaragoza #152, Colonia Centro, a media cuadra del Teatro\r\n📞 Teléfono: 311 268 7341\r\n📲 Pregunta por existencia o ven por el tuyo hoy mismo', NULL, '2025-06-20 04:11:56', '2025-06-20 04:11:56', 0, NULL),
(13, 7, NULL, '🔊🎁 ¡Papá merece lo mejor este Día del Padre! 🎁🔊\r\nSorpréndelo con bocinas Velikka, donde la potencia se encuentra con el estilo.\r\n🎶 Porque su música también cuenta su historia.\r\n💪 Calidad superior, sonido envolvente y diseño elegante…\r\nJusto lo que necesita ese gran hombre que siempre está ahí para ti.\r\n🎉 En GPtronics tenemos las mejores opciones para consentir a papá.\r\n📍 Visítanos o haz tu pedido por WhatsApp\r\n📅 Promociones especiales solo por tiempo limitado', NULL, '2025-06-20 04:13:53', '2025-06-20 04:16:06', 1, 1),
(14, NULL, 4, '¡La hamburguesa perfecta está aquí!\r\nSpider-Wings te ofrece las mejores hamburguesas al carbón, hechas con amor y dedicación.\r\n¡Pide ahora y disfruta!\r\n323 144 4895', NULL, '2025-06-20 04:17:52', '2025-06-20 04:17:52', 0, NULL),
(15, NULL, 1, 'Ese error indica que Angular no reconoce la directiva [formGroup] porque no importaste el módulo necesario para formularios reactivos.\r\n\r\nPara solucionarlo, sigue estos pasos:\r\n\r\nImporta ReactiveFormsModule en el módulo donde está declarado el componente VistaPrincipalComponent. Por ejemplo, si está en app.module.ts o en un módulo específico, agrega:', NULL, '2025-06-20 21:40:56', '2025-06-20 21:40:56', 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes_publicaciones`
--

CREATE TABLE `reportes_publicaciones` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `publicacion_id` bigint(20) UNSIGNED NOT NULL,
  `comentario` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `visto` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `reportes_publicaciones`
--

INSERT INTO `reportes_publicaciones` (`id`, `user_id`, `publicacion_id`, `comentario`, `created_at`, `updated_at`, `visto`) VALUES
(4, 4, 14, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '2025-06-20 04:23:02', '2025-06-20 04:23:17', 1),
(5, 4, 13, 'dbdvsvsdvsdv', '2025-06-20 04:28:16', '2025-06-20 04:28:42', 1),
(6, 3, 14, 'dbsdgsdgdgvdsvds', '2025-06-20 16:47:58', '2025-06-20 16:47:58', 0),
(8, 1, 14, 'xc zd', '2025-06-20 22:01:50', '2025-06-20 22:01:50', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'SuperAdmin', 'Rol con todos los permisos del sistema', '2025-06-11 07:54:55', '2025-06-11 07:54:55'),
(2, 'Emprendedor', 'Dueño del negocio', '2025-06-11 07:56:11', '2025-06-11 07:56:11'),
(3, 'Trabajador', 'Ayudante del emprendedor', '2025-06-11 07:56:29', '2025-06-11 07:56:29'),
(4, 'Cliente', 'Este usuario solo puede comprar y pedir cosas', '2025-06-19 04:50:31', '2025-06-19 04:50:31'),
(5, 'Repartidor', 'Este usuario solo puede recibir pedidos y comprar por su cuenta como cliente', '2025-06-19 04:51:23', '2025-06-19 04:51:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('SCQXUE2sCHHMj73pBYa3Mmi2ads7SFDApgkV1QTC', 1, '127.0.0.1', 'PostmanRuntime/7.44.0', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiYkozVVdzaTZCQnY2ZzBUVElhN0hZZWVYTmt4N29MVk92RDJ3M3hvNyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MjE6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMCI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fX0=', 1750218253);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `foto_perfil`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'SuperAdmin', 'SuperAdmin@gmail.com', '2025-06-05 07:42:53', '$2y$12$SEsEqpXllabWLrg5VnzTy.fY4slJYSGO.k04i/X/63vZgyeLYR8ii', 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750038232/aplicacion_a_medida/SuperAdmin%40gmail.com/rvhbl2tonclulrxjwvg7.jpg', 'oE6xHK', '2025-06-11 07:54:55', '2025-06-16 06:24:41'),
(3, 'Irving Armando Martinez Torres', 'Irtormxd@gmail.com', '2025-06-20 16:44:56', '$2y$12$uH3pwTkqZ02.gVGwqtH3iuSaMjAxuFKXOCFw.pzXobg31GmxF1a1m', NULL, NULL, '2025-06-11 09:38:23', '2025-06-20 16:44:56'),
(4, 'Yahir Nava Gandara', 'yahirna17@gmail.com', '2025-06-16 07:16:01', '$2y$12$IkizemMHTzwAGoox/xNddOSNRCBupj5qnYEphXBR9iAvBf.FqrKiq', 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750099832/aplicacion_a_medida/yahirna17%40gmail.com/lccehlnonmuukuodq3t9.jpg', 'lFXhld', '2025-06-16 03:31:01', '2025-06-16 18:50:32'),
(5, 'Anthony Joseph Lamas Castillo', 'anthony21.lamas@gmail.com', NULL, '$2y$12$RqmMV1/9C25UFSUaBCiJi.ZhSPL3r.MPGMKZinkQAYY.QAvL4lOYS', NULL, 'aKEPbu', '2025-06-16 05:15:10', '2025-06-16 05:16:06'),
(6, 'Alexis Arath Alatorre Delgadillo', 'alexisaalatorred@gmail.com', NULL, '$2y$12$Ia0snv1iaIoJ/pPMWlhXsu91vyewCGvUnOjgyMfKsPCx9r3yS71my', NULL, 'sL3gCJ', '2025-06-16 05:15:43', '2025-06-16 05:16:11'),
(7, 'Daniel Castañeda Peña', 'brayan@gmail.com', '2025-06-20 02:52:52', '$2y$12$pnRXjA1KX6oI78p0n2wmQuOeV4kq8Fq6ANw155V1HE.j7CswigOIG', 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750388209/aplicacion_a_medida/brayan%40gmail.com/i6tyc81utuor5shiuii8.jpg', NULL, '2025-06-20 02:51:48', '2025-06-20 02:56:50'),
(8, 'Luis Fernando Gomez Paz', 'luisgokufer@gmail.com', '2025-06-20 03:17:36', '$2y$12$N.zkVPlcwlnPLrtMClda4.Ycf9D0HJOVYNMu1MMeMuU7uJ39En1Ky', 'https://res.cloudinary.com/du6n25rsz/image/upload/v1750389480/aplicacion_a_medida/luisgokufer%40gmail.com/ccouqyqzrtkqywfp3nt3.jpg', NULL, '2025-06-20 03:03:00', '2025-06-20 03:18:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_role`
--

CREATE TABLE `user_role` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user_role`
--

INSERT INTO `user_role` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-06-11 07:54:55', '2025-06-11 07:54:55'),
(3, 3, 2, NULL, NULL),
(4, 4, 2, NULL, NULL),
(5, 5, 2, NULL, NULL),
(6, 6, 2, NULL, NULL),
(7, 7, 2, NULL, NULL),
(8, 8, 2, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categoria_negocio`
--
ALTER TABLE `categoria_negocio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_negocio_negocio_id_foreign` (`negocio_id`),
  ADD KEY `categoria_negocio_categoria_id_foreign` (`categoria_id`);

--
-- Indices de la tabla `categoria_publicacion`
--
ALTER TABLE `categoria_publicacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_publicacion_publicacion_id_foreign` (`publicacion_id`),
  ADD KEY `categoria_publicacion_categoria_id_foreign` (`categoria_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `horarios_negocio`
--
ALTER TABLE `horarios_negocio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `horarios_negocio_negocio_id_foreign` (`negocio_id`);

--
-- Indices de la tabla `imagenes_publicacion`
--
ALTER TABLE `imagenes_publicacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `imagenes_publicacion_publicacion_id_foreign` (`publicacion_id`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocios_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `negocio_correos`
--
ALTER TABLE `negocio_correos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_correos_negocio_id_foreign` (`negocio_id`);

--
-- Indices de la tabla `negocio_redes_sociales`
--
ALTER TABLE `negocio_redes_sociales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_redes_sociales_negocio_id_foreign` (`negocio_id`);

--
-- Indices de la tabla `negocio_telefonos`
--
ALTER TABLE `negocio_telefonos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `negocio_telefonos_negocio_id_foreign` (`negocio_id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `publicaciones_negocio_id_foreign` (`negocio_id`),
  ADD KEY `publicaciones_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `reportes_publicaciones`
--
ALTER TABLE `reportes_publicaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reportes_publicaciones_user_id_foreign` (`user_id`),
  ADD KEY `reportes_publicaciones_publicacion_id_foreign` (`publicacion_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indices de la tabla `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_role_user_id_foreign` (`user_id`),
  ADD KEY `user_role_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `categoria_negocio`
--
ALTER TABLE `categoria_negocio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categoria_publicacion`
--
ALTER TABLE `categoria_publicacion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `horarios_negocio`
--
ALTER TABLE `horarios_negocio`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT de la tabla `imagenes_publicacion`
--
ALTER TABLE `imagenes_publicacion`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `negocios`
--
ALTER TABLE `negocios`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `negocio_correos`
--
ALTER TABLE `negocio_correos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `negocio_redes_sociales`
--
ALTER TABLE `negocio_redes_sociales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `negocio_telefonos`
--
ALTER TABLE `negocio_telefonos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `reportes_publicaciones`
--
ALTER TABLE `reportes_publicaciones`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categoria_negocio`
--
ALTER TABLE `categoria_negocio`
  ADD CONSTRAINT `categoria_negocio_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categoria_negocio_negocio_id_foreign` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `categoria_publicacion`
--
ALTER TABLE `categoria_publicacion`
  ADD CONSTRAINT `categoria_publicacion_categoria_id_foreign` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `categoria_publicacion_publicacion_id_foreign` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `horarios_negocio`
--
ALTER TABLE `horarios_negocio`
  ADD CONSTRAINT `horarios_negocio_negocio_id_foreign` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes_publicacion`
--
ALTER TABLE `imagenes_publicacion`
  ADD CONSTRAINT `imagenes_publicacion_publicacion_id_foreign` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `negocios`
--
ALTER TABLE `negocios`
  ADD CONSTRAINT `negocios_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `negocio_correos`
--
ALTER TABLE `negocio_correos`
  ADD CONSTRAINT `negocio_correos_negocio_id_foreign` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `negocio_redes_sociales`
--
ALTER TABLE `negocio_redes_sociales`
  ADD CONSTRAINT `negocio_redes_sociales_negocio_id_foreign` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `negocio_telefonos`
--
ALTER TABLE `negocio_telefonos`
  ADD CONSTRAINT `negocio_telefonos_negocio_id_foreign` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `publicaciones`
--
ALTER TABLE `publicaciones`
  ADD CONSTRAINT `publicaciones_negocio_id_foreign` FOREIGN KEY (`negocio_id`) REFERENCES `negocios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `publicaciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reportes_publicaciones`
--
ALTER TABLE `reportes_publicaciones`
  ADD CONSTRAINT `reportes_publicaciones_publicacion_id_foreign` FOREIGN KEY (`publicacion_id`) REFERENCES `publicaciones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reportes_publicaciones_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `user_role_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_role_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
