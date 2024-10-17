export async function fetchJiraProjects(token:string, cloudId:string) {
    const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching projects: ${response.status} ${response.statusText}`);
        }

        const projects = await response.json();
        return projects;

    } catch (error) {
        console.error(error);
        return null; 
    }
}


export async function createJiraIssue(token:string, cloudId:string, issueData:any) {
    const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/issue`;
    console.log(issueData);
    let data={
        "fields": {
          "project": {
            "id": `${issueData.project}` // Replace with your project ID
          },
          "summary": issueData.title,
          "description": {
            "type": "doc",
            "version": 1,
            "content": [
              {
                "type": "paragraph",
                "content": [
                  {
                    "type": "text",
                    "text": issueData.message
                  }
                ]
              }
            ]
          },
          "issuetype":{
            name: "Task",  // Ensure this matches an existing issue type
        },
        }
      }
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            console.log(error);
            throw new Error(`Error creating issue: ${error.message}`);
        }

        const createdIssue = await response.json();
        console.log(createdIssue)
        return createdIssue;

    } catch (error) {
        console.error(error);
        throw new Error('Internal server error');
    }
}