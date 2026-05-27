'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import SectionMenu from '@/components/album/SectionMenu';
import ProgressBar from '@/components/album/ProgressBar';
import StatsRow from '@/components/album/StatsRow';
import StickerGrid, { type StickerStatus } from '@/components/album/StickerGrid';
import FilterPills from '@/components/album/FilterPills';
import QuantityModal from '@/components/album/QuantityModal';
import { AlbumMenuSkeleton } from '@/components/ui/Skeletons';

// ============================================================
// ALL 49 SECTIONS — matches the seed_wc2026.sql data exactly
// color = primary team/country color, color2 = secondary accent
// ============================================================
const SECTIONS = [
  { code: 'FWC', name: 'Sección Especial', flag: '🏆', color: '#C8A951', color2: '#f0e68c', total: 20, type: 'special' as const },
  { code: 'MEX', name: 'México',           flag: '🇲🇽', color: '#006847', color2: '#CE1126', total: 20, type: 'team' as const },
  { code: 'RSA', name: 'Sudáfrica',        flag: '🇿🇦', color: '#007A4D', color2: '#FFB612', total: 20, type: 'team' as const },
  { code: 'KOR', name: 'Corea del Sur',    flag: '🇰🇷', color: '#CD2E3A', color2: '#003478', total: 20, type: 'team' as const },
  { code: 'CZE', name: 'Chequia',          flag: '🇨🇿', color: '#D7141A', color2: '#11457E', total: 20, type: 'team' as const },
  { code: 'CAN', name: 'Canadá',           flag: '🇨🇦', color: '#FF0000', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'BIH', name: 'Bosnia y Herz.',   flag: '🇧🇦', color: '#002395', color2: '#FECC02', total: 20, type: 'team' as const },
  { code: 'QAT', name: 'Qatar',            flag: '🇶🇦', color: '#8D1B3D', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'SUI', name: 'Suiza',            flag: '🇨🇭', color: '#FF0000', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'BRA', name: 'Brasil',           flag: '🇧🇷', color: '#009C3B', color2: '#FEDF00', total: 20, type: 'team' as const },
  { code: 'MAR', name: 'Marruecos',        flag: '🇲🇦', color: '#C1272D', color2: '#006233', total: 20, type: 'team' as const },
  { code: 'HAI', name: 'Haití',            flag: '🇭🇹', color: '#00209F', color2: '#D21034', total: 20, type: 'team' as const },
  { code: 'SCO', name: 'Escocia',          flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#003B6F', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'USA', name: 'Estados Unidos',   flag: '🇺🇸', color: '#002868', color2: '#BF0A30', total: 20, type: 'team' as const },
  { code: 'PAR', name: 'Paraguay',         flag: '🇵🇾', color: '#D52B1E', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'AUS', name: 'Australia',        flag: '🇦🇺', color: '#00843D', color2: '#FFD700', total: 20, type: 'team' as const },
  { code: 'TUR', name: 'Türkiye',          flag: '🇹🇷', color: '#E30A17', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'GER', name: 'Alemania',         flag: '🇩🇪', color: '#3a3a3a', color2: '#DD0000', total: 20, type: 'team' as const },
  { code: 'CUW', name: 'Curazao',          flag: '🇨🇼', color: '#002B7F', color2: '#F9E814', total: 20, type: 'team' as const },
  { code: 'CIV', name: 'Costa de Marfil',  flag: '🇨🇮', color: '#F77F00', color2: '#009A44', total: 20, type: 'team' as const },
  { code: 'ECU', name: 'Ecuador',          flag: '🇪🇨', color: '#FFD100', color2: '#0072C6', total: 20, type: 'team' as const },
  { code: 'NED', name: 'Países Bajos',     flag: '🇳🇱', color: '#AE1C28', color2: '#FF6600', total: 20, type: 'team' as const },
  { code: 'JPN', name: 'Japón',            flag: '🇯🇵', color: '#BC002D', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'SWE', name: 'Suecia',           flag: '🇸🇪', color: '#006AA7', color2: '#FECC02', total: 20, type: 'team' as const },
  { code: 'TUN', name: 'Túnez',            flag: '🇹🇳', color: '#E70013', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'BEL', name: 'Bélgica',          flag: '🇧🇪', color: '#EF3340', color2: '#FDDA24', total: 20, type: 'team' as const },
  { code: 'EGY', name: 'Egipto',           flag: '🇪🇬', color: '#CE1126', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'IRN', name: 'Irán',             flag: '🇮🇷', color: '#239f40', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'NZL', name: 'Nueva Zelanda',    flag: '🇳🇿', color: '#00247D', color2: '#CC142B', total: 20, type: 'team' as const },
  { code: 'ESP', name: 'España',           flag: '🇪🇸', color: '#AA151B', color2: '#F1BF00', total: 20, type: 'team' as const },
  { code: 'CPV', name: 'Cabo Verde',       flag: '🇨🇻', color: '#003893', color2: '#CF2027', total: 20, type: 'team' as const },
  { code: 'KSA', name: 'Arabia Saudita',   flag: '🇸🇦', color: '#006C35', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'URU', name: 'Uruguay',          flag: '🇺🇾', color: '#5EB6E4', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'FRA', name: 'Francia',          flag: '🇫🇷', color: '#002395', color2: '#ED2939', total: 20, type: 'team' as const },
  { code: 'SEN', name: 'Senegal',          flag: '🇸🇳', color: '#00853F', color2: '#FDEF42', total: 20, type: 'team' as const },
  { code: 'IRQ', name: 'Irak',             flag: '🇮🇶', color: '#CE1126', color2: '#000000', total: 20, type: 'team' as const },
  { code: 'NOR', name: 'Noruega',          flag: '🇳🇴', color: '#EF2B2D', color2: '#003087', total: 20, type: 'team' as const },
  { code: 'ARG', name: 'Argentina',        flag: '🇦🇷', color: '#74ACDF', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'ALG', name: 'Argelia',          flag: '🇩🇿', color: '#006233', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'AUT', name: 'Austria',          flag: '🇦🇹', color: '#ED2939', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'JOR', name: 'Jordania',         flag: '🇯🇴', color: '#007A3D', color2: '#CE1126', total: 20, type: 'team' as const },
  { code: 'POR', name: 'Portugal',         flag: '🇵🇹', color: '#006600', color2: '#FF0000', total: 20, type: 'team' as const },
  { code: 'COL', name: 'Colombia',         flag: '🇨🇴', color: '#FCD116', color2: '#003087', total: 20, type: 'team' as const },
  { code: 'GHA', name: 'Ghana',            flag: '🇬🇭', color: '#006B3F', color2: '#FCD116', total: 20, type: 'team' as const },
  { code: 'PAN', name: 'Panamá',           flag: '🇵🇦', color: '#DA121A', color2: '#1B2FA1', total: 20, type: 'team' as const },
  { code: 'CRO', name: 'Croacia',          flag: '🇭🇷', color: '#FF0000', color2: '#FFFFFF', total: 20, type: 'team' as const },
  { code: 'COD', name: 'Congo DR',         flag: '🇨🇩', color: '#007FFF', color2: '#CE1021', total: 20, type: 'team' as const },
  { code: 'ENG', name: 'Inglaterra',       flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#012169', color2: '#C8102E', total: 20, type: 'team' as const },
];

const STICKER_NAMES: Record<string, string[]> = {
  FWC: ['Panini Logo','Official Emblem','Official Emblem','Official Mascots','Official Slogan','Official Ball','Canadá - Sedes','México - Sedes','USA - Sedes','Italia 1934','Uruguay 1950','Alemania Occ. 1954','Brasil 1962','Alemania Occ. 1974','Argentina 1986','Brasil 1994','Brasil 2002','Italia 2006','Alemania 2014','Argentina 2022'],
  MEX: ['Escudo','L. Malagón','J. Vasquez','J. Sánchez','C. Montes','J. Gallardo','I. Reyes','D. Lainez','C. Rodriguez','E. Álvarez','O. Pineda','M. Ruiz','Foto Equipo','É. Sánchez','H. Lozano','S. Giménez','R. Jiménez','A. Vega','R. Alvarado','C. Huerta'],
  RSA: ['Escudo','R. Williams','S. Chaine','A. Modiba','S. Kabini','T. Rikhotso','M. Lakay','S. Mkhuma','N. Nkosi','B. Tau','E. Lepasa','T. Zwane','Foto Equipo','L. Mabena','M. Zinnbauer','P. Lakay','K. Dolly','L. de Reuck','B. Mobbie','S. Dlamini'],
  KOR: ['Escudo','K. Seung-gyu','S. Hyeon-woo','K. Min-jae','Y. Hyeon-jun','K. Jin-su','K. Tae-hwan','H. Chan-hee','J. Woo-young','B. Junho','L. Jae-sung','N. Seung-woo','Foto Equipo','S. Heung-min','C. Gue-sung','O. Hyeon-gyu','K. Young-gwon','H. Seung-gyu','K. Moon-hwan','H. Seung-won'],
  CZE: ['Escudo','J. Staněk','T. Vaclík','T. Holes','T. Souček','V. Coufal','O. Čelůstka','L. Provod','M. Sadilek','P. Kuchta','A. Hlozek','J. Krejčí','Foto Equipo','P. Sevcik','P. Brazda','M. Jurasek','W. Sykora','A. Vlkanova','M. Chorý','V. Jurečka'],
  CAN: ['Escudo','M. Crepeau','J. St. Clair','K. Miller','D. Henry','A. Johnston','S. Laryea','J. Buchanan','M. Hoilett','J. David','A. Davies','S. Eustaquio','Foto Equipo','T. Corbo','D. Piette','L. Cavallini','A. Osorio','C. Cavallini','J. Arfield','C. Choinière'],
  BIH: ['Escudo','I. Šehić','P. Biščević','E. Kovačević','S. Kolasinac','A. Mitrović','S. Bičakčić','E. Hajradinović','S. Pjanić','M. Pjanić','E. Džeko','S. Rahimić','Foto Equipo','M. Gigović','A. Šalić','N. Gudelj','D. Šunjić','M. Kvesić','A. Hodžić','S. Prevljak'],
  QAT: ['Escudo','M. Barsham','Y. Hassan','P. Miguel','A. Salman','A. Al Haydos','M. Al Bakri','H. Al Haydos','A. Afif','A. Al Ahrak','A. Ismail','B. Boudiaf','Foto Equipo','K. Bassem','Y. Al Rawi','A. Al Moez','M. Muntari','A. Al Shahrani','A. Abdulsalam','A. Al Ansari'],
  SUI: ['Escudo','Y. Sommer','J. Omlin','M. Akanji','N. Elvedi','R. Rodríguez','F. Schär','G. Xhaka','R. Freuler','D. Shaqiri','B. Embolo','N. Amdouni','Foto Equipo','M. Zuber','S. Vargas','V. Okafor','F. Frei','M. Sow','A. Duda','K. Jashari'],
  BRA: ['Escudo','Alisson','Ederson','Marquinhos','É. Militão','Danilo','Casemiro','L. Paquetá','B. Guimarães','Fred','Gerson','Raphinha','Foto Equipo','Rodrygo','G. Martinelli','Vinicius Jr.','G. Jesus','Richarlison','Endrick','Savinho'],
  MAR: ['Escudo','Y. Bounou','M. Tagnaouti','N. Aguerd','A. Hakimi','B. Bounou','Y. Sabiri','S. Amrabat','I. Ounahi','H. Ziyech','Y. En-Nesyri','S. Amallah','Foto Equipo','Y. Jabrane','A. Dari','B. Aboukhlal','I. Benali','Z. Abuouf','W. Cheddira','S. Benoun'],
  HAI: ['Escudo','K. Fayçal','K. Laferrière','S. Birone','P. Birone','P. Horton','G. Nazon','S. Cantave','M. Jean','D. Geffrard','N. Calvé','G. Remy','Foto Equipo','M. Cantave','M. Mombele','N. Cornely','D. Nazon','W. Etienne','R. Francois','M. Jean-Louis'],
  SCO: ['Escudo','A. Gunn','C. Gordon','K. Tierney','A. Robertson','L. Hendry','J. Souttar','G. McGregor','S. McTominay','B. McLaughlin','C. Adams','J. McGinn','Foto Equipo','L. Ferguson','B. Gilmour','R. Christie','J. Forrest','A. Dykes','T. Lawrence','K. MacKenzie'],
  USA: ['Escudo','M. Turner','Z. Steffen','S. Ream','T. Adams','S. Dest','A. Robinson','W. McKennie','C. Pulisic','G. Weah','R. Pepi','B. Aaronson','Foto Equipo','F. Musah','J. Reyna','J. Sargent','M. Hoppe','E. Lletget','D. Yueill','C. Roldan'],
  PAR: ['Escudo','A. Silva','R. Fernandez','G. Arzamendia','F. Balbuena','O. Romero','L. Alonso','A. Almirón','D. Espinoza','J. Enciso','C. González','R. Bobadilla','Foto Equipo','A. Sanabria','L. Cubas','V. Villalba','I. Piris','D. Green','J. Ozoria','K. Villasanti'],
  AUS: ['Escudo','M. Ryan','A. Redmayne','H. Souttar','A. Behich','N. Atkinson','K. Rowles','A. Mooy','R. McGree','M. Leckie','M. Goodwin','C. Irvine','Foto Equipo','M. Duke','M. Devlin','Z. Degenek','J. Irvine','C. Cavallaro','T. Rogic','C. Ikonomidis'],
  TUR: ['Escudo','M. Çakır','A. Bayındır','S. Kabak','M. Demiral','Z. Çelik','C. Söyüncü','H. Çalhanoğlu','A. Yıldız','K. Akturkoglu','B. Yılmaz','H. Çalhanoglu','Foto Equipo','O. Güler','S. Özcan','F. Şahin','İ. Güneş','E. Dursun','M. Yılmaz','A. Karaman'],
  GER: ['Escudo','M. Neuer','M. Flekken','A. Rüdiger','N. Schlotterbeck','J. Kimmich','R. Gosens','L. Goretzka','T. Müller','J. Musiala','L. Gnabry','K. Havertz','Foto Equipo','S. Gündoğan','R. Koch','M. Raum','F. Wirtz','N. Füllkrug','C. Nkunku','T. Werner'],
  CUW: ['Escudo','E. Waterman','C. Fränkel','C. Häberle','J. Antonucci','C. Vink','D. Roemeratoe','J. Bacuna','L. Bacuna','G. Haps','F. Drijvers','J. Doedens','Foto Equipo','K. Dierckx','T. Mies','A. Emeran','L. Narain','E. Pita','J. Ramos','A. Dos Santos'],
  CIV: ['Escudo','S. Sangaré','B. Zouzoua','E. Bailly','W. Boly','D. Doué','F. Koné','G. Koné','M. Sangaré','F. Koné','S. Haller','J. Konaté','Foto Equipo','I. Diallo','K. Kouyaté','B. Traoré','N. Doué','I. Traoré','A. Pléa','M. Gradel'],
  ECU: ['Escudo','H. Domínguez','A. Minda','F. Hincapié','P. Estupiñán','G. Caicedo','A. Angulo','C. Gruezo','M. Caicedo','J. Plata','E. Valencia','G. Arroyo','Foto Equipo','O. González','J. Cifuentes','J. Méndez','J. Ibarra','D. Palacios','J. Sarmiento','E. Litardo'],
  NED: ['Escudo','R. Flekken','J. Bijlow','V. van Dijk','D. Blind','D. Dumfries','T. Malacia','F. de Jong','B. Bergwijn','S. Berghuis','M. Depay','C. Gakpo','Foto Equipo','T. Reijnders','J. Veerman','X. Msiaki','B. Brobbey','W. Weghorst','N. Maduro','L. de Ligt'],
  JPN: ['Escudo','S. Gonda','D. Schmidt','M. Yoshida','M. Tanaka','H. Sakai','Y. Nagatomo','W. Endo','R. Hashioka','D. Ito','T. Minamino','R. Yamane','Foto Equipo','K. Mitoma','J. Ito','D. Ugarte','H. Ito','O. Zaha','K. Kamada','T. Ueda'],
  SWE: ['Escudo','R. Olsen','K. Johnsson','V. Lindelöf','L. Augustinsson','M. Lustig','P. Andersson','E. Forsberg','D. Kulusevski','I. Ekdal','Z. Ibrahimović','A. Isak','Foto Equipo','D. Svensson','C. Olsson','M. Svanberg','A. Elanga','A. Tibbling','J. Larsson','K. Rydström'],
  TUN: ['Escudo','M. Dahmen','A. Benguit','Y. Meriah','D. Bronn','A. Ben Ali','M. Talbi','N. Laidouni','H. Ben Amor','A. Maaloul','W. Khazri','F. Ben Mustapha','Foto Equipo','M. Drager','K. Ben Romdhane','A. Jaziri','M. Ben Amor','M. Grindi','M. Sassi','S. Sliti'],
  BEL: ['Escudo','T. Courtois','K. Casteels','T. Alderweireld','J. Vertonghen','T. Meunier','Y. Carrasco','A. Witsel','K. De Bruyne','E. Hazard','R. Lukaku','D. Mertens','Foto Equipo','Z. Aouri','A. Doku','L. Openda','A. Saelemaekers','L. Trossard','C. Theate','A. Onana'],
  EGY: ['Escudo','M. El Shenawy','A. El Shennawy','A. Hegazy','O. Kamal','M. Abdel Shafy','A. Hamdi','S. Tarek','M. Elneny','O. El Sayed','M. Salah','T. Mohamed','Foto Equipo','R. El Neny','H. Diab','A. Trezeguet','M. Hany','K. Afsha','A. Sherif','M. Lasheen'],
  IRN: ['Escudo','A. Beiranvand','H. Hosseini','S. Hosseini','M. Pouraliganji','R. Rezaeian','E. Hajsafi','M. Nourollahi','S. Jahanbakhsh','A. Gholizadeh','M. Taremi','K. Ansarifard','Foto Equipo','V. Amiri','S. Cheshmi','M. Ahadi','F. Karimi','A. Shojaei','B. Mohammadi','P. Rezaian'],
  NZL: ['Escudo','O. Sail','M. Woud','W. McGarry','T. Taylor','B. Old','L. Cacace','R. De Jong','M. Fisher','C. Wood','H. Elliott','T. Payne','Foto Equipo','C. Sargeant','J. Barbarouses','A. Gressel','N. Dekker','J. Hamilton','Y. Driessen','J. Verhoeven'],
  ESP: ['Escudo','U. Simón','R. Sánchez','D. Carvajal','A. Laporte','R. Le Normand','F. García','P. Gavi','R. Merino','M. Casado','P. Zubimendi','Y. Yamal','Foto Equipo','F. Torres','N. Williams','A. Morata','B. Díaz','J. Oyarzabal','D. Olmo','A. Baena'],
  CPV: ['Escudo','M. Vozinha','L. Varela','C. Cláudio','S. Decarli','C. Borges','H. Tavares','K. Andrade','J. Rodrigues','A. Tavares','R. Tavares','D. Fortes','Foto Equipo','G. Brito','H. Alves','N. Moreira','Z. Lima','B. Andrade','C. Neto','T. Lima'],
  KSA: ['Escudo','M. Al Owais','M. Al Rubaie','A. Al Shahrani','A. Al Amri','A. Al Hamdan','S. Al Dawsari','A. Al Malki','M. Kanno','S. Al Ghannam','F. Al Buraikan','A. Al Shehri','Foto Equipo','H. Bahebri','A. Al Dawsari','Y. Al Shahrani','M. Al Buraikan','A. Qahtani','O. Hawsawi','N. Al Aqidi'],
  URU: ['Escudo','F. Muslera','M. Olivera','J. Giménez','S. Coates','J. Nandez','R. De Arrascaeta','F. Valverde','M. Ugarte','L. Torreira','L. Suárez','D. Núñez','Foto Equipo','D. Bentancur','B. Arévalo','G. Varela','A. Rodríguez','M. Gómez','F. Torres','S. Rochet'],
  FRA: ['Escudo','M. Maignan','A. Areola','W. Saliba','D. Upamecano','T. Hernández','A. Tchouaméni','A. Rabiot','Y. Fofana','N. Zaïre-Emery','E. Camavinga','O. Dembélé','Foto Equipo','A. Griezmann','K. Mbappé','M. Thuram','R. Balogun','C. Nkunku','B. Kolo Muani','M. Diaby'],
  SEN: ['Escudo','É. Mendy','A. Dieng','K. Koulibaly','A. Saliou','I. Ciss','P. Gueye','C. Kouyaté','B. Diatta','S. Mané','I. Sarr','B. Diallo','Foto Equipo','M. Diatta','Y. Sabaly','A. Mbaye','A. Goudiaby','A. Sy','D. Diouf','N. Mendy'],
  IRQ: ['Escudo','J. Hassan','M. Hassan','A. Hameed','A. Hamad','A. Abbas','S. Jasim','A. Al-Hamad','F. Mahdi','A. Dhurgham','A. Hasan','H. Amer','Foto Equipo','B. Ahmed','S. Kareem','M. Hamid','A. Saif','A. Razak','A. Ali','M. Nouri'],
  NOR: ['Escudo','Ø. Nyland','R. Jarstein','L. Sæverås','O. Ajer','A. Strand Larsen','M. Ødegaard','S. Berge','S. Johansen','K. Thorstvedt','M. Elyounoussi','E. Haaland','Foto Equipo','A. King','P. Sousa','C. Normann','N. Pedersen','T. Hestad','V. Solheim','F. Aursnes'],
  ARG: ['Escudo','E. Martínez','F. Montiel','N. Otamendi','C. Romero','M. Acuña','R. De Paul','E. Fernández','A. Mac Allister','G. Lo Celso','L. Paredes','Á. Di María','Foto Equipo','J. Almada','T. Almada','L. Messi','J. Álvarez','L. Martínez','V. Mammana','N. González'],
  ALG: ['Escudo','R. Raïs M\'Bolhi','A. Mandrea','D. Benlamri','A. Mandi','R. Bensebaini','I. Slimani','Y. Belaïli','S. Feghouli','A. Belaïli','M. Delort','S. Benrahma','Foto Equipo','B. Brahimi','Y. Atal','R. Mahrez','H. Zerrouki','A. Soudani','L. Bensebaini','M. Aïb'],
  AUT: ['Escudo','D. Bachmann','P. Pentz','D. Alaba','N. Lienhart','P. Lainer','S. Posch','X. Schlager','F. Grillitsch','M. Sabitzer','K. Arnautović','C. Gregoritsch','Foto Equipo','A. Baumgartner','N. Seiwald','D. Ljubicic','T. Laimer','G. Wöber','M. Wimmer','R. Querfeld'],
  JOR: ['Escudo','Y. Shaban','A. Raba','B. Alraghalieh','H. Naser','M. Saleh','O. Al Rashdan','M. Habes','A. Obeidat','A. Al Nawateer','H. Al Bawab','F. Awad','Foto Equipo','M. Asad','B. Al Shakhri','Y. Al Naimat','A. Al Rasan','M. Suleiman','T. Al Rawabdeh','A. Al Dardour'],
  POR: ['Escudo','R. Patrício','D. Costa','P. Pereira','R. Dias','J. Cancelo','N. Semedo','J. Palhinha','V. Fernandes','B. Fernandes','B. Silva','R. Leão','Foto Equipo','D. Dalot','M. Nunes','O. Neves','A. Silva','G. Ramos','R. Horta','C. Ronaldo'],
  COL: ['Escudo','D. Ospina','C. Vargas','Y. Mina','D. Sánchez','J. Arias','E. Sinisterra','J. Lerma','M. Cabal','L. Díaz','R. Falcao','J. Cuadrado','Foto Equipo','R. Mojica','S. Mina','F. Reyes','M. Ríos','A. Correa','J. Durán','L. Bonilla'],
  GHA: ['Escudo','L. Ati Zigi','J. Danlad','D. Amartey','A. Djiku','B. Mensah','A. Sulemana','T. Partey','M. Kudus','S. Kyereh','J. Ayew','A. Ayew','Foto Equipo','T. Antwi','I. Paintsil','A. Semenyo','G. Bediako','S. Opoku','K. Opoku','R. Tamakloe'],
  PAN: ['Escudo','L. Mejía','V. Penedo','M. Murillo','R. Miller','A. Murillo','A. Muñoz','R. Torres','A. Rodríguez','É. Davis','R. Córdoba','B. White','Foto Equipo','A. Asprilla','I. Gaitán','C. Ávila','J. Murillo','A. Tejada','M. Dovikas','R. Ortiz'],
  CRO: ['Escudo','D. Livaković','I. Gvardiol','D. Lovren','J. Šutalo','B. Sosa','J. Vrsaljko','L. Modrić','M. Kovačić','M. Brozoviç','I. Perišić','B. Kramarić','Foto Equipo','N. Vlašić','J. Pašalić','A. Budimir','L. Ivanušec','M. Oršić','M. Čavar','T. Šutalo'],
  COD: ['Escudo','O. Mvuama','B. Lokwa','D. Mbemba','G. Ngadeu','M. Boyata','J. Tisserand','D. Bolasie','C. Masuaku','P. Mpoku','D. Bakambu','M. Mbokani','Foto Equipo','Z. Mounie','B. Nsimba','G. Wissa','S. Nkuutu','B. Eboa','C. Tshimanga','P. Loba'],
  ENG: ['Escudo','J. Pickford','D. Henderson','J. Stones','T. Alexander-Arnold','L. Shaw','C. Gallagher','M. Guehi','L. Colwill','D. Rice','K. Mainoo','P. Foden','Foto Equipo','J. Bellingham','M. Rashford','B. Saka','A. Gordon','O. Watkins','C. Palmer','H. Kane'],
};


function generateStickers(code: string, total: number) {
  const names = STICKER_NAMES[code] ?? Array.from({ length: total }, (_, i) => `Jugador ${i + 1}`);
  return Array.from({ length: total }, (_, i) => ({
    id: `${code}${i + 1}`,
    code: `${code}${i + 1}`,
    name: names[i] ?? `${code}${i + 1}`,
    is_foil: i === 0,
    status: undefined as StickerStatus | undefined,
  }));
}

const TOAST_MESSAGES: Record<StickerStatus, { text: string; color: string }> = {
  owned:    { text: 'Marcada como pegada ✓',   color: '#4ade80' },
  repeated: { text: 'Marcada como repetida ↻', color: '#FAC71E' },
  wanted:   { text: 'Marcada como faltante ✗', color: '#fb7185' },
};

// ── Helper: hex to rgba ───────────────────────────────────
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

type View = 'menu' | 'section';
type Toast = { text: string; color: string; key: number } | null;

export default function AlbumPage() {
  const [view, setView]             = useState<View>('menu');
  const [activeCode, setActiveCode] = useState('MEX');
  const [filter, setFilter]         = useState<'all' | 'owned' | 'missing'>('all');
  const [statusMap, setStatusMap]   = useState<Record<string, { status: StickerStatus; quantity: number }>>({});
  const [toast, setToast]           = useState<Toast>(null);
  const [userId, setUserId]         = useState<string | null>(null);
  const [fetching, setFetching]     = useState(true);

  // ── Quantity Modal State ───────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStickerId, setSelectedStickerId] = useState('');
  const [selectedStickerName, setSelectedStickerName] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // ── Load user session + stickers from Supabase ────────
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setFetching(false); return; }
      setUserId(user.id);

      // Load all user_stickers joined with sticker codes
      supabase
        .from('user_stickers')
        .select('status, quantity, stickers(code)')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (!data) { setFetching(false); return; }
          const map: Record<string, { status: StickerStatus; quantity: number }> = {};
          data.forEach((row: any) => {
            const code = Array.isArray(row.stickers)
              ? row.stickers[0]?.code
              : row.stickers?.code;
            if (code) map[code] = { status: row.status as StickerStatus, quantity: row.quantity || 1 };
          });
          setStatusMap(map);
          setFetching(false);
        });
    });
  }, []);

  // ── Totals ────────────────────────────────────────────
  const totalOwned    = useMemo(() => Object.values(statusMap).filter(s => s.status === 'owned' || s.status === 'repeated').length, [statusMap]);
  const totalRepeated = useMemo(() => Object.values(statusMap).reduce((acc, s) => acc + (s.status === 'repeated' ? s.quantity : 0), 0), [statusMap]);
  const totalStickers = SECTIONS.reduce((s, t) => s + t.total, 0);
  const totalMissing  = totalStickers - totalOwned;

  // ── Active section ────────────────────────────────────
  const activeSection = SECTIONS.find(s => s.code === activeCode)!;
  const allStickers   = useMemo(() => generateStickers(activeCode, activeSection.total), [activeCode, activeSection.total]);

  const sectionOwned    = allStickers.filter(s => {
    const entry = statusMap[s.id];
    return entry?.status === 'owned' || entry?.status === 'repeated';
  }).length;
  const sectionRepeated = allStickers.reduce((acc, s) => {
    const entry = statusMap[s.id];
    return acc + (entry?.status === 'repeated' ? entry.quantity : 0);
  }, 0);
  const sectionMissing  = activeSection.total - sectionOwned;
  const sectionPct      = Math.round((sectionOwned / activeSection.total) * 100);

  const filtered = filter === 'owned'
    ? allStickers.filter(s => {
        const status = statusMap[s.id]?.status;
        return status === 'owned' || status === 'repeated';
      })
    : filter === 'missing'
    ? allStickers.filter(s => {
        const status = statusMap[s.id]?.status;
        return !status || status === 'wanted';
      })
    : allStickers;

  const stickerData = filtered.map(s => ({
    ...s,
    status: statusMap[s.id]?.status ?? ('wanted' as StickerStatus),
    quantity: statusMap[s.id]?.quantity ?? 1
  }));

  // ── Handlers ──────────────────────────────────────────
  const handleSelect = (code: string) => {
    setActiveCode(code);
    setFilter('all');
    setView('section');
  };

  const handleBack = () => {
    setView('menu');
    setFilter('all');
  };

  const handleStatusChange = useCallback(async (id: string, status: StickerStatus, quantity: number = 1) => {
    // Optimistic update
    setStatusMap(prev => ({
      ...prev,
      [id]: { status, quantity }
    }));
    setToast({ ...TOAST_MESSAGES[status], key: Date.now() });
    setTimeout(() => setToast(null), 1800);

    // Persist to Supabase if logged in
    if (!userId) return;
    const supabase = createClient();

    // Find sticker UUID by code
    const { data: stickerRow, error: stickerErr } = await supabase
      .from('stickers')
      .select('id')
      .eq('code', id)
      .single();

    if (!stickerRow) {
      console.error('Sticker lookup failed:', stickerErr);
      return;
    }

    if (status === 'wanted') {
      // 'wanted' is the default state — remove the row
      await supabase
        .from('user_stickers')
        .delete()
        .eq('user_id', userId)
        .eq('sticker_id', stickerRow.id);
    } else {
      // Manual upsert to avoid onConflict issues
      const { data: existing } = await supabase
        .from('user_stickers')
        .select('id')
        .eq('user_id', userId)
        .eq('sticker_id', stickerRow.id)
        .maybeSingle();

      if (existing) {
        const { error: updateErr } = await supabase
          .from('user_stickers')
          .update({ status, quantity, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (updateErr) console.error('Update error:', updateErr);
      } else {
        const { error: insertErr } = await supabase
          .from('user_stickers')
          .insert({ user_id: userId, sticker_id: stickerRow.id, status, quantity });
        
        if (insertErr) {
          // Fallback: If insert fails due to missing user profile, attempt to recreate it
          if (insertErr.code === '23503') { 
            console.log('Attempting to recover user profile...');
            await supabase.from('users').insert({
              id: userId,
              email: `user_${userId.substring(0,6)}@swap.local`,
              username: `user_${userId.substring(0,8)}`,
              display_name: 'Sticker Collector'
            });
            // Try inserting sticker again
            await supabase
              .from('user_stickers')
              .insert({ user_id: userId, sticker_id: stickerRow.id, status, quantity });
          } else {
            console.error('Insert error:', insertErr);
          }
        }
      }
    }
  }, [userId]);

  const handleOpenQuantityModal = useCallback((id: string, name: string, status: StickerStatus, quantity: number) => {
    setSelectedStickerId(id);
    setSelectedStickerName(name);
    setSelectedQuantity(quantity);
    setModalOpen(true);
  }, []);

  const handleSaveQuantity = useCallback((quantity: number) => {
    handleStatusChange(selectedStickerId, 'repeated', quantity);
  }, [selectedStickerId, handleStatusChange]);

  const handleSetStatusFromModal = useCallback((status: 'owned' | 'wanted') => {
    handleStatusChange(selectedStickerId, status, 1);
  }, [selectedStickerId, handleStatusChange]);

  // ── Section hero colors ────────────────────────────────
  const c1 = activeSection.color;
  const c2 = activeSection.color2;
  const isSpecial = activeSection.type === 'special';

  // ============================================================
  // MENU VIEW
  // ============================================================
  if (fetching) return <AlbumMenuSkeleton />;

  if (view === 'menu') {
    return (
      <div className="relative min-h-screen pb-28 md:pb-8 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-8 pb-5">
          <div className="flex flex-col gap-1.5">
            <span className="block text-[10px] uppercase font-bold tracking-[0.25em] font-body" style={{ color: '#FAC71E' }}>
              PANINI · FIFA
            </span>
            <span className="font-display text-[32px] font-bold leading-none tracking-tight drop-shadow-sm" style={{ color: '#f0eee8' }}>
              WORLD CUP 2026
            </span>
          </div>
          <Link
            href="/profile"
            id="menu-profile-link"
            className="flex items-center gap-2.5 px-2.5 py-2 card-hover-transition"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-display text-sm"
              style={{ background: 'linear-gradient(135deg, #FAC71E, #f0a500)', color: '#0a0a0f', boxShadow: '0 2px 10px rgba(250,199,30,0.3)' }}
            >
              U
            </div>
            <span className="text-[12px] font-medium font-body hidden sm:block pr-2" style={{ color: 'rgba(240,238,232,0.6)' }}>
              Mi perfil
            </span>
          </Link>
        </div>

        <div className="px-5" style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '12px' }}>
          <ProgressBar owned={totalOwned} total={totalStickers} />
        </div>
        <div className="px-5" style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '20px' }}>
          <StatsRow owned={totalOwned} repeated={totalRepeated} missing={totalMissing} />
        </div>

        {/* Quick manage list button */}
        <div className="px-5" style={{ paddingLeft: '20px', paddingRight: '20px', marginBottom: '24px' }}>
          <Link
            href="/album/quick"
            className="w-full py-3.5 rounded-2xl text-[13px] font-body font-bold flex items-center justify-center gap-2 transition-all bg-[rgba(250,199,30,0.08)] border border-[rgba(250,199,30,0.25)] text-[#FAC71E] hover:bg-[rgba(250,199,30,0.12)] active:scale-[0.98] shadow-sm shadow-[#FAC71E]/5"
          >
            <span className="text-lg leading-none">⚡</span>
            <span>Carga Rápida (Listas de Códigos)</span>
          </Link>
        </div>

        <div className="mx-5 h-px" style={{ marginLeft: '20px', marginRight: '20px', marginBottom: '24px', background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />

        <div className="px-1">
          <SectionMenu sections={SECTIONS} statusMap={statusMap} onSelect={handleSelect} />
        </div>

        {/* Signature */}
        <div className="flex justify-center items-center py-8 opacity-45">
          <span className="text-[10px] tracking-widest text-[#f0eee8] font-mono">pixelia - crisman</span>
        </div>
      </div>
    );
  }

  // ============================================================
  // SECTION DETAIL VIEW — Personalized per country
  // ============================================================
  return (
    <div className="relative min-h-screen pb-28 md:pb-8">

      {/* ── HERO BANNER ─────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: isSpecial
            ? `linear-gradient(160deg, #1a1200 0%, #2a1d00 40%, #0a0a0f 100%)`
            : `linear-gradient(160deg, ${hexToRgba(c1, 0.9)} 0%, ${hexToRgba(c2, 0.4)} 50%, #0a0a0f 100%)`,
          paddingTop: '52px', // space for sticky header
        }}
      >
        {/* Radial glow — team color */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${hexToRgba(c1, 0.35)} 0%, transparent 65%)`,
          }}
        />

        {/* Diagonal stripe texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              ${c1}22 0px,
              ${c1}22 1px,
              transparent 1px,
              transparent 28px
            )`,
          }}
        />

        {/* Hero content */}
        <div className="relative px-5 pt-6 pb-8 flex items-end gap-4">
          {/* Big flag */}
          <div
            className="flex-shrink-0 flex items-center justify-center text-6xl rounded-2xl"
            style={{
              width: 96,
              height: 96,
              background: hexToRgba(c1, 0.2),
              border: `0.5px solid ${hexToRgba(c1, 0.4)}`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {activeSection.flag}
          </div>

          <div className="flex-1 min-w-0">
            {/* Code chip */}
            <span
              className="inline-block mb-1.5 text-[10px] font-body font-bold uppercase tracking-widest px-2 py-0.5"
              style={{
                background: hexToRgba(c1, 0.25),
                border: `0.5px solid ${hexToRgba(c1, 0.5)}`,
                color: isSpecial ? '#FAC71E' : '#f0eee8',
                borderRadius: '6px',
              }}
            >
              {activeSection.code}
            </span>

            {/* Team name */}
            <h1 className="font-display text-[38px] font-bold leading-[1.1] tracking-tight drop-shadow-md" style={{ color: '#f0eee8' }}>
              {activeSection.name.toUpperCase()}
            </h1>

            {/* Progress */}
            <div className="flex items-center gap-4 mt-4">
              {/* Mini bar */}
              <div className="flex-1 relative shadow-inner" style={{ height: '6px', background: 'rgba(255,255,255,0.12)', borderRadius: '99px' }}>
                <div
                  style={{
                    width: `${sectionPct}%`,
                    height: '100%',
                    borderRadius: '99px',
                    background: `linear-gradient(90deg, ${c1}, ${c2})`,
                    boxShadow: `0 0 10px ${c1}60`,
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>
              <span className="font-display text-[20px] font-bold leading-none flex-shrink-0 drop-shadow-sm" style={{ color: c1 }}>
                {sectionPct}%
              </span>
            </div>

            {/* Stats row inline */}
            <div className="flex gap-5 mt-4">
              {[
                { label: 'Pegadas',  value: sectionOwned,    color: '#4ade80' },
                { label: 'Repetidas', value: sectionRepeated, color: '#FAC71E' },
                { label: 'Faltan',   value: sectionMissing,  color: '#fb7185' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="font-display text-[22px] font-bold leading-none drop-shadow-sm" style={{ color }}>{value}</span>
                  <span className="text-[10px] font-body font-medium uppercase tracking-wider" style={{ color: 'rgba(240,238,232,0.4)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade into dark */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-10"
          style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0f)' }}
        />
      </div>

      {/* ── STICKY HEADER (back + title) ───────────────────── */}
      <div
        className="fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{
          background: `rgba(${parseInt(c1.slice(1,3),16)},${parseInt(c1.slice(3,5),16)},${parseInt(c1.slice(5,7),16)},0.15)`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: `0.5px solid ${hexToRgba(c1, 0.2)}`,
        }}
      >
        <button
          id="back-to-menu"
          onClick={handleBack}
          className="flex items-center justify-center w-9 h-9 card-hover-transition active:scale-95 flex-shrink-0"
          style={{
            background: hexToRgba(c1, 0.15),
            border: `0.5px solid ${hexToRgba(c1, 0.35)}`,
            borderRadius: '10px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#f0eee8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13L5 8l5-5" />
          </svg>
        </button>

        <span className="text-[22px] drop-shadow-sm">{activeSection.flag}</span>
        <span className="font-display text-[18px] font-bold leading-none flex-1 tracking-wide" style={{ color: '#f0eee8' }}>
          {activeSection.name.toUpperCase()}
        </span>
        <span className="font-display text-[16px] font-bold tracking-widest" style={{ color: c1 }}>
          {sectionOwned}/{activeSection.total}
        </span>

        <Link
          href="/profile"
          id="section-profile-link"
          className="flex items-center justify-center w-9 h-9 card-hover-transition flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FAC71E, #f0a500)',
            borderRadius: '10px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0a0a0f" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="8" cy="5" r="3" />
            <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" />
          </svg>
        </Link>
      </div>

      {/* ── FILTER + GRID ───────────────────────────────────── */}
      <div
        className="relative z-10 pt-4"
        style={{
          background: `linear-gradient(to bottom, ${hexToRgba(c1, 0.04)} 0%, transparent 120px)`,
        }}
      >
        {/* Filter pills */}
        <div className="flex items-center justify-between px-4 mb-3">
          <span className="text-[11px] uppercase tracking-[0.14em] font-body" style={{ color: 'rgba(240,238,232,0.25)' }}>
            FIGURITAS
          </span>
          <FilterPills active={filter} onChange={setFilter} />
        </div>

        {/* Sticker grid */}
        <StickerGrid
          stickers={stickerData}
          onStatusChange={handleStatusChange}
          onOpenQuantityModal={handleOpenQuantityModal}
        />

        {/* Signature */}
        <div className="flex justify-center items-center py-10 opacity-30">
          <span className="text-[10px] tracking-widest text-[#f0eee8] font-mono">pixelia - crisman</span>
        </div>
      </div>

      {/* ── TOAST ───────────────────────────────────────────── */}
      {toast && (
        <div
          key={toast.key}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 animate-toast-in z-50 px-4 py-2.5 text-sm font-body font-medium whitespace-nowrap"
          style={{
            background: '#14141c',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '99px',
            color: toast.color,
          }}
        >
          {toast.text}
        </div>
      )}

      {/* Quantity Modal */}
      <QuantityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        stickerId={selectedStickerId}
        stickerName={selectedStickerName}
        initialQuantity={selectedQuantity}
        onSave={handleSaveQuantity}
        onSetStatus={handleSetStatusFromModal}
      />
    </div>
  );
}
