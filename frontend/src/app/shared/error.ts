import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../core/api.service';
export function errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
        const response = error.error as Partial<ApiResponse<unknown>> | null;
        const errors = response?.errors;
        if (errors && typeof errors === 'object') {
            return Object.entries(errors)
                .map(([field, message]) => `${field}: ${message}`)
                .join('; ');
        }
        return response?.message || 'Could not reach backend. Is Spring Boot running?';
    }
    return 'Unexpected error';
}

