import api from './axios';

// Company content managed from the admin dashboard (home page sections).
// Every item carries `{field}_ar` / `{field}_en`, so read texts with useLocalize() - no refetch on language change.
export const getPartners = () => api.get('/partners');
export const getCertificates = () => api.get('/certificates');
export const getTeam = () => api.get('/team');
