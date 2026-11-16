// import axios from 'axios';

// const http = axios.create({
//   baseURL: '/',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export type ApiErrorType =
//   | 'UNAUTHORIZED'
//   | 'FORBIDDEN'
//   | 'NOT_FOUND'
//   | 'CONFLICT'
//   | 'SERVER_ERROR'
//   | 'NETWORK_ERROR'
//   | 'UNKNOWN_ERROR'
//   | 'CANCELLED';

// export class ApiError extends Error {
//   constructor(
//     public type: ApiErrorType,
//     public status?: number,
//     message?: string
//   ) {
//     super(message ?? type);
//     this.name = 'ApiError';
//   }
// }

// export default http;

import axios, {
  type InternalAxiosRequestConfig
} from 'axios';
import { ApiError } from './apiError';

const http = axios.create({
  baseURL: '/',
  timeout: 10000
});

// 1. Request Interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(
      '[Request]',
      config.method?.toUpperCase(),
      config.url
    );

    return config;
  },
  error => Promise.reject(error)
);

// 2. Response Interceptor

http.interceptors.response.use(
  response => {
    console.log(
      `[Response] ${response.status} ${response.config.url}`
    );

    return response;
  },

  (error: unknown) => {
    // 1. Request cancelled
    if (
      axios.isCancel(error) ||
      (axios.isAxiosError(error) &&
        error.code === 'ERR_CANCELED')
    ) {
      return Promise.reject(
        new ApiError(
          'CANCELLED',
          undefined,
          'Request cancelled.'
        )
      );
    }

    // 2. Axios error
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const responseData: unknown =
        axiosError.response?.data;

      // 3. Network error
      if (!axiosError.response) {
        return Promise.reject(
          new ApiError(
            'NETWORK_ERROR',
            undefined,
            'Network error. Please check your connection.'
          )
        );
      }

      // 4. HTTP error mapping
      const errorMap: Record<
        number,
        {
          type: ApiError['type'];
          message: string;
        }
      > = {
        400: {
          type: 'VALIDATION_ERROR',
          message: 'Invalid request.'
        },
        401: {
          type: 'UNAUTHORIZED',
          message: 'Authentication required.'
        },
        403: {
          type: 'FORBIDDEN',
          message: 'Access denied.'
        },
        404: {
          type: 'NOT_FOUND',
          message: 'Resource not found.'
        },
        409: {
          type: 'CONFLICT',
          message: 'Resource conflict.'
        }
      };

      const mapped = status
        ? errorMap[status]
        : undefined;

      if (mapped) {
        return Promise.reject(
          new ApiError(
            mapped.type,
            status,
            extractErrorMessage(
              responseData,
              mapped.message
            ),
            responseData
          )
        );
      }

      // 5. Server error
      if (status && status >= 500) {
        return Promise.reject(
          new ApiError(
            'SERVER_ERROR',
            status,
            'Server error. Please try again later.',
            responseData
          )
        );
      }
    }

    // 6. Unknown error
    return Promise.reject(
      new ApiError(
        'UNKNOWN_ERROR',
        undefined,
        'Unexpected error.'
      )
    );
  }
);


function extractErrorMessage(
  data: unknown,
  fallback: string
): string {
  if (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof data.message === 'string'
  ) {
    return data.message;
  }

  return fallback;
}

export default http;
