import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {{COMPONENT_NAME}} from './{{COMPONENT_NAME}}';
import type { {{COMPONENT_NAME}}Props } from './{{COMPONENT_NAME}}';

// Mock dependencies
{{MOCK_IMPORTS}}

const defaultProps: {{COMPONENT_NAME}}Props = {
  {{DEFAULT_PROPS}}
};

const renderComponent = (props: Partial<{{COMPONENT_NAME}}Props> = {}) => {
  return render(<{{COMPONENT_NAME}} {...defaultProps} {...props} />);
};

describe('{{COMPONENT_NAME}}', () => {
  beforeEach(() => {
    {{BEFORE_EACH_SETUP}}
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('{{COMPONENT_NAME_KEBAB}}')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      renderComponent({ className: 'custom-class' });
      const element = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      expect(element).toHaveClass('custom-class');
    });

    it('renders with correct default props', () => {
      renderComponent();
      {{DEFAULT_PROPS_ASSERTIONS}}
    });
  });

  describe('User Interactions', () => {
    {{INTERACTION_TESTS}}
  });

  describe('Props Handling', () => {
    {{PROPS_TESTS}}
  });

  describe('Error States', () => {
    {{ERROR_STATE_TESTS}}
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes', () => {
      renderComponent();
      const element = screen.getByTestId('{{COMPONENT_NAME_KEBAB}}');
      {{ACCESSIBILITY_ASSERTIONS}}
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      renderComponent();
      {{KEYBOARD_NAVIGATION_TESTS}}
    });
  });
});