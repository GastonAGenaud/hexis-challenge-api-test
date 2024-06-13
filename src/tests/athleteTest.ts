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
