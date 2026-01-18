export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
}

export async function getLatestRelease(
  owner: string,
  repo: string,
  includePrerelease: boolean = false
): Promise<GitHubRelease | null> {
  try {
    if (includePrerelease) {
      // Fetch all releases and get the first one (latest including pre-releases)
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
          next: { revalidate: 3600 } // Cache for 1 hour
        }
      );

      if (!response.ok) {
        console.error('Failed to fetch GitHub releases:', response.statusText);
        return null;
      }

      const releases: GitHubRelease[] = await response.json();
      return releases.length > 0 ? releases[0] : null;
    } else {
      // Try to fetch the latest stable release
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          },
          next: { revalidate: 3600 } // Cache for 1 hour
        }
      );

      if (response.ok) {
        return await response.json();
      }

      // If no stable release exists (404), fall back to latest release (including pre-release)
      if (response.status === 404) {
        const allReleasesResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/releases`,
          {
            headers: {
              'Accept': 'application/vnd.github.v3+json',
            },
            next: { revalidate: 3600 }
          }
        );

        if (allReleasesResponse.ok) {
          const releases: GitHubRelease[] = await allReleasesResponse.json();
          // Find the first non-prerelease, or return the latest if all are prereleases
          const stableRelease = releases.find(r => !r.prerelease);
          return stableRelease || (releases.length > 0 ? releases[0] : null);
        }
      }

      console.error('Failed to fetch GitHub release:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching GitHub release:', error);
    return null;
  }
}

export function extractVersionFromTag(tagName: string): string {
  // Remove 'v' prefix if exists
  return tagName.startsWith('v') ? tagName.slice(1) : tagName;
}
