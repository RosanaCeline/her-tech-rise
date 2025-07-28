import { requestService } from "./requestService";

export const postJob = async (formData) => {
    return await requestService.apiRequest(`/job-postings`, 'POST', formData);
}

export const companyJobPostings = async () => {
    return await requestService.apiRequest(`/job-postings/company`, 'GET');
}

export const editPostJob = async (formData) => {
    return await requestService.apiRequest(`/job-postings/${formData.id}`, 'PUT', formData);
}

export const companyJobPostingDetail = async (id) => {
    return await requestService.apiRequest(`/job-postings/company/${id}`, 'GET');
}

export const deactivateJobPosting = async (id) => {
    return await requestService.apiRequest(`/job-postings/${id}/deactivate`, 'PATCH');
}

export const publicJobPostings = async () => {
    return await requestService.apiRequest(`/job-postings/public`, 'GET');
}

export const publicJobDetail = async (id) => {
    return await requestService.apiRequest(`/job-postings/public/${id}`, 'GET');
}