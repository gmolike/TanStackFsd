// src/pages/team/editor/ui/page.tsx
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Mail, Phone, Plus, Settings, Trash2, UserPlus } from 'lucide-react';

import { AddressDialog } from '~/features/team';

import type { Address, TeamFormData } from '~/entities/team';
import { countryOptions, frameworkOptions, teamFormSchema } from '~/entities/team';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

export const TeamEditorPage = () => {
  const [submitResult, setSubmitResult] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<string>('');

  const handleSubmit = (data: TeamFormData) => {
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

  const defaultValues: Partial<TeamFormData> = {
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

  // Initialize form
  const form = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
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
                options={countryOptions}
                label="Country"
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
                    value={value as Address | undefined}
                    onChange={onChange}
                  />
                )}
                required
                emptyText="Click to add address"
                description="Click the button to enter your address details"
              >
                {(value) => {
                  const address = value as Address | undefined;
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
