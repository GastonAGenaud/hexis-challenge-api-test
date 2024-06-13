import 'dotenv/config';
import cluster from 'cluster';
import { cpus } from 'os';
import { runTests, generateTestCases } from './tests/athleteTest';
import Mocha from 'mocha';
import SimpleTextReporter from './utils/reporter';
import { AthleteInput } from './models/athleteModel';

if (cluster.isMaster) {
  const numCPUs = cpus().length;
  const testCases = generateTestCases();
  const chunkSize = Math.ceil(testCases.length / numCPUs);

  console.log(`Master ${process.pid} is running`);
  console.log(`Spawning ${numCPUs} workers...`);

  for (let i = 0; i < numCPUs; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const workerTestCases = testCases.slice(start, end);
    const worker = cluster.fork();

    console.log(`Sending ${workerTestCases.length} test cases to worker ${worker.process.pid}`);

    worker.send(workerTestCases);

    worker.on('exit', (code, signal) => {
      if (code !== 0) {
        console.error(`Worker ${worker.process.pid} exited with code ${code} and signal ${signal}`);
      }
    });
  }

  cluster.on('message', (worker, message) => {
    if (message.type === 'result') {
      console.log(`Received result from worker ${worker.process.pid}`);
      // Handle the results from workers if needed
    }
  });

} else {
    process.on('message', async (testCases: AthleteInput[]) => {
        console.log(`Worker ${process.pid} received ${testCases.length} test cases`);

        const mocha = new Mocha({
            reporter: SimpleTextReporter
        });

        mocha.suite.emit('pre-require', global, null, mocha);

        runTests(testCases);

        mocha.run((failures: number) => {
            console.log(`Failures: ${failures}`);
            process.exitCode = failures ? 1 : 0;
            process.exit();
        });
    });
}
