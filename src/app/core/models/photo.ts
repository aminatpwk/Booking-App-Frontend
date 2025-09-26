export interface Photo{
  id: string;
  apartmentId: string;
  imageData?: string; //base64 converted to byte[] on backend later
  imageName: string;
  imageType: string;
  createdAt: Date;
  imageUrl?: string;
}

export interface CreatePhotoDto{
  apartmentId: string;
  imageFile: File;
  imageName: string;
  imageType: string;
}

export class PhotoHelper {
  static createImageUrl(photo: Photo): string {
    if (photo.imageData) {
      return `data:${photo.imageType};base64,${photo.imageData}`;
    }
    return '';
  }

  static isValidImageType(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  static getFileExtension(imageType: string): string {
    const typeMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp'
    };
    return typeMap[imageType] || '';
  }

  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static validateImageSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}
