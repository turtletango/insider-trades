# Claude Development Guidelines

## Git Workflow

### Commit Early and Often
Make commits to your feature branch as you complete logical units of work. Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention for all commit messages.

**Format:** `<type>[optional scope]: <description>`

**Types:**
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

## Quality Checks

Before committing or pushing changes, verify that your code passes:

```bash
npm run lint    # Check code style and potential errors
npm run build   # Verify the project builds successfully
```

Fix any issues before proceeding with commits.
