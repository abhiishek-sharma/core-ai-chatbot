# Contributing to CORE AI Chatbot

Thank you for your interest in contributing to CORE AI Chatbot! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and professional in all interactions.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
3. **Create a branch** for your changes
4. **Make your changes** following our guidelines
5. **Test your changes** thoroughly
6. **Submit a pull request**

## How to Contribute

### Types of Contributions

- **Bug Fixes**: Fix issues and improve stability
- **Features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize existing code
- **Refactoring**: Improve code quality

## Development Setup

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-enterprise.txt
cp .env.example .env
# Configure your .env file
```

### Frontend Setup

```bash
cd frontend
npm install
```

### Running Locally

```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Coding Standards

### Python (Backend)

- **Style Guide**: Follow PEP 8
- **Formatter**: Use `black` for code formatting
- **Linter**: Use `flake8` for linting
- **Type Hints**: Use type hints for all functions
- **Docstrings**: Use Google-style docstrings

```python
def example_function(param: str) -> dict:
    """
    Brief description of the function.

    Args:
        param: Description of parameter

    Returns:
        Description of return value

    Raises:
        ValueError: When invalid input is provided
    """
    pass
```

### JavaScript/React (Frontend)

- **Style Guide**: Follow Airbnb JavaScript Style Guide
- **Formatter**: Use Prettier
- **Linter**: Use ESLint
- **Components**: Use functional components with hooks
- **File Naming**: Use PascalCase for components, camelCase for utilities

```javascript
// Good
function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null);
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
}
```

## Testing Guidelines

### Backend Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=html

# Run specific test file
pytest tests/unit/test_services.py -v
```

### Test Requirements

- All new features must include tests
- Bug fixes should include regression tests
- Aim for 80%+ code coverage
- Tests should be isolated and repeatable

### Test Structure

```python
import pytest

@pytest.mark.asyncio
async def test_feature_name():
    """Test description."""
    # Arrange
    setup_data = create_test_data()
    
    # Act
    result = await function_under_test(setup_data)
    
    # Assert
    assert result == expected_result
```

## Commit Guidelines

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(api): add conversation search endpoint

Add ability to search conversations by title and content.
Includes pagination and filtering options.

Closes #123

fix(auth): resolve JWT token expiration issue

Token was expiring too quickly due to incorrect time calculation.
Updated to use UTC consistently.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest main branch
2. **Run all tests** and ensure they pass
3. **Format your code** using black/prettier
4. **Lint your code** and fix any issues
5. **Update documentation** if needed
6. **Add tests** for new features

### PR Title

Use the same format as commit messages:

```
feat(api): add conversation search endpoint
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
```

### Review Process

1. At least one approval required
2. All CI checks must pass
3. No merge conflicts
4. Up-to-date with main branch

## Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's reproducible
3. Test on latest version

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 11]
- Python: [e.g., 3.11]
- Node: [e.g., 18.0]
- Browser: [e.g., Chrome 120]

**Additional Context**
Screenshots, logs, etc.
```

## Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Proposed Solution**
How you'd like to solve it

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Any other relevant information
```

## Code Review Guidelines

### For Reviewers

- Be respectful and constructive
- Focus on the code, not the person
- Explain reasoning behind suggestions
- Approve when ready, request changes if needed

### For Contributors

- Be open to feedback
- Respond to all comments
- Make requested changes promptly
- Ask questions if unclear

## Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring
- `test/description` - Test updates

### Example Workflow

```bash
# Create feature branch
git checkout -b feature/add-search

# Make changes
git add .
git commit -m "feat(api): add search functionality"

# Push to your fork
git push origin feature/add-search

# Create pull request on GitHub
```

## Style Guide Summary

### Python

```bash
# Format code
black app/

# Sort imports
isort app/

# Lint code
flake8 app/

# Type check
mypy app/
```

### JavaScript

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Documentation

### When to Update Documentation

- Adding new features
- Changing API endpoints
- Modifying configuration options
- Updating dependencies
- Changing deployment process

### Documentation Standards

- Clear and concise
- Include examples
- Update README.md
- Add inline code comments
- Update API documentation

## Questions?

- Check existing [documentation](docs/)
- Search [existing issues](https://github.com/yourusername/core-ai-chatbot/issues)
- Ask in [discussions](https://github.com/yourusername/core-ai-chatbot/discussions)
- Contact maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to CORE AI Chatbot! 🎉