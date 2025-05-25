// src/shared/ui/form/Form.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

import { Checkbox } from './checkbox/Checkbox';
import { DatePicker } from './datePicker/DatePicker';
import { Footer } from './footer/Footer';
import { Form } from './form/Form';
import { Header } from './header/Header';
import { Input } from './input/Input';
import { Select } from './select/Select';
import { userEvent } from './test-utils';
import { TextArea } from './textarea/TextArea';

describe('Form System Integration', () => {
  const user = userEvent.setup();

  // Comprehensive test schema
  const registrationSchema = z
    .object({
      personal: z.object({
        firstName: z.string().min(2, 'First name must be at least 2 characters'),
        lastName: z.string().min(2, 'Last name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        phone: z
          .string()
          .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number')
          .optional(),
      }),
      account: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string(),
      }),
      profile: z.object({
        birthDate: z.date().max(new Date(), 'Birth date cannot be in the future'),
        country: z.string().min(1, 'Please select a country'),
        bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
      }),
      preferences: z.object({
        newsletter: z.boolean(),
        notifications: z.boolean(),
      }),
      terms: z.object({
        acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
        acceptPrivacy: z
          .boolean()
          .refine((val) => val === true, 'You must accept the privacy policy'),
      }),
    })
    .refine((data) => data.account.password === data.account.confirmPassword, {
      message: "Passwords don't match",
      path: ['account', 'confirmPassword'],
    });

  type RegistrationForm = z.infer<typeof registrationSchema>;

  const defaultValues: Partial<RegistrationForm> = {
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    account: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    profile: {
      country: '',
      bio: '',
      birthDate: new Date(),
    },
    preferences: {
      newsletter: false,
      notifications: true,
    },
    terms: {
      acceptTerms: false,
      acceptPrivacy: false,
    },
  };

  const countries = [
    { value: 'de', label: 'Germany' },
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'fr', label: 'France' },
  ];

  describe('Complete User Registration Flow', () => {
    test('successfully completes registration with all fields', async () => {
      const onSubmit = vi.fn();

      render(
        <Form<RegistrationForm>
          schema={registrationSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        >
          {(form) => (
            <>
              <Header
                title="Create Account"
                description="Fill in your details to register"
                variant="default"
              />

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    control={form.control}
                    name="personal.firstName"
                    label="First Name"
                    required
                  />
                  <Input
                    control={form.control}
                    name="personal.lastName"
                    label="Last Name"
                    required
                  />
                </div>
                <Input
                  control={form.control}
                  name="personal.email"
                  label="Email"
                  type="email"
                  required
                />
                <Input
                  control={form.control}
                  name="personal.phone"
                  label="Phone"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Information</h3>
                <Input control={form.control} name="account.username" label="Username" required />
                <Input
                  control={form.control}
                  name="account.password"
                  label="Password"
                  type="password"
                  required
                />
                <Input
                  control={form.control}
                  name="account.confirmPassword"
                  label="Confirm Password"
                  type="password"
                  required
                />
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Profile Information</h3>
                <DatePicker
                  control={form.control}
                  name="profile.birthDate"
                  label="Birth Date"
                  required
                  max={new Date()}
                />
                <Select
                  control={form.control}
                  name="profile.country"
                  label="Country"
                  options={countries}
                  required
                />
                <TextArea
                  control={form.control}
                  name="profile.bio"
                  label="Bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <Checkbox
                  control={form.control}
                  name="preferences.newsletter"
                  label="Subscribe to newsletter"
                />
                <Checkbox
                  control={form.control}
                  name="preferences.notifications"
                  label="Enable notifications"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Terms & Conditions</h3>
                <Checkbox
                  control={form.control}
                  name="terms.acceptTerms"
                  label="I accept the terms and conditions"
                  required
                />
                <Checkbox
                  control={form.control}
                  name="terms.acceptPrivacy"
                  label="I accept the privacy policy"
                  required
                />
              </div>

              <Footer
                form={form}
                showCancel
                showReset
                submitText="Create Account"
                onCancel={() => console.log('Cancelled')}
              />
            </>
          )}
        </Form>,
      );

      // Fill in personal information
      await user.type(screen.getByLabelText('First Name'), 'John');
      await user.type(screen.getByLabelText('Last Name'), 'Doe');
      await user.type(screen.getByLabelText('Email'), 'john.doe@example.com');
      await user.type(screen.getByLabelText('Phone'), '+1 555 123 4567');

      // Fill in account information
      await user.type(screen.getByLabelText('Username'), 'johndoe');
      await user.type(screen.getByLabelText('Password'), 'SecurePass123!');
      await user.type(screen.getByLabelText('Confirm Password'), 'SecurePass123!');

      // Fill in profile information
      const birthDateTrigger = screen.getByRole('button', { name: /datum auswählen/i });
      await user.click(birthDateTrigger);
      // Select a date (simplified for test)
      const dateInput = screen.getByPlaceholderText('dd.MM.yyyy');
      await user.type(dateInput, '15.03.1990');
      await user.click(document.body); // Close calendar

      // Select country
      const countrySelect = screen.getByRole('combobox', { name: 'Country' });
      await user.click(countrySelect);
      await user.click(screen.getByText('Germany'));

      // Fill bio
      await user.type(screen.getByLabelText('Bio'), 'Software developer from Berlin');

      // Set preferences
      await user.click(screen.getByLabelText('Subscribe to newsletter'));
      // Notifications already checked by default

      // Accept terms
      await user.click(screen.getByLabelText('I accept the terms and conditions'));
      await user.click(screen.getByLabelText('I accept the privacy policy'));

      // Submit form
      const submitButton = screen.getByRole('button', { name: 'Create Account' });
      await user.click(submitButton);

      // Verify submission
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            personal: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '+1 555 123 4567',
            },
            account: {
              username: 'johndoe',
              password: 'SecurePass123!',
              confirmPassword: 'SecurePass123!',
            },
            profile: expect.objectContaining({
              country: 'de',
              bio: 'Software developer from Berlin',
            }),
            preferences: {
              newsletter: true,
              notifications: true,
            },
            terms: {
              acceptTerms: true,
              acceptPrivacy: true,
            },
          }),
        );
      });
    });

    test('shows validation errors when submitting invalid form', async () => {
      const onSubmit = vi.fn();

      render(
        <Form<RegistrationForm>
          schema={registrationSchema}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
        >
          {(form) => (
            <>
              <Input control={form.control} name="personal.firstName" label="First Name" required />
              <Input control={form.control} name="personal.email" label="Email" required />
              <Checkbox
                control={form.control}
                name="terms.acceptTerms"
                label="Accept Terms"
                required
              />
              <Footer form={form} submitText="Submit" />
            </>
          )}
        </Form>,
      );

      // Try to submit without filling required fields
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText('First name must be at least 2 characters')).toBeInTheDocument();
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        expect(screen.getByText('You must accept the terms')).toBeInTheDocument();
      });

      // Form should not be submitted
      expect(onSubmit).not.toHaveBeenCalled();
    });

    test('resets form to default values', async () => {
      render(
        <Form<RegistrationForm>
          schema={registrationSchema}
          defaultValues={{
            ...defaultValues,
            personal: {
              ...defaultValues.personal!,
              firstName: 'Default',
              lastName: 'User',
            },
          }}
          onSubmit={() => {}}
        >
          {(form) => (
            <>
              <Input control={form.control} name="personal.firstName" label="First Name" />
              <Input control={form.control} name="personal.lastName" label="Last Name" />
              <Footer form={form} showReset />
            </>
          )}
        </Form>,
      );

      // Change values
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');

      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Changed');
      await user.clear(lastNameInput);
      await user.type(lastNameInput, 'Name');

      // Reset button should be enabled
      const resetButton = screen.getByRole('button', { name: /zurücksetzen/i });
      expect(resetButton).not.toBeDisabled();

      // Click reset
      await user.click(resetButton);

      // Should reset to defaults
      expect(firstNameInput).toHaveValue('Default');
      expect(lastNameInput).toHaveValue('User');
    });

    test('shows field-specific reset buttons', async () => {
      render(
        <Form<RegistrationForm>
          schema={registrationSchema}
          defaultValues={{
            ...defaultValues,
            personal: {
              ...defaultValues.personal!,
              firstName: 'Default',
            },
          }}
          onSubmit={() => {}}
        >
          {(form) => <Input control={form.control} name="personal.firstName" label="First Name" />}
        </Form>,
      );

      // Initially no reset button
      expect(screen.queryByLabelText('Auf Standardwert zurücksetzen')).not.toBeInTheDocument();

      // Change value
      const input = screen.getByLabelText('First Name');
      await user.clear(input);
      await user.type(input, 'New Name');

      // Reset button should appear
      const resetButton = await screen.findByLabelText('Auf Standardwert zurücksetzen');
      await user.click(resetButton);

      // Should reset to default
      expect(input).toHaveValue('Default');
    });
  });
});
