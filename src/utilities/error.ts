/**
 * @description Utility enum to define all the reaonsable error codes that could be used by "ApiError"
 */
export enum CommonError {
  GENERAL = 0,
  MissingRequiredField = 1,
  ProfileCreationFailed = 2,
  EpisodeNotRecognized = 3,
}

/**
 * Method to resolve CommonError references to appropriate error messages - Utility method to keep route code clean
 * @param code Used to specify the code to resolve
 * @returns string
 */
export function resolveErrorMessage(code: CommonError): string {
  switch (code) {
    case CommonError.GENERAL:
      return 'The server encountered an unexpected error handling your request (details below)'
    case CommonError.MissingRequiredField:
      return 'Missing one or more required fields (details below)';
    case CommonError.EpisodeNotRecognized:
      return 'The episode ID provided does not match an entry in our archive.';
    default:
      return 'Unknown Error Code'
  }
}

export namespace errorTypeDefinitions {
  /**
   * Used for when there is one or more missing fields in a request body
   */
  export interface FieldErrorContext {
    field: string
    type: string
  }

  /**
   * Utility type to encompass all type exported by this namespace
   */
  export type ErrorContext =
    FieldErrorContext
    | FieldErrorContext[]
    | Error
    | unknown
    | string
}

/**
 * Utility class to automate generation of standardized errors based off of a
 * provided error code and some contextual information (if available)
 */
export class ApiError extends Error {
  readonly message: string
  readonly code: CommonError
  readonly context: errorTypeDefinitions.ErrorContext = "Not Provided"

  constructor(code: CommonError, ctx?: errorTypeDefinitions.ErrorContext) {
    super()

    this.message = resolveErrorMessage(code);
    this.code = code;
    if (ctx) this.context = ctx;
  }
}