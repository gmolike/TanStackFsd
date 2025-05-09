# Test Strategy Explanation for Obligation Detail

This document explains the reasoning behind the testing approach for the Obligation Detail components.

## Key Principles

### 1. Alignment with Feature-Sliced Design (FSD)

The testing approach follows FSD boundaries:

- **Entity Layer**: Tests for the `useApi` hook reside in the entity layer, focusing on data fetching and transformation
- **Feature Layer**: Tests for UI components (`ClientDisplay`, `PersonDisplay`, `Detail`) are in the feature layer
- **Integration Tests**: Tests that verify cross-component behavior are separated from unit tests

### 2. Testing Behavior vs. Implementation

The current tests mix concerns by testing internal state directly. The new approach focuses on behavior:

```javascript
// OLD (problematic): Testing internal state directly
test("person and client details should be closed", async () => {
  vi.mocked(useApi).mockReturnValue(apiMock);
  const { findByRole, queryByText, queryByTestId } = await setup(crypto.randomUUID(), obligationDetailMock.id);

  const checkDetailsClosed = async (showButtonText: RegExp, hideButtonText: RegExp, appearingTestId: string) => {
    await findByRole("button", { name: showButtonText });
    await waitFor(() => expect(queryByText(hideButtonText)).toBeNull());
    await waitFor(() => expect(queryByTestId(appearingTestId)).toBeNull());
  };
  await checkDetailsClosed(/Kunde/i, /Kundendetails/i, "client-details");
  await checkDetailsClosed(/Verpflichtete Person/i, /Personendetails/i, "person-details");
});

// NEW (better): Testing what the user sees
it('should switch to client detail view when clicked', () => {
  render(
    <ClientDisplay
      clientId="client-123"
      obligationDetail={mockObligationDetail as any}
    />
  );

  // Click on the short info to show details
  fireEvent.click(screen.getByTestId('client-short-info'));

  // Should now show client detail
  expect(screen.getByTestId('client-detail')).toBeInTheDocument();
  expect(screen.queryByTestId('client-short-info')).not.toBeInTheDocument();
});
```

### 3. Modern React Testing Best Practices

The approach employs current best practices:

- **Component Isolation** through mocking dependencies
- **React Testing Library** to test from the user's perspective
- **Vitest** for performant, modern testing
- **Component-focused tests** rather than page-focused tests

### 4. TanStack Query Integration

Components using TanStack Query are tested with:

- A `QueryClientProvider` wrapper
- Mock hooks that return the appropriate data structure
- Tests for loading, error, and success states

## Specific Test Cases and Their Purpose

### useApi.test.tsx

Tests the API hook that fetches obligation details:

1. **Loading state**: Verifies proper loading state is returned
2. **Error state**: Ensures error conditions are properly handled
3. **Data transformation**: Validates that the DTO from the API is correctly transformed

### ClientDisplay.test.tsx and PersonDisplay.test.tsx

Tests the components that display client and person information:

1. **Default state**: Verifies short info is shown by default
2. **Expanding details**: Tests that clicking shows detailed information
3. **Collapsing details**: Tests that clicking again returns to short info
4. **Edge cases**: Checks behavior with undefined/incomplete data

### Detail.test.tsx

Tests the main Detail component:

1. **Loading state**: Verifies loading indicator is shown
2. **Error state**: Ensures error message is displayed
3. **Complete rendering**: Tests that all sections render with the right data
4. **Structure and content**: Validates headings, sections, and formatting

### integration.test.tsx

Tests how components work together:

1. **Flow between components**: Tests expanding/collapsing of sections
2. **Data passing**: Verifies data flows correctly between components
3. **User interaction**: Tests common user interactions

## Why This Approach Is Superior

1. **Maintainability**: Tests are isolated to their specific components, making maintenance easier
2. **Resilience**: Tests don't break due to internal implementation changes
3. **Coverage**: Tests cover all key functionality and edge cases
4. **Developer Experience**: Tests are clear and focused on user behavior
5. **FSD Alignment**: Test organization mirrors the application's architecture

The original tests mixed concerns, tested implementation details, and didn't follow FSD boundaries. The new approach addresses these issues while providing better coverage and clearer tests.
