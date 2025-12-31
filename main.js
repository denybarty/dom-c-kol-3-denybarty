// -----------------------------------------------
// Data pro generování náhodných osob
// -----------------------------------------------

// Pole povolených pohlaví, slouží jako klíč k výběru jména/příjmení dle pohlaví. 
//Zde pracujeme se dvěma hodnotami 'male' a'female'.
const genders   = ['male', 'female'];

// Seznam ženských křestních jmen používaných pro náhodný výběr. Vzorky jsou z běžně používaných českých jmen.
const nameF     = ['Adéla','Barbora','Denisa','Petra','Lucie','Kateřina','Karolína','Libuše','Veronika','Agáta','Hana','Pavlína','Alexandra','Jitka','Jana','Klára','Alena','Věra','Marie','Eva','Anna','Lenka','Mirka','Jasmína','Amélie'];

// Seznam mužských křestních jmen pro náhodný výběr.
const nameM     = ['Jiří','Jan','Petr','Josef','Pavel','Martin','Tomáš','Jaroslav','Miroslav','Zdeněk','Václav','Michal','Frntišek','Jakub','Milan','Karel','Lukáš','David','Vladimír','Ondřej','Ladislav','Roman','Marek','Stanislav','David'];

// Seznam ženských příjmení (s koncovkou -ová apod.), pro správný formát.
const surnameF  = ['Balíková','Adamová','Bártová','Faltusová','Fiedlerová','Batková','Mironová','Kadlecová','Malinová','Tondrová','Hývnarová','Kostelecká','Macáková','Lysáková','Kovářová','Millerová','Frydrychová','Nová','Orelová','Melicharová','Moravcová','Malíková','Nožičková','Odstrčilová','Paličková'];

// Seznam mužských příjmení odpovídajících výše uvedeným ženským variantám.
const surnameM  = ['Balík','Adam','Bárta','Faltus','Fiedler','Batka','Mironov','Kadlec','Malina','Tondra','Hývnar','Kostelecký','Macák','Lysák','Kovář','Miller','Frydrych','Nový','Orel','Melichar','Moravec','Malík','Nožička','Odstrčil','Palička'];

// Předdefinované pracovní úvazky. Slouží pro náhodný výběr.
const workloads = [10, 20, 30, 40];


// -------------------
// Vstupní parametry 
// -------------------

// dtoIn je objekt určující:
// - count: kolik osob vygenerovat
// - age.min/max: věkový rozsah, v němž má proběhnout vygenerovaní datumu narození.
//   Pozn.: Věk se počítá vůči aktuálnímu datu, takže datum narození bude v intervalu:
//          [today - maxAge, today - minAge]
const dtoIn = {
  count: 5,
  age: { 
    min: 19, 
    max: 35 
  } // generování data narození tak, aby vycházel věk mezi 19 a 35 lety
};


// ---------------------------------
// Pomocné funkce pro náhodný výběr
// ---------------------------------

//Funkce pro výpočet random hodnot všech výstupů kromě datumu
//Vrátí náhodný index v rozsahu 0..(n-1). pomocí funkce Math.floor zaokrouhlí dolů pro celočíselný vásledek.
//Používá Math.random(), které dává číslo v <0,1), násobením n a zaokrouhlením dolů získáme platný index do pole délky n.
const rndIndex = (n) => Math.floor(Math.random() * n);

//Funkce pro výpočet random datumu
//Vrátí náhodné datum pro objekt Date mezi hodnotou start (včetně) a hodnotou end (exkluzivně).
//Princip: vybere se náhodný časový posun v milisekundách v intervalu <0, end-start> a přičte se ke start.getTime().
function rndDateBetween(start, end) {
  const time = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(time);
}

/**
 * Vygeneruje náhodné ISO datum narození tak, aby výsledný věk byl v intervalu [minAge, maxAge].
 * 1) Založíme hranice intervalu tak, že od dnešního data odečteme maxAge a minAge (po letech),
 *    čímž zachováme měsíc/den
 * 2) Vybereme náhodné datum mezi těmito hranicemi a vrátíme ISO string.
 */
function rndBirthdateForAgeRange(minAge, maxAge) {
  const now = new Date();

  // Nejstarší povolené datum narození (odpovídá maxAge)
  const start = new Date(now);
  start.setFullYear(now.getFullYear() - maxAge);

  // Nejmladší povolené datum narození (odpovídá minAge)
  const end = new Date(now);
  end.setFullYear(now.getFullYear() - minAge);

  // Rovnoměrný výběr uvnitř intervalu [start, end)
  const result = rndDateBetween(start, end);

  // ISO formát (např. '2025-06-14T25:57:00.000Z')
  return result.toISOString();
}

// ----------------------------------------------------------------------------
// Hlavní generátor: sestaví pole DtoOut s vygenerovanými objekty dle zadání
// ----------------------------------------------------------------------------

function main(dtoIn) {
  // Základní validace vstupů:
  // - dtoIn.count: musí být číslo >= 1 (pro vygenerování alespon 1 záznamu)
  // - dtoIn.age.min/max: musí být čísla, min >= 18 a max >= min
  if (typeof dtoIn.count !== 'number' || dtoIn.count <= 0) {
    throw new Error('Invalid input: dtoIn.count nesmí být menší než 1!');
  }
  if (typeof dtoIn.age.min !== 'number' || typeof dtoIn.age.max !== 'number' || dtoIn.age.min < 18 || dtoIn.age.max >= 60 || dtoIn.age.max < dtoIn.age.min) {
    throw new Error('Invalid input: age.min a age.max musí být kladná, maxmusí být v rozsahu 18 a 60 a zárověn musí být roven nebo větší než min.');
  }

  // dtoOut bude výsledné pole s vygenerovanými záznamy
  const dtoOut = [];

  // Cyklus for vygeneruje požadovaný počet záznamů viz hodnota count ze vstupu v dtoIn
  for (let i = 0; i < dtoIn.count; i++) {
    // 1) Náhodný výběr pohlaví (male/female) - vygenerování random indexu z pole gender a dosazení do konstanty
    const genderIdx = rndIndex(genders.length);
    const gender = genders[genderIdx];

    // 2) Výběr jména dle pohlaví a dosazení do konstant name a surname
    const name =
      gender === 'female'
        ? nameF[rndIndex(nameF.length)]
        : nameM[rndIndex(nameM.length)];

    // 3) Výběr příjmení dle pohlaví
    const surname =
      gender === 'female'
        ? surnameF[rndIndex(surnameF.length)]
        : surnameM[rndIndex(surnameM.length)];

    // 4) Náhodný výběr pracovního úvazku z předdefinovaných hodnot v polu workloads
    const workload = workloads[rndIndex(workloads.length)];

    // 5) Datum narození tak, aby věk spadal do zadaného intervalu
    const birthdate = rndBirthdateForAgeRange(dtoIn.age.min, dtoIn.age.max);

    // 6) Sestavení dtoOut záznamu a uložení do výstupního pole ve správném pořadí a formátu
    dtoOut.push({ gender, birthdate, name, surname, workload });
  }

  // Vracíme výsledné pole dtoOut s vygenerovanými záznamy.
  return dtoOut;
}

// ------------------------------------------
// Spuštění funkce main a vypsání do konzole
// ------------------------------------------

// Vygenerujeme dtoOut výstup dle vstupních parametrů a vypíšeme do konzole
const dtoOut = main(dtoIn);
console.log(dtoOut);
