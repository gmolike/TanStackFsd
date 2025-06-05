// src/shared/mock/generators.ts

/**
 * Generische Mock-Daten Generatoren
 * Ähnlich wie faker.js, aber leichtgewichtig und angepasst
 */

// ===== BASIC GENERATORS =====

export const random = {
  /**
   * Zufällige Zahl zwischen min und max
   */
  number: (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min,

  /**
   * Zufälliges Element aus Array
   */
  arrayElement: <T>(array: Array<T>): T => array[Math.floor(Math.random() * array.length)],

  /**
   * Mehrere zufällige Elemente aus Array
   */
  arrayElements: <T>(array: Array<T>, count?: number): Array<T> => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count || random.number(1, array.length));
  },

  /**
   * Zufälliger Boolean
   */
  boolean: (probability = 0.5): boolean => Math.random() < probability,

  /**
   * Zufällige UUID
   */
  uuid: (): string =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }),

  /**
   * Zufälliges Datum zwischen zwei Daten
   */
  date: (from: Date = new Date(2020, 0, 1), to: Date = new Date()): Date =>
    new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime())),
};

// ===== STRING GENERATORS =====

export const string = {
  /**
   * Zufälliger Vorname
   */
  firstName: (): string => {
    const names = [
      'Max',
      'Anna',
      'Tom',
      'Lisa',
      'Jan',
      'Sarah',
      'Tim',
      'Julia',
      'Lukas',
      'Emma',
      'Paul',
      'Mia',
      'Felix',
      'Sophie',
      'Leon',
      'Marie',
      'Finn',
      'Laura',
      'Jonas',
      'Lena',
      'Erik',
      'Nina',
      'David',
      'Clara',
    ];
    return random.arrayElement(names);
  },

  /**
   * Zufälliger Nachname
   */
  lastName: (): string => {
    const names = [
      'Müller',
      'Schmidt',
      'Schneider',
      'Fischer',
      'Weber',
      'Meyer',
      'Wagner',
      'Becker',
      'Schulz',
      'Hoffmann',
      'Schäfer',
      'Koch',
      'Bauer',
      'Richter',
      'Klein',
      'Wolf',
      'Schröder',
      'Neumann',
    ];
    return random.arrayElement(names);
  },

  /**
   * Vollständiger Name
   */
  fullName: (): string => `${string.firstName()} ${string.lastName()}`,

  /**
   * E-Mail basierend auf Namen
   */
  email: (firstName?: string, lastName?: string): string => {
    const fn = firstName || string.firstName();
    const ln = lastName || string.lastName();
    const domains = ['example.com', 'test.de', 'demo.org', 'mail.com'];
    return `${fn.toLowerCase()}.${ln.toLowerCase()}@${random.arrayElement(domains)}`;
  },

  /**
   * Telefonnummer (deutsch)
   */
  phone: (): string => {
    const prefixes = [
      '0151',
      '0152',
      '0157',
      '0159',
      '0160',
      '0170',
      '0171',
      '0172',
      '0173',
      '0174',
      '0175',
    ];
    return `+49 ${random.arrayElement(prefixes)} ${random.number(1000000, 9999999)}`;
  },

  /**
   * Straße und Hausnummer
   */
  street: (): string => {
    const streets = [
      'Hauptstraße',
      'Bahnhofstraße',
      'Gartenstraße',
      'Dorfstraße',
      'Schulstraße',
      'Kirchstraße',
      'Bergstraße',
      'Waldstraße',
      'Parkstraße',
      'Lindenstraße',
      'Birkenweg',
      'Rosenweg',
    ];
    return `${random.arrayElement(streets)} ${random.number(1, 200)}`;
  },

  /**
   * Stadt
   */
  city: (): string => {
    const cities = [
      'Berlin',
      'Hamburg',
      'München',
      'Köln',
      'Frankfurt',
      'Stuttgart',
      'Düsseldorf',
      'Dortmund',
      'Essen',
      'Leipzig',
      'Bremen',
      'Dresden',
      'Hannover',
      'Nürnberg',
      'Duisburg',
      'Bochum',
    ];
    return random.arrayElement(cities);
  },

  /**
   * Postleitzahl (deutsch)
   */
  postalCode: (): string => random.number(10000, 99999).toString(),

  /**
   * EAN Code (13 Ziffern)
   */
  ean: (): string => {
    let ean = '';
    for (let i = 0; i < 12; i++) {
      ean += random.number(0, 9);
    }
    // Prüfziffer berechnen (vereinfacht)
    ean += random.number(0, 9);
    return ean;
  },

  /**
   * Lorem Ipsum Text
   */
  lorem: (wordCount: number = 10): string => {
    const words = [
      'lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit',
      'sed',
      'do',
      'eiusmod',
      'tempor',
      'incididunt',
      'ut',
      'labore',
      'et',
      'dolore',
      'magna',
      'aliqua',
      'enim',
      'ad',
      'minim',
      'veniam',
    ];
    const result = [];
    for (let i = 0; i < wordCount; i++) {
      result.push(random.arrayElement(words));
    }
    return result.join(' ');
  },

  /**
   * Artikelnummer
   */
  articleNumber: (prefix: string = 'ART'): string => `${prefix}-${random.number(1000, 9999)}`,
};

// ===== COMMERCE GENERATORS =====

export const commerce = {
  /**
   * Produktname
   */
  productName: (): string => {
    const adjectives = [
      'Premium',
      'Professional',
      'Ultra',
      'Smart',
      'Eco',
      'Wireless',
      'Compact',
      'Deluxe',
    ];
    const products = [
      'Laptop',
      'Mouse',
      'Keyboard',
      'Monitor',
      'Webcam',
      'Headset',
      'Speaker',
      'Tablet',
    ];
    const suffixes = ['Pro', 'Plus', 'Max', 'Elite', '2024', 'X', 'S', 'HD'];

    return `${random.arrayElement(adjectives)} ${random.arrayElement(products)} ${random.arrayElement(suffixes)}`;
  },

  /**
   * Preis
   */
  price: (min: number = 10, max: number = 1000): number => {
    const price = random.number(min * 100, max * 100) / 100;
    return Math.round(price * 100) / 100;
  },

  /**
   * Produktbeschreibung
   */
  productDescription: (productName: string): string => {
    const templates = [
      `Hochwertige ${productName} für professionelle Anwendungen. ${string.lorem(15)}.`,
      `Die ${productName} überzeugt durch modernste Technologie und erstklassige Verarbeitung. ${string.lorem(12)}.`,
      `Erleben Sie mit ${productName} eine neue Dimension. ${string.lorem(18)}.`,
      `${productName} - Perfekt für anspruchsvolle Nutzer. ${string.lorem(10)}.`,
    ];
    return random.arrayElement(templates);
  },

  /**
   * Kategorie
   */
  category: (): string => {
    const categories = [
      'Elektronik',
      'Computer',
      'Zubehör',
      'Software',
      'Gaming',
      'Büro',
      'Haushalt',
    ];
    return random.arrayElement(categories);
  },

  /**
   * Hersteller
   */
  manufacturer: (): string => {
    const manufacturers = [
      'TechPro GmbH',
      'Digital Solutions AG',
      'Smart Systems',
      'Innovation Labs',
      'Future Tech',
      'Global Electronics',
      'Premium Devices',
      'NextGen Industries',
    ];
    return random.arrayElement(manufacturers);
  },
};

// ===== ARRAY GENERATORS =====

export const array = {
  /**
   * Erstellt ein Array mit n Elementen
   */
  of: <T>(count: number, generator: (index: number) => T): Array<T> =>
    Array.from({ length: count }, (_, index) => generator(index)),

  /**
   * Erstellt ein Array mit zufälliger Länge
   */
  ofRandom: <T>(minCount: number, maxCount: number, generator: (index: number) => T): Array<T> => {
    const count = random.number(minCount, maxCount);
    return array.of(count, generator);
  },
};
