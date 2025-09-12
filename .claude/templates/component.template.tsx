import React from 'react';
import { cn } from '@/lib/utils';

/**
 * {{COMPONENT_NAME}} - {{COMPONENT_DESCRIPTION}}
 * 
 * @component
 * @example
 * ```tsx
 * <{{COMPONENT_NAME}} 
 *   {{EXAMPLE_PROPS}}
 * />
 * ```
 */

export interface {{COMPONENT_NAME}}Props {
  {{PROPS_INTERFACE}}
  /** Additional CSS classes */
  className?: string;
  /** Test identifier */
  'data-testid'?: string;
}

export const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = ({
  {{PROPS_DESTRUCTURE}}
  className,
  'data-testid': testId,
}) => {
  return (
    <div 
      className={cn(
        "{{BASE_CLASSES}}",
        className
      )}
      data-testid={testId || "{{COMPONENT_NAME_KEBAB}}"}
    >
      {{COMPONENT_CONTENT}}
    </div>
  );
};

{{COMPONENT_NAME}}.displayName = '{{COMPONENT_NAME}}';

export default {{COMPONENT_NAME}};