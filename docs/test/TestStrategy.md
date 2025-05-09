# Obligation Detail Testing Strategy

## Overview

This directory contains tests for the Obligation Detail feature following Feature-Sliced Design (FSD) principles and modern React testing practices. The tests focus on behavior rather than implementation details and align with FSD architecture layers.

## Test Structure

Tests are organized according to FSD layers:

```
src/
├── entities/
│   └── obligations/
│       └── api/
│           └── __tests__/
│               └── useApi.test.tsx  # Tests for API hook
├── features/
│   └── obligation-detail/
│       ├── __tests__/
│       │   ├── Detail.test.tsx      # Tests for main component
│       │   └── integration.test.tsx # Integration tests
│       └── ui/
│           └── __tests__/
│               ├── ClientDisplay.test.tsx
│               └── PersonDisplay.test.tsx
```

## Testing Approach

1. **Entity Layer Tests** focus on data fetching and transformation
2. **Feature Layer Tests** focus on UI components and business logic
3. **Integration Tests** focus on how components work together

## Setup

Tests use:

- Vitest as the test runner
- React Testing Library for component testing
- MSW (Mock Service Worker) for API mocking (optional)
- TanStack Query test utilities

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests for a specific file
pnpm test -- features/obligation-detail

# Run tests in watch mode
pnpm test:watch
```

## Test Migration Notes

These tests replace the older approach that:

1. Directly tested local component state
2. Used custom assertions
3. Mixed concerns across FSD layers

The new approach:

1. Tests behavior (what the user sees) rather than implementation
2. Uses standard RTL assertions
3. Separates tests by FSD layer
