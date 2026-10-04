# ARGUS — Solo Development & Git Safety Workflow

**Platform:** ARGUS — AI-Powered Customer Support Investigation & Intelligence Platform  
**Audience:** Solo Developer & Technical Lead  
**Effective Date:** October 2026  
**Document Status:** Active Protocol  

---

## 1. Core Principles

As a solo developer, disciplined version control and structured phase gates are essential to avoid regressions, lost work, and corrupted states. 

1. **Controlled, Phase-Wise Execution:** Never start Phase $N+1$ until Phase $N$ is reviewed, verified, and committed.
2. **Never Break `main`:** The `main` branch must always compile cleanly, pass builds, and represent a deployable baseline.
3. **No Blind Operations:** Never run `git add .` or destructive commands (`git reset --hard`, `git clean -fd`) without inspecting changes first.
4. **Scope Isolation:** Modify only files directly relevant to the current task. Never touch unrelated files or teammate placeholders.

---

## 2. Feature Branch Strategy

### 2.1 Branch Topology

```
main (Protected / Production Baseline)
  │
  ├── anxhu/argus-phase-0 (Audit & Workflow Setup)
  │
  ├── anxhu/argus-phase-1-backend (Backend Scaffolding & DB Models)
  │
  ├── anxhu/argus-phase-2-integration (API Service Layer & Data Sync)
  │
  └── ...
```

### 2.2 Branch Naming Standard

All branches created by the lead developer must follow this convention:

```bash
anxhu/<feature-or-phase-name>
```

**Examples:**
- `anxhu/argus-phase-0`
- `anxhu/argus-phase-1-backend`
- `anxhu/fix-case-filter-sorting`

### 2.3 Branch Creation Protocol

Always branch off the latest verified `main`:

```bash
# 1. Ensure working directory is clean
git status

# 2. Switch to main and pull latest remote changes
git checkout main
git pull origin main

# 3. Create and switch to the new feature/phase branch
git checkout -b anxhu/<branch-name>
```

---

## 3. Commit Naming Conventions

ARGUS enforces the **Conventional Commits specification** to maintain a clean, scannable git history:

```
<type>(<scope>): <short imperative description>
```

### 3.1 Allowed Types

| Type | When to Use | Example |
| :--- | :--- | :--- |
| `feat` | New user-facing feature or module | `feat(investigation): add raw json payload modal` |
| `fix` | Bug fix in existing logic or UI | `fix(dashboard): correct responsive layout overflow` |
| `chore` | Maintenance, audit, dependencies, tooling | `chore(audit): audit ARGUS repository and establish workflow` |
| `docs` | Documentation only additions or edits | `docs(readme): update development setup guide` |
| `refactor` | Code restructuring without feature changes | `refactor(api): extract mock delay into utility` |
| `test` | Adding or updating tests | `test(cases): add unit tests for filter logic` |
| `style` | Formatting or styling corrections | `style(css): adjust glassmorphism border opacity` |

---

## 4. Pre-Commit Verification Checklist

Before staging or committing any code, execute this verification sequence:

### Step 1: Pre-Build Validation
Run the local production build to catch missing imports, syntax errors, and broken exports:

```bash
npm run build
```
*(Must exit with code `0` and 0 errors).*

### Step 2: Working Tree Inspection
Check all modified and untracked files:

```bash
git status
```

### Step 3: Git Diff Review
Review every changed line to ensure no stray debug statements, console logs, or unintended files are present:

```bash
git diff
```

### Step 4: Focused Staging
Stage only the files relevant to the specific commit. **Do not run `git add .` blindly**:

```bash
git add docs/PROJECT_AUDIT.md docs/DEVELOPMENT_WORKFLOW.md
```

Verify staged contents:

```bash
git status
```

---

## 5. GitHub Push Procedure

Once the commit is created locally:

```bash
git commit -m "chore: audit ARGUS repository and establish development workflow"
```

Push to GitHub with upstream tracking:

```bash
git push -u origin <branch-name>
```

### Handling Push Failures

If `git push` fails:
1. **Never use `--force` or `-f`** against shared branches.
2. Check remote status:
   ```bash
   git remote -v
   ```
3. If remote changes exist, fetch and inspect first:
   ```bash
   git fetch origin
   git log HEAD..origin/<branch-name> --oneline
   ```
4. Rebase cleanly if needed:
   ```bash
   git rebase origin/<branch-name>
   ```
5. If authentication or network errors occur, preserve local commits safely and do not discard changes.

---

## 6. Safe Rollback & Error Recovery

Destructive git commands can permanently erase uncommitted work or rewrite shared history.

### Strict Prohibitions

> [!CAUTION]
> **NEVER USE THE FOLLOWING COMMANDS:**
> - `git reset --hard` (destroys uncommitted code permanently)
> - `git clean -fd` (deletes untracked work without a backup)
> - `git push --force` (overwrites remote repository history)

### Safe Alternatives

1. **Undoing Staged Changes (Unstage without losing work):**
   ```bash
   git restore --staged <file-path>
   ```

2. **Discarding Changes to a Specific File (Only when certain):**
   ```bash
   git restore <file-path>
   ```

3. **Reverting a Committed Change Safely:**
   Always create an explicit reverse commit instead of resetting:
   ```bash
   git revert <commit-hash>
   ```

4. **Preserving In-Progress Work Temporarily:**
   Use the git stash mechanism:
   ```bash
   # Save work
   git stash save "WIP: investigation filter rework"

   # Inspect stashed items
   git stash list

   # Re-apply work
   git stash pop
   ```

---

## 7. Rules Against Modifying Unrelated Files

1. **Respect Team Files:** Files such as `Alok_Frontend_2.md`, `AmanSR_backend_1.md`, and `Aman_backend_2.md` belong to respective team tracks. Do not edit, delete, or rename them.
2. **Component Boundaries:** When working on a specific view (e.g., `SupportView.jsx`), do not introduce unrelated tweaks into `DashboardView.jsx` or `index.css` within the same commit.
3. **Keep Commits Atomic:** Each commit should do one thing and do it completely.
