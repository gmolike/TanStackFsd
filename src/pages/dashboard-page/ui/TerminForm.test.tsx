import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserForm } from './TerminForm';

// Mock für tanstack router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock für toast
vi.mock('~/shared/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

// Fix für Radix UI hasPointerCapture Error
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false);
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = vi.fn();
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = vi.fn();
  }
});

describe('UserForm - Label und Value Tests', () => {
  it('sollte alle Formularfelder mit korrekten Labels und Standardwerten anzeigen', () => {
    const { getByText, getByPlaceholderText, getByLabelText, getByRole } = render(
      <BrowserRouter>
        <UserForm />
      </BrowserRouter>,
    );

    // Header
    getByText('Alle Form-Komponenten Demo');
    getByText(
      'Dieses Formular zeigt alle verfügbaren Form-Komponenten mit verschiedenen Konfigurationen.',
    );

    // Persönliche Daten Section
    getByText(/persönliche daten/i);

    // Mit getByPlaceholderText finden wir das Element UND prüfen gleichzeitig den Placeholder
    expect(getByPlaceholderText('Max')).toHaveProperty('value', 'Max');
    expect(getByPlaceholderText('Mustermann')).toHaveProperty('value', '');
    expect(getByPlaceholderText('max.mustermann@example.com')).toHaveProperty(
      'value',
      'max.mustermann@example.com',
    );
    expect(getByPlaceholderText('Mindestens 8 Zeichen')).toHaveProperty('value', '');
    expect(getByPlaceholderText('18')).toHaveProperty('value', '25');
    expect(getByPlaceholderText('+49 123 456789')).toHaveProperty('value', '+49 123 456789');
    expect(getByPlaceholderText('https://example.com')).toHaveProperty(
      'value',
      'https://example.com',
    );

    // Datum-Auswahl Section - hier müssen wir bei Labels bleiben, da DatePicker andere Placeholder haben
    getByText(/datum-auswahl/i);

    getByText('Geburtsdatum');
    expect(getByPlaceholderText('Datum wählen oder eingeben')).toHaveProperty(
      'value',
      '01.01.2028',
    );

    getByText('Eintrittsdatum');
    expect(getByPlaceholderText('Datum auswählen')).toHaveProperty('value', '');

    // Date Range
    getByText('Beschäftigungszeitraum');
    getByText('Von');
    getByText('Bis');

    // Auswahl-Felder Section - Select-Felder haben keinen value im klassischen Sinne
    getByText(/auswahl-felder/i);

    getByText('Land');
    expect(getByRole('combobox', { name: 'Land' }).textContent).equals('Land auswählen');

    getByText('Hauptsprache');
    expect(getByRole('combobox', { name: 'Hauptsprache' }).textContent).equals('Deutsch');

    // Checkboxen Section
    getByText(/checkboxen/i);

    getByText('Ich akzeptiere die AGB');
    expect(getByRole('checkbox', { name: 'Ich akzeptiere die AGB' })).toHaveProperty(
      'checked',
      false,
    );
    getByText('Sie müssen die AGB akzeptieren, um fortzufahren.');

    getByText('Newsletter abonnieren');
    expect(getByRole('checkbox', { name: 'Newsletter abonnieren' })).toHaveProperty(
      'checked',
      true,
    );
    getByText('Erhalten Sie Updates und Neuigkeiten per E-Mail.');

    // Textbereiche Section
    getByText(/textbereiche/i);

    expect(getByPlaceholderText('Erzählen Sie etwas über sich...')).toHaveProperty(
      'value',
      'Dies ist eine Beispiel-Biografie.',
    );
    getByText('Maximal 500 Zeichen');

    expect(getByPlaceholderText('Weitere Informationen...')).toHaveProperty('value', '');

    // Footer Buttons
    getByText(/benutzer erstellen/i);
    getByText(/abbrechen/i);
    getByText(/formular zurücksetzen/i);
  });

  // Alternative: Alle verfügbaren Query-Methoden demonstrieren
  it('zeigt verschiedene Query-Methoden', () => {
    const { getByPlaceholderText, getByDisplayValue, getByAltText, getByTitle } = render(
      <BrowserRouter>
        <UserForm />
      </BrowserRouter>,
    );

    // getByPlaceholderText - findet Element über Placeholder
    const vornameInput = getByPlaceholderText('Max');
    expect(vornameInput).toHaveProperty('value', 'Max');

    // getByDisplayValue - findet Element über aktuellen Wert
    const emailInput = getByDisplayValue('max.mustermann@example.com');
    expect(emailInput).toHaveProperty('placeholder', 'max.mustermann@example.com');

    // Weitere nützliche Queries:
    // getByTitle - wenn title-Attribut vorhanden
    // getByAltText - für Bilder
    // getByTestId - für data-testid Attribute
  });

  // Kompakter Test mit getAllBy* für mehrere ähnliche Elemente
  it('prüft alle Input-Felder auf einmal', () => {
    const { getAllByPlaceholderText } = render(
      <BrowserRouter>
        <UserForm />
      </BrowserRouter>,
    );

    // Alle Inputs mit Placeholder finden
    const allInputs = getAllByPlaceholderText(/./); // Regex für beliebigen Text

    // Prüfen, dass wir die erwartete Anzahl haben
    expect(allInputs.length).toBeGreaterThan(0);

    // Spezifische Placeholder-Werte prüfen
    const expectedPlaceholders = [
      'Max',
      'Mustermann',
      'max.mustermann@example.com',
      'Mindestens 8 Zeichen',
      '18',
      '+49 123 456789',
      'https://example.com',
      'Erzählen Sie etwas über sich...',
      'Weitere Informationen...',
    ];

    expectedPlaceholders.forEach((placeholder) => {
      expect(allInputs.some((input) => input.placeholder === placeholder)).toBe(true);
    });
  });
});
