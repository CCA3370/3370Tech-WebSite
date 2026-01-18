import { NextRequest, NextResponse } from 'next/server';
import { getLatestRelease, extractVersionFromTag } from '@/lib/github';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const repo = searchParams.get('repo');
  const includePrerelease = searchParams.get('includePrerelease') === 'true';

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
    const release = await getLatestRelease(owner, repoName, includePrerelease);

    if (!release) {
      return NextResponse.json(
        { error: 'Failed to fetch release information' },
        { status: 404 }
      );
    }

    const version = extractVersionFromTag(release.tag_name);

    return NextResponse.json({
      version,
      isPrerelease: release.prerelease,
      tagName: release.tag_name,
      publishedAt: release.published_at,
      url: release.html_url
    });
  } catch (error) {
    console.error('Error in github-version API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
