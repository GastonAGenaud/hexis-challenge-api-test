export type SEX = "MALE" | "FEMALE";
export type TOTAL_ACTIVITY_DURATION = "ZERO_TO_THREE_HOURS" | "THREE_TO_SIX_HOURS" | "SIX_TO_NINE_HOURS" | "NINE_TO_TWELVE_HOURS" | "TWELVE_PLUS_HOURS";


export interface AthleteInput {
    gender?: SEX;
    total_activity_duration?: TOTAL_ACTIVITY_DURATION;
    age?: number;
    weight_today?: number;
    height?: number;
    category?: string;
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