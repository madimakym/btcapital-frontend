import { apiRequest, apiUpload } from './client';
import type { KycDocumentResponse, KycDocType } from '$lib/types';

export const kycApi = {
  async uploadDocument(file: File, docType: KycDocType): Promise<KycDocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return apiUpload(`/kyc/upload?documentType=${encodeURIComponent(docType)}`, formData, true);
  },

  async getMyDocuments(): Promise<KycDocumentResponse[]> {
    return apiRequest('/kyc/my-documents', {}, true);
  }
};
