-- =========================
-- ESTADOS
-- =========================
INSERT INTO estado (ibge, sigla, nome) VALUES (11, 'RO', 'Rondônia');
INSERT INTO estado (ibge, sigla, nome) VALUES (12, 'AC', 'Acre');
INSERT INTO estado (ibge, sigla, nome) VALUES (13, 'AM', 'Amazonas');
INSERT INTO estado (ibge, sigla, nome) VALUES (14, 'RR', 'Roraima');
INSERT INTO estado (ibge, sigla, nome) VALUES (15, 'PA', 'Pará');
INSERT INTO estado (ibge, sigla, nome) VALUES (16, 'AP', 'Amapá');
INSERT INTO estado (ibge, sigla, nome) VALUES (17, 'TO', 'Tocantins');
INSERT INTO estado (ibge, sigla, nome) VALUES (21, 'MA', 'Maranhão');
INSERT INTO estado (ibge, sigla, nome) VALUES (22, 'PI', 'Piauí');
INSERT INTO estado (ibge, sigla, nome) VALUES (23, 'CE', 'Ceará');
INSERT INTO estado (ibge, sigla, nome) VALUES (24, 'RN', 'Rio Grande do Norte');
INSERT INTO estado (ibge, sigla, nome) VALUES (25, 'PB', 'Paraíba');
INSERT INTO estado (ibge, sigla, nome) VALUES (26, 'PE', 'Pernambuco');
INSERT INTO estado (ibge, sigla, nome) VALUES (27, 'AL', 'Alagoas');
INSERT INTO estado (ibge, sigla, nome) VALUES (28, 'SE', 'Sergipe');
INSERT INTO estado (ibge, sigla, nome) VALUES (29, 'BA', 'Bahia');
INSERT INTO estado (ibge, sigla, nome) VALUES (31, 'MG', 'Minas Gerais');
INSERT INTO estado (ibge, sigla, nome) VALUES (32, 'ES', 'Espírito Santo');
INSERT INTO estado (ibge, sigla, nome) VALUES (33, 'RJ', 'Rio de Janeiro');
INSERT INTO estado (ibge, sigla, nome) VALUES (35, 'SP', 'São Paulo');
INSERT INTO estado (ibge, sigla, nome) VALUES (41, 'PR', 'Paraná');
INSERT INTO estado (ibge, sigla, nome) VALUES (42, 'SC', 'Santa Catarina');
INSERT INTO estado (ibge, sigla, nome) VALUES (43, 'RS', 'Rio Grande do Sul');
INSERT INTO estado (ibge, sigla, nome) VALUES (50, 'MS', 'Mato Grosso do Sul');
INSERT INTO estado (ibge, sigla, nome) VALUES (51, 'MT', 'Mato Grosso');
INSERT INTO estado (ibge, sigla, nome) VALUES (52, 'GO', 'Goiás');
INSERT INTO estado (ibge, sigla, nome) VALUES (53, 'DF', 'Distrito Federal');

-- =========================
-- CIDADES (5 por estado)
-- =========================

-- Rondônia (RO)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1100205, 'Porto Velho', (SELECT id FROM estado WHERE sigla='RO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1100304, 'Guajará-Mirim', (SELECT id FROM estado WHERE sigla='RO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1100452, 'Ji-Paraná', (SELECT id FROM estado WHERE sigla='RO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1100601, 'Cacoal', (SELECT id FROM estado WHERE sigla='RO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1100700, 'Ariquemes', (SELECT id FROM estado WHERE sigla='RO'));

-- Acre (AC)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1200401, 'Rio Branco', (SELECT id FROM estado WHERE sigla='AC'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1200609, 'Cruzeiro do Sul', (SELECT id FROM estado WHERE sigla='AC'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1200807, 'Sena Madureira', (SELECT id FROM estado WHERE sigla='AC'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1200138, 'Acrelândia', (SELECT id FROM estado WHERE sigla='AC'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1200252, 'Brasiléia', (SELECT id FROM estado WHERE sigla='AC'));

-- Amazonas (AM)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1302603, 'Manaus', (SELECT id FROM estado WHERE sigla='AM'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1301852, 'Itacoatiara', (SELECT id FROM estado WHERE sigla='AM'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1303403, 'Parintins', (SELECT id FROM estado WHERE sigla='AM'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1304062, 'Tabatinga', (SELECT id FROM estado WHERE sigla='AM'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1303205, 'Manacapuru', (SELECT id FROM estado WHERE sigla='AM'));

-- Roraima (RR)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1400100, 'Boa Vista', (SELECT id FROM estado WHERE sigla='RR'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1400209, 'Caracaraí', (SELECT id FROM estado WHERE sigla='RR'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1400308, 'Rorainópolis', (SELECT id FROM estado WHERE sigla='RR'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1400407, 'Mucajaí', (SELECT id FROM estado WHERE sigla='RR'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1400506, 'Alto Alegre', (SELECT id FROM estado WHERE sigla='RR'));

-- Pará (PA)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1501402, 'Belém', (SELECT id FROM estado WHERE sigla='PA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1500800, 'Ananindeua', (SELECT id FROM estado WHERE sigla='PA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1501501, 'Marabá', (SELECT id FROM estado WHERE sigla='PA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1504208, 'Santarém', (SELECT id FROM estado WHERE sigla='PA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1500602, 'Altamira', (SELECT id FROM estado WHERE sigla='PA'));

-- Amapá (AP)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1600303, 'Macapá', (SELECT id FROM estado WHERE sigla='AP'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1600600, 'Santana', (SELECT id FROM estado WHERE sigla='AP'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1600204, 'Laranjal do Jari', (SELECT id FROM estado WHERE sigla='AP'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1600501, 'Oiapoque', (SELECT id FROM estado WHERE sigla='AP'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1600402, 'Mazagão', (SELECT id FROM estado WHERE sigla='AP'));

-- Tocantins (TO)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1721000, 'Palmas', (SELECT id FROM estado WHERE sigla='TO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1718204, 'Araguaína', (SELECT id FROM estado WHERE sigla='TO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1702109, 'Gurupi', (SELECT id FROM estado WHERE sigla='TO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1707009, 'Porto Nacional', (SELECT id FROM estado WHERE sigla='TO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (1709005, 'Paraíso do Tocantins', (SELECT id FROM estado WHERE sigla='TO'));

-- Maranhão (MA)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2111300, 'São Luís', (SELECT id FROM estado WHERE sigla='MA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2105302, 'Imperatriz', (SELECT id FROM estado WHERE sigla='MA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2103000, 'Caxias', (SELECT id FROM estado WHERE sigla='MA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2107505, 'Timon', (SELECT id FROM estado WHERE sigla='MA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2100055, 'Açailândia', (SELECT id FROM estado WHERE sigla='MA'));

-- Piauí (PI)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2211001, 'Teresina', (SELECT id FROM estado WHERE sigla='PI'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2207702, 'Parnaíba', (SELECT id FROM estado WHERE sigla='PI'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2208007, 'Picos', (SELECT id FROM estado WHERE sigla='PI'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2202909, 'Floriano', (SELECT id FROM estado WHERE sigla='PI'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2204558, 'José de Freitas', (SELECT id FROM estado WHERE sigla='PI'));

-- Ceará (CE)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2304400, 'Fortaleza', (SELECT id FROM estado WHERE sigla='CE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2307650, 'Juazeiro do Norte', (SELECT id FROM estado WHERE sigla='CE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2305506, 'Sobral', (SELECT id FROM estado WHERE sigla='CE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2307304, 'Maracanaú', (SELECT id FROM estado WHERE sigla='CE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2306405, 'Iguatu', (SELECT id FROM estado WHERE sigla='CE'));

-- Rio Grande do Norte (RN)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2408102, 'Natal', (SELECT id FROM estado WHERE sigla='RN'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2403251, 'Mossoró', (SELECT id FROM estado WHERE sigla='RN'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2408003, 'Parnamirim', (SELECT id FROM estado WHERE sigla='RN'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2403103, 'Macaíba', (SELECT id FROM estado WHERE sigla='RN'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2401206, 'Ceará-Mirim', (SELECT id FROM estado WHERE sigla='RN'));

-- Paraíba (PB)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2507507, 'João Pessoa', (SELECT id FROM estado WHERE sigla='PB'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2504009, 'Campina Grande', (SELECT id FROM estado WHERE sigla='PB'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2501807, 'Bayeux', (SELECT id FROM estado WHERE sigla='PB'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2503209, 'Cabedelo', (SELECT id FROM estado WHERE sigla='PB'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2503704, 'Cajazeiras', (SELECT id FROM estado WHERE sigla='PB'));

-- Pernambuco (PE)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2611606, 'Recife', (SELECT id FROM estado WHERE sigla='PE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2607901, 'Olinda', (SELECT id FROM estado WHERE sigla='PE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2604106, 'Caruaru', (SELECT id FROM estado WHERE sigla='PE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2606804, 'Jaboatão dos Guararapes', (SELECT id FROM estado WHERE sigla='PE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2609600, 'Petrolina', (SELECT id FROM estado WHERE sigla='PE'));

-- Alagoas (AL)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2704302, 'Maceió', (SELECT id FROM estado WHERE sigla='AL'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2701506, 'Arapiraca', (SELECT id FROM estado WHERE sigla='AL'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2707701, 'Palmeira dos Índios', (SELECT id FROM estado WHERE sigla='AL'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2704708, 'Maragogi', (SELECT id FROM estado WHERE sigla='AL'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2708600, 'São Miguel dos Campos', (SELECT id FROM estado WHERE sigla='AL'));

-- Sergipe (SE)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2800308, 'Aracaju', (SELECT id FROM estado WHERE sigla='SE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2804805, 'Nossa Senhora do Socorro', (SELECT id FROM estado WHERE sigla='SE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2800605, 'Barra dos Coqueiros', (SELECT id FROM estado WHERE sigla='SE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2804003, 'Lagarto', (SELECT id FROM estado WHERE sigla='SE'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2802908, 'Itabaiana', (SELECT id FROM estado WHERE sigla='SE'));

-- Bahia (BA)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2927408, 'Salvador', (SELECT id FROM estado WHERE sigla='BA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2903201, 'Feira de Santana', (SELECT id FROM estado WHERE sigla='BA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2910800, 'Ilhéus', (SELECT id FROM estado WHERE sigla='BA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2914802, 'Juazeiro', (SELECT id FROM estado WHERE sigla='BA'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (2900709, 'Barreiras', (SELECT id FROM estado WHERE sigla='BA'));

-- Minas Gerais (MG)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3106200, 'Belo Horizonte', (SELECT id FROM estado WHERE sigla='MG'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3101508, 'Uberlândia', (SELECT id FROM estado WHERE sigla='MG'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3103504, 'Juiz de Fora', (SELECT id FROM estado WHERE sigla='MG'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3104205, 'Montes Claros', (SELECT id FROM estado WHERE sigla='MG'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3105608, 'Betim', (SELECT id FROM estado WHERE sigla='MG'));

-- Espírito Santo (ES)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3205309, 'Vitória', (SELECT id FROM estado WHERE sigla='ES'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3201209, 'Cariacica', (SELECT id FROM estado WHERE sigla='ES'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3205101, 'Vila Velha', (SELECT id FROM estado WHERE sigla='ES'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3203908, 'Serra', (SELECT id FROM estado WHERE sigla='ES'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3201308, 'Colatina', (SELECT id FROM estado WHERE sigla='ES'));

-- Rio de Janeiro (RJ)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3304557, 'Rio de Janeiro', (SELECT id FROM estado WHERE sigla='RJ'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3301702, 'Niterói', (SELECT id FROM estado WHERE sigla='RJ'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3301001, 'Duque de Caxias', (SELECT id FROM estado WHERE sigla='RJ'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3303500, 'Nova Iguaçu', (SELECT id FROM estado WHERE sigla='RJ'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3300409, 'Campos dos Goytacazes', (SELECT id FROM estado WHERE sigla='RJ'));

-- São Paulo (SP)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3550308, 'São Paulo', (SELECT id FROM estado WHERE sigla='SP'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3548708, 'Santos', (SELECT id FROM estado WHERE sigla='SP'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3549902, 'São Bernardo do Campo', (SELECT id FROM estado WHERE sigla='SP'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3547809, 'Ribeirão Preto', (SELECT id FROM estado WHERE sigla='SP'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (3543402, 'Osasco', (SELECT id FROM estado WHERE sigla='SP'));

-- Paraná (PR)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4106902, 'Curitiba', (SELECT id FROM estado WHERE sigla='PR'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4105805, 'Londrina', (SELECT id FROM estado WHERE sigla='PR'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4104303, 'Maringá', (SELECT id FROM estado WHERE sigla='PR'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4109401, 'Ponta Grossa', (SELECT id FROM estado WHERE sigla='PR'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4108304, 'Cascavel', (SELECT id FROM estado WHERE sigla='PR'));

-- Santa Catarina (SC)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4205407, 'Florianópolis', (SELECT id FROM estado WHERE sigla='SC'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4209102, 'Joinville', (SELECT id FROM estado WHERE sigla='SC'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4202008, 'Blumenau', (SELECT id FROM estado WHERE sigla='SC'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4216602, 'São José', (SELECT id FROM estado WHERE sigla='SC'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4201307, 'Balneário Camboriú', (SELECT id FROM estado WHERE sigla='SC'));

-- Rio Grande do Sul (RS)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4314902, 'Porto Alegre', (SELECT id FROM estado WHERE sigla='RS'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4305108, 'Caxias do Sul', (SELECT id FROM estado WHERE sigla='RS'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4313409, 'Pelotas', (SELECT id FROM estado WHERE sigla='RS'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4307005, 'Santa Maria', (SELECT id FROM estado WHERE sigla='RS'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (4318705, 'Viamão', (SELECT id FROM estado WHERE sigla='RS'));

-- Mato Grosso do Sul (MS)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5002704, 'Campo Grande', (SELECT id FROM estado WHERE sigla='MS'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5003207, 'Dourados', (SELECT id FROM estado WHERE sigla='MS'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5003702, 'Três Lagoas', (SELECT id FROM estado WHERE sigla='MS'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5008305, 'Ponta Porã', (SELECT id FROM estado WHERE sigla='MS'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5004007, 'Corumbá', (SELECT id FROM estado WHERE sigla='MS'));

-- Mato Grosso (MT)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5103403, 'Cuiabá', (SELECT id FROM estado WHERE sigla='MT'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5107908, 'Várzea Grande', (SELECT id FROM estado WHERE sigla='MT'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5105257, 'Rondonópolis', (SELECT id FROM estado WHERE sigla='MT'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5108401, 'Sinop', (SELECT id FROM estado WHERE sigla='MT'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5106207, 'Tangará da Serra', (SELECT id FROM estado WHERE sigla='MT'));

-- Goiás (GO)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5208707, 'Goiânia', (SELECT id FROM estado WHERE sigla='GO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5212501, 'Anápolis', (SELECT id FROM estado WHERE sigla='GO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5218805, 'Rio Verde', (SELECT id FROM estado WHERE sigla='GO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5208004, 'Aparecida de Goiânia', (SELECT id FROM estado WHERE sigla='GO'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5201108, 'Águas Lindas de Goiás', (SELECT id FROM estado WHERE sigla='GO'));

-- Distrito Federal (DF)
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5300108, 'Brasília', (SELECT id FROM estado WHERE sigla='DF'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5300207, 'Gama', (SELECT id FROM estado WHERE sigla='DF'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5300306, 'Taguatinga', (SELECT id FROM estado WHERE sigla='DF'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5300405, 'Ceilândia', (SELECT id FROM estado WHERE sigla='DF'));
INSERT INTO cidade (ibge, nome, estado_id) VALUES (5300504, 'Planaltina', (SELECT id FROM estado WHERE sigla='DF'));