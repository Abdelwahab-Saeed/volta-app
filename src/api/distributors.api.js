import api from './axios';

// "Become a Volta distributor" form. The admin manages the requests in the dashboard.
export const createDistributorRequest = (data) => {
    return api.post('/distributor-requests', data);
};
