# Claude Development Guidelines

## Git Workflow

### Commit Early and Often
Make commits to your feature branch as you complete logical units of work. Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention for all commit messages.

**Format:** `<type>[optional scope]: <description>`

**Types (use only these prefixes):**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (whitespace, formatting)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvements
- `test`: Adding or correcting tests
- `chore`: Changes to build process or auxiliary tools

**Examples:**
```
feat: add insider trading detection algorithm
fix: resolve API rate limiting issue
docs: update README with installation steps
refactor: simplify trade analysis logic
```

### Pull Request Titles
PR titles should also follow the Conventional Commits specification, using the same format and types as commit messages. This ensures consistency across commits and PRs, and makes it easier to understand the changes at a glance.

**Example PR titles:**
```
feat: add insider trading detection algorithm
fix: resolve API rate limiting issue
docs: update development guidelines
```

## Quality Checks

Before committing or pushing changes, verify that your code passes:

```bash
npm run lint    # Check code style and potential errors
npm run build   # Verify the project builds successfully
```

Fix any issues before proceeding with commits.
