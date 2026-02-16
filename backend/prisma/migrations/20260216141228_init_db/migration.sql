-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `cargo` ENUM('GESTOR', 'COLABORADOR') NOT NULL DEFAULT 'COLABORADOR',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(200) NOT NULL,
    `descricao` TEXT NULL,
    `status` ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA') NOT NULL DEFAULT 'PENDENTE',
    `prioridade` ENUM('BAIXA', 'MEDIA', 'ALTA') NOT NULL DEFAULT 'MEDIA',
    `prazo` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
