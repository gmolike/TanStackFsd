// src/features/test-form/ui/TestForm.tsx
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Mail, Phone, Plus, Settings, Trash2, UserPlus } from 'lucide-react';
import { z } from 'zod';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/shared/shadcn';
import {
  FormCheckbox,
  FormCombobox,
  FormDatePicker,
  FormDateRange,
  FormDialogButton,
  FormFooter,
  FormHeader,
  FormInput,
  FormProvider,
  FormSelect,
  FormTextArea,
} from '~/shared/ui/form';

// ===== SCHEMAS =====
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().optional(),
});

const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.string().optional(), // This is the optional field
});

const formSchema = z
  .object({
    // Basic fields
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .regex(/^\+?[0-9\s-]+$/, 'Invalid phone number')
      .optional(),

    // TextArea
    bio: z
      .string()
      .min(10, 'Bio must be at least 10 characters')
      .max(500, 'Bio must be less than 500 characters'),

    // Select & Combobox
    country: z.string().min(1, 'Please select a country'),
    framework: z.string().min(1, 'Please select a framework'),

    // Checkbox
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
    newsletter: z.boolean().optional(),

    // Date fields
    birthDate: z.date({
      required_error: 'Birth date is required',
      invalid_type_error: 'Invalid date',
    }),

    // Date range
    projectStartDate: z.date().optional(),
    projectEndDate: z.date().optional(),

    // Complex object from dialog
    address: addressSchema,

    // Field array with 3 fields (2 required, 1 optional)
    teamMembers: z.array(teamMemberSchema).min(1, 'At least one team member is required'),
  })
  .refine(
    (data) => {
      // Prüfe ob beide Daten vorhanden sind
      if (data.projectStartDate && data.projectEndDate) {
        return data.projectEndDate >= data.projectStartDate;
      }
      return true; // Wenn eines oder beide Daten fehlen, ist es valide
    },
    {
      message: 'Project end date must be after or equal to start date',
      path: ['projectEndDate'], // Zeigt den Fehler beim End Date Feld an
    },
  )
  .refine(
    (data) =>
      // Zusätzliche Regel: Prüfe ob mindestens ein Team Member eine Rolle hat
      data.teamMembers.some((member) => member.role && member.role.trim() !== ''),
    {
      message: 'At least one team member must have a role specified',
      path: ['teamMembers'], // Zeigt den Fehler bei den Team Members an
    },
  )
  .refine(
    (data) => {
      // Prüfe ob alle Team Member E-Mails einzigartig sind
      const emails = data.teamMembers.map((member) => member.email.toLowerCase());
      const uniqueEmails = new Set(emails);
      return emails.length === uniqueEmails.size;
    },
    {
      message: 'Team member emails must be unique',
      path: ['teamMembers'],
    },
  );

type FormData = z.infer<typeof formSchema>;

// ===== MAIN FORM COMPONENT =====
export const TeamEditorPage = () => {
  const [submitResult, setSubmitResult] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const handleSubmit = (data: FormData) => {
    setSubmitError('');
    setSubmitSuccess('');

    try {
      console.log('Form submitted:', data);
      setSubmitResult(JSON.stringify(data, null, 2));
      setSubmitSuccess('Form submitted successfully!');
    } catch (error) {
      setSubmitError('Failed to submit form');
      console.error(error);
    }
  };

  const handleError = (errors: unknown) => {
    console.error('Form validation errors:', errors);
    setSubmitError('Please fix the validation errors');
  };

  const defaultValues: Partial<FormData> = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    country: '',
    framework: '',
    acceptTerms: false,
    newsletter: true,
    birthDate: undefined,
    projectStartDate: undefined,
    projectEndDate: undefined,
    address: {
      street: '',
      city: '',
      country: '',
      postalCode: '',
    },
    teamMembers: [
      { name: '', email: '', role: '' }, // First member with all fields empty
    ],
  };

  // Options for select/combobox
  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'jp', label: 'Japan' },
  ];

  const frameworkOptions = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'next', label: 'Next.js' },
    { value: 'nuxt', label: 'Nuxt.js' },
    { value: 'remix', label: 'Remix' },
  ];

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange', // Validiert sofort beim Tippen
    reValidateMode: 'onChange', // Nach Fehler: validiert bei jeder Änderung
    criteriaMode: 'all', // Zeigt alle FehFler gleichzeitig
  });

  // Initialize field array OUTSIDE of render
  const { fields, append, remove } = useFieldArray({
    control: form.control,

    name: 'teamMembers',
  });

  const onSubmit = form.handleSubmit(handleSubmit, handleError);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Header */}
          <FormHeader
            title="Comprehensive Test Form"
            description="This form demonstrates all available form components with validation"
            subtitle="All fields marked with * are required"
            icon={Settings}
            variant="default"
            badge={
              <span className="rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-700">Demo</span>
            }
          />

          {/* Basic Input Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                  required
                  startIcon={<UserPlus className="h-4 w-4" />}
                />
                <FormInput
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  required
                />
              </div>

              <FormInput
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="john.doe@example.com"
                required
                startIcon={<Mail className="h-4 w-4" />}
              />

              <FormInput
                control={form.control}
                name="phone"
                label="Phone Number"
                type="tel"
                placeholder="+1 234 567 8900"
                startIcon={<Phone className="h-4 w-4" />}
                description="Optional field - include country code"
              />
            </CardContent>
          </Card>

          {/* TextArea */}
          <Card>
            <CardHeader>
              <CardTitle>About You</CardTitle>
            </CardHeader>
            <CardContent>
              <FormTextArea
                control={form.control}
                name="bio"
                label="Bio"
                placeholder="Tell us about yourself... (min 10, max 500 characters)"
                rows={4}
                required
                description="Write a brief description about yourself"
              />
            </CardContent>
          </Card>

          {/* Select & Combobox */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormSelect
                control={form.control}
                name="country"
                label="Country"
                options={countryOptions}
                placeholder="Select a country..."
                required
                emptyOption="-- None --"
              />

              <FormCombobox
                control={form.control}
                name="framework"
                label="Favorite Framework"
                options={frameworkOptions}
                placeholder="Select framework..."
                searchPlaceholder="Search frameworks..."
                required
                emptyText="No framework found."
                description="Choose your preferred JavaScript framework"
              />
            </CardContent>
          </Card>

          {/* Date Fields */}
          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormDatePicker
                control={form.control}
                name="birthDate"
                label="Birth Date"
                placeholder="Select your birth date"
                max={new Date()}
                required
                dateFormat="dd/MM/yyyy"
                allowInput={true}
              />

              <FormDateRange
                control={form.control}
                startName="projectStartDate"
                endName="projectEndDate"
                label="Project Duration (Optional)"
                startLabel="Start Date"
                endLabel="End Date"
                description="Select the project timeline"
              />
            </CardContent>
          </Card>

          {/* Complex Dialog Field */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormDialogButton
                control={form.control}
                name="address"
                label="Address"
                icon={UserPlus}
                endIcon={Calendar}
                dialog={({ open, onOpenChange, value, onChange }) => (
                  <AddressDialog
                    open={open}
                    onOpenChange={onOpenChange}
                    value={value as FormData['address'] | undefined}
                    onChange={onChange}
                  />
                )}
                required
                emptyText="Click to add address"
                description="Click the button to enter your address details"
              >
                {(value) => {
                  const address = value as FormData['address'] | undefined;
                  if (!address || !address.street) return null;
                  return (
                    <div className="text-left">
                      <div className="font-medium">{address.street}</div>
                      <div className="text-sm text-muted-foreground">
                        {address.city}, {address.country} {address.postalCode}
                      </div>
                    </div>
                  );
                }}
              </FormDialogButton>
            </CardContent>
          </Card>

          {/* Field Array */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add team members with name (required), email (required), and role (optional)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="space-y-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-medium">Member {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>

                    <FormInput
                      control={form.control}
                      name={`teamMembers.${index}.name`}
                      label="Name"
                      placeholder="Team member name"
                      required
                    />

                    <FormInput
                      control={form.control}
                      name={`teamMembers.${index}.email`}
                      label="Email"
                      type="email"
                      placeholder="member@example.com"
                      required
                    />

                    <FormInput
                      control={form.control}
                      name={`teamMembers.${index}.role`}
                      label="Role"
                      placeholder="Developer, Designer, etc."
                      description="Optional - specify the team member's role"
                    />
                  </div>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: '', email: '', role: '' })}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </CardContent>
          </Card>

          {/* Checkboxes */}
          <Card>
            <CardHeader>
              <CardTitle>Agreements & Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormCheckbox
                control={form.control}
                name="acceptTerms"
                label="I accept the terms and conditions"
                required
                description="You must accept the terms to proceed"
              />

              <FormCheckbox
                control={form.control}
                name="newsletter"
                label="Subscribe to newsletter"
                description="Get updates about new features and improvements (optional)"
                side="right"
              />
            </CardContent>
          </Card>

          {/* Footer */}
          <FormFooter
            submitText="Submit Form"
            showCancel={true}
            showReset={true}
            onCancel={() => {
              console.log('Form cancelled');
              setSubmitResult('');
              setSubmitError('');
              setSubmitSuccess('');
            }}
            error={submitError}
            success={submitSuccess}
          />

          {/* Result Display */}
          {submitResult && (
            <Card>
              <CardHeader>
                <CardTitle>Form Submission Result</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertDescription>
                    <pre className="overflow-auto rounded-md bg-muted p-4">
                      <code>{submitResult}</code>
                    </pre>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

// ===== ADDRESS DIALOG COMPONENT =====
interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: FormData['address'] | undefined;
  onChange: (value: FormData['address']) => void;
}

const AddressDialog = ({ open, onOpenChange, value, onChange }: AddressDialogProps) => {
  const [localAddress, setLocalAddress] = useState<FormData['address']>(
    value || { street: '', city: '', country: '', postalCode: '' },
  );

  const handleSave = () => {
    // Simple validation
    if (localAddress.street && localAddress.city && localAddress.country) {
      onChange(localAddress);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Enter your address details. All fields except postal code are required.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">
              Street <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.street}
              onChange={(e) => setLocalAddress({ ...localAddress, street: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              City <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.city}
              onChange={(e) => setLocalAddress({ ...localAddress, city: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="New York"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Country <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={localAddress.country}
              onChange={(e) => setLocalAddress({ ...localAddress, country: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="USA"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Postal Code</label>
            <input
              type="text"
              value={localAddress.postalCode || ''}
              onChange={(e) => setLocalAddress({ ...localAddress, postalCode: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              placeholder="10001"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!localAddress.street || !localAddress.city || !localAddress.country}
          >
            Save Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
