-- ============================================================
-- STICKER SWAP APP — Seed de Datos
-- Álbum Panini FIFA World Cup 2026
-- 980 figuritas · 48 selecciones · Sección especial FWC
-- ============================================================

-- ============================================================
-- 1. ÁLBUM
-- ============================================================
INSERT INTO albums (id, name, publisher, year, total_stickers, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'FIFA World Cup 2026',
  'Panini',
  2026,
  980,
  true
);

-- Variable de referencia para el álbum (usada en todas las secciones)
DO $$
DECLARE
  album_id UUID := 'a0000000-0000-0000-0000-000000000001';
  sec_id   UUID;
BEGIN

-- ============================================================
-- 2. SECCIÓN ESPECIAL FWC (Introducción + Historia del Mundial)
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000001', album_id, 'FWC', 'Sección Especial', '🏆', '#C8A951', 1, 'special')
RETURNING id INTO sec_id;

INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id, '00',    'Panini Logo',                    0,  true,  'special'),
  (sec_id, 'FWC1',  'Official Emblem',                1,  true,  'special'),
  (sec_id, 'FWC2',  'Official Emblem',                2,  true,  'special'),
  (sec_id, 'FWC3',  'Official Mascots',               3,  true,  'special'),
  (sec_id, 'FWC4',  'Official Slogan',                4,  true,  'special'),
  (sec_id, 'FWC5',  'Official Ball',                  5,  true,  'special'),
  (sec_id, 'FWC6',  'Canada - Host Countries & Cities',6,  true,  'special'),
  (sec_id, 'FWC7',  'Mexico - Host Countries & Cities',7,  true,  'special'),
  (sec_id, 'FWC8',  'USA - Host Countries & Cities',  8,  true,  'special'),
  (sec_id, 'FWC9',  'Italy 1934 - FIFA Museum',       9,  true,  'history'),
  (sec_id, 'FWC10', 'Uruguay 1950 - FIFA Museum',     10, true,  'history'),
  (sec_id, 'FWC11', 'West Germany 1954 - FIFA Museum',11, true,  'history'),
  (sec_id, 'FWC12', 'Brazil 1962 - FIFA Museum',      12, true,  'history'),
  (sec_id, 'FWC13', 'West Germany 1974 - FIFA Museum',13, true,  'history'),
  (sec_id, 'FWC14', 'Argentina 1986 - FIFA Museum',   14, true,  'history'),
  (sec_id, 'FWC15', 'Brazil 1994 - FIFA Museum',      15, true,  'history'),
  (sec_id, 'FWC16', 'Brazil 2002 - FIFA Museum',      16, true,  'history'),
  (sec_id, 'FWC17', 'Italy 2006 - FIFA Museum',       17, true,  'history'),
  (sec_id, 'FWC18', 'Germany 2014 - FIFA Museum',     18, true,  'history'),
  (sec_id, 'FWC19', 'Argentina 2022 - FIFA Museum',   19, true,  'history');

-- ============================================================
-- MACRO para insertar cada equipo (20 figuritas por selección)
-- Patrón: XX1=Badge(FOIL), XX2-XX12=Players, XX13=Team Photo, XX14-XX20=Players
-- ============================================================

-- ============================================================
-- 3. MÉXICO (anfitrión)
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000002', album_id, 'MEX', 'México', '🇲🇽', '#006847', 2, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'MEX1','Team Logo - México',1,true,'badge'),
  (sec_id,'MEX2','Luis Malagón',2,false,'player'),
  (sec_id,'MEX3','Johan Vasquez',3,false,'player'),
  (sec_id,'MEX4','Jorge Sánchez',4,false,'player'),
  (sec_id,'MEX5','Cesar Montes',5,false,'player'),
  (sec_id,'MEX6','Jesus Gallardo',6,false,'player'),
  (sec_id,'MEX7','Israel Reyes',7,false,'player'),
  (sec_id,'MEX8','Diego Lainez',8,false,'player'),
  (sec_id,'MEX9','Carlos Rodriguez',9,false,'player'),
  (sec_id,'MEX10','Edson Alvarez',10,false,'player'),
  (sec_id,'MEX11','Orbelin Pineda',11,false,'player'),
  (sec_id,'MEX12','Marcel Ruiz',12,false,'player'),
  (sec_id,'MEX13','Team Photo - México',13,false,'team_photo'),
  (sec_id,'MEX14','Érick Sánchez',14,false,'player'),
  (sec_id,'MEX15','Hirving Lozano',15,false,'player'),
  (sec_id,'MEX16','Santiago Giménez',16,false,'player'),
  (sec_id,'MEX17','Raúl Jiménez',17,false,'player'),
  (sec_id,'MEX18','Alexis Vega',18,false,'player'),
  (sec_id,'MEX19','Roberto Alvarado',19,false,'player'),
  (sec_id,'MEX20','Cesar Huerta',20,false,'player');

-- ============================================================
-- 4. SUDÁFRICA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000003', album_id, 'RSA', 'Sudáfrica', '🇿🇦', '#007A4D', 3, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'RSA1','Team Logo - Sudáfrica',1,true,'badge'),
  (sec_id,'RSA2','Ronwen Williams',2,false,'player'),
  (sec_id,'RSA3','Sipho Chaine',3,false,'player'),
  (sec_id,'RSA4','Aubrey Modiba',4,false,'player'),
  (sec_id,'RSA5','Samukele Kabini',5,false,'player'),
  (sec_id,'RSA6','Mbekezeli Mbokazi',6,false,'player'),
  (sec_id,'RSA7','Khulumani Ndamane',7,false,'player'),
  (sec_id,'RSA8','Siyabonga Ngezana',8,false,'player'),
  (sec_id,'RSA9','Khuliso Mudau',9,false,'player'),
  (sec_id,'RSA10','Nkosinathi Sibisi',10,false,'player'),
  (sec_id,'RSA11','Teboho Mokoena',11,false,'player'),
  (sec_id,'RSA12','Thalente Mbatha',12,false,'player'),
  (sec_id,'RSA13','Team Photo - Sudáfrica',13,false,'team_photo'),
  (sec_id,'RSA14','Bathasi Aubaas',14,false,'player'),
  (sec_id,'RSA15','Yaya Sithole',15,false,'player'),
  (sec_id,'RSA16','Sipho Mbule',16,false,'player'),
  (sec_id,'RSA17','Lyle Foster',17,false,'player'),
  (sec_id,'RSA18','Iqraam Rayners',18,false,'player'),
  (sec_id,'RSA19','Mohau Nkota',19,false,'player'),
  (sec_id,'RSA20','Oswin Appollis',20,false,'player');

-- ============================================================
-- 5. COREA DEL SUR
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000004', album_id, 'KOR', 'Corea del Sur', '🇰🇷', '#CD2E3A', 4, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'KOR1','Team Logo - Corea del Sur',1,true,'badge'),
  (sec_id,'KOR2','Hyeon-woo Jo',2,false,'player'),
  (sec_id,'KOR3','Seung-Gyu Kim',3,false,'player'),
  (sec_id,'KOR4','Min-jae Kim',4,false,'player'),
  (sec_id,'KOR5','Yu-min Cho',5,false,'player'),
  (sec_id,'KOR6','Young-woo Seol',6,false,'player'),
  (sec_id,'KOR7','Han-beom Lee',7,false,'player'),
  (sec_id,'KOR8','Tae-seok Lee',8,false,'player'),
  (sec_id,'KOR9','Myung-jae Lee',9,false,'player'),
  (sec_id,'KOR10','Jae-sung Lee',10,false,'player'),
  (sec_id,'KOR11','In-beom Hwang',11,false,'player'),
  (sec_id,'KOR12','Kang-in Lee',12,false,'player'),
  (sec_id,'KOR13','Team Photo - Corea del Sur',13,false,'team_photo'),
  (sec_id,'KOR14','Seung-ho Paik',14,false,'player'),
  (sec_id,'KOR15','Jens Castrop',15,false,'player'),
  (sec_id,'KOR16','Dong-yeong Lee',16,false,'player'),
  (sec_id,'KOR17','Gue-sung Cho',17,false,'player'),
  (sec_id,'KOR18','Heung-min Son',18,false,'player'),
  (sec_id,'KOR19','Hee-chan Hwang',19,false,'player'),
  (sec_id,'KOR20','Hyeon-Gyu Oh',20,false,'player');

-- ============================================================
-- 6. CHEQUIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000005', album_id, 'CZE', 'Chequia', '🇨🇿', '#D7141A', 5, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'CZE1','Team Logo - Chequia',1,true,'badge'),
  (sec_id,'CZE2','Matej Kovar',2,false,'player'),
  (sec_id,'CZE3','Jindrich Stanek',3,false,'player'),
  (sec_id,'CZE4','Ladislav Krejci',4,false,'player'),
  (sec_id,'CZE5','Vladimir Coufal',5,false,'player'),
  (sec_id,'CZE6','Jaroslav Zeleny',6,false,'player'),
  (sec_id,'CZE7','Tomas Holes',7,false,'player'),
  (sec_id,'CZE8','David Zima',8,false,'player'),
  (sec_id,'CZE9','Michal Sadilek',9,false,'player'),
  (sec_id,'CZE10','Lukas Provod',10,false,'player'),
  (sec_id,'CZE11','Lukas Cerv',11,false,'player'),
  (sec_id,'CZE12','Tomas Soucek',12,false,'player'),
  (sec_id,'CZE13','Team Photo - Chequia',13,false,'team_photo'),
  (sec_id,'CZE14','Pavel Sulc',14,false,'player'),
  (sec_id,'CZE15','Matej Vydra',15,false,'player'),
  (sec_id,'CZE16','Vasil Kusej',16,false,'player'),
  (sec_id,'CZE17','Tomas Chory',17,false,'player'),
  (sec_id,'CZE18','Vaclav Cerny',18,false,'player'),
  (sec_id,'CZE19','Adam Hlozek',19,false,'player'),
  (sec_id,'CZE20','Patrik Schick',20,false,'player');

-- ============================================================
-- 7. CANADÁ (anfitrión)
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000006', album_id, 'CAN', 'Canadá', '🇨🇦', '#FF0000', 6, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'CAN1','Team Logo - Canadá',1,true,'badge'),
  (sec_id,'CAN2','Dayne St.Clair',2,false,'player'),
  (sec_id,'CAN3','Alphonso Davies',3,false,'player'),
  (sec_id,'CAN4','Alistair Johnston',4,false,'player'),
  (sec_id,'CAN5','Samuel Adekugbe',5,false,'player'),
  (sec_id,'CAN6','Riche Larvea',6,false,'player'),
  (sec_id,'CAN7','Derek Cornelius',7,false,'player'),
  (sec_id,'CAN8','Moïse Bombito',8,false,'player'),
  (sec_id,'CAN9','Kamal Miller',9,false,'player'),
  (sec_id,'CAN10','Stephen Eustáquio',10,false,'player'),
  (sec_id,'CAN11','Ismaël Koné',11,false,'player'),
  (sec_id,'CAN12','Jonathan Osorio',12,false,'player'),
  (sec_id,'CAN13','Team Photo - Canadá',13,false,'team_photo'),
  (sec_id,'CAN14','Jacob Shaffelburg',14,false,'player'),
  (sec_id,'CAN15','Mathieu Choinière',15,false,'player'),
  (sec_id,'CAN16','Niko Sigur',16,false,'player'),
  (sec_id,'CAN17','Tajon Buchanan',17,false,'player'),
  (sec_id,'CAN18','Liam Millar',18,false,'player'),
  (sec_id,'CAN19','Cyle Larin',19,false,'player'),
  (sec_id,'CAN20','Jonathan David',20,false,'player');

-- ============================================================
-- 8. BOSNIA Y HERZEGOVINA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000007', album_id, 'BIH', 'Bosnia y Herzegovina', '🇧🇦', '#002395', 7, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'BIH1','Team Logo - Bosnia y Herzegovina',1,true,'badge'),
  (sec_id,'BIH2','Nikola Vasilj',2,false,'player'),
  (sec_id,'BIH3','Amer Dedic',3,false,'player'),
  (sec_id,'BIH4','Sead Kolasinac',4,false,'player'),
  (sec_id,'BIH5','Tarik Muharemovic',5,false,'player'),
  (sec_id,'BIH6','Nihad Mujakic',6,false,'player'),
  (sec_id,'BIH7','Nikola Katic',7,false,'player'),
  (sec_id,'BIH8','Amir Hadziahmetovic',8,false,'player'),
  (sec_id,'BIH9','Benjamin Tahirovic',9,false,'player'),
  (sec_id,'BIH10','Armin Gigovic',10,false,'player'),
  (sec_id,'BIH11','Ivan Sunjic',11,false,'player'),
  (sec_id,'BIH12','Ivan Basic',12,false,'player'),
  (sec_id,'BIH13','Team Photo - Bosnia y Herzegovina',13,false,'team_photo'),
  (sec_id,'BIH14','Dzenis Burnic',14,false,'player'),
  (sec_id,'BIH15','Esmir Bajraktarevic',15,false,'player'),
  (sec_id,'BIH16','Amar Memic',16,false,'player'),
  (sec_id,'BIH17','Ermedin Demirovic',17,false,'player'),
  (sec_id,'BIH18','Edin Dzeko',18,false,'player'),
  (sec_id,'BIH19','Samed Bazdar',19,false,'player'),
  (sec_id,'BIH20','Haris Tabakovic',20,false,'player');

-- ============================================================
-- 9. QATAR
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000008', album_id, 'QAT', 'Qatar', '🇶🇦', '#8D1B3D', 8, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'QAT1','Team Logo - Qatar',1,true,'badge'),
  (sec_id,'QAT2','Meshaal Barsham',2,false,'player'),
  (sec_id,'QAT3','Sultan Albrake',3,false,'player'),
  (sec_id,'QAT4','Lucas Mendes',4,false,'player'),
  (sec_id,'QAT5','Homam Ahmed',5,false,'player'),
  (sec_id,'QAT6','Boualem Khoukhi',6,false,'player'),
  (sec_id,'QAT7','Pedro Miguel',7,false,'player'),
  (sec_id,'QAT8','Tarek Salman',8,false,'player'),
  (sec_id,'QAT9','Mohamed Al-Mannai',9,false,'player'),
  (sec_id,'QAT10','Karim Boudiaf',10,false,'player'),
  (sec_id,'QAT11','Assim Madibo',11,false,'player'),
  (sec_id,'QAT12','Ahmed Fatehi',12,false,'player'),
  (sec_id,'QAT13','Team Photo - Qatar',13,false,'team_photo'),
  (sec_id,'QAT14','Mohammed Waad',14,false,'player'),
  (sec_id,'QAT15','Abdulaziz Hatem',15,false,'player'),
  (sec_id,'QAT16','Hassan Al-Haydos',16,false,'player'),
  (sec_id,'QAT17','Edmilson Junior',17,false,'player'),
  (sec_id,'QAT18','Akram Hassan Afif',18,false,'player'),
  (sec_id,'QAT19','Ahmed Al Ganehi',19,false,'player'),
  (sec_id,'QAT20','Almoez Ali',20,false,'player');

-- ============================================================
-- 10. SUIZA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000009', album_id, 'SUI', 'Suiza', '🇨🇭', '#FF0000', 9, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'SUI1','Team Logo - Suiza',1,true,'badge'),
  (sec_id,'SUI2','Gregor Kobel',2,false,'player'),
  (sec_id,'SUI3','Yvon Mvogo',3,false,'player'),
  (sec_id,'SUI4','Manuel Akanji',4,false,'player'),
  (sec_id,'SUI5','Ricardo Rodriguez',5,false,'player'),
  (sec_id,'SUI6','Nico Elvedi',6,false,'player'),
  (sec_id,'SUI7','Aurèle Amenda',7,false,'player'),
  (sec_id,'SUI8','Silvan Widmer',8,false,'player'),
  (sec_id,'SUI9','Granit Xhaka',9,false,'player'),
  (sec_id,'SUI10','Denis Zakaria',10,false,'player'),
  (sec_id,'SUI11','Remo Freuler',11,false,'player'),
  (sec_id,'SUI12','Fabian Rieder',12,false,'player'),
  (sec_id,'SUI13','Team Photo - Suiza',13,false,'team_photo'),
  (sec_id,'SUI14','Ardon Jashari',14,false,'player'),
  (sec_id,'SUI15','Johan Manzambi',15,false,'player'),
  (sec_id,'SUI16','Michel Aebischer',16,false,'player'),
  (sec_id,'SUI17','Breel Embolo',17,false,'player'),
  (sec_id,'SUI18','Ruben Vargas',18,false,'player'),
  (sec_id,'SUI19','Dan Ndoye',19,false,'player'),
  (sec_id,'SUI20','Zeki Amdouni',20,false,'player');

-- ============================================================
-- 11. BRASIL
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000010', album_id, 'BRA', 'Brasil', '🇧🇷', '#009C3B', 10, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'BRA1','Team Logo - Brasil',1,true,'badge'),
  (sec_id,'BRA2','Alisson',2,false,'player'),
  (sec_id,'BRA3','Bento',3,false,'player'),
  (sec_id,'BRA4','Marquinhos',4,false,'player'),
  (sec_id,'BRA5','Éder Militão',5,false,'player'),
  (sec_id,'BRA6','Gabriel Magalhães',6,false,'player'),
  (sec_id,'BRA7','Danilo',7,false,'player'),
  (sec_id,'BRA8','Wesley',8,false,'player'),
  (sec_id,'BRA9','Lucas Paquetá',9,false,'player'),
  (sec_id,'BRA10','Casemiro',10,false,'player'),
  (sec_id,'BRA11','Bruno Guimarães',11,false,'player'),
  (sec_id,'BRA12','Luiz Henrique',12,false,'player'),
  (sec_id,'BRA13','Team Photo - Brasil',13,false,'team_photo'),
  (sec_id,'BRA14','Vinicius Júnior',14,false,'player'),
  (sec_id,'BRA15','Rodrygo',15,false,'player'),
  (sec_id,'BRA16','João Pedro',16,false,'player'),
  (sec_id,'BRA17','Matheus Cunha',17,false,'player'),
  (sec_id,'BRA18','Gabriel Martinelli',18,false,'player'),
  (sec_id,'BRA19','Raphinha',19,false,'player'),
  (sec_id,'BRA20','Estévão',20,false,'player');

-- ============================================================
-- 12. MARRUECOS
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000011', album_id, 'MAR', 'Marruecos', '🇲🇦', '#C1272D', 11, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'MAR1','Team Logo - Marruecos',1,true,'badge'),
  (sec_id,'MAR2','Yassine Bounou',2,false,'player'),
  (sec_id,'MAR3','Munir El Kajoui',3,false,'player'),
  (sec_id,'MAR4','Achraf Hakimi',4,false,'player'),
  (sec_id,'MAR5','Noussair Mazraoui',5,false,'player'),
  (sec_id,'MAR6','Nayef Aguerd',6,false,'player'),
  (sec_id,'MAR7','Roman Saiss',7,false,'player'),
  (sec_id,'MAR8','Jawad El Yamiq',8,false,'player'),
  (sec_id,'MAR9','Adam Masina',9,false,'player'),
  (sec_id,'MAR10','Sofyan Amrabat',10,false,'player'),
  (sec_id,'MAR11','Azzedine Ounahi',11,false,'player'),
  (sec_id,'MAR12','Eliesse Ben Seghir',12,false,'player'),
  (sec_id,'MAR13','Team Photo - Marruecos',13,false,'team_photo'),
  (sec_id,'MAR14','Bilal El Khannouss',14,false,'player'),
  (sec_id,'MAR15','Ismael Saibari',15,false,'player'),
  (sec_id,'MAR16','Youssef En-Nesyri',16,false,'player'),
  (sec_id,'MAR17','Abde Ezzalzouli',17,false,'player'),
  (sec_id,'MAR18','Soufiane Rahimi',18,false,'player'),
  (sec_id,'MAR19','Brahim Diaz',19,false,'player'),
  (sec_id,'MAR20','Ayoub El Kaabi',20,false,'player');

-- ============================================================
-- 13. HAITÍ
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000012', album_id, 'HAI', 'Haití', '🇭🇹', '#00209F', 12, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'HAI1','Team Logo - Haití',1,true,'badge'),
  (sec_id,'HAI2','Johny Placide',2,false,'player'),
  (sec_id,'HAI3','Carlens Arcus',3,false,'player'),
  (sec_id,'HAI4','Martin Expérience',4,false,'player'),
  (sec_id,'HAI5','Jean-Kevin Duverne',5,false,'player'),
  (sec_id,'HAI6','Ricardo Adé',6,false,'player'),
  (sec_id,'HAI7','Duke Lacroix',7,false,'player'),
  (sec_id,'HAI8','Garven Metusala',8,false,'player'),
  (sec_id,'HAI9','Hannes Delcroix',9,false,'player'),
  (sec_id,'HAI10','Leverton Pierre',10,false,'player'),
  (sec_id,'HAI11','Danley Jean Jacques',11,false,'player'),
  (sec_id,'HAI12','Jean-Ricner Bellegarde',12,false,'player'),
  (sec_id,'HAI13','Team Photo - Haití',13,false,'team_photo'),
  (sec_id,'HAI14','Christopher Attys',14,false,'player'),
  (sec_id,'HAI15','Derrick Etienne Jr',15,false,'player'),
  (sec_id,'HAI16','Josue Casimir',16,false,'player'),
  (sec_id,'HAI17','Ruben Providence',17,false,'player'),
  (sec_id,'HAI18','Duckens Nazon',18,false,'player'),
  (sec_id,'HAI19','Louicius Deedson',19,false,'player'),
  (sec_id,'HAI20','Frantzdy Pierrot',20,false,'player');

-- ============================================================
-- 14. ESCOCIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000013', album_id, 'SCO', 'Escocia', '🏴󠁧󠁢󠁳󠁣󠁴󠁿', '#003B6F', 13, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'SCO1','Team Logo - Escocia',1,true,'badge'),
  (sec_id,'SCO2','Angus Gunn',2,false,'player'),
  (sec_id,'SCO3','Jack Hendry',3,false,'player'),
  (sec_id,'SCO4','Kieran Tierney',4,false,'player'),
  (sec_id,'SCO5','Aaron Hickey',5,false,'player'),
  (sec_id,'SCO6','Andrew Robertson',6,false,'player'),
  (sec_id,'SCO7','Scott McKenna',7,false,'player'),
  (sec_id,'SCO8','John Souttar',8,false,'player'),
  (sec_id,'SCO9','Anthony Ralston',9,false,'player'),
  (sec_id,'SCO10','Grant Hanley',10,false,'player'),
  (sec_id,'SCO11','Scott McTominay',11,false,'player'),
  (sec_id,'SCO12','Billy Gilmour',12,false,'player'),
  (sec_id,'SCO13','Team Photo - Escocia',13,false,'team_photo'),
  (sec_id,'SCO14','Lewis Ferguson',14,false,'player'),
  (sec_id,'SCO15','Ryan Christie',15,false,'player'),
  (sec_id,'SCO16','Kenny McLean',16,false,'player'),
  (sec_id,'SCO17','John McGinn',17,false,'player'),
  (sec_id,'SCO18','Lyndon Dykes',18,false,'player'),
  (sec_id,'SCO19','Che Adams',19,false,'player'),
  (sec_id,'SCO20','Ben Gannon-Doak',20,false,'player');

-- ============================================================
-- 15. ESTADOS UNIDOS (anfitrión)
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000014', album_id, 'USA', 'Estados Unidos', '🇺🇸', '#002868', 14, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'USA1','Team Logo - Estados Unidos',1,true,'badge'),
  (sec_id,'USA2','Matt Freese',2,false,'player'),
  (sec_id,'USA3','Chris Richards',3,false,'player'),
  (sec_id,'USA4','Tim Ream',4,false,'player'),
  (sec_id,'USA5','Mark McKenzie',5,false,'player'),
  (sec_id,'USA6','Alex Freeman',6,false,'player'),
  (sec_id,'USA7','Antonee Robinson',7,false,'player'),
  (sec_id,'USA8','Tyler Adams',8,false,'player'),
  (sec_id,'USA9','Tanner Tessmann',9,false,'player'),
  (sec_id,'USA10','Weston McKennie',10,false,'player'),
  (sec_id,'USA11','Christian Roldan',11,false,'player'),
  (sec_id,'USA12','Timothy Weah',12,false,'player'),
  (sec_id,'USA13','Team Photo - Estados Unidos',13,false,'team_photo'),
  (sec_id,'USA14','Diego Luna',14,false,'player'),
  (sec_id,'USA15','Malik Tillman',15,false,'player'),
  (sec_id,'USA16','Christian Pulisic',16,false,'player'),
  (sec_id,'USA17','Brenden Aaronson',17,false,'player'),
  (sec_id,'USA18','Ricardo Pepi',18,false,'player'),
  (sec_id,'USA19','Haji Wright',19,false,'player'),
  (sec_id,'USA20','Folarin Balogun',20,false,'player');

-- ============================================================
-- 16. PARAGUAY
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000015', album_id, 'PAR', 'Paraguay', '🇵🇾', '#D52B1E', 15, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'PAR1','Team Logo - Paraguay',1,true,'badge'),
  (sec_id,'PAR2','Roberto Fernandez',2,false,'player'),
  (sec_id,'PAR3','Orlando Gill',3,false,'player'),
  (sec_id,'PAR4','Gustavo Gomez',4,false,'player'),
  (sec_id,'PAR5','Fabián Balbuena',5,false,'player'),
  (sec_id,'PAR6','Juan José Cáceres',6,false,'player'),
  (sec_id,'PAR7','Omar Alderete',7,false,'player'),
  (sec_id,'PAR8','Junior Alonso',8,false,'player'),
  (sec_id,'PAR9','Mathías Villasanti',9,false,'player'),
  (sec_id,'PAR10','Diego Gomez',10,false,'player'),
  (sec_id,'PAR11','Damián Bobadilla',11,false,'player'),
  (sec_id,'PAR12','Andres Cubas',12,false,'player'),
  (sec_id,'PAR13','Team Photo - Paraguay',13,false,'team_photo'),
  (sec_id,'PAR14','Matias Galarza Fonda',14,false,'player'),
  (sec_id,'PAR15','Julio Enciso',15,false,'player'),
  (sec_id,'PAR16','Alejandro Romero Gamarra',16,false,'player'),
  (sec_id,'PAR17','Miguel Almirón',17,false,'player'),
  (sec_id,'PAR18','Ramon Sosa',18,false,'player'),
  (sec_id,'PAR19','Angel Romero',19,false,'player'),
  (sec_id,'PAR20','Antonio Sanabria',20,false,'player');

-- ============================================================
-- 17. AUSTRALIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000016', album_id, 'AUS', 'Australia', '🇦🇺', '#00843D', 16, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'AUS1','Team Logo - Australia',1,true,'badge'),
  (sec_id,'AUS2','Mathew Ryan',2,false,'player'),
  (sec_id,'AUS3','Joe Gauci',3,false,'player'),
  (sec_id,'AUS4','Harry Souttar',4,false,'player'),
  (sec_id,'AUS5','Alessandro Circati',5,false,'player'),
  (sec_id,'AUS6','Jordan Bos',6,false,'player'),
  (sec_id,'AUS7','Aziz Behich',7,false,'player'),
  (sec_id,'AUS8','Cameron Burgess',8,false,'player'),
  (sec_id,'AUS9','Lewis Miller',9,false,'player'),
  (sec_id,'AUS10','Milos Degenek',10,false,'player'),
  (sec_id,'AUS11','Jackson Irvine',11,false,'player'),
  (sec_id,'AUS12','Riley McGree',12,false,'player'),
  (sec_id,'AUS13','Team Photo - Australia',13,false,'team_photo'),
  (sec_id,'AUS14','Aiden O''Neill',14,false,'player'),
  (sec_id,'AUS15','Connor Metcalfe',15,false,'player'),
  (sec_id,'AUS16','Patrick Yazbek',16,false,'player'),
  (sec_id,'AUS17','Craig Goodwin',17,false,'player'),
  (sec_id,'AUS18','Kusini Vengi',18,false,'player'),
  (sec_id,'AUS19','Nestory Irankunda',19,false,'player'),
  (sec_id,'AUS20','Mohamed Touré',20,false,'player');

-- ============================================================
-- 18. TÜRKIYE
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000017', album_id, 'TUR', 'Türkiye', '🇹🇷', '#E30A17', 17, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'TUR1','Team Logo - Türkiye',1,true,'badge'),
  (sec_id,'TUR2','Ugurcan Cakir',2,false,'player'),
  (sec_id,'TUR3','Mert Muldur',3,false,'player'),
  (sec_id,'TUR4','Zeki Celik',4,false,'player'),
  (sec_id,'TUR5','Abdulkerim Bardakci',5,false,'player'),
  (sec_id,'TUR6','Caglar Soyuncu',6,false,'player'),
  (sec_id,'TUR7','Merih Demiral',7,false,'player'),
  (sec_id,'TUR8','Ferdi Kadioglu',8,false,'player'),
  (sec_id,'TUR9','Kaan Ayhan',9,false,'player'),
  (sec_id,'TUR10','Ismail Yuksek',10,false,'player'),
  (sec_id,'TUR11','Hakan Calhanoglu',11,false,'player'),
  (sec_id,'TUR12','Orkun Kokcu',12,false,'player'),
  (sec_id,'TUR13','Team Photo - Türkiye',13,false,'team_photo'),
  (sec_id,'TUR14','Arda Guler',14,false,'player'),
  (sec_id,'TUR15','Irfan Can Kahveci',15,false,'player'),
  (sec_id,'TUR16','Yunus Akgun',16,false,'player'),
  (sec_id,'TUR17','Can Uzun',17,false,'player'),
  (sec_id,'TUR18','Baris Alper Yilmaz',18,false,'player'),
  (sec_id,'TUR19','Kerem Akturkoglu',19,false,'player'),
  (sec_id,'TUR20','Kenan Yildiz',20,false,'player');

-- ============================================================
-- 19. ALEMANIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000018', album_id, 'GER', 'Alemania', '🇩🇪', '#000000', 18, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'GER1','Team Logo - Alemania',1,true,'badge'),
  (sec_id,'GER2','Marc-André ter Stegen',2,false,'player'),
  (sec_id,'GER3','Jonathan Tah',3,false,'player'),
  (sec_id,'GER4','David Raum',4,false,'player'),
  (sec_id,'GER5','Nico Schlotterbeck',5,false,'player'),
  (sec_id,'GER6','Antonio Rüdiger',6,false,'player'),
  (sec_id,'GER7','Waldemar Anton',7,false,'player'),
  (sec_id,'GER8','Ridle Baku',8,false,'player'),
  (sec_id,'GER9','Maximilian Mittelstadt',9,false,'player'),
  (sec_id,'GER10','Joshua Kimmich',10,false,'player'),
  (sec_id,'GER11','Florian Wirtz',11,false,'player'),
  (sec_id,'GER12','Felix Nmecha',12,false,'player'),
  (sec_id,'GER13','Team Photo - Alemania',13,false,'team_photo'),
  (sec_id,'GER14','Leon Goretzka',14,false,'player'),
  (sec_id,'GER15','Jamal Musiala',15,false,'player'),
  (sec_id,'GER16','Serge Gnabry',16,false,'player'),
  (sec_id,'GER17','Kai Havertz',17,false,'player'),
  (sec_id,'GER18','Leroy Sane',18,false,'player'),
  (sec_id,'GER19','Karim Adeyemi',19,false,'player'),
  (sec_id,'GER20','Nick Woltemade',20,false,'player');

-- ============================================================
-- 20. CURAZAO
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000019', album_id, 'CUW', 'Curazao', '🇨🇼', '#002B7F', 19, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'CUW1','Team Logo - Curazao',1,true,'badge'),
  (sec_id,'CUW2','Eloy Room',2,false,'player'),
  (sec_id,'CUW3','Armando Obispo',3,false,'player'),
  (sec_id,'CUW4','Sherel Floranus',4,false,'player'),
  (sec_id,'CUW5','Jurien Gaari',5,false,'player'),
  (sec_id,'CUW6','Joshua Brenet',6,false,'player'),
  (sec_id,'CUW7','Roshon Van Eijma',7,false,'player'),
  (sec_id,'CUW8','Shurandy Sambo',8,false,'player'),
  (sec_id,'CUW9','Livano Comenencia',9,false,'player'),
  (sec_id,'CUW10','Godfried Roemeratoe',10,false,'player'),
  (sec_id,'CUW11','Juninho Bacuna',11,false,'player'),
  (sec_id,'CUW12','Leandro Bacuna',12,false,'player'),
  (sec_id,'CUW13','Team Photo - Curazao',13,false,'team_photo'),
  (sec_id,'CUW14','Tahith Chong',14,false,'player'),
  (sec_id,'CUW15','Kenji Gorre',15,false,'player'),
  (sec_id,'CUW16','Jearl Margaritha',16,false,'player'),
  (sec_id,'CUW17','Jurgen Locadia',17,false,'player'),
  (sec_id,'CUW18','Jeremy Antonisse',18,false,'player'),
  (sec_id,'CUW19','Gervane Kastaneer',19,false,'player'),
  (sec_id,'CUW20','Sontje Hansen',20,false,'player');

-- ============================================================
-- 21. COSTA DE MARFIL
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000020', album_id, 'CIV', 'Costa de Marfil', '🇨🇮', '#F77F00', 20, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'CIV1','Team Logo - Costa de Marfil',1,true,'badge'),
  (sec_id,'CIV2','Yahia Fofana',2,false,'player'),
  (sec_id,'CIV3','Ghislain Konan',3,false,'player'),
  (sec_id,'CIV4','Wilfried Singo',4,false,'player'),
  (sec_id,'CIV5','Odilon Kossounou',5,false,'player'),
  (sec_id,'CIV6','Evan Ndicka',6,false,'player'),
  (sec_id,'CIV7','Willy Boly',7,false,'player'),
  (sec_id,'CIV8','Emmanuel Agbadou',8,false,'player'),
  (sec_id,'CIV9','Ousmane Diomande',9,false,'player'),
  (sec_id,'CIV10','Franck Kessie',10,false,'player'),
  (sec_id,'CIV11','Seko Fofana',11,false,'player'),
  (sec_id,'CIV12','Ibrahim Sangare',12,false,'player'),
  (sec_id,'CIV13','Team Photo - Costa de Marfil',13,false,'team_photo'),
  (sec_id,'CIV14','Jean-Philippe Gbamin',14,false,'player'),
  (sec_id,'CIV15','Amad Diallo',15,false,'player'),
  (sec_id,'CIV16','Sébastien Haller',16,false,'player'),
  (sec_id,'CIV17','Simon Adingra',17,false,'player'),
  (sec_id,'CIV18','Yan Diomande',18,false,'player'),
  (sec_id,'CIV19','Evann Guessand',19,false,'player'),
  (sec_id,'CIV20','Oumar Diakite',20,false,'player');

-- ============================================================
-- 22. ECUADOR
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000021', album_id, 'ECU', 'Ecuador', '🇪🇨', '#FFD100', 21, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'ECU1','Team Logo - Ecuador',1,true,'badge'),
  (sec_id,'ECU2','Hernán Galíndez',2,false,'player'),
  (sec_id,'ECU3','Gonzalo Valle',3,false,'player'),
  (sec_id,'ECU4','Piero Hincapié',4,false,'player'),
  (sec_id,'ECU5','Pervis Estupiñán',5,false,'player'),
  (sec_id,'ECU6','Willian Pacho',6,false,'player'),
  (sec_id,'ECU7','Ángelo Preciado',7,false,'player'),
  (sec_id,'ECU8','Joel Ordóñez',8,false,'player'),
  (sec_id,'ECU9','Moises Caicedo',9,false,'player'),
  (sec_id,'ECU10','Alan Franco',10,false,'player'),
  (sec_id,'ECU11','Kendry Paez',11,false,'player'),
  (sec_id,'ECU12','Pedro Vite',12,false,'player'),
  (sec_id,'ECU13','Team Photo - Ecuador',13,false,'team_photo'),
  (sec_id,'ECU14','John Yeboah',14,false,'player'),
  (sec_id,'ECU15','Leonardo Campana',15,false,'player'),
  (sec_id,'ECU16','Gonzalo Plata',16,false,'player'),
  (sec_id,'ECU17','Nilson Angulo',17,false,'player'),
  (sec_id,'ECU18','Alan Minda',18,false,'player'),
  (sec_id,'ECU19','Kevin Rodriguez',19,false,'player'),
  (sec_id,'ECU20','Enner Valencia',20,false,'player');

-- ============================================================
-- 23. PAÍSES BAJOS
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000022', album_id, 'NED', 'Países Bajos', '🇳🇱', '#FF4F00', 22, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'NED1','Team Logo - Países Bajos',1,true,'badge'),
  (sec_id,'NED2','Bart Verbruggen',2,false,'player'),
  (sec_id,'NED3','Virgil van Dijk',3,false,'player'),
  (sec_id,'NED4','Micky van de Ven',4,false,'player'),
  (sec_id,'NED5','Jurrien Timber',5,false,'player'),
  (sec_id,'NED6','Denzel Dumfries',6,false,'player'),
  (sec_id,'NED7','Nathan Aké',7,false,'player'),
  (sec_id,'NED8','Jeremie Frimpong',8,false,'player'),
  (sec_id,'NED9','Jan Paul van Hecke',9,false,'player'),
  (sec_id,'NED10','Tijjani Reijnders',10,false,'player'),
  (sec_id,'NED11','Ryan Gravenberch',11,false,'player'),
  (sec_id,'NED12','Teun Koopmeiners',12,false,'player'),
  (sec_id,'NED13','Team Photo - Países Bajos',13,false,'team_photo'),
  (sec_id,'NED14','Frenkie de Jong',14,false,'player'),
  (sec_id,'NED15','Xavi Simons',15,false,'player'),
  (sec_id,'NED16','Justin Kluivert',16,false,'player'),
  (sec_id,'NED17','Memphis Depay',17,false,'player'),
  (sec_id,'NED18','Donyell Malen',18,false,'player'),
  (sec_id,'NED19','Wout Weghorst',19,false,'player'),
  (sec_id,'NED20','Cody Gakpo',20,false,'player');

-- ============================================================
-- 24. JAPÓN
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000023', album_id, 'JPN', 'Japón', '🇯🇵', '#BC002D', 23, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'JPN1','Team Logo - Japón',1,true,'badge'),
  (sec_id,'JPN2','Zion Suzuki',2,false,'player'),
  (sec_id,'JPN3','Henry Heroki Mochizuki',3,false,'player'),
  (sec_id,'JPN4','Ayumu Seko',4,false,'player'),
  (sec_id,'JPN5','Junnosuke Suzuki',5,false,'player'),
  (sec_id,'JPN6','Shogo Taniguchi',6,false,'player'),
  (sec_id,'JPN7','Tsuyoshi Watanabe',7,false,'player'),
  (sec_id,'JPN8','Kaishu Sano',8,false,'player'),
  (sec_id,'JPN9','Yuki Soma',9,false,'player'),
  (sec_id,'JPN10','Ao Tanaka',10,false,'player'),
  (sec_id,'JPN11','Daichi Kamada',11,false,'player'),
  (sec_id,'JPN12','Takefusa Kubo',12,false,'player'),
  (sec_id,'JPN13','Team Photo - Japón',13,false,'team_photo'),
  (sec_id,'JPN14','Ritsu Doan',14,false,'player'),
  (sec_id,'JPN15','Keito Nakamura',15,false,'player'),
  (sec_id,'JPN16','Takumi Minamino',16,false,'player'),
  (sec_id,'JPN17','Shuto Machino',17,false,'player'),
  (sec_id,'JPN18','Junya Ito',18,false,'player'),
  (sec_id,'JPN19','Koki Ogawa',19,false,'player'),
  (sec_id,'JPN20','Ayase Ueda',20,false,'player');

-- ============================================================
-- 25. SUECIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000024', album_id, 'SWE', 'Suecia', '🇸🇪', '#006AA7', 24, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'SWE1','Team Logo - Suecia',1,true,'badge'),
  (sec_id,'SWE2','Victor Johansson',2,false,'player'),
  (sec_id,'SWE3','Isak Hien',3,false,'player'),
  (sec_id,'SWE4','Gabriel Gudmundsson',4,false,'player'),
  (sec_id,'SWE5','Emil Holm',5,false,'player'),
  (sec_id,'SWE6','Victor Nilsson Lindelöf',6,false,'player'),
  (sec_id,'SWE7','Gustaf Lagerbielke',7,false,'player'),
  (sec_id,'SWE8','Lucas Bergvall',8,false,'player'),
  (sec_id,'SWE9','Hugo Larsson',9,false,'player'),
  (sec_id,'SWE10','Jesper Karlström',10,false,'player'),
  (sec_id,'SWE11','Yasin Ayari',11,false,'player'),
  (sec_id,'SWE12','Mattias Svanberg',12,false,'player'),
  (sec_id,'SWE13','Team Photo - Suecia',13,false,'team_photo'),
  (sec_id,'SWE14','Daniel Svensson',14,false,'player'),
  (sec_id,'SWE15','Ken Sema',15,false,'player'),
  (sec_id,'SWE16','Roony Bardghji',16,false,'player'),
  (sec_id,'SWE17','Dejan Kulusevski',17,false,'player'),
  (sec_id,'SWE18','Anthony Elanga',18,false,'player'),
  (sec_id,'SWE19','Alexander Isak',19,false,'player'),
  (sec_id,'SWE20','Viktor Gyökeres',20,false,'player');

-- ============================================================
-- 26. TÚNEZ
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000025', album_id, 'TUN', 'Túnez', '🇹🇳', '#E70013', 25, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'TUN1','Team Logo - Túnez',1,true,'badge'),
  (sec_id,'TUN2','Bechir Ben Said',2,false,'player'),
  (sec_id,'TUN3','Aymen Dahmen',3,false,'player'),
  (sec_id,'TUN4','Yan Valery',4,false,'player'),
  (sec_id,'TUN5','Montassar Talbi',5,false,'player'),
  (sec_id,'TUN6','Yassine Meriah',6,false,'player'),
  (sec_id,'TUN7','Ali Abdi',7,false,'player'),
  (sec_id,'TUN8','Dylan Bronn',8,false,'player'),
  (sec_id,'TUN9','Ellyes Skhiri',9,false,'player'),
  (sec_id,'TUN10','Aissa Laidouni',10,false,'player'),
  (sec_id,'TUN11','Ferjani Sassi',11,false,'player'),
  (sec_id,'TUN12','Mohamed Ali Ben Romdhane',12,false,'player'),
  (sec_id,'TUN13','Team Photo - Túnez',13,false,'team_photo'),
  (sec_id,'TUN14','Hannibal Mejbri',14,false,'player'),
  (sec_id,'TUN15','Elias Achouri',15,false,'player'),
  (sec_id,'TUN16','Elias Saad',16,false,'player'),
  (sec_id,'TUN17','Hazem Mastouri',17,false,'player'),
  (sec_id,'TUN18','Ismael Gharbi',18,false,'player'),
  (sec_id,'TUN19','Sayfallah Ltaief',19,false,'player'),
  (sec_id,'TUN20','Naim Sliti',20,false,'player');

-- ============================================================
-- 27. BÉLGICA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000026', album_id, 'BEL', 'Bélgica', '🇧🇪', '#EF3340', 26, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'BEL1','Team Logo - Bélgica',1,true,'badge'),
  (sec_id,'BEL2','Thibaut Courtois',2,false,'player'),
  (sec_id,'BEL3','Arthur Theate',3,false,'player'),
  (sec_id,'BEL4','Timothy Castagne',4,false,'player'),
  (sec_id,'BEL5','Zeno Debast',5,false,'player'),
  (sec_id,'BEL6','Brandon Mechele',6,false,'player'),
  (sec_id,'BEL7','Maxim De Cuyper',7,false,'player'),
  (sec_id,'BEL8','Thomas Meunier',8,false,'player'),
  (sec_id,'BEL9','Youri Tielemans',9,false,'player'),
  (sec_id,'BEL10','Amadou Onana',10,false,'player'),
  (sec_id,'BEL11','Nicolas Raskin',11,false,'player'),
  (sec_id,'BEL12','Alexis Saelemaekers',12,false,'player'),
  (sec_id,'BEL13','Team Photo - Bélgica',13,false,'team_photo'),
  (sec_id,'BEL14','Hans Vanaken',14,false,'player'),
  (sec_id,'BEL15','Kevin De Bruyne',15,false,'player'),
  (sec_id,'BEL16','Jérémy Doku',16,false,'player'),
  (sec_id,'BEL17','Charles De Ketelaere',17,false,'player'),
  (sec_id,'BEL18','Leandro Trossard',18,false,'player'),
  (sec_id,'BEL19','Loïs Openda',19,false,'player'),
  (sec_id,'BEL20','Romelu Lukaku',20,false,'player');

-- ============================================================
-- 28. EGIPTO
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000027', album_id, 'EGY', 'Egipto', '🇪🇬', '#CE1126', 27, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'EGY1','Team Logo - Egipto',1,true,'badge'),
  (sec_id,'EGY2','Mohamed El Shenawy',2,false,'player'),
  (sec_id,'EGY3','Mohamed Hany',3,false,'player'),
  (sec_id,'EGY4','Mohamed Hamdy',4,false,'player'),
  (sec_id,'EGY5','Yasser Ibrahim',5,false,'player'),
  (sec_id,'EGY6','Khaled Sobhi',6,false,'player'),
  (sec_id,'EGY7','Ramy Rabia',7,false,'player'),
  (sec_id,'EGY8','Hossam Abdelmaguid',8,false,'player'),
  (sec_id,'EGY9','Ahmed Fatouh',9,false,'player'),
  (sec_id,'EGY10','Marwan Attia',10,false,'player'),
  (sec_id,'EGY11','Zizo',11,false,'player'),
  (sec_id,'EGY12','Hamdy Fathy',12,false,'player'),
  (sec_id,'EGY13','Team Photo - Egipto',13,false,'team_photo'),
  (sec_id,'EGY14','Mohamed Lasheen',14,false,'player'),
  (sec_id,'EGY15','Emam Ashour',15,false,'player'),
  (sec_id,'EGY16','Osama Faisal',16,false,'player'),
  (sec_id,'EGY17','Mohamed Salah',17,false,'player'),
  (sec_id,'EGY18','Mostafa Mohamed',18,false,'player'),
  (sec_id,'EGY19','Trezeguet',19,false,'player'),
  (sec_id,'EGY20','Omar Marmoush',20,false,'player');

-- ============================================================
-- 29. IRÁN
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000028', album_id, 'IRN', 'Irán', '🇮🇷', '#239f40', 28, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'IRN1','Team Logo - Irán',1,true,'badge'),
  (sec_id,'IRN2','Alireza Beiranvand',2,false,'player'),
  (sec_id,'IRN3','Morteza Pouraliganji',3,false,'player'),
  (sec_id,'IRN4','Ehsan Hajsafi',4,false,'player'),
  (sec_id,'IRN5','Milad Mohammadi',5,false,'player'),
  (sec_id,'IRN6','Shojae Khalilzadeh',6,false,'player'),
  (sec_id,'IRN7','Ramin Rezaeian',7,false,'player'),
  (sec_id,'IRN8','Hossein Kanaani',8,false,'player'),
  (sec_id,'IRN9','Sadegh Moharrami',9,false,'player'),
  (sec_id,'IRN10','Saleh Hardani',10,false,'player'),
  (sec_id,'IRN11','Saeed Ezatolahi',11,false,'player'),
  (sec_id,'IRN12','Saman Ghoddos',12,false,'player'),
  (sec_id,'IRN13','Team Photo - Irán',13,false,'team_photo'),
  (sec_id,'IRN14','Omid Noorafkan',14,false,'player'),
  (sec_id,'IRN15','Roozbeh Cheshmi',15,false,'player'),
  (sec_id,'IRN16','Mohammad Mohebi',16,false,'player'),
  (sec_id,'IRN17','Sardar Azmoun',17,false,'player'),
  (sec_id,'IRN18','Mehdi Taremi',18,false,'player'),
  (sec_id,'IRN19','Alireza Jahanbakhsh',19,false,'player'),
  (sec_id,'IRN20','Ali Gholizadeh',20,false,'player');

-- ============================================================
-- 30. NUEVA ZELANDA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000029', album_id, 'NZL', 'Nueva Zelanda', '🇳🇿', '#00247D', 29, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'NZL1','Team Logo - Nueva Zelanda',1,true,'badge'),
  (sec_id,'NZL2','Max Crocombe',2,false,'player'),
  (sec_id,'NZL3','Alex Paulsen',3,false,'player'),
  (sec_id,'NZL4','Michael Boxall',4,false,'player'),
  (sec_id,'NZL5','Liberato Cacace',5,false,'player'),
  (sec_id,'NZL6','Tim Payne',6,false,'player'),
  (sec_id,'NZL7','Tyler Bindon',7,false,'player'),
  (sec_id,'NZL8','Francis de Vries',8,false,'player'),
  (sec_id,'NZL9','Finn Surman',9,false,'player'),
  (sec_id,'NZL10','Joe Bell',10,false,'player'),
  (sec_id,'NZL11','Sarpreet Singh',11,false,'player'),
  (sec_id,'NZL12','Ryan Thomas',12,false,'player'),
  (sec_id,'NZL13','Team Photo - Nueva Zelanda',13,false,'team_photo'),
  (sec_id,'NZL14','Matthew Garbett',14,false,'player'),
  (sec_id,'NZL15','Marko Stamenić',15,false,'player'),
  (sec_id,'NZL16','Ben Old',16,false,'player'),
  (sec_id,'NZL17','Chris Wood',17,false,'player'),
  (sec_id,'NZL18','Elijah Just',18,false,'player'),
  (sec_id,'NZL19','Callum McCowatt',19,false,'player'),
  (sec_id,'NZL20','Kosta Barbarouses',20,false,'player');

-- ============================================================
-- 31. ESPAÑA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000030', album_id, 'ESP', 'España', '🇪🇸', '#AA151B', 30, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'ESP1','Team Logo - España',1,true,'badge'),
  (sec_id,'ESP2','Unai Simon',2,false,'player'),
  (sec_id,'ESP3','Robin Le Normand',3,false,'player'),
  (sec_id,'ESP4','Aymeric Laporte',4,false,'player'),
  (sec_id,'ESP5','Dean Huijsen',5,false,'player'),
  (sec_id,'ESP6','Pedro Porro',6,false,'player'),
  (sec_id,'ESP7','Dani Carvajal',7,false,'player'),
  (sec_id,'ESP8','Marc Cucurella',8,false,'player'),
  (sec_id,'ESP9','Martín Zubimendi',9,false,'player'),
  (sec_id,'ESP10','Rodri',10,false,'player'),
  (sec_id,'ESP11','Pedri',11,false,'player'),
  (sec_id,'ESP12','Fabian Ruiz',12,false,'player'),
  (sec_id,'ESP13','Team Photo - España',13,false,'team_photo'),
  (sec_id,'ESP14','Mikel Merino',14,false,'player'),
  (sec_id,'ESP15','Lamine Yamal',15,false,'player'),
  (sec_id,'ESP16','Dani Olmo',16,false,'player'),
  (sec_id,'ESP17','Nico Williams',17,false,'player'),
  (sec_id,'ESP18','Ferran Torres',18,false,'player'),
  (sec_id,'ESP19','Álvaro Morata',19,false,'player'),
  (sec_id,'ESP20','Mikel Oyarzabal',20,false,'player');

-- ============================================================
-- 32. CABO VERDE
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000031', album_id, 'CPV', 'Cabo Verde', '🇨🇻', '#003893', 31, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'CPV1','Team Logo - Cabo Verde',1,true,'badge'),
  (sec_id,'CPV2','Vozinha',2,false,'player'),
  (sec_id,'CPV3','Logan Costa',3,false,'player'),
  (sec_id,'CPV4','Pico',4,false,'player'),
  (sec_id,'CPV5','Diney',5,false,'player'),
  (sec_id,'CPV6','Steven Moreira',6,false,'player'),
  (sec_id,'CPV7','Wagner Pina',7,false,'player'),
  (sec_id,'CPV8','Joao Paulo',8,false,'player'),
  (sec_id,'CPV9','Yannick Semedo',9,false,'player'),
  (sec_id,'CPV10','Kevin Pina',10,false,'player'),
  (sec_id,'CPV11','Patrick Andrade',11,false,'player'),
  (sec_id,'CPV12','Jamiro Monteiro',12,false,'player'),
  (sec_id,'CPV13','Team Photo - Cabo Verde',13,false,'team_photo'),
  (sec_id,'CPV14','Deroy Duarte',14,false,'player'),
  (sec_id,'CPV15','Garry Rodrigues',15,false,'player'),
  (sec_id,'CPV16','Jovane Cabral',16,false,'player'),
  (sec_id,'CPV17','Ryan Mendes',17,false,'player'),
  (sec_id,'CPV18','Dailon Livramento',18,false,'player'),
  (sec_id,'CPV19','Willy Semedo',19,false,'player'),
  (sec_id,'CPV20','Bebe',20,false,'player');

-- ============================================================
-- 33. ARABIA SAUDITA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000032', album_id, 'KSA', 'Arabia Saudita', '🇸🇦', '#006C35', 32, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'KSA1','Team Logo - Arabia Saudita',1,true,'badge'),
  (sec_id,'KSA2','Nawaf Alaqidi',2,false,'player'),
  (sec_id,'KSA3','Abdulrahman Al-Sanbi',3,false,'player'),
  (sec_id,'KSA4','Saud Abdulhamid',4,false,'player'),
  (sec_id,'KSA5','Nawaf Bouwashl',5,false,'player'),
  (sec_id,'KSA6','Jihad Thakri',6,false,'player'),
  (sec_id,'KSA7','Moteb Al-Harbi',7,false,'player'),
  (sec_id,'KSA8','Hassan Altambakti',8,false,'player'),
  (sec_id,'KSA9','Musab Aljuwayr',9,false,'player'),
  (sec_id,'KSA10','Ziyad Aljohani',10,false,'player'),
  (sec_id,'KSA11','Abdullah Alkhaibari',11,false,'player'),
  (sec_id,'KSA12','Nasser Aldawsari',12,false,'player'),
  (sec_id,'KSA13','Team Photo - Arabia Saudita',13,false,'team_photo'),
  (sec_id,'KSA14','Saleh Abu Alshamat',14,false,'player'),
  (sec_id,'KSA15','Marwan Alsahafi',15,false,'player'),
  (sec_id,'KSA16','Salem Aldawsari',16,false,'player'),
  (sec_id,'KSA17','Abdulrahman Al-Aboud',17,false,'player'),
  (sec_id,'KSA18','Feras Akbrikan',18,false,'player'),
  (sec_id,'KSA19','Saleh Alshehri',19,false,'player'),
  (sec_id,'KSA20','Abdullah Al-Hamdan',20,false,'player');

-- ============================================================
-- 34. URUGUAY
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000033', album_id, 'URU', 'Uruguay', '🇺🇾', '#5EB6E4', 33, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'URU1','Team Logo - Uruguay',1,true,'badge'),
  (sec_id,'URU2','Sergio Rochet',2,false,'player'),
  (sec_id,'URU3','Santiago Mele',3,false,'player'),
  (sec_id,'URU4','Ronald Araujo',4,false,'player'),
  (sec_id,'URU5','José María Giménez',5,false,'player'),
  (sec_id,'URU6','Sebastian Caceres',6,false,'player'),
  (sec_id,'URU7','Mathias Olivera',7,false,'player'),
  (sec_id,'URU8','Guillermo Varela',8,false,'player'),
  (sec_id,'URU9','Nahitan Nandez',9,false,'player'),
  (sec_id,'URU10','Federico Valverde',10,false,'player'),
  (sec_id,'URU11','Giorgian De Arrascaeta',11,false,'player'),
  (sec_id,'URU12','Rodrigo Bentancur',12,false,'player'),
  (sec_id,'URU13','Team Photo - Uruguay',13,false,'team_photo'),
  (sec_id,'URU14','Manuel Ugarte',14,false,'player'),
  (sec_id,'URU15','Nicolás de la Cruz',15,false,'player'),
  (sec_id,'URU16','Maxi Araujo',16,false,'player'),
  (sec_id,'URU17','Darwin Núñez',17,false,'player'),
  (sec_id,'URU18','Federico Viñas',18,false,'player'),
  (sec_id,'URU19','Rodrigo Aguirre',19,false,'player'),
  (sec_id,'URU20','Facundo Pellistri',20,false,'player');

-- ============================================================
-- 35. FRANCIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000034', album_id, 'FRA', 'Francia', '🇫🇷', '#002395', 34, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'FRA1','Team Logo - Francia',1,true,'badge'),
  (sec_id,'FRA2','Mike Maignan',2,false,'player'),
  (sec_id,'FRA3','Theo Hernandez',3,false,'player'),
  (sec_id,'FRA4','William Saliba',4,false,'player'),
  (sec_id,'FRA5','Jules Kounde',5,false,'player'),
  (sec_id,'FRA6','Ibrahima Konate',6,false,'player'),
  (sec_id,'FRA7','Dayot Upamecano',7,false,'player'),
  (sec_id,'FRA8','Lucas Digne',8,false,'player'),
  (sec_id,'FRA9','Aurélien Tchouaméni',9,false,'player'),
  (sec_id,'FRA10','Eduardo Camavinga',10,false,'player'),
  (sec_id,'FRA11','Manu Kone',11,false,'player'),
  (sec_id,'FRA12','Adrien Rabiot',12,false,'player'),
  (sec_id,'FRA13','Team Photo - Francia',13,false,'team_photo'),
  (sec_id,'FRA14','Michael Olise',14,false,'player'),
  (sec_id,'FRA15','Ousmane Dembele',15,false,'player'),
  (sec_id,'FRA16','Bradley Barcola',16,false,'player'),
  (sec_id,'FRA17','Désiré Doué',17,false,'player'),
  (sec_id,'FRA18','Kingsley Coman',18,false,'player'),
  (sec_id,'FRA19','Hugo Ekitike',19,false,'player'),
  (sec_id,'FRA20','Kylian Mbappé',20,false,'player');

-- ============================================================
-- 36. SENEGAL
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000035', album_id, 'SEN', 'Senegal', '🇸🇳', '#00853F', 35, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'SEN1','Team Logo - Senegal',1,true,'badge'),
  (sec_id,'SEN2','Edouard Mendy',2,false,'player'),
  (sec_id,'SEN3','Yehvann Diouf',3,false,'player'),
  (sec_id,'SEN4','Moussa Niakhaté',4,false,'player'),
  (sec_id,'SEN5','Abdoulaye Seck',5,false,'player'),
  (sec_id,'SEN6','Ismail Jakobs',6,false,'player'),
  (sec_id,'SEN7','El Hadji Malick Diouf',7,false,'player'),
  (sec_id,'SEN8','Kalidou Koulibaly',8,false,'player'),
  (sec_id,'SEN9','Idrissa Gana Gueye',9,false,'player'),
  (sec_id,'SEN10','Pape Matar Sarr',10,false,'player'),
  (sec_id,'SEN11','Pape Gueye',11,false,'player'),
  (sec_id,'SEN12','Habib Diarra',12,false,'player'),
  (sec_id,'SEN13','Team Photo - Senegal',13,false,'team_photo'),
  (sec_id,'SEN14','Lamine Camara',14,false,'player'),
  (sec_id,'SEN15','Sadio Mane',15,false,'player'),
  (sec_id,'SEN16','Ismaïla Sarr',16,false,'player'),
  (sec_id,'SEN17','Boulaye Dia',17,false,'player'),
  (sec_id,'SEN18','Iliman Ndiaye',18,false,'player'),
  (sec_id,'SEN19','Nicolas Jackson',19,false,'player'),
  (sec_id,'SEN20','Krepin Diatta',20,false,'player');

-- ============================================================
-- 37. IRAK
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000036', album_id, 'IRQ', 'Irak', '🇮🇶', '#CE1126', 36, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'IRQ1','Team Logo - Irak',1,true,'badge'),
  (sec_id,'IRQ2','Jalal Hassan',2,false,'player'),
  (sec_id,'IRQ3','Rebin Sulaka',3,false,'player'),
  (sec_id,'IRQ4','Hussein Ali',4,false,'player'),
  (sec_id,'IRQ5','Akam Hashem',5,false,'player'),
  (sec_id,'IRQ6','Merchas Doski',6,false,'player'),
  (sec_id,'IRQ7','Zaid Tahseen',7,false,'player'),
  (sec_id,'IRQ8','Manaf Younis',8,false,'player'),
  (sec_id,'IRQ9','Zidane Iqbal',9,false,'player'),
  (sec_id,'IRQ10','Amir Al-Ammari',10,false,'player'),
  (sec_id,'IRQ11','Ibrahim Bavesh',11,false,'player'),
  (sec_id,'IRQ12','Ali Jasim',12,false,'player'),
  (sec_id,'IRQ13','Team Photo - Irak',13,false,'team_photo'),
  (sec_id,'IRQ14','Youssef Amyn',14,false,'player'),
  (sec_id,'IRQ15','Aimar Sher',15,false,'player'),
  (sec_id,'IRQ16','Marko Farji',16,false,'player'),
  (sec_id,'IRQ17','Osama Rashid',17,false,'player'),
  (sec_id,'IRQ18','Ali Al-Hamadi',18,false,'player'),
  (sec_id,'IRQ19','Aymen Hussein',19,false,'player'),
  (sec_id,'IRQ20','Mohanad Ali',20,false,'player');

-- ============================================================
-- 38. NORUEGA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000037', album_id, 'NOR', 'Noruega', '🇳🇴', '#EF2B2D', 37, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'NOR1','Team Logo - Noruega',1,true,'badge'),
  (sec_id,'NOR2','Orjan Nyland',2,false,'player'),
  (sec_id,'NOR3','Julian Ryerson',3,false,'player'),
  (sec_id,'NOR4','Leo Ostigård',4,false,'player'),
  (sec_id,'NOR5','Kristoffer Vassbakk Ajer',5,false,'player'),
  (sec_id,'NOR6','Marcus Holmgren Pedersen',6,false,'player'),
  (sec_id,'NOR7','David Møller Wolfe',7,false,'player'),
  (sec_id,'NOR8','Torbjørn Heggem',8,false,'player'),
  (sec_id,'NOR9','Morten Thorsby',9,false,'player'),
  (sec_id,'NOR10','Martin Ødegaard',10,false,'player'),
  (sec_id,'NOR11','Sander Berge',11,false,'player'),
  (sec_id,'NOR12','Andreas Schjelderup',12,false,'player'),
  (sec_id,'NOR13','Team Photo - Noruega',13,false,'team_photo'),
  (sec_id,'NOR14','Patrick Berg',14,false,'player'),
  (sec_id,'NOR15','Erling Haaland',15,false,'player'),
  (sec_id,'NOR16','Alexander Sørloth',16,false,'player'),
  (sec_id,'NOR17','Aron Dønnum',17,false,'player'),
  (sec_id,'NOR18','Jorgen Strand Larsen',18,false,'player'),
  (sec_id,'NOR19','Antonio Nusa',19,false,'player'),
  (sec_id,'NOR20','Oscar Bobb',20,false,'player');

-- ============================================================
-- 39. ARGENTINA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000038', album_id, 'ARG', 'Argentina', '🇦🇷', '#74ACDF', 38, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'ARG1','Team Logo - Argentina',1,true,'badge'),
  (sec_id,'ARG2','Emiliano Martinez',2,false,'player'),
  (sec_id,'ARG3','Nahuel Molina',3,false,'player'),
  (sec_id,'ARG4','Cristian Romero',4,false,'player'),
  (sec_id,'ARG5','Nicolas Otamendi',5,false,'player'),
  (sec_id,'ARG6','Nicolas Tagliafico',6,false,'player'),
  (sec_id,'ARG7','Leonardo Balerdi',7,false,'player'),
  (sec_id,'ARG8','Enzo Fernandez',8,false,'player'),
  (sec_id,'ARG9','Alexis Mac Allister',9,false,'player'),
  (sec_id,'ARG10','Rodrigo De Paul',10,false,'player'),
  (sec_id,'ARG11','Exequiel Palacios',11,false,'player'),
  (sec_id,'ARG12','Leandro Paredes',12,false,'player'),
  (sec_id,'ARG13','Team Photo - Argentina',13,false,'team_photo'),
  (sec_id,'ARG14','Nico Paz',14,false,'player'),
  (sec_id,'ARG15','Franco Mastantuono',15,false,'player'),
  (sec_id,'ARG16','Nico Gonzalez',16,false,'player'),
  (sec_id,'ARG17','Lionel Messi',17,false,'player'),
  (sec_id,'ARG18','Lautaro Martinez',18,false,'player'),
  (sec_id,'ARG19','Julian Alvarez',19,false,'player'),
  (sec_id,'ARG20','Giuliano Simeone',20,false,'player');

-- ============================================================
-- 40. ARGELIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000039', album_id, 'ALG', 'Argelia', '🇩🇿', '#006233', 39, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'ALG1','Team Logo - Argelia',1,true,'badge'),
  (sec_id,'ALG2','Alexis Guendouz',2,false,'player'),
  (sec_id,'ALG3','Ramy Bensebaini',3,false,'player'),
  (sec_id,'ALG4','Youcef Atal',4,false,'player'),
  (sec_id,'ALG5','Rayan Aït-Nouri',5,false,'player'),
  (sec_id,'ALG6','Mohamed Amine Tougai',6,false,'player'),
  (sec_id,'ALG7','Aïssa Mandi',7,false,'player'),
  (sec_id,'ALG8','Ismael Bennacer',8,false,'player'),
  (sec_id,'ALG9','Houssem Aquar',9,false,'player'),
  (sec_id,'ALG10','Hicham Boudaoui',10,false,'player'),
  (sec_id,'ALG11','Ramiz Zerrouki',11,false,'player'),
  (sec_id,'ALG12','Nabil Bentalab',12,false,'player'),
  (sec_id,'ALG13','Team Photo - Argelia',13,false,'team_photo'),
  (sec_id,'ALG14','Farés Chaibi',14,false,'player'),
  (sec_id,'ALG15','Riyad Mahrez',15,false,'player'),
  (sec_id,'ALG16','Said Benrahma',16,false,'player'),
  (sec_id,'ALG17','Anis Hadj Moussa',17,false,'player'),
  (sec_id,'ALG18','Amine Gouiri',18,false,'player'),
  (sec_id,'ALG19','Baghdad Bounedjah',19,false,'player'),
  (sec_id,'ALG20','Mohammed Amoura',20,false,'player');

-- ============================================================
-- 41. AUSTRIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000040', album_id, 'AUT', 'Austria', '🇦🇹', '#ED2939', 40, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'AUT1','Team Logo - Austria',1,true,'badge'),
  (sec_id,'AUT2','Alexander Schlager',2,false,'player'),
  (sec_id,'AUT3','Patrick Pentz',3,false,'player'),
  (sec_id,'AUT4','David Alaba',4,false,'player'),
  (sec_id,'AUT5','Kevin Danso',5,false,'player'),
  (sec_id,'AUT6','Philipp Lienhart',6,false,'player'),
  (sec_id,'AUT7','Stefan Posch',7,false,'player'),
  (sec_id,'AUT8','Phillipp Mwene',8,false,'player'),
  (sec_id,'AUT9','Alexander Prass',9,false,'player'),
  (sec_id,'AUT10','Xaver Schlager',10,false,'player'),
  (sec_id,'AUT11','Marcel Sabitzer',11,false,'player'),
  (sec_id,'AUT12','Konrad Laimer',12,false,'player'),
  (sec_id,'AUT13','Team Photo - Austria',13,false,'team_photo'),
  (sec_id,'AUT14','Florian Grillitsch',14,false,'player'),
  (sec_id,'AUT15','Nicolas Seiwald',15,false,'player'),
  (sec_id,'AUT16','Romano Schmid',16,false,'player'),
  (sec_id,'AUT17','Patrick Wimmer',17,false,'player'),
  (sec_id,'AUT18','Christoph Baumgartner',18,false,'player'),
  (sec_id,'AUT19','Michael Gregoritsch',19,false,'player'),
  (sec_id,'AUT20','Marko Arnautović',20,false,'player');

-- ============================================================
-- 42. JORDANIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000041', album_id, 'JOR', 'Jordania', '🇯🇴', '#007A3D', 41, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'JOR1','Team Logo - Jordania',1,true,'badge'),
  (sec_id,'JOR2','Yazeed Abulaila',2,false,'player'),
  (sec_id,'JOR3','Ihsan Haddad',3,false,'player'),
  (sec_id,'JOR4','Mohammad Abu Hashish',4,false,'player'),
  (sec_id,'JOR5','Yazan Al-Arab',5,false,'player'),
  (sec_id,'JOR6','Abdallah Nasib',6,false,'player'),
  (sec_id,'JOR7','Saleem Obaid',7,false,'player'),
  (sec_id,'JOR8','Mohammad Abualnadi',8,false,'player'),
  (sec_id,'JOR9','Ibrahim Saadeh',9,false,'player'),
  (sec_id,'JOR10','Nizar Al-Rashdan',10,false,'player'),
  (sec_id,'JOR11','Noor Al-Rawabdeh',11,false,'player'),
  (sec_id,'JOR12','Mohannad Abu Taha',12,false,'player'),
  (sec_id,'JOR13','Team Photo - Jordania',13,false,'team_photo'),
  (sec_id,'JOR14','Amer Jamous',14,false,'player'),
  (sec_id,'JOR15','Musa Al-Taamari',15,false,'player'),
  (sec_id,'JOR16','Yazan Al-Naimat',16,false,'player'),
  (sec_id,'JOR17','Mahmoud Al-Mardi',17,false,'player'),
  (sec_id,'JOR18','Ali Olwan',18,false,'player'),
  (sec_id,'JOR19','Mohammad Abu Zrayq',19,false,'player'),
  (sec_id,'JOR20','Ibrahim Sabra',20,false,'player');

-- ============================================================
-- 43. PORTUGAL
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000042', album_id, 'POR', 'Portugal', '🇵🇹', '#006600', 42, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'POR1','Team Logo - Portugal',1,true,'badge'),
  (sec_id,'POR2','Diogo Costa',2,false,'player'),
  (sec_id,'POR3','Jose Sa',3,false,'player'),
  (sec_id,'POR4','Ruben Dias',4,false,'player'),
  (sec_id,'POR5','João Cancelo',5,false,'player'),
  (sec_id,'POR6','Diogo Dalot',6,false,'player'),
  (sec_id,'POR7','Nuno Mendes',7,false,'player'),
  (sec_id,'POR8','António Silva',8,false,'player'),
  (sec_id,'POR9','Vitinha',9,false,'player'),
  (sec_id,'POR10','João Palhinha',10,false,'player'),
  (sec_id,'POR11','Bruno Fernandes',11,false,'player'),
  (sec_id,'POR12','Bernardo Silva',12,false,'player'),
  (sec_id,'POR13','Team Photo - Portugal',13,false,'team_photo'),
  (sec_id,'POR14','Rúben Neves',14,false,'player'),
  (sec_id,'POR15','Rafael Leão',15,false,'player'),
  (sec_id,'POR16','João Félix',16,false,'player'),
  (sec_id,'POR17','Cristiano Ronaldo',17,false,'player'),
  (sec_id,'POR18','Gonçalo Ramos',18,false,'player'),
  (sec_id,'POR19','Pedro Neto',19,false,'player'),
  (sec_id,'POR20','Francisco Conceiçao',20,false,'player');

-- ============================================================
-- 44. COLOMBIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000043', album_id, 'COL', 'Colombia', '🇨🇴', '#FCD116', 43, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'COL1','Team Logo - Colombia',1,true,'badge'),
  (sec_id,'COL2','Camilo Vargas',2,false,'player'),
  (sec_id,'COL3','David Ospina',3,false,'player'),
  (sec_id,'COL4','Carlos Cuesta',4,false,'player'),
  (sec_id,'COL5','Davinson Sanchez',5,false,'player'),
  (sec_id,'COL6','Daniel Munoz',6,false,'player'),
  (sec_id,'COL7','Johan Mojica',7,false,'player'),
  (sec_id,'COL8','Jhon Lucumi',8,false,'player'),
  (sec_id,'COL9','Richard Rios',9,false,'player'),
  (sec_id,'COL10','Jefferson Lerma',10,false,'player'),
  (sec_id,'COL11','Mateus Uribe',11,false,'player'),
  (sec_id,'COL12','Juan Fernando Quintero',12,false,'player'),
  (sec_id,'COL13','Team Photo - Colombia',13,false,'team_photo'),
  (sec_id,'COL14','James Rodriguez',14,false,'player'),
  (sec_id,'COL15','Luis Diaz',15,false,'player'),
  (sec_id,'COL16','Jhon Arias',16,false,'player'),
  (sec_id,'COL17','Cucho Hernandez',17,false,'player'),
  (sec_id,'COL18','Rafael Santos Borre',18,false,'player'),
  (sec_id,'COL19','Jhon Cordoba',19,false,'player'),
  (sec_id,'COL20','Falcao',20,false,'player');

-- ============================================================
-- 45. GHANA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000044', album_id, 'GHA', 'Ghana', '🇬🇭', '#006B3F', 44, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'GHA1','Team Logo - Ghana',1,true,'badge'),
  (sec_id,'GHA2','Lawrence Ati-Zigi',2,false,'player'),
  (sec_id,'GHA3','Abdul Manaf Nurudeen',3,false,'player'),
  (sec_id,'GHA4','Daniel Amartey',4,false,'player'),
  (sec_id,'GHA5','Gideon Mensah',5,false,'player'),
  (sec_id,'GHA6','Denis Odoi',6,false,'player'),
  (sec_id,'GHA7','Alexander Djiku',7,false,'player'),
  (sec_id,'GHA8','Harrison Afful',8,false,'player'),
  (sec_id,'GHA9','Baba Rahman',9,false,'player'),
  (sec_id,'GHA10','Thomas Partey',10,false,'player'),
  (sec_id,'GHA11','Elisha Owusu',11,false,'player'),
  (sec_id,'GHA12','Mohammed Kudus',12,false,'player'),
  (sec_id,'GHA13','Team Photo - Ghana',13,false,'team_photo'),
  (sec_id,'GHA14','Jordan Ayew',14,false,'player'),
  (sec_id,'GHA15','Andre Ayew',15,false,'player'),
  (sec_id,'GHA16','Felix Afena-Gyan',16,false,'player'),
  (sec_id,'GHA17','Inaki Williams',17,false,'player'),
  (sec_id,'GHA18','Joseph Paintsil',18,false,'player'),
  (sec_id,'GHA19','Osman Bukari',19,false,'player'),
  (sec_id,'GHA20','Antoine Semenyo',20,false,'player');

-- ============================================================
-- 46. PANAMÁ
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000045', album_id, 'PAN', 'Panamá', '🇵🇦', '#DA121A', 45, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'PAN1','Team Logo - Panamá',1,true,'badge'),
  (sec_id,'PAN2','Orlando Mosquera',2,false,'player'),
  (sec_id,'PAN3','Luis Mejia',3,false,'player'),
  (sec_id,'PAN4','Fidel Escobar',4,false,'player'),
  (sec_id,'PAN5','Andres Andrade',5,false,'player'),
  (sec_id,'PAN6','Michael Amir Murillo',6,false,'player'),
  (sec_id,'PAN7','Eric Davis',7,false,'player'),
  (sec_id,'PAN8','Jose Cordoba',8,false,'player'),
  (sec_id,'PAN9','Cesar Blackman',9,false,'player'),
  (sec_id,'PAN10','Cristian Martinez',10,false,'player'),
  (sec_id,'PAN11','Aníbal Godoy',11,false,'player'),
  (sec_id,'PAN12','Adalberto Carrasquilla',12,false,'player'),
  (sec_id,'PAN13','Team Photo - Panamá',13,false,'team_photo'),
  (sec_id,'PAN14','Édgar Bárcenas',14,false,'player'),
  (sec_id,'PAN15','Carlos Harvey',15,false,'player'),
  (sec_id,'PAN16','Ismael Díaz',16,false,'player'),
  (sec_id,'PAN17','Jose Fajardo',17,false,'player'),
  (sec_id,'PAN18','Cecilio Waterman',18,false,'player'),
  (sec_id,'PAN19','Jose Luiz Rodriguez',19,false,'player'),
  (sec_id,'PAN20','Alberto Quintero',20,false,'player');

-- ============================================================
-- 47. CROACIA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000046', album_id, 'CRO', 'Croacia', '🇭🇷', '#FF0000', 46, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'CRO1','Team Logo - Croacia',1,true,'badge'),
  (sec_id,'CRO2','Dominik Livaković',2,false,'player'),
  (sec_id,'CRO3','Josip Sutalo',3,false,'player'),
  (sec_id,'CRO4','Josip Stanisic',4,false,'player'),
  (sec_id,'CRO5','Borna Sosa',5,false,'player'),
  (sec_id,'CRO6','Duje Caleta-Car',6,false,'player'),
  (sec_id,'CRO7','Martin Erlic',7,false,'player'),
  (sec_id,'CRO8','Šime Vrsaljko',8,false,'player'),
  (sec_id,'CRO9','Marcelo Brozović',9,false,'player'),
  (sec_id,'CRO10','Luka Modric',10,false,'player'),
  (sec_id,'CRO11','Mateo Kovačić',11,false,'player'),
  (sec_id,'CRO12','Mario Pasalic',12,false,'player'),
  (sec_id,'CRO13','Team Photo - Croacia',13,false,'team_photo'),
  (sec_id,'CRO14','Lovro Majer',14,false,'player'),
  (sec_id,'CRO15','Luka Ivanusec',15,false,'player'),
  (sec_id,'CRO16','Nikola Vlasic',16,false,'player'),
  (sec_id,'CRO17','Andrej Kramaric',17,false,'player'),
  (sec_id,'CRO18','Bruno Petkovic',18,false,'player'),
  (sec_id,'CRO19','Ivan Perisic',19,false,'player'),
  (sec_id,'CRO20','Marko Livaja',20,false,'player');

-- ============================================================
-- 48. CONGO DR
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000047', album_id, 'COD', 'Congo DR', '🇨🇩', '#007FFF', 47, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'COD1','Team Logo - Congo DR',1,true,'badge'),
  (sec_id,'COD2','Joel Kiassumbua',2,false,'player'),
  (sec_id,'COD3','Chancel Mbemba',3,false,'player'),
  (sec_id,'COD4','Arthur Masuaku',4,false,'player'),
  (sec_id,'COD5','Marcel Tisserand',5,false,'player'),
  (sec_id,'COD6','Lionel Mpasi',6,false,'player'),
  (sec_id,'COD7','Nathan Ngoyi Munkonda',7,false,'player'),
  (sec_id,'COD8','Cédric Bakambu',8,false,'player'),
  (sec_id,'COD9','Silas Mvumpa',9,false,'player'),
  (sec_id,'COD10','Neeskens Kebano',10,false,'player'),
  (sec_id,'COD11','Yannick Bolasie',11,false,'player'),
  (sec_id,'COD12','Gaël Kakuta',12,false,'player'),
  (sec_id,'COD13','Team Photo - Congo DR',13,false,'team_photo'),
  (sec_id,'COD14','Samuel Moutoussamy',14,false,'player'),
  (sec_id,'COD15','Jonathan Bolingi',15,false,'player'),
  (sec_id,'COD16','Fiston Mayele',16,false,'player'),
  (sec_id,'COD17','Dodi Lukebakio',17,false,'player'),
  (sec_id,'COD18','Théo Bongonda',18,false,'player'),
  (sec_id,'COD19','Djodji Amian',19,false,'player'),
  (sec_id,'COD20','Yoane Wissa',20,false,'player');

-- ============================================================
-- 49. INGLATERRA
-- ============================================================
INSERT INTO sections (id, album_id, code, name, flag_emoji, color_primary, order_index, section_type)
VALUES ('b0000000-0000-0000-0000-000000000048', album_id, 'ENG', 'Inglaterra', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', '#012169', 48, 'team')
RETURNING id INTO sec_id;
INSERT INTO stickers (section_id, code, name, order_index, is_foil, sticker_type) VALUES
  (sec_id,'ENG1','Team Logo - Inglaterra',1,true,'badge'),
  (sec_id,'ENG2','Jordan Pickford',2,false,'player'),
  (sec_id,'ENG3','Dean Henderson',3,false,'player'),
  (sec_id,'ENG4','John Stones',4,false,'player'),
  (sec_id,'ENG5','Trent Alexander-Arnold',5,false,'player'),
  (sec_id,'ENG6','Luke Shaw',6,false,'player'),
  (sec_id,'ENG7','Conor Gallagher',7,false,'player'),
  (sec_id,'ENG8','Marc Guehi',8,false,'player'),
  (sec_id,'ENG9','Levi Colwill',9,false,'player'),
  (sec_id,'ENG10','Declan Rice',10,false,'player'),
  (sec_id,'ENG11','Kobbie Mainoo',11,false,'player'),
  (sec_id,'ENG12','Phil Foden',12,false,'player'),
  (sec_id,'ENG13','Team Photo - Inglaterra',13,false,'team_photo'),
  (sec_id,'ENG14','Jude Bellingham',14,false,'player'),
  (sec_id,'ENG15','Marcus Rashford',15,false,'player'),
  (sec_id,'ENG16','Bukayo Saka',16,false,'player'),
  (sec_id,'ENG17','Anthony Gordon',17,false,'player'),
  (sec_id,'ENG18','Ollie Watkins',18,false,'player'),
  (sec_id,'ENG19','Cole Palmer',19,false,'player'),
  (sec_id,'ENG20','Harry Kane',20,false,'player');

END $$;

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
DO $$
DECLARE
  total_stickers INT;
  total_sections INT;
BEGIN
  SELECT COUNT(*) INTO total_stickers FROM stickers;
  SELECT COUNT(*) INTO total_sections FROM sections;
  RAISE NOTICE '✅ Seed completado: % secciones, % figuritas insertadas',
    total_sections, total_stickers;
END $$;
