# Form Component System Documentation

## Übersicht

Das Form Component System ist eine umfassende, typsichere und wiederverwendbare Form-Lösung basierend auf React Hook Form, React 19, und der FSD-Architektur. Es bietet standardisierte Form-Komponenten mit integrierter Validierung, Fehlerbehandlung, einem Context-System sowie flexible Header und Footer Komponenten.

## Features

✅ **TypeScript-first**: Vollständig typisiert für beste Developer Experience  
✅ **React Hook Form Integration**: Optimale Performance durch uncontrolled components  
✅ **Zod Validation**: Schema-basierte Validierung mit automatischer TypeScript-Inferenz  
✅ **FSD Architecture**: Klar strukturiert nach Feature-Sliced Design Prinzipien  
✅ **ShadCN UI**: Einheitliches Design-System  
✅ **Form Context**: Globaler Zugriff auf Form-State innerhalb aller Komponenten  
✅ **Accessibility**: ARIA-Labels und Focus-Management  
✅ **Responsive**: Mobile-first Design mit Tailwind CSS  
✅ **Form Header & Footer**: Standardisierte Layouts mit mehreren Varianten  
✅ **Multi-Step Support**: Integrierte Unterstützung für mehrstufige Formulare

## Installation & Setup

Die Komponenten befinden sich in `src/shared/ui/form/` und können wie folgt importiert werden:

```typescript
import {
  Form,
  FormInput,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormDate,
  FormHeader,
  FormFooter,
  FormHeaderWithSteps,
  FormFooterSteps,
} from '~/shared/ui/form';
```

## Basis-Konzept: Form Context

Alle Form-Komponenten nutzen den React Hook Form Context, um automatisch auf den Form-State zuzugreifen:

```typescript
import { useFormField } from '~/shared/ui/form';

// Innerhalb jeder Form-Komponente verfügbar
const { name, formItemId, error, isDirty, invalid } = useFormField();
```

## Form Header Komponenten

### 1. FormHeader (Basis)

Die Standard-Header-Komponente mit flexiblen Layout-Optionen:

```typescript
<FormHeader
  title="Formular-Titel"
  description="Beschreibung des Formulars"
  subtitle="Untertitel"
  icon={User}
  badge={<span className="badge">Neu</span>}
  actions={<button>Action</button>}
  variant="default" // 'default' | 'centered' | 'minimal'
/>
```

**Props:**

- `title`: Haupttitel (required)
- `description`: Beschreibungstext
- `subtitle`: Zusätzlicher Untertitel
- `icon`: Lucide Icon-Komponente
- `avatar`: Custom Avatar/Bild Element
- `badge`: Badge-Element (z.B. Status)
- `actions`: Action-Buttons rechts oben
- `variant`: Layout-Variante
- `className`: Custom CSS-Klassen

**Varianten:**

- `default`: Standard Layout mit Icon links, Actions rechts
- `centered`: Zentriertes Layout, ideal für Onboarding
- `minimal`: Kompakte Darstellung für einfache Forms

### 2. FormHeaderWithSteps

Header für Multi-Step Formulare mit Schritt-Anzeige:

```typescript
<FormHeaderWithSteps
  title="Schritt-Titel"
  description="Beschreibung"
  currentStep={2}
  totalSteps={5}
  stepLabel="Schritt" // Anpassbar (z.B. "Step", "Phase")
/>
```

### 3. FormHeaderWithProgress

Header mit Fortschrittsbalken:

```typescript
<FormHeaderWithProgress
  title="Upload-Formular"
  description="Dateien werden hochgeladen..."
  progress={75} // 0-100
  showPercentage={true}
/>
```

### 4. Vordefinierte Varianten

```typescript
// Minimal Header
<FormHeaderMinimal
  title="Login"
  description="Anmelden um fortzufahren"
/>

// Zentrierter Header
<FormHeaderCentered
  title="Willkommen"
  description="Erstellen Sie Ihr Konto"
  icon={UserPlus}
/>
```

## Form Footer Komponenten

### 1. FormFooter (Basis)

Die Standard-Footer-Komponente mit automatischer Form-State Integration:

```typescript
<FormFooter
  submitText="Speichern"
  cancelText="Abbrechen"
  resetText="Zurücksetzen"
  showCancel={true}
  showReset={true}
  onCancel={handleCancel}
  onReset={handleReset}
  errors={errors}
  successMessage={successMessage}
  links={[
    { label: 'Hilfe', href: '/help' },
    { label: 'Datenschutz', href: '/privacy' }
  ]}
  variant="default" // 'default' | 'compact' | 'split' | 'centered'
/>
```

**Props:**

- `submitText`: Text für Submit-Button
- `cancelText/resetText`: Texte für sekundäre Buttons
- `showCancel/showReset`: Sichtbarkeit der Buttons
- `onCancel/onReset`: Event-Handler
- `actions`: Zusätzliche custom Actions
- `errors`: Array von Error-Messages
- `successMessage`: Erfolgs-Nachricht
- `links`: Footer-Links (Hilfe, AGB, etc.)
- `variant`: Layout-Variante
- `sticky`: Footer am unteren Rand fixieren

**Varianten:**

- `default`: Standard Layout mit Messages und Links
- `compact`: Nur Buttons, Links unten
- `split`: Messages links, Buttons rechts
- `centered`: Zentrierte Anordnung

### 2. FormFooterSteps

Spezieller Footer für Multi-Step Formulare:

```typescript
<FormFooterSteps
  currentStep={2}
  totalSteps={5}
  onNext={handleNext}
  onPrevious={handlePrevious}
  onSkip={handleSkip}
  allowSkip={true}
  nextText="Weiter"
  previousText="Zurück"
  finishText="Abschließen"
  skipText="Überspringen"
/>
```

**Features:**

- Automatische Button-Logik (Previous nur wenn nicht erster Schritt)
- Submit-Typ für letzten Schritt
- Skip-Funktionalität
- Custom Texte für alle Buttons

### 3. Custom Actions

Zusätzliche Buttons können einfach hinzugefügt werden:

```typescript
const customActions: FormFooterAction[] = [
  {
    label: 'Als Vorlage speichern',
    variant: 'outline',
    onClick: handleSaveTemplate,
    icon: <Save className="h-4 w-4" />,
  },
  {
    label: 'Exportieren',
    variant: 'secondary',
    onClick: handleExport,
    disabled: !form.formState.isValid,
  }
];

<FormFooter actions={customActions} />
```

## Form Layout Integration

### Komplettes Formular mit Header und Footer

```typescript
<Form
  schema={mySchema}
  onSubmit={handleSubmit}
  header={
    <FormHeader
      title="Benutzer erstellen"
      description="Füllen Sie alle erforderlichen Felder aus"
      icon={UserPlus}
    />
  }
  footer={
    <FormFooter
      showCancel={true}
      showReset={true}
      onCancel={handleCancel}
    />
  }
>
  <FormInput name="name" label="Name" required />
  <FormInput name="email" type="email" label="E-Mail" required />
</Form>
```

### Multi-Step Formular

```typescript
<Form
  schema={currentStepSchema}
  onSubmit={handleSubmit}
  header={
    <>
      <FormHeaderWithProgress
        title={stepData.title}
        description={stepData.description}
        progress={(currentStep / totalSteps) * 100}
      />
      <FormHeaderWithSteps
        currentStep={currentStep}
        totalSteps={totalSteps}
        variant="minimal"
      />
    </>
  }
  footer={
    <FormFooterSteps
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={handlePrevious}
      allowSkip={currentStep < totalSteps}
    />
  }
>
  {/* Schritt-spezifische Felder */}
</Form>
```

## Styling & Theming

### Custom Header Styling

```typescript
<FormHeader
  title="Custom Header"
  className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg"
  titleClassName="text-3xl text-blue-900"
  descriptionClassName="text-blue-700"
/>
```

### Sticky Footer

```typescript
<FormFooter
  sticky={true}
  className="bg-white shadow-lg border-t-2"
/>
```

## Erweiterte Patterns

### Bedingte Header/Footer

```typescript
const showAdvanced = form.watch('showAdvanced');

<Form
  header={
    showAdvanced ? (
      <FormHeaderWithProgress title="Erweitert" progress={90} />
    ) : (
      <FormHeaderMinimal title="Einfach" />
    )
  }
  footer={
    <FormFooter
      actions={showAdvanced ? advancedActions : basicActions}
    />
  }
>
  {/* Form content */}
</Form>
```

### Dynamische Nachrichten

```typescript
const [messages, setMessages] = useState<{
  errors: string[];
  success?: string;
}>({ errors: [] });

// In Submit-Handler
const handleSubmit = async (data) => {
  try {
    await saveData(data);
    setMessages({ errors: [], success: 'Erfolgreich gespeichert!' });
  } catch (error) {
    setMessages({
      errors: [error.message],
      success: undefined
    });
  }
};

<FormFooter
  errors={messages.errors}
  successMessage={messages.success}
/>
```

## Best Practices

### 1. Header Design

```typescript
// ✅ Gute Praxis: Klare Hierarchie
<FormHeader
  title="Primärer Titel"
  subtitle="Sekundäre Information"
  description="Detaillierte Beschreibung"
/>

// ❌ Vermeiden: Überladen mit zu vielen Informationen
<FormHeader
  title="Sehr langer Titel mit vielen Details"
  description="Noch mehr Text hier..."
  badge={<Badge />}
  actions={<MultipleButtons />}
/>
```

### 2. Footer Actions

```typescript
// ✅ Gute Praxis: Logische Reihenfolge
<FormFooter
  showReset={true}    // Links: Destructive Actions
  showCancel={true}   // Mitte: Cancel
  submitText="Save"   // Rechts: Primary Action
/>

// ✅ Conditional Actions basierend auf Form State
{({ formState: { isDirty, isValid } }) => (
  <FormFooter
    showReset={isDirty}
    actions={isValid ? additionalActions : []}
  />
)}
```

### 3. Error Handling

```typescript
// ✅ Zentrale Error-Behandlung
const [formErrors, setFormErrors] = useState<string[]>([]);

const handleSubmit = async (data) => {
  try {
    setFormErrors([]); // Clear previous errors
    await submitData(data);
  } catch (error) {
    if (error.validation) {
      // Field-level errors werden automatisch angezeigt
      // Footer nur für globale Errors
      setFormErrors([error.message]);
    }
  }
};

<FormFooter errors={formErrors} />
```

### 4. Mobile Responsiveness

```typescript
// Header automatisch responsive
<FormHeader
  variant="centered" // Besser für mobile
  actions={
    <div className="flex gap-2 flex-col sm:flex-row">
      {/* Actions stapeln sich auf mobile */}
    </div>
  }
/>

// Footer mit Sticky für mobile
<FormFooter
  sticky={true}
  variant="compact" // Kompakter für mobile
/>
```

## Komponentenkomposition

### Vordefinierte Layouts

```typescript
// Login Layout
export const LoginFormLayout = ({ children, onForgotPassword }) => (
  <Form
    header={
      <FormHeaderCentered
        title="Anmelden"
        description="Willkommen zurück"
        icon={LogIn}
      />
    }
    footer={
      <FormFooterCentered
        submitText="Anmelden"
        showCancel={false}
        links={[
          { label: 'Passwort vergessen?', href: '#', onClick: onForgotPassword }
        ]}
      />
    }
  >
    {children}
  </Form>
);

// Settings Layout
export const SettingsFormLayout = ({ children, onCancel }) => (
  <Form
    header={
      <FormHeader
        title="Einstellungen"
        description="Verwalten Sie Ihre Kontoeinstellungen"
        icon={Settings}
        badge={<Badge>Beta</Badge>}
      />
    }
    footer={
      <FormFooterSplit
        submitText="Änderungen speichern"
        showReset={true}
        onCancel={onCancel}
        links={[
          { label: 'Hilfe', href: '/help' },
          { label: 'Feedback', href: '/feedback' }
        ]}
      />
    }
  >
    {children}
  </Form>
);
```

## Performance Considerations

- **Header/Footer werden nur bei Prop-Änderungen re-rendered**
- **Form State Updates beeinflussen Footer automatisch**
- **Lazy Loading für Icons**: Verwenden Sie dynamic imports für große Icon-Sets
- **Memoization**: Header/Footer Components sind bereits optimiert

## Accessibility

- **Automatische ARIA-Labels** für alle Buttons
- **Focus-Management** zwischen Schritten
- **Screen Reader Support** für Fortschrittsanzeigen
- **High Contrast Mode** Support
- **Keyboard Navigation** optimiert

## Fazit

Das erweiterte Form Component System mit Header und Footer bietet:

- **Konsistente UX** durch standardisierte Layouts
- **Flexible Komposition** für verschiedene Use Cases
- **Automatische State-Integration** mit React Hook Form
- **Responsive Design** out-of-the-box
- **Multi-Step Support** mit integrierter Navigation
- **Accessibility** und Performance Optimierungen

Durch die Verwendung der vorgefertigten Header- und Footer-Komponenten können Sie schnell professionelle Formulare erstellen, die sowohl funktional als auch benutzerfreundlich sind.
