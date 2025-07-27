import { requestService } from "./requestService";

export const postJob = async (formData) => {
    return await requestService.apiRequest(`/job-postings`, 'POST', formData);
}