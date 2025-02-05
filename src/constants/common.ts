export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};


export enum GasTypes {
    TWO_KG = 'TWO_KG',
    FIVE_KG = 'FIVE_KG',
    TWELVE_HALF_KG = 'TWELVE_HALF_KG',
    SIXTEEN_KG = 'SIXTEEN_KG',
}

export const GasTypesValues = {
    TWO_KG: '2 Kg',
    FIVE_KG: '5 Kg',
    TWELVE_HALF_KG: '12.5 Kg',
    SIXTEEN_KG: '16 Kg',
}

export enum BusinessVerifcationStatus {
    PENDING = 'PENDING',
    VERIFIED = 'VERIFIED',
    DENIED = 'DENIED',
}