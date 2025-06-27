import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AddressDisplay } from '.';

describe('AddressDisplay', () => {
  const fullAddress = {
    street: 'Hauptstraße 123',
    postalCode: '12345',
    city: 'Berlin',
    country: 'Deutschland',
  };

  const partialAddress = {
    street: 'Hauptstraße 123',
    city: 'Berlin',
  };

  it('renders full address inline', () => {
    render(<AddressDisplay address={fullAddress} />);
    expect(screen.getByText('Hauptstraße 123, 12345 Berlin, Deutschland')).toBeInTheDocument();
  });

  it('renders partial address inline', () => {
    render(<AddressDisplay address={partialAddress} />);
    expect(screen.getByText('Hauptstraße 123, Berlin')).toBeInTheDocument();
  });

  it('renders address multiline', () => {
    render(<AddressDisplay address={fullAddress} format="multiline" />);
    expect(screen.getByText('Hauptstraße 123')).toBeInTheDocument();
    expect(screen.getByText('12345 Berlin')).toBeInTheDocument();
    expect(screen.getByText('Deutschland')).toBeInTheDocument();
  });

  it('combines postalCode and city correctly', () => {
    const address = { postalCode: '12345', city: 'Berlin' };
    render(<AddressDisplay address={address} />);
    expect(screen.getByText('12345 Berlin')).toBeInTheDocument();
  });

  it('renders only city when postalCode is missing', () => {
    const address = { city: 'Berlin' };
    render(<AddressDisplay address={address} />);
    expect(screen.getByText('Berlin')).toBeInTheDocument();
  });

  it('renders placeholder when address is null', () => {
    render(<AddressDisplay address={null} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('renders placeholder when address is undefined', () => {
    render(<AddressDisplay address={undefined} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('shows empty fields when hideEmpty is false', () => {
    const address = { street: 'Hauptstraße 123', city: '', country: 'Deutschland' };
    render(<AddressDisplay address={address} hideEmpty={false} />);
    expect(screen.getByText('Hauptstraße 123, , Deutschland')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<AddressDisplay address={fullAddress} className="custom-address" />);
    expect(screen.getByText('Hauptstraße 123, 12345 Berlin, Deutschland')).toHaveClass(
      'custom-address',
    );
  });

  it('applies truncate class for inline format', () => {
    render(<AddressDisplay address={fullAddress} format="inline" />);
    expect(screen.getByText('Hauptstraße 123, 12345 Berlin, Deutschland')).toHaveClass('truncate');
  });

  it('renders multiline with space-y-1 class', () => {
    render(<AddressDisplay address={fullAddress} format="multiline" />);
    const container = screen.getByText('Hauptstraße 123').parentElement;
    expect(container).toHaveClass('space-y-1');
  });
});
