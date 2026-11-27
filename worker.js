export default {
  async fetch(request, env) {
    const reqUrl = new URL(request.url);

    if (reqUrl.pathname === '/api/submit' && request.method === 'POST') {
      try {
        const body = await request.json();
        const skillUrl = String(body?.url || '').trim();
        const name = String(body?.name || '').trim();
        const description = String(body?.description || '').trim();
        const verifiedInfo = String(body?.verifiedInfo || '').trim();

        let parsed;
        try {
          parsed = new URL(skillUrl);
        } catch {
          return Response.json({ ok: false, error: 'Invalid URL format.' }, { status: 400 });
        }
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return Response.json({ ok: false, error: 'URL must start with http:// or https://.' }, { status: 400 });
        }
        if (!name || !description) {
          return Response.json({ ok: false, error: 'Name and description are required.' }, { status: 400 });
        }

        if (!env.GITHUB_TOKEN) {
          return Response.json(
            { ok: false, fallback: true, error: 'GITHUB_TOKEN secret is not configured on Worker.' },
            { status: 503 }
          );
        }

        const issueBody = [
          '### Skill Submission',
          `- **URL:** ${skillUrl}`,
          `- **Name:** ${name}`,
          verifiedInfo ? `- **Verification:** ${verifiedInfo}` : '',
          '',
          '### Short Description',
          description,
        ]
          .filter(Boolean)
          .join('\n');

        const ghRes = await fetch('https://api.github.com/repos/apondas007890/ai-skills-index/issues', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'SkillAtlas-Worker/1.0',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `[Skill Submission] ${name}`,
            body: issueBody,
            labels: ['skill-submission'],
          }),
        });

        if (!ghRes.ok) {
          const errText = await ghRes.text();
          return Response.json(
            { ok: false, error: `GitHub API error (${ghRes.status}): ${errText.slice(0, 160)}` },
            { status: 502 }
          );
        }

        const created = await ghRes.json();
        return Response.json({
          ok: true,
          issueNumber: created.number,
          issueUrl: created.html_url,
        });
      } catch {
        return Response.json({ ok: false, error: 'Invalid request payload.' }, { status: 400 });
      }
    }

    return env.ASSETS.fetch(request);
  },
};
