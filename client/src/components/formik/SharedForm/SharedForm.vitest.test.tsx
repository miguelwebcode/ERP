import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SharedForm from "./SharedForm";
import {
  CustomerFormValues,
  LoginFormValues,
  ProjectFormValues,
  RegisterFormValues,
  SelectCustomerFormValues,
  SelectProjectFormValues,
} from "../../../types/form-values-types";
import {
  customerFormValidationSchema,
  loginFormValidationSchema,
  projectFormValidationSchema,
  registerFormValidationSchema,
  selectCustomerFormValidationSchema,
  selectProjectFormValidationSchema,
} from "../../../schemas";
import { CustomInput } from "../CustomInput/CustomInput";
import { CustomSelect } from "../CustomSelect/CustomSelect";

describe("SharedForm", () => {});
