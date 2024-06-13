import Mocha from 'mocha';

export const mocha = new Mocha({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: './reports',
    reportFilename: 'hexis_report',
    quiet: true,
    overwrite: true,
  },
});