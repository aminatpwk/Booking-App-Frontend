export interface PhotoUpload {
  id: string;
  file: File;
  preview: string;
  base64?: string;
  uploadProgress?: number;
  isUploading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export interface PhotoValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PhotoUploadConfig {
  maxFiles: number;
  minFiles: number;
  maxFileSizeInMB: number;
  allowedTypes: string[];
}

export const DEFAULT_PHOTO_CONFIG: PhotoUploadConfig = {
  maxFiles: 10,
  minFiles: 4,
  maxFileSizeInMB: 5,
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
};
