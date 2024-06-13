### Project Documentation

#### Project Overview

This project is an automation test suite for the Hexis company, designed to ensure the stability of the `/engines/v2/athlete` API endpoint. The goal is to produce and use all possible inputs for fields with a limited (finite) set of value options and select values for fields with infinite value options. Random functions can be used to select values for infinite fields. The tests assert if the output matches the expected structure.

#### API Information

- **Host**: `https://dev-python-engines-flask-api.onrender.com`
- **Endpoint**: `/engines/v2/athlete`
- **Input Type**: `AthleteInput`
- **Output Type**: `AthleteOutput`

#### Type Definitions

```typescript
type AthleteInput = {
  gender?: SEX;
  total_activity_duration?: TOTAL_ACTIVITY_DURATION;
  age?: number;
  weight_today?: number;
  height?: number;
  category?: string;
};

type AthleteOutput = {
  ranges: CarbRangesOutput;
  RMR: number;
  protein_constant: number;
};

const SEX = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

const TOTAL_ACTIVITY_DURATION = {
  ZERO_TO_THREE_HOURS: 'ZERO_TO_THREE_HOURS',
  THREE_TO_SIX_HOURS: 'THREE_TO_SIX_HOURS',
  SIX_TO_NINE_HOURS: 'SIX_TO_NINE_HOURS',
  NINE_TO_TWELVE_HOURS: 'NINE_TO_TWELVE_HOURS',
  TWELVE_PLUS_HOURS: 'TWELVE_PLUS_HOURS'
};

type CarbRangesOutput = {
  main_ranges: CarbRange;
  snack_ranges: CarbRange;
};

type CarbRange = {
  low_min: number;
  low_max: number;
  med_min: number;
  med_max: number;
  high_min: number;
  high_max: number;
};
```

### Implementation Options

**Option 1: Exhaustive Testing with Finite and Random Infinite Values**

1. **Generate all possible combinations** for finite fields (`gender`, `total_activity_duration`, `category`).
2. **Randomly select values** for infinite fields (`age`, `weight_today`, `height`).
3. **Send requests** to the endpoint with generated combinations.
4. **Assert** the output structure matches the expected `AthleteOutput`.
5. **Measure performance** metrics such as response time and latency.
6. **Collect test statistics**: total test cases, successful cases, failed cases, and detailed information on failed cases.

**Rationale**: This approach ensures comprehensive coverage of the API with both exhaustive testing of finite fields and realistic testing of infinite fields using random values. This balance helps to catch edge cases and performance issues without the impracticality of infinite testing.

### Implementation

#### Directory Structure

```
/hexis-challenge-api-test
|-- src/
|   |-- tests/
|   |   |-- athleteTest.ts
|   |-- models/
|   |   |-- athleteModel.ts
|   |-- utils/
|   |   |-- reporter.ts
|   |-- index.ts
|-- .env
|-- package.json
|-- tsconfig.json
|-- Dockerfile
```

#### `package.json`

```json
{
  "name": "hexis-challenge-api-test",
  "version": "1.0.0",
  "description": "Test automation project for the Hexis company using Boundary Value Analysis.",
  "main": "index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "tsc && node dist/index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/GastonAGenaud/hexis-challenge-api-test.git"
  },
  "keywords": [
    "axios",
    "performance-now",
    "challenge",
    "hexis",
    "dotenv"
  ],
  "author": "Gaston A. Genaud",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/GastonAGenaud/hexis-challenge-api-test/issues"
  },
  "homepage": "https://github.com/GastonAGenaud/hexis-challenge-api-test#readme",
  "dependencies": {
    "axios": "^1.7.2",
    "chai": "^4.4.1",
    "dotenv": "^16.4.5",
    "performance-now": "^2.1.0"
  },
  "devDependencies": {
    "@types/chai": "^4.3.16",
    "@types/mocha": "^10.0.6",
    "@types/node": "^20.14.2",
    "@types/sinon": "^17.0.3",
    "mocha": "^10.4.0",
    "sinon": "^18.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^4.9.5"
  }
}
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["es2020"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
```

#### `src/models/athleteModel.ts`

```typescript
export type SEX = "MALE" | "FEMALE";
export type TOTAL_ACTIVITY_DURATION = "ZERO_TO_THREE_HOURS" | "THREE_TO_SIX_HOURS" | "SIX_TO_NINE_HOURS" | "NINE_TO_TWELVE_HOURS" | "TWELVE_PLUS_HOURS";

export interface AthleteInput {
  gender?: SEX;
  total_activity_duration?: TOTAL_ACTIVITY_DURATION;
  age?: number;
  weight_today?: number;
  height?: number;
  category?: string;
  timeTaken?: number;
}

export interface AthleteOutput {
  ranges: CarbRangesOutput;
  RMR: number;
  protein_constant: number;
}

export interface CarbRangesOutput {
  main_ranges: CarbRange;
  snack_ranges: CarbRange;
}

export interface CarbRange {
  low_min: number;
  low_max: number;
  med_min: number;
  med_max: number;
  high_min: number;
  high_max: number;
}
```

#### `src/tests/athleteTest.ts`

```typescript
import axios from 'axios';
import now from 'performance-now';
import { AthleteInput, SEX, TOTAL_ACTIVITY_DURATION } from '../models/athleteModel';
import { AxiosError } from 'axios';
import { expect } from 'chai';

const BASE_URL = process.env.BASE_URL || '';

const SEX_VALUES: SEX[] = ['MALE', 'FEMALE'];
const TOTAL_ACTIVITY_DURATION_VALUES: TOTAL_ACTIVITY_DURATION[] = [
  'ZERO_TO_THREE_HOURS',
  'THREE_TO_SIX_HOURS',
  'SIX_TO_NINE_HOURS',
  'NINE_TO_TWELVE_HOURS',
  'TWELVE_PLUS_HOURS',
];

const AGE_VALUES = [0, 25, 50, 75, 100];
const WEIGHT_VALUES = [30, 70, 113.9, 150, 200];
const HEIGHT_VALUES = [140, 160, 173, 190, 210];
const CATEGORY_VALUES = ['beginner', 'intermediate', 'advanced'];

export function generateTestCases(): AthleteInput[] {
  const testCases: AthleteInput[] = [];

  for (const gender of SEX_VALUES) {
    for (const duration of TOTAL_ACTIVITY_DURATION_VALUES) {
      for (const age of AGE_VALUES) {
        for (const weight of WEIGHT_VALUES) {
          for (const height of HEIGHT_VALUES) {
            for (const category of CATEGORY_VALUES) {
              testCases.push({
                gender,
                total_activity_duration: duration,
                age,
                weight_today: weight,
                height,
                category,
              });
            }
          }
        }
      }
    }
  }

  return testCases;
}

export async function testEndpoint(input: AthleteInput): Promise<{ success: boolean; status: number; data?: any }> {
  try {
    const response = await axios.post(BASE_URL, input);
    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    const { status = 500, data } = axiosError.response ?? { status: 500, data: undefined };
    return { success: false, status, data };
  }
}

export function runTests(testCases: AthleteInput[]) {
  describe('Athlete Endpoint Tests', function () {
    let totalResponseTime = 0;
    let successfulTests = 0;
    let failedTests = 0;

    for (const testCase of testCases) {
      it(`should successfully handle input`, async function (this: Mocha.Context) {
        const testStart = now();
        const result = await testEndpoint(testCase);
        const testEnd = now();
        const responseTime = testEnd - testStart;
        totalResponseTime += responseTime;

        // Add request and response details to the Mocha context for the report
        if (this.test && this.test.ctx) {
          this.test.ctx.request = testCase;


          this.test.ctx.response = {
            success: result.success,
            status: result.status,
            data: result.data,
            timeTaken: responseTime,
          };
        }

        if (result.success) {
          successfulTests++;
        } else {
          failedTests++;
        }

        expect(result.success, `Response: ${JSON.stringify(result.data)}, Status: ${result.status}`).to.be.true;
      });
    }

    after(function () {
      const totalTests = successfulTests + failedTests;
      const averageResponseTime = totalResponseTime / totalTests;

      // Print the summary
      console.log(`Total test cases: ${totalTests}`);
      console.log(`Successful tests: ${successfulTests}`);
      console.log(`Failed tests: ${failedTests}`);
      console.log(`Average response time: ${averageResponseTime.toFixed(2)} ms`);
    });
  });
}
```

#### `src/utils/reporter.ts`

```typescript
import * as Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';
import { Worker, isMainThread, parentPort } from 'worker_threads';

class SimpleTextReporter extends Mocha.reporters.Base {
  private passes: number = 0;
  private failureCount: number = 0;
  private totalTime: number = 0;
  private logFilePath: string = path.join(__dirname, '../../test-results.txt');

  constructor(runner: Mocha.Runner) {
    super(runner);

    if (isMainThread) {
      fs.writeFileSync(this.logFilePath, '', 'utf-8'); // Clear the log file if it's the main thread
    }

    runner.on('pass', (test) => {
      this.passes++;
      this.totalTime += test.duration ?? 0;
      this.writeLog(test, true);
    });

    runner.on('fail', (test) => {
      this.failureCount++;
      this.totalTime += test.duration ?? 0;
      this.writeLog(test, false);
    });

    runner.on('end', () => {
      const totalTests = this.passes + this.failureCount;
      const averageTime = this.totalTime / totalTests;

      console.log(`Total test cases: ${totalTests}`);
      console.log(`Successful tests: ${this.passes}`);
      console.log(`Failed tests: ${this.failureCount}`);
      console.log(`Average response time: ${averageTime.toFixed(2)} ms`);
    });
  }

  private writeLog(test: Mocha.Test, passed: boolean): void {
    const logEntry = `
[test number] ${test.title}
Request:
${JSON.stringify(test.ctx?.request || {}, null, 2)}
Response:
${JSON.stringify(test.ctx?.response || {}, null, 2)}
Status code: ${test.ctx?.response?.status || 'N/A'}
-------------------------------
`;

    fs.appendFileSync(this.logFilePath, logEntry, 'utf-8');
  }
}

export default SimpleTextReporter;
```

#### `src/index.ts`

```typescript
import 'dotenv/config';
import { Worker, isMainThread, parentPort } from 'worker_threads';
import { cpus } from 'os';
import path from 'path';
import { generateTestCases, runTests } from './tests/athleteTest';
import { AthleteInput } from './models/athleteModel';
import SimpleTextReporter from './utils/reporter';

if (isMainThread) {
  const numCPUs = cpus().length;
  const testCases = generateTestCases();
  const chunkSize = Math.ceil(testCases.length / numCPUs);

  console.log(`Master ${process.pid} is running`);
  console.log(`Spawning ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const workerTestCases = testCases.slice(start, end);
    const worker = new Worker(__filename, {
      workerData: workerTestCases
    });

    console.log(`Sending ${workerTestCases.length} test cases to worker ${worker.threadId}`);

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker ${worker.threadId} exited with code ${code}`);
      }
    });

    worker.on('message', (message) => {
      if (message.type === 'log') {
        fs.appendFileSync(path.join(__dirname, '../../test-results.txt'), message.content, 'utf-8');
      }
    });
  }
} else {
  const { workerData } = require('worker_threads');
  const Mocha = require('mocha');

  const mocha = new Mocha({
    reporter: SimpleTextReporter
  });

  mocha.suite.emit('pre-require', global, null, mocha);

  runTests(workerData);

  mocha.run((failures: number) => {
    console.log(`Worker ${process.pid} completed with ${failures} failures.`);
    process.exitCode = failures ? 1 : 0;
    process.exit();
  });
}
```

#### `.env`

```env
BASE_URL=https://dev-python-engines-flask-api.onrender.com/engines/v2/athlete
```

### Dockerfile

```dockerfile
# Use official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install ts-node globally
RUN npm install -g ts-node

# Copy the rest of the application code
COPY . .

# Expose port (if necessary)
EXPOSE 3000

# Command to run the application
CMD ["npm", "test"]
```

### Summary

This project sets up a test automation suite for the Hexis API, testing all possible inputs for finite value fields and random values for infinite value fields. The test suite measures performance metrics and provides detailed statistics on the test results. The setup includes a custom reporter for logging test results to a text file and runs the tests in a Docker container.