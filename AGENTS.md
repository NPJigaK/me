## Purpose
This guide explains how AI coding agents can safely contribute to this Astro blog. It sets expectations for feature proposals, code contributions, and pull-request quality.

## Project Goals
- Improve site usability (e.g., search UI, navigation, dark mode)
- Enhance accessibility and responsiveness
- Keep the design consistent with the current look and feel

## Non-Goals
- Major visual redesigns or brand changes
- Backend or server-side work
- Large rewrites that disrupt existing content

## Agent’s Role & Responsibilities
- Suggest and implement front-end improvements
- Write and update documentation
- Add or update tests when relevant
- Ensure new code is maintainable and visually consistent

## Development Workflow
1. Create a new branch from `ads` with a clear English name (e.g., `codex/add-dark-mode-toggle`).
2. Use descriptive commit messages in English.
3. Before opening a PR, run `pnpm format`, `pnpm lint`, and `pnpm build` to check for errors.
4. Open a pull request against `ads` with a concise title and description in English.

## Best Practices
- Keep pull requests small and focused
- Follow existing code style and structure
- Prioritize accessibility and responsive design
- Document user-facing changes
- Limit new dependencies and justify their use

## Safety & Compliance
- Do not include secrets or sensitive data in the repository
- Check licenses for any new dependencies before adding them
