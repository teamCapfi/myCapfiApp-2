export interface User {
    name: string,
    family_name?: string,
    given_name?: string,
    phoneNumber?: string,
    jobTitle?: string,
    email: string,
    photo: string,
    status?: string,
    key: string,
    isManager?: boolean,
    company?: string
}