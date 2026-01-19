export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
}

export interface VersionInfo {
  latest: GitHubRelease | null;
  latestStable: GitHubRelease | null;
}

export async function getVersionInfo(
  owner: string,
  repo: string
): Promise<VersionInfo> {
  try {
    // Fetch all releases
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
      return { latest: null, latestStable: null };
    }

    const releases: GitHubRelease[] = await response.json();

    if (releases.length === 0) {
      return { latest: null, latestStable: null };
    }

    const latest = releases[0];
    const latestStable = releases.find(r => !r.prerelease) || null;

    return { latest, latestStable };
  } catch (error) {
    console.error('Error fetching GitHub release:', error);
    return { latest: null, latestStable: null };
  }
}

// Keep for backward compatibility
export async function getLatestRelease(
  owner: string,
  repo: string,
  includePrerelease: boolean = false
): Promise<GitHubRelease | null> {
  const { latest, latestStable } = await getVersionInfo(owner, repo);

  if (includePrerelease) {
    return latest;
  }

  return latestStable || latest;
}

export function extractVersionFromTag(tagName: string): string {
  // Remove 'v' prefix if exists
  return tagName.startsWith('v') ? tagName.slice(1) : tagName;
}
