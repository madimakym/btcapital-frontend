import { apiRequest, apiUpload } from './client';
import type { KycDocumentResponse, KycDocType } from '$lib/types';

export const kycApi = {
  async uploadDocument(file: File, docType: KycDocType): Promise<KycDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('docType', docType);
    return apiUpload('/kyc/upload', formData, true);
  },

  async getMyDocuments(): Promise<KycDocumentResponse[]> {
    return apiRequest('/kyc/my-documents', {}, true);
  }
};
