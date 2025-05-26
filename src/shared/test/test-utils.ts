/* eslint-disable @typescript-eslint/naming-convention */

import type { ReactElement } from 'react';

import type {
  Queries,
  queries,
  RenderHookOptions,
  RenderHookResult,
  RenderOptions,
} from '@testing-library/react';
import { render, renderHook } from '@testing-library/react';

import CustomWrapper from './CustomWrapper.tsx';

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, {
    wrapper: CustomWrapper,
    ...options,
  });

const customRenderHook = <
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  hook: (initialProps: Props) => Result,

  options?: RenderHookOptions<Props, Q, Container, BaseElement>,
): RenderHookResult<Result, Props> =>
  renderHook<Result, Props, Q, Container, BaseElement>(hook, {
    wrapper: CustomWrapper,
    ...options,
  });

export * from '@testing-library/react';

export { customRender as render };

export { customRenderHook as renderHook };
