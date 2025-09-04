export enum typeDonation{
    "one-time",
    "recurring"
}

export enum statusDonation{
    "success",
    "failed",
    "In progress"}

export interface AddDonation {
     donor_email?:string,
    donor_name?:string,
    amount:number,
    currency:string,
    type:typeDonation,
    metadata?:string,
    is_anonymous:boolean,
    created_at?: Date;
    status: statusDonation;
    times?: number;
    payment_provider_id: string;
    day_in_month?: number;
}
export interface Donation {
    donation_id: string;
    donor_id:number;
    amount: number;
    currency: string;
    type: typeDonation;
    payment_provider_id: string;
    status: statusDonation;
    metadata?: string;
    created_at: Date;
    standing_order_id:number|null;
}

export interface Donor {
    is_anonymous: boolean;
    donor_id: number;
    donor_email?: string;
    donor_name?: string;
    created_at: Date;
}

export interface standing_order{
    standing_order_id:number;
    start_date: Date;
    end_date: Date;
    day_in_month: number;
    is_active: boolean;
    several_times: boolean;
    actual_times: number;
}

export interface RecurringDonation {
        donation_id:number;
        amount: number;
        currency: string,
        standing_order_id: 9,
        standing_order: {
            end_date: Date,
            is_active:boolean,
            start_date: Date,
            day_in_month:number,
            several_times:number
        },
        donor: {
            donor_name: string,
            donor_email:string
        }
    }