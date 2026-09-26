-- V3  Tabela Marca
CREATE TABLE marca (
                       id BIGINT IDENTITY(1,1) PRIMARY KEY,
                       nome VARCHAR(255) NOT NULL UNIQUE
);

-- Tabela Modelo
CREATE TABLE modelo (
                        id BIGINT IDENTITY(1,1) PRIMARY KEY,
                        nome VARCHAR(255) NOT NULL,
                        marca_id BIGINT NOT NULL,
                        CONSTRAINT fk_marca FOREIGN KEY (marca_id) REFERENCES marca (id) ON DELETE CASCADE
);