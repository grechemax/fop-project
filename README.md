# FOP Project - Test Automation Framework

## Description

Test automation project for FOP (Individual Entrepreneur) system. The framework implements E2E and API testing for income, expense, and tax management functionality.

The project uses the Page Object Model (POM) pattern for code organization.
The fixture is used for login before each test, saving

## Technologies and Tools

- **Playwright** (v1.57.0) - browser automation and testing framework
- **TypeScript** (v5.9.3) - programming language for type-safe code
- **Node.js** - runtime environment
- **ESLint** - code quality linter
- **Prettier** - code formatter
- **dotenv** - environment variables management
- **Page Object Model** - design pattern for test organization

### Project Structure

```
fop-project/
├── src/
│   ├── fixtures/           # Playwright fixtures
│   ├── pages/              # Page Object classes
│   │   ├── components/     # Page components
│   │   └── *.page.ts       # Main pages
├── tests/
│   ├── api/                # API tests
│   └── e2e/                # E2E tests
├── storageStates/          # Saved authentication states
├── playwright-report/      # HTML test reports
└── test-results/           # Test execution results
```

## Setup

### Prerequisites

- **Node.js** version 18 or higher
- **npm** or **yarn**
- **Git**

### Step 1: Clone the repository

```bash
git clone https://github.com/grechemax/fop-project.git
cd fop-project
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Install Playwright browsers

```bash
npx playwright install
```

### Step 4: Configure environment variables

Create a `.env` file in the project root and add the required variables:

```env
BASE_URL=https://new.fophelp.pro

API_BASE_URL=https://new.fophelp.pro/api
API_BASE_URL_V2=https://new.fophelp.pro/api/v2

TEST_USER=<your_registered_user>
TEST_PASSWORD=<your_password>
```

### Step 5: Run tests

```bash
# Run all tests
npm test

# Run API tests only
npm run test:api

# Run specific test file
npx playwright test tests/e2e/expense.test.ts

# Run with UI mode
npx playwright test --ui

# Run in headed mode (show browser)
npx playwright test --headed

# Run in specific browser
npx playwright test --project=chromium

# Debug
npx playwright test --debug
```

### Step 6: View reports

After test execution, open the HTML report:

```bash
npx playwright show-report
```

## Additional Commands

### Code Linting

```bash
npm run lint
```

### Auto-fix linting errors

```bash
npm run lint:fix
```

### Auto-fix formatting issues

```bash
npx prettier --write .
```

## CI/CD

The project is configured to work in CI/CD environment with automated test execution and report generation.

## License

ISC

## Author

GitHub: [@grechemax](https://github.com/grechemax)
