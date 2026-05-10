CREATE TABLE `coredes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`regiao_funcional_id` int NOT NULL,
	`descricao` text,
	CONSTRAINT `coredes_id` PRIMARY KEY(`id`),
	CONSTRAINT `coredes_nome_unique` UNIQUE(`nome`)
);
--> statement-breakpoint
CREATE TABLE `idese` (
	`id` int AUTO_INCREMENT NOT NULL,
	`municipio_id` int NOT NULL,
	`ano` year NOT NULL,
	`valor` decimal(5,3),
	`fonte` varchar(255),
	CONSTRAINT `idese_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `idsc` (
	`id` int AUTO_INCREMENT NOT NULL,
	`municipio_id` int NOT NULL,
	`ano` year NOT NULL,
	`pontuacao` decimal(5,2),
	`classificacao` varchar(50),
	`fonte` varchar(255),
	CONSTRAINT `idsc_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `igm` (
	`id` int AUTO_INCREMENT NOT NULL,
	`municipio_id` int NOT NULL,
	`ano` year NOT NULL,
	`dimensao1` decimal(5,3),
	`dimensao2` decimal(5,3),
	`dimensao3` decimal(5,3),
	`indice_consolidado` decimal(5,3),
	`fonte` varchar(255),
	CONSTRAINT `igm_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `municipios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo_ibge` int NOT NULL,
	`nome` varchar(255) NOT NULL,
	`corede_id` int NOT NULL,
	`regiao_funcional_id` int NOT NULL,
	`latitude` decimal(10,6),
	`longitude` decimal(10,6),
	CONSTRAINT `municipios_id` PRIMARY KEY(`id`),
	CONSTRAINT `municipios_codigo_ibge_unique` UNIQUE(`codigo_ibge`)
);
--> statement-breakpoint
CREATE TABLE `regioes_funcionais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(10) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	CONSTRAINT `regioes_funcionais_id` PRIMARY KEY(`id`),
	CONSTRAINT `regioes_funcionais_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `violencia_geral` (
	`id` int AUTO_INCREMENT NOT NULL,
	`municipio_id` int NOT NULL,
	`ano` year NOT NULL,
	`cvli` int,
	`homicidios` int,
	`latrocinio` int,
	`lesao_corporal_seguida` int,
	`estupro` int,
	`outros_indicadores` text,
	`fonte` varchar(255),
	CONSTRAINT `violencia_geral_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `violencia_mulher` (
	`id` int AUTO_INCREMENT NOT NULL,
	`municipio_id` int NOT NULL,
	`ano` year NOT NULL,
	`violencia_fisica` int,
	`violencia_emocional` int,
	`violencia_sexual` int,
	`violencia_patrimonial` int,
	`violencia_moral` int,
	`femicidio` int,
	`outros_indicadores` text,
	`fonte` varchar(255),
	CONSTRAINT `violencia_mulher_id` PRIMARY KEY(`id`)
);
