import { AuthClient } from '../auth/AuthClient.js';
import {
  GetReportsResponse,
  GetReportResponse,
  CreateReportRequest,
  GetReportInsightsResponse, 
  GetReportCategoriesResponse, 
  GetTypeaheadSuggestionsResponse,
  AccountResponse,
  EstimateAudienceResponse,
  JsonAudienceDefinition
} from './types.js';

/**
 * Get all reports with optional pagination
 */
export async function getReports(paginationStart?: number, paginationEnd?: number): Promise<GetReportsResponse> {
  const queryParams = new URLSearchParams({
    ...(paginationStart !== undefined && { paginationStart: paginationStart.toString() }),
    ...(paginationEnd !== undefined && { paginationEnd: paginationEnd.toString() })
  });
  const endpoint = queryParams.toString() ? `/reports?${queryParams.toString()}` : '/reports';

  const response = await makeAuthenticatedRequest<GetReportsResponse>(endpoint, {
    method: 'GET',
  });

  return response;
}

/**
 * Get a specific report by ID
 */
export async function getReportById(id: string): Promise<GetReportResponse> {
  const endpoint = `/reports/${id}`;
  
  const response = await makeAuthenticatedRequest<GetReportResponse>(endpoint, {
    method: 'GET',
  });

  return response;
}

/**
 * Create a new report
 */
export async function createReport(reportData: CreateReportRequest): Promise<void> {
  const endpoint = '/reports';
  
  await makeAuthenticatedRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
}

/**
 * Get insights for a specific report
 */
export async function getReportInsights(
  reportId: string, 
  facetUrns?: string[]
): Promise<GetReportInsightsResponse> {
  let endpoint = `/reports/${reportId}/insights`;
  
  if (facetUrns && facetUrns.length > 0) {
    const queryParams = new URLSearchParams();
    facetUrns.forEach(urn => queryParams.append('facetUrn', urn));
    endpoint += `?${queryParams.toString()}`;
  }
  
  const response = await makeAuthenticatedRequest<GetReportInsightsResponse>(endpoint, {
    method: 'GET',
  });

  return response;
}

/**
 * Get categories for a specific report
 */
export async function getReportCategories(
  reportId: string, 
  urns?: string[]
): Promise<GetReportCategoriesResponse> {
  let endpoint = `/reports/${reportId}/categories`;
  
  if (urns && urns.length > 0) {
    const queryParams = new URLSearchParams();
    urns.forEach(urn => queryParams.append('urn', urn));
    endpoint += `?${queryParams.toString()}`;
  }
  
  const response = await makeAuthenticatedRequest<GetReportCategoriesResponse>(endpoint, {
    method: 'GET',
  });

  return response;
}

/**
 * Get typeahead suggestions for a specific facet and optional query
 */
export async function getTypeaheadSuggestions(
  facet: string, 
  query?: string
): Promise<GetTypeaheadSuggestionsResponse> {
  const queryParams = new URLSearchParams({
    facet,
    ...(query && { query })
  });
  
  const endpoint = `/typeahead?${queryParams.toString()}`;
  
  const response = await makeAuthenticatedRequest<GetTypeaheadSuggestionsResponse>(endpoint, {
    method: 'GET',
  });

  return response;
}

/**
 * Get account details including LinkedIn token
 */
export async function getAccountDetails(): Promise<AccountResponse> {
  const endpoint = '/account/me';
  
  const response = await makeAuthenticatedRequest<AccountResponse>(endpoint, {
    method: 'GET',
  });

  return response;
}

/**
 * Estimate audience size based on audience definition
 */
export async function estimateAudience(audienceDefinition: JsonAudienceDefinition): Promise<EstimateAudienceResponse> {
  const endpoint = '/estimation';
  
  const response = await makeAuthenticatedRequest<EstimateAudienceResponse>(endpoint, {
    method: 'POST',
    body: JSON.stringify({ audienceDefinition }),
  });

  return response;
}


/**
 * Helper function to make authenticated requests to the API
 */
async function makeAuthenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await AuthClient.getInstance().getAccessToken();

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Audiense MCP Server',
  };

  const url = `https://linkedinbackendhttp.socialbro.me${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    if(response.status === 201) {
      return null as any;
    }

    return response.json();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Error making request to ${endpoint}:`, errorMessage);
    throw error;
  }
}
