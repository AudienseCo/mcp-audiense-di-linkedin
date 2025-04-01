import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getReports, getReportById, createReport, getReportInsights, getReportCategories, getTypeaheadSuggestions, getAccountDetails } from "./DiLinkedInClient/Client.js";
import { AuthClient } from "./auth/AuthClient.js";
import { JsonAudienceDefinition } from "./DiLinkedInClient/types.js";
import { typeaheadFacetUrnSchema } from "./DiLinkedInClient/TypeaheadFacetUrnSchema.js";
import { ObjectId } from "bson";

// MCP Server instance
const server = new McpServer({
  name: "di-linkedin",
  version: "1.0.0",
  description: "DI LinkedIn API MCP Server",
});

/**
 * Starts the MCP server and listens for incoming requests.
 */
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("DI LinkedIn Public API MCP Server running on stdio");
}

/**
 * MCP Tool: Get user reports
 */
server.tool(
  "get-linkedin-reports",
  "Get LinkedIn reports for the authorized user",
  {  },
  async () => {
    try {
      const data = await getReports();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to get user reports: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

/**
 * MCP Tool: Get a specific report by ID
 */
server.tool(
  "get-linkedin-report",
  "Get a specific LinkedIn report by ID",
  {
    id: z.string().describe("The report ID"),
  },
  async ({ id }) => {
    try {
      const data = await getReportById(id);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to get report: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

/**
 * MCP Tool: Create a new report
 */
server.tool(
  "create-linkedin-report",
  "Create a new LinkedIn report with audience definition",
  {
    title: z.string().describe("The report title"),
    audienceDefinition: z.object({
      include: z.object({
        and: z.array(
          z.object({
            or: z.record(z.array(z.string())).describe("Object with facet URNs as keys and arrays of facet values as values")
          }).describe("OR clause for audience targeting")
        )
      }),
      exclude: z.object({
        or: z.record(z.array(z.string())).describe("Object with facet URNs as keys and arrays of facet values as values")
      }).optional().describe("Optional exclusion criteria")
    }).describe("The audience definition with inclusion and optional exclusion criteria"),
    baselineDefinition: z.object({
      include: z.object({
        and: z.array(
          z.object({
            or: z.record(z.array(z.string())).describe("Object with facet URNs as keys and arrays of facet values as values")
          }).describe("OR clause for baseline audience targeting")
        )
      }),
      exclude: z.object({
        or: z.record(z.array(z.string())).describe("Object with facet URNs as keys and arrays of facet values as values")
      }).optional().describe("Optional exclusion criteria for baseline")
    }).optional().describe("The baseline definition is mandatory"),
  },
  async ({ title, audienceDefinition, baselineDefinition }) => {
    try {
      JSON.parse(JSON.stringify(audienceDefinition));
      JSON.parse(JSON.stringify(baselineDefinition));
      const id = new ObjectId().toString();
      await createReport({
        id,
        title,
        audienceDefinition: audienceDefinition as JsonAudienceDefinition,
        baselineDefinition: baselineDefinition as JsonAudienceDefinition | undefined,
      });

      return {
        content: [
          {
            type: "text",
            text: `Report "${title}" (ID: ${id}) created successfully. It could take up to 10 minutes to process. Wait until status is Finished before querying insights.`,
          },
        ],
      };
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to create report: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

/**
 * MCP Tool: Get insights for a report
 */
server.tool(
  "get-linkedin-insights",
  "Get LinkedIn insights for a specific report",
  {
    reportId: z.string().describe("The report ID"),
    facetUrns: z.array(z.string()).optional().describe("Filter insights by facet URNs (optional)"),
  },
  async ({ reportId, facetUrns }) => {
    try {
      const data = await getReportInsights(reportId, facetUrns);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to get insights: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

/**
 * MCP Tool: Get categories for a report
 */
server.tool(
  "get-linkedin-categories",
  "Get LinkedIn categories for a specific report",
  {
    reportId: z.string().describe("The report ID"),
    urns: z.array(z.string()).optional().describe("Filter categories by URNs (optional)"),
  },
  async ({ reportId, urns }) => {
    try {
      const data = await getReportCategories(reportId, urns);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to get categories: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

/**
 * MCP Tool: Get typeahead suggestions
 */
server.tool(
  "get-linkedin-typeahead",
  "Get LinkedIn typeahead suggestions for a specific facet and query. Use the facet parameter to specify which type of suggestions you want to retrieve.",
  {
    facet: typeaheadFacetUrnSchema.describe(
      "The facet URN to search for suggestions. Available facets include: " +
      "locations, profileLocations, titles, titlesPast, employersPast, followedCompanies, " +
      "interests, skills, employers, degrees, memberBehaviors, schools, companyCategory, " +
      "titlesAll, industries, groups, firstDegreeConnectionCompanies, employersAll, fieldsOfStudy. " +
      "Use with prefix 'urn:li:adTargetingFacet:' (e.g., 'urn:li:adTargetingFacet:locations')."
    ),
    query: z.string().optional().describe("The search query (optional). Use this to filter suggestions by keyword."),
  },
  async ({ facet, query }) => {
    try {
      // Log available facets if there's an error with the facet parameter
      if (!facet) {
        const availableFacets = [
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
        ];
        
        return {
          content: [
            {
              type: "text",
              text: "Missing or invalid facet parameter. Available facets are:\n" + 
                    availableFacets.join("\n"),
            },
          ],
          isError: true,
        };
      }
      
      const data = await getTypeaheadSuggestions(facet as unknown as string, query as unknown as string);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to get typeahead suggestions: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

/**
 * MCP Tool: Get account details
 */
server.tool(
  "get-linkedin-account",
  "Get LinkedIn account details including LinkedIn token",
  {},
  async () => {
    try {
      const data = await getAccountDetails();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to get account details: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

/**
 * MCP Tool: List available typeahead facets
 */
server.tool(
  "list-linkedin-typeahead-facets",
  "List all available facets that can be used with the get-linkedin-typeahead tool",
  {},
  async () => {
    try {      
      const facetsWithDescriptions = [
        { facet: "urn:li:adTargetingFacet:locations", description: "Geographic locations" },
        { facet: "urn:li:adTargetingFacet:profileLocations", description: "Profile locations" },
        { facet: "urn:li:adTargetingFacet:titles", description: "Current job titles" },
        { facet: "urn:li:adTargetingFacet:titlesPast", description: "Past job titles" },
        { facet: "urn:li:adTargetingFacet:employersPast", description: "Past employers" },
        { facet: "urn:li:adTargetingFacet:followedCompanies", description: "Companies followed by users" },
        { facet: "urn:li:adTargetingFacet:interests", description: "User interests" },
        { facet: "urn:li:adTargetingFacet:skills", description: "Professional skills" },
        { facet: "urn:li:adTargetingFacet:employers", description: "Current employers" },
        { facet: "urn:li:adTargetingFacet:degrees", description: "Educational degrees" },
        { facet: "urn:li:adTargetingFacet:memberBehaviors", description: "Member behaviors" },
        { facet: "urn:li:adTargetingFacet:schools", description: "Educational institutions" },
        { facet: "urn:li:adTargetingFacet:companyCategory", description: "Company categories" },
        { facet: "urn:li:adTargetingFacet:titlesAll", description: "All job titles (current and past)" },
        { facet: "urn:li:adTargetingFacet:industries", description: "Industries" },
        { facet: "urn:li:adTargetingFacet:groups", description: "LinkedIn groups" },
        { facet: "urn:li:adTargetingFacet:firstDegreeConnectionCompanies", description: "Companies with first-degree connections" },
        { facet: "urn:li:adTargetingFacet:employersAll", description: "All employers (current and past)" },
        { facet: "urn:li:adTargetingFacet:fieldsOfStudy", description: "Fields of study" }
      ];

      return {
        content: [
          {
            type: "text",
            text: "Available facets for typeahead suggestions:\n\n" + 
                  facetsWithDescriptions.map(item => `${item.facet} - ${item.description}`).join("\n") +
                  "\n\nUse these facets with the get-linkedin-typeahead tool to retrieve suggestions."
          }
        ]
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to list typeahead facets: ${errorMessage}`
          }
        ]
      };
    }
  }
);

/**
 * MCP Tool: List LinkedIn facet values
 */
server.tool(
  "list-linkedin-facet-values",
  "List all LinkedIn facets with predefined values, or filter by a specific facet",
  {
    facet: z.string().optional().describe("Optional: The specific facet URN to get values for (e.g., urn:li:adTargetingFacet:genders)")
  },
  async ({ facet }) => {
    try {
      // Define types for facet values
      type FacetValue = {
        value: string;
        description: string;
      };
      
      type FacetInfo = {
        description: string;
        values: FacetValue[];
      };
      
      type FacetsWithValues = {
        [key: string]: FacetInfo;
      };
      
      // Define the complete map of facets with their predefined values
      const facetsWithValues: FacetsWithValues = {
        "urn:li:adTargetingFacet:genders": {
          description: "Gender targeting",
          values: [
            { value: "urn:li:gender:FEMALE", description: "Female" },
            { value: "urn:li:gender:MALE", description: "Male" }
          ]
        },
        "urn:li:adTargetingFacet:ageRanges": {
          description: "Age range targeting",
          values: [
            { value: "urn:li:ageRange:(18,24)", description: "18-24 years" },
            { value: "urn:li:ageRange:(25,34)", description: "25-34 years" },
            { value: "urn:li:ageRange:(35,54)", description: "35-54 years" },
            { value: "urn:li:ageRange:(55,2147483647)", description: "55+ years" }
          ]
        },
        "urn:li:adTargetingFacet:seniorities": {
          description: "Seniority targeting",
          values: [
            { value: "urn:li:seniority:1", description: "Entry level" },
            { value: "urn:li:seniority:2", description: "Senior" },
            { value: "urn:li:seniority:3", description: "Manager" },
            { value: "urn:li:seniority:4", description: "Director" },
            { value: "urn:li:seniority:5", description: "VP" },
            { value: "urn:li:seniority:6", description: "CXO" },
            { value: "urn:li:seniority:7", description: "Owner" },
            { value: "urn:li:seniority:8", description: "Partner" },
            { value: "urn:li:seniority:9", description: "Unpaid" },
            { value: "urn:li:seniority:10", description: "Training" }
          ]
        },
        "urn:li:adTargetingFacet:revenue": {
          description: "Company revenue targeting",
          values: [
            { value: "urn:li:revenue:(-2147483647,1)", description: "Less than $1 million" },
            { value: "urn:li:revenue:(1,10)", description: "$1-10 million" },
            { value: "urn:li:revenue:(10,100)", description: "$10-100 million" },
            { value: "urn:li:revenue:(100,1000)", description: "$100 million-1 billion" },
            { value: "urn:li:revenue:(1000,2147483647)", description: "More than $1 billion" }
          ]
        },
        "urn:li:adTargetingFacet:growthRate": {
          description: "Company growth rate targeting",
          values: [
            { value: "urn:li:growthRate:(-2147483647,0)", description: "Negative growth" },
            { value: "urn:li:growthRate:(0,3)", description: "0-3% growth" },
            { value: "urn:li:growthRate:(3,10)", description: "3-10% growth" },
            { value: "urn:li:growthRate:(10,20)", description: "10-20% growth" },
            { value: "urn:li:growthRate:(20,2147483647)", description: "More than 20% growth" }
          ]
        },
        "urn:li:adTargetingFacet:yearsOfExperienceRanges": {
          description: "Years of experience targeting",
          values: [
            { value: "urn:li:yearsOfExperience:1", description: "1 year" },
            { value: "urn:li:yearsOfExperience:2", description: "2 years" },
            { value: "urn:li:yearsOfExperience:3", description: "3 years" },
            { value: "urn:li:yearsOfExperience:4", description: "4 years" },
            { value: "urn:li:yearsOfExperience:5", description: "5 years" },
            { value: "urn:li:yearsOfExperience:6", description: "6 years" },
            { value: "urn:li:yearsOfExperience:7", description: "7 years" },
            { value: "urn:li:yearsOfExperience:8", description: "8 years" },
            { value: "urn:li:yearsOfExperience:9", description: "9 years" },
            { value: "urn:li:yearsOfExperience:10", description: "10 years" },
            { value: "urn:li:yearsOfExperience:11", description: "11 years" },
            { value: "urn:li:yearsOfExperience:12", description: "12+ years" }
          ]
        },
        "urn:li:adTargetingFacet:staffCountRanges": {
          description: "Company size targeting",
          values: [
            { value: "urn:li:staffCountRange:(1,1)", description: "Self-employed" },
            { value: "urn:li:staffCountRange:(2,10)", description: "2-10 employees" },
            { value: "urn:li:staffCountRange:(11,50)", description: "11-50 employees" },
            { value: "urn:li:staffCountRange:(51,200)", description: "51-200 employees" },
            { value: "urn:li:staffCountRange:(201,500)", description: "201-500 employees" },
            { value: "urn:li:staffCountRange:(501,1000)", description: "501-1,000 employees" },
            { value: "urn:li:staffCountRange:(1001,5000)", description: "1,001-5,000 employees" },
            { value: "urn:li:staffCountRange:(5001,10000)", description: "5,001-10,000 employees" },
            { value: "urn:li:staffCountRange:(10001,2147483647)", description: "10,001+ employees" }
          ]
        },
        "urn:li:adTargetingFacet:jobFunctions": {
          description: "Job function targeting",
          values: [
            { value: "urn:li:function:1", description: "Accounting" },
            { value: "urn:li:function:2", description: "Administrative" },
            { value: "urn:li:function:3", description: "Arts and Design" },
            { value: "urn:li:function:4", description: "Business Development" },
            { value: "urn:li:function:5", description: "Community and Social Services" },
            { value: "urn:li:function:6", description: "Consulting" },
            { value: "urn:li:function:7", description: "Education" },
            { value: "urn:li:function:8", description: "Engineering" },
            { value: "urn:li:function:9", description: "Entrepreneurship" },
            { value: "urn:li:function:10", description: "Finance" },
            { value: "urn:li:function:11", description: "Healthcare Services" },
            { value: "urn:li:function:12", description: "Human Resources" },
            { value: "urn:li:function:13", description: "Information Technology" },
            { value: "urn:li:function:14", description: "Legal" },
            { value: "urn:li:function:15", description: "Marketing" },
            { value: "urn:li:function:16", description: "Media and Communication" },
            { value: "urn:li:function:17", description: "Military and Protective Services" },
            { value: "urn:li:function:18", description: "Operations" },
            { value: "urn:li:function:19", description: "Product Management" },
            { value: "urn:li:function:20", description: "Program and Project Management" },
            { value: "urn:li:function:21", description: "Purchasing" },
            { value: "urn:li:function:22", description: "Quality Assurance" },
            { value: "urn:li:function:23", description: "Real Estate" },
            { value: "urn:li:function:24", description: "Research" },
            { value: "urn:li:function:25", description: "Sales" },
            { value: "urn:li:function:26", description: "Support" }
          ]
        },
        "urn:li:adTargetingFacet:interfaceLocales": {
          description: "Interface language targeting",
          values: [
            { value: "urn:li:locale:ar_AE", description: "Arabic" },
            { value: "urn:li:locale:cs_CZ", description: "Czech" },
            { value: "urn:li:locale:da_DK", description: "Danish" },
            { value: "urn:li:locale:nl_NL", description: "Dutch" },
            { value: "urn:li:locale:en_US", description: "English" },
            { value: "urn:li:locale:fr_FR", description: "French" },
            { value: "urn:li:locale:de_DE", description: "German" },
            { value: "urn:li:locale:in_ID", description: "Indonesian" },
            { value: "urn:li:locale:it_IT", description: "Italian" },
            { value: "urn:li:locale:ja_JP", description: "Japanese" },
            { value: "urn:li:locale:ko_KR", description: "Korean" },
            { value: "urn:li:locale:ms_MY", description: "Malay" },
            { value: "urn:li:locale:no_NO", description: "Norwegian" },
            { value: "urn:li:locale:pl_PL", description: "Polish" },
            { value: "urn:li:locale:pt_BR", description: "Portuguese" },
            { value: "urn:li:locale:ro_RO", description: "Romanian" },
            { value: "urn:li:locale:ru_RU", description: "Russian" },
            { value: "urn:li:locale:es_ES", description: "Spanish" },
            { value: "urn:li:locale:sv_SE", description: "Swedish" },
            { value: "urn:li:locale:tr_TR", description: "Turkish" },
            { value: "urn:li:locale:hi_IN", description: "Hindi" }
          ]
        }
      };

      // If a specific facet is provided, filter only that facet
      if (facet) {
        if (!facetsWithValues[facet]) {
          // Check if this is a typeahead facet
          const typeaheadFacets = [
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
          ];

          if (typeaheadFacets.includes(facet)) {
            return {
              content: [
                {
                  type: "text",
                  text: `The facet "${facet}" is a typeahead facet and does not have predefined values. ` +
                        `Use the "get-linkedin-typeahead" tool to search for values for this facet.\n\n` +
                        `Example: { "facet": "${facet}", "query": "your search term" }`
                }
              ]
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `Facet "${facet}" not found or does not have predefined values. Available facets with predefined values are:\n\n` +
                      Object.keys(facetsWithValues).join("\n")
              }
            ],
            isError: true
          };
        }

        const facetInfo = facetsWithValues[facet];
        return {
          content: [
            {
              type: "text",
              text: `# ${facet} - ${facetInfo.description}\n\n` +
                    facetInfo.values.map(v => `- \`${v.value}\` - ${v.description}`).join("\n") +
                    "\n\n## Usage Example\n\n" +
                    "When creating a report with the `create-linkedin-report` tool, you can use these values in the audience definition:\n\n" +
                    "```json\n" +
                    `{\n  "audienceDefinition": {\n    "include": {\n      "and": [\n        {\n          "or": {\n            "${facet}": [\n              "${facetInfo.values[0].value}"\n            ]\n          }\n        }\n      ]\n    }\n  }\n}\n` +
                    "```"
            }
          ]
        };
      }

      // If no facet is provided, return all facets with their values
      return {
        content: [
          {
            type: "text",
            text: "# LinkedIn facets with predefined values\n\n" +
                  "The following facets have predefined values that can be used in audience definitions. " +
                  "For facets not listed here, use the `get-linkedin-typeahead` tool to search for values.\n\n" +
                  Object.entries(facetsWithValues).map(([facetUrn, info]) => 
                    `## ${facetUrn} - ${info.description}\n\n` +
                    info.values.map(v => `- \`${v.value}\` - ${v.description}`).join("\n")
                  ).join("\n\n") +
                  "\n\n## Usage Example\n\n" +
                  "When creating a report with the `create-linkedin-report` tool, you can use these values in the audience definition:\n\n" +
                  "```json\n" +
                  `{\n  "audienceDefinition": {\n    "include": {\n      "and": [\n        {\n          "or": {\n            "urn:li:adTargetingFacet:genders": [\n              "urn:li:gender:FEMALE"\n            ]\n          }\n        }\n      ]\n    }\n  }\n}\n` +
                  "```"
          }
        ]
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to list facet values: ${errorMessage}`
          }
        ],
        isError: true
      };
    }
  }
);

/**
 * MCP Tool: Initiate Device Authorization Flow
 */
server.tool(
  "initiate-linkedin-device-auth",
  "Start the device authorization flow to get a device code for authentication",
  {},
  async () => {
    try {
      const authClient = AuthClient.getInstance();
      const deviceCodeResponse = await authClient.requestDeviceCode();

      return {
        content: [
          {
            type: "text",
            text: "Device Authorization Flow initiated. Please follow these steps:",
          },
          {
            type: "text",
            text: `1. Visit: ${deviceCodeResponse.verification_uri_complete}`,
          },
          {
            type: "text",
            text: `2. Verify the code in the browser matches this one: ${deviceCodeResponse.user_code}`,
          },
          {
            type: "text",
            text: `3. The code will expire in ${deviceCodeResponse.expires_in} seconds`,
          },
          {
            type: "text",
            text: `4. After completing the authentication in the browser, the user should write the request again.`,
          },
          {
            type: "text",
            text: JSON.stringify(deviceCodeResponse, null, 2),
          },
        ],
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        content: [
          {
            type: "text",
            text: `Failed to initiate device authorization: ${errorMessage}`,
          },
        ],
      };
    }
  }
);

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
