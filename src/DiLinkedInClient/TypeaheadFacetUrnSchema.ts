import { z } from "zod";
import { TypeaheadFacetUrn } from "./types.js";

// Helper function to create a Zod schema for typeahead facet URNs
export const typeaheadFacetUrnSchema = z.enum([
    "urn:li:adTargetingFacet:locations",
    "urn:li:adTargetingFacet:profileLocations",
    "urn:li:adTargetingFacet:titles",
    "urn:li:adTargetingFacet:titlesPast",
    "urn:li:adTargetingFacet:employersPast",
    "urn:li:adTargetingFacet:followedCompanies",
    "urn:li:adTargetingFacet:interests",
    "urn:li:adTargetingFacet:skills",
    "urn:li:adTargetingFacet:employers",
    "urn:li:adTargetingFacet:degrees",
    "urn:li:adTargetingFacet:memberBehaviors",
    "urn:li:adTargetingFacet:schools",
    "urn:li:adTargetingFacet:companyCategory",
    "urn:li:adTargetingFacet:titlesAll",
    "urn:li:adTargetingFacet:industries",
    "urn:li:adTargetingFacet:groups",
    "urn:li:adTargetingFacet:firstDegreeConnectionCompanies",
    "urn:li:adTargetingFacet:employersAll",
    "urn:li:adTargetingFacet:fieldsOfStudy"
  ] as [TypeaheadFacetUrn, ...TypeaheadFacetUrn[]]);
