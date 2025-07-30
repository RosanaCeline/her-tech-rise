import { requestService } from "./requestService";

export const postApplication = async (data) => {
    const formData = new FormData();
    formData.append("jobPostingId", data.jobPostingId);
    formData.append("githubLink", data.githubLink);
    formData.append("portfolioLink", data.portfolioLink);
    formData.append("resumeFile", data.resumeFile); 
    
    return await requestService.apiRequest(`/job-applications`, 'POST', formData);
}

export const myApplications = async () => {
    return await requestService.apiRequest("/job-applications/my", "GET")
}

export const myApplicationDetail = async (id) => {
    return await requestService.apiRequest(`/job-applications/my/${id}`, 'GET');
}

export const cancelApplication = async (id) => {
    return await requestService.apiRequest(`/job-applications/${id}`, 'DELETE');
}