import api from './axios';

// ✅ Récupérer toutes les réclamations
export const getClaims = async () => {
  const response = await api.get('/claims/');
  // Gère la pagination de Django (results) ou un tableau direct
  return response.data.results || response.data;
};

// ✅ Récupérer les détails d'une réclamation
export const getClaimDetails = async (claimId) => {
  const response = await api.get(`/claims/${claimId}/`);
  return response.data;
};

// ✅ Récupérer les pièces jointes (photos)
export const getClaimAttachments = async (claimId) => {
  const response = await api.get(`/attachments/claim/${claimId}/`);
  return response.data;
};

// ✅ Mettre à jour le statut
export const updateClaimStatus = async (claimId, newStatus) => {
  const response = await api.patch(`/claims/${claimId}/status/`, {
    status: newStatus,
  });
  return response.data;
};

// ✅ Assigner un agent à une réclamation
export const assignClaim = async (claimId, agentId) => {
  const response = await api.patch(`/claims/${claimId}/assign/`, {
    agent_id: agentId,
  });
  return response.data;
};

// ✅ Résoudre une réclamation avec photos
export const resolveClaim = async (claimId, comment, files) => {
  const formData = new FormData();
  formData.append('resolution_comment', comment);
  
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append('resolution_proofs', file);
    });
  }

  const response = await api.patch(`/claims/${claimId}/resolve/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};