
export async function fetchGitHubRepos(token: string) {
    const response = await fetch('https://api.github.com/user/repos', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch repositories');
    }

    return await response.json();
}

export async function createIssue(token:string,owner:string,repo:string,issue:{title:string,message:string}){
    const url = `https://api.github.com/repos/${owner}/${repo}/issues`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title:issue.title,
                body:issue.message , // Use 'body' instead of 'message' as per GitHub API
            }),
        });

        return response;

}