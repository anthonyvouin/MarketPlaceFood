
export interface ContactDto {
    id?: string; 
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
    submittedAt?: Date;
}
