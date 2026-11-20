-- Tabela Estado
CREATE TABLE estado (
                        id BIGINT IDENTITY(1,1) PRIMARY KEY,
                        ibge INT,
                        sigla VARCHAR(2) NOT NULL UNIQUE,
                        nome VARCHAR(100) NOT NULL
);

-- Tabela Cidade
CREATE TABLE cidade (
                        id BIGINT IDENTITY(1,1) PRIMARY KEY,
                        ibge INT NOT NULL UNIQUE,
                        nome VARCHAR(255) NOT NULL,
                        estado_id BIGINT NOT NULL,
                        CONSTRAINT fk_estado FOREIGN KEY (estado_id) REFERENCES estado (id) ON DELETE CASCADE
);
