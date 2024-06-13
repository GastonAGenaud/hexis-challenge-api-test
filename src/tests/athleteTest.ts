import axios from 'axios';
import now from 'performance-now';
import { AthleteInput, SEX, TOTAL_ACTIVITY_DURATION } from '../models/athleteModel';
import { AxiosError } from 'axios';

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

async function testEndpoint(input: AthleteInput): Promise<{ success: boolean; data?: any }> {
    try {
      const response = await axios.post(BASE_URL, input);
      return { success: true, data: response.data };
    } catch (error) {
      const axiosError = error as AxiosError;
      return { success: false, data: axiosError.response?.data };
    }
  }

export async function runTests() {
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

    const results: { testCase: AthleteInput; success: boolean; data?: any; timeTaken: number }[] = [];
    const startTime = now();

    for (const testCase of testCases) {
        const testStart = now();
        const result = await testEndpoint(testCase);
        const testEnd = now();
        results.push({
            testCase,
            success: result.success,
            data: result.data,
            timeTaken: testEnd - testStart,
        });
    }

    const endTime = now();

    const successfulTests = results.filter(result => result.success).length;
    const failedTests = results.filter(result => !result.success);

    console.log(`Total test cases: ${testCases.length}`);

    console.log(`Successful tests: ${successfulTests}`);

    console.log(`Failed tests: ${failedTests.length}`);

    failedTests.forEach((result, index) => {

        console.log(`Failed test #${index + 1}:`, result.testCase, result.data);

    });

    const totalTimeTaken = endTime - startTime;
    const averageResponseTime = totalTimeTaken / testCases.length;

    console.log(`Total test time: ${totalTimeTaken} ms`);

    console.log(`Average response time: ${averageResponseTime} ms`);
}
