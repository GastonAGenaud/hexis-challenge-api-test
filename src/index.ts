import 'dotenv/config';
import { runTests } from './tests/athleteTest';
import { mocha } from './utils/reporter';

mocha.addFile('./src/tests/athleteTest.ts');

mocha.run((failures: number) => {
    console.log('Failures:', failures);
    process.exitCode = failures ? 1 : 0;
  });

runTests().catch(error => console.error('Error running tests:', error));
