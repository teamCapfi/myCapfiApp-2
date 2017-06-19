export interface User {
    name: string,
    family_name ?: string,
    given_name ?: string,
    phoneNumber ?: string,
    email: string,
    jobTitle ?: string,
    photo: string,
    status ?: string,
    key: string,
    isManager ?: boolean
}