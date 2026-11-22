-- Inserindo Marcas
INSERT INTO marca (nome) VALUES
                             ('Samsung'),
                             ('LG'),
                             ('Sony'),
                             ('Philips'),
                             ('Electrolux'),
                             ('Brastemp'),
                             ('Panasonic'),
                             ('Dell'),
                             ('Apple'),
                             ('Lenovo'),
                             ('Xiaomi');

-- Samsung
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Galaxy S23', (SELECT id FROM marca WHERE nome='Samsung')),
                                        ('Galaxy Tab S9', (SELECT id FROM marca WHERE nome='Samsung')),
                                        ('Smart TV QLED', (SELECT id FROM marca WHERE nome='Samsung')),
                                        ('Refrigerador Frost Free', (SELECT id FROM marca WHERE nome='Samsung')),
                                        ('Máquina de Lavar 11kg', (SELECT id FROM marca WHERE nome='Samsung'));

-- LG
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Smart TV OLED', (SELECT id FROM marca WHERE nome='LG')),
                                        ('Refrigerador InstaView', (SELECT id FROM marca WHERE nome='LG')),
                                        ('Ar Condicionado Dual Inverter', (SELECT id FROM marca WHERE nome='LG')),
                                        ('Máquina Lava e Seca', (SELECT id FROM marca WHERE nome='LG')),
                                        ('Monitor UltraWide', (SELECT id FROM marca WHERE nome='LG'));

-- Sony
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('PlayStation 5', (SELECT id FROM marca WHERE nome='Sony')),
                                        ('Smart TV Bravia', (SELECT id FROM marca WHERE nome='Sony')),
                                        ('Caixa de Som Bluetooth', (SELECT id FROM marca WHERE nome='Sony')),
                                        ('Câmera Alpha 7', (SELECT id FROM marca WHERE nome='Sony')),
                                        ('Fones WH-1000XM5', (SELECT id FROM marca WHERE nome='Sony'));

-- Philips
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Airfryer', (SELECT id FROM marca WHERE nome='Philips')),
                                        ('Smart TV Ambilight', (SELECT id FROM marca WHERE nome='Philips')),
                                        ('Barbeador Elétrico', (SELECT id FROM marca WHERE nome='Philips')),
                                        ('Liquidificador Walita', (SELECT id FROM marca WHERE nome='Philips')),
                                        ('Monitor Gamer', (SELECT id FROM marca WHERE nome='Philips'));

-- Electrolux
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Geladeira Frost Free', (SELECT id FROM marca WHERE nome='Electrolux')),
                                        ('Fogão 5 Bocas', (SELECT id FROM marca WHERE nome='Electrolux')),
                                        ('Máquina de Lavar 12kg', (SELECT id FROM marca WHERE nome='Electrolux')),
                                        ('Aspirador de Pó', (SELECT id FROM marca WHERE nome='Electrolux')),
                                        ('Micro-ondas 30L', (SELECT id FROM marca WHERE nome='Electrolux'));

-- Brastemp
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Geladeira Inverse', (SELECT id FROM marca WHERE nome='Brastemp')),
                                        ('Fogão 4 Bocas', (SELECT id FROM marca WHERE nome='Brastemp')),
                                        ('Máquina de Lavar 11kg', (SELECT id FROM marca WHERE nome='Brastemp')),
                                        ('Micro-ondas 25L', (SELECT id FROM marca WHERE nome='Brastemp')),
                                        ('Freezer Horizontal', (SELECT id FROM marca WHERE nome='Brastemp'));

-- Panasonic
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Smart TV 4K', (SELECT id FROM marca WHERE nome='Panasonic')),
                                        ('Micro-ondas 32L', (SELECT id FROM marca WHERE nome='Panasonic')),
                                        ('Câmera Lumix', (SELECT id FROM marca WHERE nome='Panasonic')),
                                        ('Telefone Sem Fio', (SELECT id FROM marca WHERE nome='Panasonic')),
                                        ('Aparelho de Som', (SELECT id FROM marca WHERE nome='Panasonic'));

-- Dell
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Notebook Inspiron', (SELECT id FROM marca WHERE nome='Dell')),
                                        ('Notebook XPS', (SELECT id FROM marca WHERE nome='Dell')),
                                        ('Monitor Ultrasharp', (SELECT id FROM marca WHERE nome='Dell')),
                                        ('Servidor PowerEdge', (SELECT id FROM marca WHERE nome='Dell')),
                                        ('Desktop Optiplex', (SELECT id FROM marca WHERE nome='Dell'));

-- Apple
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('iPhone 15', (SELECT id FROM marca WHERE nome='Apple')),
                                        ('iPad Pro', (SELECT id FROM marca WHERE nome='Apple')),
                                        ('MacBook Air', (SELECT id FROM marca WHERE nome='Apple')),
                                        ('Apple Watch Series 9', (SELECT id FROM marca WHERE nome='Apple')),
                                        ('AirPods Pro', (SELECT id FROM marca WHERE nome='Apple'));

-- Lenovo
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Notebook ThinkPad', (SELECT id FROM marca WHERE nome='Lenovo')),
                                        ('Notebook Yoga', (SELECT id FROM marca WHERE nome='Lenovo')),
                                        ('Monitor ThinkVision', (SELECT id FROM marca WHERE nome='Lenovo')),
                                        ('Tablet M10', (SELECT id FROM marca WHERE nome='Lenovo')),
                                        ('Desktop Legion', (SELECT id FROM marca WHERE nome='Lenovo'));
-- Xiaomi
INSERT INTO modelo (nome, marca_id) VALUES
                                        ('Redmi Note 13', (SELECT id FROM marca WHERE nome='Xiaomi')),
                                        ('Mi TV 4S', (SELECT id FROM marca WHERE nome='Xiaomi')),
                                        ('Mi Band 8', (SELECT id FROM marca WHERE nome='Xiaomi')),
                                        ('Aspirador Robô Mi Robot', (SELECT id FROM marca WHERE nome='Xiaomi')),
                                        ('Purificador de Ar Mi Air', (SELECT id FROM marca WHERE nome='Xiaomi'));
