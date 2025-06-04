import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  InputShadcn as Input,
  Label,
} from '~/shared/shadcn';

import { LoginFormData, loginSchema } from '../model/schema';

export function LoginForm() {
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = (data: LoginFormData) => {
    console.log('Login attempt:', data);
    // TODO: Implement actual authentication
    navigate({ to: '/' });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Anmeldung</CardTitle>
        <CardDescription>Melden Sie sich an, um auf Ihr Konto zuzugreifen</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="ihre@email.de"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Anmelden
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
