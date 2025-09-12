import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { {{ENTITY_NAME}} } from '../types/{{ENTITY_NAME_LOWERCASE}}.types';
import { {{ENTITY_NAME}}Service } from '../services/{{ENTITY_NAME_LOWERCASE}}.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

/**
 * {{ENDPOINT_DESCRIPTION}}
 * 
 * @route {{HTTP_METHOD}} {{ENDPOINT_PATH}}
 * @access {{ACCESS_LEVEL}}
 * @param {AuthenticatedRequest} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */

// Validation rules
export const {{FUNCTION_NAME}}Validation = [
  {{VALIDATION_RULES}}
];

// Controller function
export const {{FUNCTION_NAME}} = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Validation failed',
        details: errors.array()
      });
      return;
    }

    // Extract validated data
    const {{EXTRACTED_DATA}} = req.{{REQUEST_LOCATION}};
    const userId = req.user?.uid;

    // Log the operation
    logger.info(`{{OPERATION_LOG_MESSAGE}}`, { 
      userId, 
      {{LOG_CONTEXT}} 
    });

    // Execute business logic
    {{BUSINESS_LOGIC}}

    // Send response
    res.status(StatusCodes.{{SUCCESS_STATUS}}).json({
      success: true,
      data: {{RESPONSE_DATA}},
      message: '{{SUCCESS_MESSAGE}}'
    });

  } catch (error) {
    logger.error(`{{ERROR_LOG_MESSAGE}}:`, error);
    
    // Handle specific error types
    if (error instanceof {{SPECIFIC_ERROR_TYPE}}) {
      res.status(StatusCodes.{{ERROR_STATUS}}).json({
        error: '{{ERROR_MESSAGE}}',
        code: '{{ERROR_CODE}}'
      });
      return;
    }

    // Generic error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Route registration helper
export const {{FUNCTION_NAME}}Route = {
  method: '{{HTTP_METHOD}}' as const,
  path: '{{ENDPOINT_PATH}}',
  validation: {{FUNCTION_NAME}}Validation,
  handler: {{FUNCTION_NAME}},
  requiresAuth: {{REQUIRES_AUTH}},
  permissions: {{REQUIRED_PERMISSIONS}}
};