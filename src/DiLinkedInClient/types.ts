export interface Error {
  error: string;
  code?: string | null;
}

export interface TypeaheadSuggestion {
  name: string;
  urn: string;
  facetUrn: string;
}

// LinkedIn Facet URNs
export type FacetUrn =
  | "urn:li:adTargetingFacet:genders"
  | "urn:li:adTargetingFacet:ageRanges"
  | "urn:li:adTargetingFacet:seniorities"
  | "urn:li:adTargetingFacet:revenue"
  | "urn:li:adTargetingFacet:growthRate"
  | "urn:li:adTargetingFacet:yearsOfExperienceRanges"
  | "urn:li:adTargetingFacet:staffCountRanges"
  | "urn:li:adTargetingFacet:jobFunctions"
  | "urn:li:adTargetingFacet:locations"
  | "urn:li:adTargetingFacet:profileLocations"
  | "urn:li:adTargetingFacet:titles"
  | "urn:li:adTargetingFacet:titlesPast"
  | "urn:li:adTargetingFacet:titlesAll"
  | "urn:li:adTargetingFacet:employers"
  | "urn:li:adTargetingFacet:employersPast"
  | "urn:li:adTargetingFacet:employersAll"
  | "urn:li:adTargetingFacet:followedCompanies"
  | "urn:li:adTargetingFacet:firstDegreeConnectionCompanies"
  | "urn:li:adTargetingFacet:interests"
  | "urn:li:adTargetingFacet:skills"
  | "urn:li:adTargetingFacet:degrees"
  | "urn:li:adTargetingFacet:memberBehaviors"
  | "urn:li:adTargetingFacet:companyCategory"
  | "urn:li:adTargetingFacet:industries"
  | "urn:li:adTargetingFacet:groups"
  | "urn:li:adTargetingFacet:fieldsOfStudy"
  | "urn:li:adTargetingFacet:schools"
  | "urn:li:adTargetingFacet:interfaceLocales"
  | "urn:li:adTargetingFacet:dynamicSegments"
  | "urn:li:adTargetingFacet:audienceMatchingSegments";

// Facet value types
export type GenderFacetValue = "urn:li:gender:FEMALE" | "urn:li:gender:MALE";

export type AgeFacetValue =
  | "urn:li:ageRange:(18,24)"
  | "urn:li:ageRange:(25,34)"
  | "urn:li:ageRange:(35,54)"
  | "urn:li:ageRange:(55,2147483647)";

export type SeniorityFacetValue =
  | "urn:li:seniority:1"
  | "urn:li:seniority:2"
  | "urn:li:seniority:3"
  | "urn:li:seniority:4"
  | "urn:li:seniority:5"
  | "urn:li:seniority:6"
  | "urn:li:seniority:7"
  | "urn:li:seniority:8"
  | "urn:li:seniority:9"
  | "urn:li:seniority:10";

export type RevenueFacetValue =
  | "urn:li:revenue:(-2147483647,1)"
  | "urn:li:revenue:(1,10)"
  | "urn:li:revenue:(10,100)"
  | "urn:li:revenue:(100,1000)"
  | "urn:li:revenue:(1000,2147483647)";

export type GrowthRateFacetValue =
  | "urn:li:growthRate:(-2147483647,0)"
  | "urn:li:growthRate:(0,3)"
  | "urn:li:growthRate:(3,10)"
  | "urn:li:growthRate:(10,20)"
  | "urn:li:growthRate:(20,2147483647)";

export type YearsOfExperienceFacetValue =
  | "urn:li:yearsOfExperience:1"
  | "urn:li:yearsOfExperience:2"
  | "urn:li:yearsOfExperience:3"
  | "urn:li:yearsOfExperience:4"
  | "urn:li:yearsOfExperience:5"
  | "urn:li:yearsOfExperience:6"
  | "urn:li:yearsOfExperience:7"
  | "urn:li:yearsOfExperience:8"
  | "urn:li:yearsOfExperience:9"
  | "urn:li:yearsOfExperience:10"
  | "urn:li:yearsOfExperience:11"
  | "urn:li:yearsOfExperience:12";

export type StaffCountRangesFacetValue =
  | "urn:li:staffCountRange:(1,1)"
  | "urn:li:staffCountRange:(2,10)"
  | "urn:li:staffCountRange:(11,50)"
  | "urn:li:staffCountRange:(51,200)"
  | "urn:li:staffCountRange:(201,500)"
  | "urn:li:staffCountRange:(501,1000)"
  | "urn:li:staffCountRange:(1001,5000)"
  | "urn:li:staffCountRange:(5001,10000)"
  | "urn:li:staffCountRange:(10001,2147483647)";

export type JobFunctionsFacetValue =
  | "urn:li:function:1"
  | "urn:li:function:2"
  | "urn:li:function:3"
  | "urn:li:function:4"
  | "urn:li:function:5"
  | "urn:li:function:6"
  | "urn:li:function:7"
  | "urn:li:function:8"
  | "urn:li:function:9"
  | "urn:li:function:10"
  | "urn:li:function:11"
  | "urn:li:function:12"
  | "urn:li:function:13"
  | "urn:li:function:14"
  | "urn:li:function:15"
  | "urn:li:function:16"
  | "urn:li:function:17"
  | "urn:li:function:18"
  | "urn:li:function:19"
  | "urn:li:function:20"
  | "urn:li:function:21"
  | "urn:li:function:22"
  | "urn:li:function:23"
  | "urn:li:function:24"
  | "urn:li:function:25"
  | "urn:li:function:26";

export type InterfaceLocalesFacetValue =
  | "urn:li:locale:ar_AE"
  | "urn:li:locale:cs_CZ"
  | "urn:li:locale:da_DK"
  | "urn:li:locale:nl_NL"
  | "urn:li:locale:en_US"
  | "urn:li:locale:fr_FR"
  | "urn:li:locale:de_DE"
  | "urn:li:locale:in_ID"
  | "urn:li:locale:it_IT"
  | "urn:li:locale:ja_JP"
  | "urn:li:locale:ko_KR"
  | "urn:li:locale:ms_MY"
  | "urn:li:locale:no_NO"
  | "urn:li:locale:pl_PL"
  | "urn:li:locale:pt_BR"
  | "urn:li:locale:ro_RO"
  | "urn:li:locale:ru_RU"
  | "urn:li:locale:es_ES"
  | "urn:li:locale:sv_SE"
  | "urn:li:locale:tr_TR"
  | "urn:li:locale:hi_IN";

// Generic type for typeahead facet values (locations, titles, employers, etc.)
export type TypeaheadFacetValue = string;

// OrClause type with specific facet value types
export interface OrClause {
  or: {
    [key in FacetUrn]?: Array<
      key extends "urn:li:adTargetingFacet:genders"
        ? GenderFacetValue
        : key extends "urn:li:adTargetingFacet:ageRanges"
        ? AgeFacetValue
        : key extends "urn:li:adTargetingFacet:seniorities"
        ? SeniorityFacetValue
        : key extends "urn:li:adTargetingFacet:revenue"
        ? RevenueFacetValue
        : key extends "urn:li:adTargetingFacet:growthRate"
        ? GrowthRateFacetValue
        : key extends "urn:li:adTargetingFacet:yearsOfExperienceRanges"
        ? YearsOfExperienceFacetValue
        : key extends "urn:li:adTargetingFacet:staffCountRanges"
        ? StaffCountRangesFacetValue
        : key extends "urn:li:adTargetingFacet:jobFunctions"
        ? JobFunctionsFacetValue
        : key extends "urn:li:adTargetingFacet:interfaceLocales"
        ? InterfaceLocalesFacetValue
        : TypeaheadFacetValue
    >;
  };
}

export interface JsonAudienceDefinition {
  include: {
    and: OrClause[];
  };
  exclude?: OrClause;
}

export interface CreateReportRequest {
  id: string;
  title: string;
  audienceDefinition: JsonAudienceDefinition;
  baselineDefinition?: JsonAudienceDefinition;
}

export interface ReportSummary {
  id: string;
  title: string;
  createdAt: string;
  audienceDefinition: JsonAudienceDefinition;
  audienceSize?: number | null;
  baselineSize?: number | null;
  status: 'Generating' | 'Failed' | 'Finished';
  errorCode?: 'RateLimitError' | 'AudienceSizeTooSmallError' | 'UnknownError' | null;
}

export interface ReportDetail {
  id: string;
  title: string;
  audienceSize: number;
  baselineSize: number;
  createdAt: string;
  status: 'Generating' | 'Failed' | 'Finished';
  errorCode?: 'RateLimitError' | 'AudienceSizeTooSmallError' | 'UnknownError' | null;
}

export interface LinkedInInsight {
  name: string;
  urn: string;
  count: number;
  facetUrn: string;
}

export interface SerializedInsight {
  name: string;
  urn: string;
  count: number;
  penetration: number;
  affinity: number;
  baselineCount: number;
  baselinePenetration: number;
  facetUrn: string;
}

export interface SerializedSubcategoryCalculated {
  name: string;
  count: number;
  penetration: number;
  affinity: number;
  baselineCount: number;
  baselinePenetration: number;
  insights: SerializedInsight[];
}

export interface SerializedCategoryCalculated {
  name: string;
  count: number;
  penetration: number;
  affinity: number;
  baselineCount: number;
  baselinePenetration: number;
  subcategories: SerializedSubcategoryCalculated[];
}

export interface SerializedMainCategoryCalculated {
  name: string;
  urn: string;
  categories: SerializedCategoryCalculated[];
}

export interface Account {
  id: string;
  email: string;
  identityId: string;
  createdAt: string;
}

export interface LinkedInToken {
  accountId: string;
  accessToken: string;
  expiresIn: number;
  refreshToken?: string | null;
  refreshTokenExpiresIn?: number | null;
  scope: string;
  createdAt: string;
  adsAccountId?: string | null;
}

export interface AccountResponse {
  account: Account;
  linkedInToken?: LinkedInToken;
}

// Response types for API endpoints
export type GetReportsResponse = ReportSummary[];
export type GetReportResponse = ReportDetail;
export type GetReportInsightsResponse = SerializedInsight[];
export type GetReportCategoriesResponse = SerializedMainCategoryCalculated[];
export type GetTypeaheadSuggestionsResponse = TypeaheadSuggestion[];

// Valid facet URNs for typeahead endpoint
export type TypeaheadFacetUrn =
  | "urn:li:adTargetingFacet:locations"
  | "urn:li:adTargetingFacet:profileLocations"
  | "urn:li:adTargetingFacet:titles"
  | "urn:li:adTargetingFacet:titlesPast"
  | "urn:li:adTargetingFacet:employersPast"
  | "urn:li:adTargetingFacet:followedCompanies"
  | "urn:li:adTargetingFacet:interests"
  | "urn:li:adTargetingFacet:skills"
  | "urn:li:adTargetingFacet:employers"
  | "urn:li:adTargetingFacet:degrees"
  | "urn:li:adTargetingFacet:memberBehaviors"
  | "urn:li:adTargetingFacet:schools"
  | "urn:li:adTargetingFacet:companyCategory"
  | "urn:li:adTargetingFacet:titlesAll"
  | "urn:li:adTargetingFacet:industries"
  | "urn:li:adTargetingFacet:groups"
  | "urn:li:adTargetingFacet:firstDegreeConnectionCompanies"
  | "urn:li:adTargetingFacet:employersAll"
  | "urn:li:adTargetingFacet:fieldsOfStudy";
