export const ERROR_MESSAGE = {
    // DEFUALT DATABASE
    RECORD_NOT_FOUND: {
        message: "Record Not Found.",
        codeNumber: 10000,
        statusCode: 500,
    },

    // DEFUALT AUTH
    UNAUTHORIZED: {
        message: "Unauthorized.",
        codeNumber: 10101,
        statusCode: 401,
    },
    YOU_NOT_PERMISSIONS: {
        message: "You are not permissions.",
        codeNumber: 10102,
        statusCode: 401,
    },
    TOKEN_EXPIRED: {
        message: "Token Expried.",
        codeNumber: 10103,
        statusCode: 401,
    },
    BAD_TOKEN: {
        message: "Bad Token.",
        codeNumber: 10104,
        statusCode: 401,
    },

    // DEFUALT ROUTER
    SORRY_SOMETHING_WENT_WRONG: {
        message: "Sorry! Something went wrong.",
        codeNumber: 10201,
        statusCode: 500,
    },
    THE_API_NOT_SUPPORTED: {
        message: "The API is not supported.",
        codeNumber: 10202,
        statusCode: 500,
    },
    BAD_REQUEST: {
        message: "Bad Request.",
        codeNumber: 10203,
        statusCode: 400,
    },
    // Auth
    USERNAME_DOES_NOT_EXIST: {
        message: "Username does not exist.",
        codeNumber: 20001,
        statusCode: 404,
    },
    THIS_ACCOUNT_IS_APPLE: {
        message: "This account is an account logged in through APPLE.",
        codeNumber: 20001,
        statusCode: 400,
    },
    THIS_ACCOUNT_IS_PHONE: {
        message: "This account is an account logged in through PHONE.",
        codeNumber: 20001,
        statusCode: 400,
    },
    THIS_ACCOUNT_IS_NAVER: {
        message: "This account is an account logged in through NAVER.",
        codeNumber: 20001,
        statusCode: 400,
    },
    THIS_ACCOUNT_IS_KAKAOTALK: {
        message: "This account is an account logged in through KAKAOTALK.",
        codeNumber: 20002,
        statusCode: 400,
    },
    THIS_ACCOUNT_IS_GOOGLE: {
        message: "This account is an account logged in through GOOGLE.",
        codeNumber: 20003,
        statusCode: 400,
    },
    THIS_ACCOUNT_IS_INAPP: {
        message: "This account is an account logged in through username and password.",
        codeNumber: 20004,
        statusCode: 400,
    },
    USERNAME_ALREADY_REGISTERED: {
        message: "Username already registered.",
        codeNumber: 20005,
        statusCode: 400,
    },
    PASSWORD_OR_USERNAME_INCORRECT: {
        message: "Password or username incorrect.",
        codeNumber: 20006,
        statusCode: 400,
    },
    LOGIN_METHOD_NOT_SUPPORTED: {
        message: "This login method is not supported.",
        codeNumber: 20007,
        statusCode: 400,
    },
    // Booking
    BOOKER_DOES_NOT_EXISTED: {
        message: "Booker doesn't exist.",
        codeNumber: 20100,
        statusCode: 400,
    },
    YOU_CAN_NOT_BOOKING_YOURSELF: {
        message: "You can't booking yourself.",
        codeNumber: 20101,
        statusCode: 400,
    },
    BOOKING_REQUEST_DOES_NOT_EXISTED: {
        message: "The booking request does not exist.",
        codeNumber: 20102,
        statusCode: 400,
    },
    BOOKING_ENDED: {
        message: "Booking ended.",
        codeNumber: 20103,
        statusCode: 400,
    },
    // Skill
    THIS_SKILL_DOES_NOT_EXISTED: {
        message: "This skill doesn't exist.",
        codeNumber: 20200,
        statusCode: 400,
    },
    // Provider
    THIS_PROVIDER_DOES_NOT_EXISTED: {
        message: "This provider doesn't exist.",
        codeNumber: 20300,
        statusCode: 400,
    },
    YOU_ARE_ALREADY_A_PROVIDER: {
        message: "You are already a provider.",
        codeNumber: 20301,
        statusCode: 400,
    },
    // Provider Skill
    THIS_PROVIDER_SKILL_IS_EXISTED: {
        message: "This skill already exists in the provider's skill list.",
        codeNumber: 20400,
        statusCode: 400,
    },
    THIS_PROVIDER_SKILL_DOES_NOT_EXISTED: {
        message: "This skill doesn't exist in the provider's skill list.",
        codeNumber: 20401,
        statusCode: 400,
    },
    // Coin
    YOU_DO_NOT_HAVE_ENOUGH_COINS_TO_MAKE_THE_TRANSACTION: {
        message: "You don't have enough coins to make the transaction.",
        codeNumber: 20500,
        statusCode: 400,
    },
};
