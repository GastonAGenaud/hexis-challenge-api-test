import * as Mocha from 'mocha';
import * as fs from 'fs';
import * as path from 'path';

class SimpleTextReporter extends Mocha.reporters.Base {
    private passes: number = 0;
    private failureCount: number = 0;
    private totalTime: number = 0;
    private logFilePath: string = path.join(__dirname, '../../test-results.txt');

    constructor(runner: Mocha.Runner) {
        super(runner);

        // Ensure the log file is clean before starting
        fs.writeFileSync(this.logFilePath, '', 'utf-8');

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
