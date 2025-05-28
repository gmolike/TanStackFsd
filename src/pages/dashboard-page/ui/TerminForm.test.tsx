import { BrowserRouter } from 'react-router-dom';

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { UserForm } from './TerminForm';

// Mock für tanstack router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => vi.fn(),
}));

// Mock für toast
vi.mock('~/shared/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

describe('UserForm - Label und Value Tests', () => {
  it('sollte alle Formularfelder mit korrekten Labels und Standardwerten anzeigen', () => {
    const { getByText, getByRole, getByLabelText } = render(
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

    getByText('Vorname');
    expect(getByRole('textbox', { name: 'Vorname' })).toHaveProperty('value', 'Max');

    getByText('Nachname');
    expect(getByRole('textbox', { name: 'Nachname' })).toHaveProperty('value', '');

    getByText(/e-mail-adresse/i);
    expect(getByRole('textbox', { name: /e-mail-adresse/i })).toHaveProperty(
      'value',
      'max.mustermann@example.com',
    );

    getByText('Passwort');
    expect(getByLabelText('Passwort')).toHaveProperty('value', '');

    getByText('Alter');
    expect(getByRole('spinbutton', { name: 'Alter' })).toHaveProperty('value', '25');

    getByText('Telefonnummer');
    expect(getByRole('textbox', { name: 'Telefonnummer' })).toHaveProperty(
      'value',
      '+49 123 456789',
    );

    getByText('Website');
    expect(getByRole('textbox', { name: 'Website' })).toHaveProperty(
      'value',
      'https://example.com',
    );

    // Datum-Auswahl Section
    getByText(/datum-auswahl/i);

    getByText('Geburtsdatum');
    expect(getByRole('textbox', { name: 'Geburtsdatum' })).toHaveProperty('value', '01.01.2028');

    getByText('Eintrittsdatum');
    expect(getByRole('button', { name: /eintrittsdatum/i }).textContent).includes(
      'Datum auswählen',
    );

    // Date Range
    getByText('Beschäftigungszeitraum');
    getByText('Von');
    getByText('Bis');

    // Auswahl-Felder Section
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

    getByText('Über mich');
    expect(getByRole('textbox', { name: 'Über mich' })).toHaveProperty(
      'value',
      'Dies ist eine Beispiel-Biografie.',
    );
    getByText('Maximal 500 Zeichen');

    getByText('Zusätzliche Notizen');
    expect(getByRole('textbox', { name: 'Zusätzliche Notizen' })).toHaveProperty('value', '');

    // Footer Buttons
    getByText(/benutzer erstellen/i);
    getByText(/abbrechen/i);
    getByText(/formular zurücksetzen/i);
  });

  it('sollte Pflichtfelder und Placeholder korrekt anzeigen', () => {
    const { getByLabelText, getByRole } = render(
      <BrowserRouter>
        <UserForm />
      </BrowserRouter>,
    );

    // Required Felder prüfen
    expect(getByLabelText('Vorname')).toHaveProperty('required', true);
    expect(getByLabelText('Nachname')).toHaveProperty('required', true);
    expect(getByLabelText('E-Mail-Adresse')).toHaveProperty('required', true);
    expect(getByLabelText('Passwort')).toHaveProperty('required', true);
    expect(getByRole('combobox', { name: 'Land' })).toHaveProperty('required', true);
    expect(getByRole('checkbox', { name: 'Ich akzeptiere die AGB' })).toHaveProperty(
      'required',
      true,
    );

    // Placeholder prüfen
    expect(getByLabelText('Vorname')).toHaveProperty('placeholder', 'Max');
    expect(getByLabelText('Nachname')).toHaveProperty('placeholder', 'Mustermann');
    expect(getByLabelText('E-Mail-Adresse')).toHaveProperty(
      'placeholder',
      'max.mustermann@example.com',
    );
    expect(getByLabelText('Passwort')).toHaveProperty('placeholder', 'Mindestens 8 Zeichen');
    expect(getByLabelText('Alter')).toHaveProperty('placeholder', '18');
    expect(getByLabelText('Telefonnummer')).toHaveProperty('placeholder', '+49 123 456789');
    expect(getByLabelText('Website')).toHaveProperty('placeholder', 'https://example.com');
    expect(getByLabelText('Über mich')).toHaveProperty(
      'placeholder',
      'Erzählen Sie etwas über sich...',
    );
    expect(getByLabelText('Zusätzliche Notizen')).toHaveProperty(
      'placeholder',
      'Weitere Informationen...',
    );
  });
});
