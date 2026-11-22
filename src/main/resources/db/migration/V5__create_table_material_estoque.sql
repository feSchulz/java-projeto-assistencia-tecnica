-- V5  Tabela MaterialEstoque
CREATE TABLE material_estoque (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(500) NOT NULL,
    marca_id BIGINT NOT NULL,
    modelo_id BIGINT NOT NULL,
    quantidade_estoque BIGINT NOT NULL,
    valor_unitario DECIMAL(12,2) NOT NULL,
    status TINYINT NOT NULL,
    CONSTRAINT fk_material_marca FOREIGN KEY (marca_id) REFERENCES marca (id),
    CONSTRAINT fk_material_modelo FOREIGN KEY (modelo_id) REFERENCES modelo (id)
);
