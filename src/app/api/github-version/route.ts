import { NextRequest, NextResponse } from 'next/server';
import { getVersionInfo, extractVersionFromTag } from '@/lib/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repo = searchParams.get('repo');

  if (!repo) {
    return NextResponse.json(
      { error: 'Repository parameter is required' },
      { status: 400 }
    );
  }

  // Parse owner and repo from format "owner/repo"
  const [owner, repoName] = repo.split('/');

  if (!owner || !repoName) {
    return NextResponse.json(
      { error: 'Invalid repository format. Expected: owner/repo' },
      { status: 400 }
    );
  }

  try {
    const { latest, latestStable } = await getVersionInfo(owner, repoName);

    if (!latest) {
      return NextResponse.json(
        { error: 'Failed to fetch release information' },
        { status: 404 }
      );
    }

    const response: {
      version: string;
      isPrerelease: boolean;
      tagName: string;
      publishedAt: string;
      url: string;
      stableVersion?: string;
      stableTagName?: string;
      stableUrl?: string;
    } = {
      version: extractVersionFromTag(latest.tag_name),
      isPrerelease: latest.prerelease,
      tagName: latest.tag_name,
      publishedAt: latest.published_at,
      url: latest.html_url
    };

    // If latest is prerelease and there's a stable version, include it
    if (latest.prerelease && latestStable && latestStable.tag_name !== latest.tag_name) {
      response.stableVersion = extractVersionFromTag(latestStable.tag_name);
      response.stableTagName = latestStable.tag_name;
      response.stableUrl = latestStable.html_url;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in github-version API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
