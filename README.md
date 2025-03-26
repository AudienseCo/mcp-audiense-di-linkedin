# 🏆 LinkedIn DI MCP Server

This server, based on the [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol), allows **Claude** or any other MCP-compatible client to interact with the Digital Intelligence LinkedIn Insight service. It provides tools to create and analyze reports, get insights, categories, and typeahead suggestions.

## ⚠️ Disclaimer

- This is a Work In Progress project, so the configuration might vary in the short term.
- This server is intended for use with official LinkedIn accounts only.
- Access and refresh tokens contain sensitive information and should be kept secure.
- API usage is subject to LinkedIn's terms of service and rate limits.

---

## 🚀 Prerequisites

Before using this server, ensure you have:

- **Node.js** (v18 or higher)
- **Claude Desktop App**
- **LinkedIn Account** with appropriate permissions
- **Auth0 Authentication** credentials

---

## ⚙️ Configuring Claude Desktop

1. Open the configuration file for Claude Desktop:

   - **MacOS:**
     ```bash
     code ~/Library/Application\ Support/Claude/claude_desktop_config.json
     ```
   - **Windows:**
     ```bash
     code %AppData%\Claude\claude_desktop_config.json
     ```

2. Add or update the following configuration:

   ```json
   "mcpServers": {
     "di-linkedin": {
       "command": "/opt/homebrew/bin/node",
       "args": [
         "/ABSOLUTE/PATH/TO/YOUR/build/index.js"
       ]
     }
   }
   ```

3. Save the file and restart Claude Desktop.

## 🛠️ Available Tools

### 📌 `get-linkedin-reports`
**Description**: Retrieves the list of LinkedIn reports owned by the authenticated user.

- **Parameters**:
  - `paginationStart` _(number, optional)_: Pagination start index
  - `paginationEnd` _(number, optional)_: Pagination end index

- **Response**:
  - List of reports in JSON format

---

### 📌 `get-linkedin-report`
**Description**: Fetches detailed information about a specific LinkedIn report.

- **Parameters**:
  - `id` _(string)_: The ID of the report to get information for

- **Response**:
  - Full report details in JSON format

---

### 📌 `create-linkedin-report`
**Description**: Creates a new LinkedIn report with audience definition.

- **Parameters**:
  - `id` _(string)_: The report ID
  - `title` _(string)_: The report title
  - `audienceDefinition` _(object)_: The audience definition
  - `baselineDefinition` _(object, optional)_: The baseline definition

- **Response**:
  - Confirmation of report creation

---

### 📌 `get-linkedin-insights`
**Description**: Gets insights for a specific LinkedIn report.

- **Parameters**:
  - `reportId` _(string)_: The ID of the report to get insights for
  - `facetUrns` _(array of strings, optional)_: Filter insights by facet URNs

- **Response**:
  - Insights data in JSON format

---

### 📌 `get-linkedin-categories`
**Description**: Gets categories for a specific LinkedIn report.

- **Parameters**:
  - `reportId` _(string)_: The ID of the report to get categories for
  - `urns` _(array of strings, optional)_: Filter categories by URNs

- **Response**:
  - Categories data in JSON format

---

### 📌 `get-linkedin-typeahead`
**Description**: Gets LinkedIn typeahead suggestions for a specific facet and query. Use this to search for entities like companies, job titles, skills, etc.

- **Parameters**:
  - `facet` _(string)_: The facet URN (e.g., urn:li:adTargetingFacet:employers). See the list of available facets using the `list-linkedin-typeahead-facets` tool.
  - `query` _(string, optional)_: The search query to filter suggestions by keyword

- **Response**:
  - Typeahead suggestions in JSON format, including name, URN, and facet URN for each suggestion

- **Example Usage**:
  ```json
  {
    "facet": "urn:li:adTargetingFacet:skills",
    "query": "javascript"
  }
  ```

---

### 📌 `list-linkedin-typeahead-facets`
**Description**: Lists all available facets that can be used with the `get-linkedin-typeahead` tool. Each facet represents a different type of entity you can search for.

- **Parameters**: None

- **Response**:
  - A list of all available facets with descriptions, including:
    - locations (Geographic locations)
    - titles (Current job titles)
    - employers (Current employers)
    - skills (Professional skills)
    - industries (Industries)
    - and many more

---

### 📌 `list-linkedin-facet-values`
**Description**: Lists all LinkedIn facets with predefined values, or filters by a specific facet. This tool helps you discover the exact values you can use for facets that don't use the typeahead system.

- **Parameters**:
  - `facet` _(string, optional)_: The specific facet URN to get values for (e.g., urn:li:adTargetingFacet:genders). If not provided, all facets with predefined values will be listed.

- **Response**:
  - When no facet is specified: A comprehensive list of all facets with predefined values, including their descriptions and possible values.
  - When a facet is specified: Detailed information about the specified facet, including all possible values and usage examples.

- **Example Usage**:
  ```json
  {
    "facet": "urn:li:adTargetingFacet:genders"
  }
  ```

- **Available Facets with Predefined Values**:
  - genders (e.g., "urn:li:gender:FEMALE", "urn:li:gender:MALE")
  - ageRanges (e.g., "urn:li:ageRange:(18,24)", "urn:li:ageRange:(25,34)")
  - seniorities (e.g., "urn:li:seniority:1" for "Entry level")
  - revenue (e.g., "urn:li:revenue:(1,10)" for "$1-10 million")
  - and many more

---

### 📌 `get-linkedin-account`
**Description**: Gets LinkedIn account details including LinkedIn token.

- **Parameters**: None

- **Response**:
  - Account details in JSON format

---

### 📌 `initiate-linkedin-device-auth`
**Description**: Initiates the device authorization flow to get a device code for authentication.

- **Parameters**: None

- **Response**:
  - Device authorization details and instructions

## 🛠️ Troubleshooting

### Tools Not Appearing in Claude
1. Check Claude Desktop logs:

```
tail -f ~/Library/Logs/Claude/mcp*.log
```
2. Verify environment variables are set correctly.
3. Ensure the absolute path to index.js is correct.

### Authentication Issues
- Double-check OAuth credentials.
- Try initiating the device authorization flow again using the `initiate-linkedin-device-auth` tool.
- Verify that the required API scopes are enabled.

## 📜 Viewing Logs

To check server logs:

### For MacOS/Linux:
```
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```

### For Windows:
```
Get-Content -Path "$env:AppData\Claude\Logs\mcp*.log" -Wait -Tail 20
```

## 🔐 Security Considerations

- Keep API credentials secure – never expose them in public repositories.
- Use environment variables to manage sensitive data.

## 📄 License

This project is licensed under the Apache 2.0 License. See the LICENSE file for more details.

## 🔐 Authentication

The server uses Auth0 device authorization flow for authentication:

1. Use the `initiate-linkedin-device-auth` tool to start the authorization flow
2. Follow the instructions to complete the authorization in your browser
3. The server will automatically handle token management, including refreshing tokens when they expire
