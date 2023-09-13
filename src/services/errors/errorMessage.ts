export const ERROR_MESSAGE = {
    RECORD_NOT_FOUND: {
        type: "database_exception",
        message: "Record Not Found.",
        codeNumber: 10000,
        statusCode: 500,
        description:
            "This error is used when a record or data item is not found in the database, resulting in a 500 Internal Server Error status.",
    },

    UNAUTHORIZED: {
        type: "authentication_exception",
        message: "Unauthorized.",
        codeNumber: 10101,
        statusCode: 401,
        description:
            "This error indicates that the user is not authorized to access a particular resource or perform an action, resulting in a 401 Unauthorized status.",
    },

    YOU_NOT_PERMISSIONS: {
        type: "authentication_exception",
        message: "You are not permissions.",
        codeNumber: 10102,
        statusCode: 401,
        description:
            "This error suggests that the user does not have the necessary permissions to perform an action, resulting in a 401 Unauthorized status.",
    },

    TOKEN_EXPIRED: {
        type: "authentication_exception",
        message: "Token Expired.",
        codeNumber: 10103,
        statusCode: 401,
        description:
            "This error is triggered when an authentication token has expired, resulting in a 401 Unauthorized status.",
    },

    BAD_TOKEN: {
        type: "authentication_exception",
        message: "Bad Token.",
        codeNumber: 10104,
        statusCode: 401,
        description:
            "This error indicates that the provided authentication token is invalid or malformed, resulting in a 401 Unauthorized status.",
    },

    SORRY_SOMETHING_WENT_WRONG: {
        type: "router_exception",
        message: "Sorry! Something went wrong.",
        codeNumber: 10201,
        statusCode: 500,
        description:
            "This is a generic error message used when an unspecified error occurs on the server, resulting in a 500 Internal Server Error status.",
    },

    THE_API_NOT_SUPPORTED: {
        type: "router_exception",
        message: "The API is not supported.",
        codeNumber: 10202,
        statusCode: 500,
        description:
            "This error is returned when the client attempts to access an API that is not supported, resulting in a 500 Internal Server Error status.",
    },

    BAD_REQUEST: {
        type: "router_exception",
        message: "Bad Request.",
        codeNumber: 10203,
        statusCode: 400,
        description:
            "This error is used for malformed or invalid client requests, resulting in a 400 Bad Request status.",
    },

    USERNAME_DOES_NOT_EXIST: {
        type: "authentication_exception",
        message: "Username does not exist.",
        codeNumber: 20001,
        statusCode: 404,
        description:
            "This error indicates that a username provided by the client does not exist in the system, resulting in a 404 Not Found status.",
    },

    THIS_ACCOUNT_IS_APPLE: {
        type: "authentication_exception",
        message: "This account is an account logged in through APPLE.",
        codeNumber: 20001,
        statusCode: 403,
        description:
            "This error occurs when a user tries to access an Apple login account without the necessary permissions, resulting in a 403 Forbidden status.",
    },

    THIS_ACCOUNT_IS_PHONE: {
        type: "authentication_exception",
        message: "This account is an account logged in through PHONE.",
        codeNumber: 20001,
        statusCode: 403,
        description:
            "This error is returned when a user attempts to access a phone-based login account without appropriate permissions, resulting in a 403 Forbidden status.",
    },

    THIS_ACCOUNT_IS_NAVER: {
        type: "authentication_exception",
        message: "This account is an account logged in through NAVER.",
        codeNumber: 20001,
        statusCode: 403,
        description:
            "This error occurs when a user lacks the necessary permissions to access a NAVER login account, resulting in a 403 Forbidden status.",
    },

    THIS_ACCOUNT_IS_KAKAOTALK: {
        type: "authentication_exception",
        message: "This account is an account logged in through KAKAOTALK.",
        codeNumber: 20002,
        statusCode: 403,
        description:
            "This error is triggered when a user attempts to access a KAKAOTALK login account without the required permissions, resulting in a 403 Forbidden status.",
    },

    THIS_ACCOUNT_IS_GOOGLE: {
        type: "authentication_exception",
        message: "This account is an account logged in through GOOGLE.",
        codeNumber: 20003,
        statusCode: 403,
        description:
            "This error occurs when a user tries to access a GOOGLE login account without appropriate permissions, resulting in a 403 Forbidden status.",
    },

    THIS_ACCOUNT_IS_INAPP: {
        type: "authentication_exception",
        message:
            "This account is an account logged in through username and password.",
        codeNumber: 20004,
        statusCode: 403,
        description:
            "This error is returned when a user attempts to access an in-app login account without the required permissions, resulting in a 403 Forbidden status.",
    },

    USERNAME_ALREADY_REGISTERED: {
        type: "authentication_exception",
        message: "Username already registered.",
        codeNumber: 20005,
        statusCode: 409,
        description:
            "This error is used when a user attempts to register with a username that is already in use, resulting in a 409 Conflict status.",
    },

    PASSWORD_OR_USERNAME_INCORRECT: {
        type: "authentication_exception",
        message: "Password or username incorrect.",
        codeNumber: 20006,
        statusCode: 401,
        description:
            "This error indicates that either the provided password or username is incorrect during the login process, resulting in a 401 Unauthorized status.",
    },

    LOGIN_METHOD_NOT_SUPPORTED: {
        type: "authentication_exception",
        message: "This login method is not supported.",
        codeNumber: 20007,
        statusCode: 501,
        description:
            "This error is returned when a login method is not supported by the application, resulting in a 501 Not Implemented status.",
    },
    ACCOUNT_NOT_FOUND: {
        type: "user_error",
        message: "This account could not be found.",
        codeNumber: 20008,
        statusCode: 404,
        description:
            "This error is used when the requested account could not be found, resulting in a 404 Not Found status.",
    },
    EACH_USER_CAN_ONLY_UPDATE_THE_SLUG_ONCE: {
        type: "user_error",
        message: "Each user can only update the slug once",
        codeNumber: 30001,
        statusCode: 409,
        description:
            "This error is used when a user attempts to update their slug more than once, which is not allowed, resulting in a 409 Conflict status.",
    },
    SLUG_ALREADY_EXISTS: {
        type: "user_error",
        message: "Slug already exists.",
        codeNumber: 30002,
        statusCode: 409,
        description:
            "This error occurs when a user attempts to use a slug that is already in use, resulting in a 409 Conflict status.",
    },
    BOOKER_DOES_NOT_EXISTED: {
        type: "booking_exception",
        message: "Booker doesn't exist.",
        codeNumber: 20100,
        statusCode: 400,
        description:
            "This error is used when a booker (a user who makes bookings) does not exist in the system, resulting in a 400 Bad Request status.",
    },

    YOU_CAN_NOT_BOOKING_YOURSELF: {
        type: "booking_exception",
        message: "You can't booking yourself.",
        codeNumber: 20101,
        statusCode: 422,
        description:
            "This error occurs when a user tries to make a booking for themselves, which is not allowed, resulting in a 422 Unprocessable Entity status.",
    },

    BOOKING_REQUEST_DOES_NOT_EXISTED: {
        type: "booking_exception",
        message: "The booking request does not exist.",
        codeNumber: 20102,
        statusCode: 404,
        description:
            "This error is returned when a booking request cannot be found in the system, resulting in a 404 Not Found status.",
    },

    BOOKING_DOES_NOT_EXISTED: {
        type: "booking_exception",
        message: "The booking does not exist.",
        codeNumber: 20103,
        statusCode: 404,
        description:
            "This error is returned when a booking does not exist in the system, resulting in a 404 Not Found status.",
    },

    BOOKING_ENDED: {
        type: "booking_exception",
        message: "Booking ended.",
        codeNumber: 20104,
        statusCode: 400,
        description:
            "This error is used when a booking has ended and certain actions cannot be performed, resulting in a 400 Bad Request status.",
    },

    THIS_SKILL_DOES_NOT_EXISTED: {
        type: "skill_exception",
        message: "This skill doesn't exist.",
        codeNumber: 20200,
        statusCode: 404,
        description:
            "This error indicates that a skill does not exist in the system, resulting in a 404 Not Found status.",
    },

    THIS_PROVIDER_DOES_NOT_EXISTED: {
        type: "provider_exception",
        message: "This provider doesn't exist.",
        codeNumber: 20300,
        statusCode: 404,
        description:
            "This error is used when a provider does not exist in the system, resulting in a 404 Not Found status.",
    },

    YOU_ARE_ALREADY_A_PROVIDER: {
        type: "provider_exception",
        message: "You are already a provider.",
        codeNumber: 20301,
        statusCode: 409,
        description:
            "This error is used when a user is attempting to become a provider but is already registered as one, resulting in a 409 Conflict status.",
    },

    YOU_HAVE_NOT_BECOME_A_PROVIDER: {
        type: "provider_exception",
        message: "You have not become a provider.",
        codeNumber: 20302,
        statusCode: 409,
        description:
            "This error is used when a user is attempting to perform actions that require provider status but has not become a provider, resulting in a 409 Conflict status.",
    },

    EACH_PROVIDER_CAN_ONLY_UPDATE_THE_SLUG_ONCE: {
        type: "provider_exception",
        message: "Each provider can only update the slug once",
        codeNumber: 20303,
        statusCode: 409,
        description:
            "This error is used when a provider attempts to update their slug more than once, which is not allowed, resulting in a 409 Conflict status.",
    },

    THIS_SLUG_ALREADY_EXISTS_AT_ANOTHER_PROVIDER: {
        type: "provider_exception",
        message: "This slug already exists at another provider",
        codeNumber: 20303,
        statusCode: 409,
        description:
            "This error occurs when a provider attempts to use a slug that is already associated with another provider, resulting in a 409 Conflict status.",
    },

    THIS_PROVIDER_SKILL_IS_EXISTED: {
        type: "provider_skill_exception",
        message: "This skill already exists in the provider's skill list.",
        codeNumber: 20400,
        statusCode: 409,
        description:
            "This error is used when a provider tries to add a skill that already exists in their skill list, resulting in a 409 Conflict status.",
    },

    THIS_PROVIDER_SKILL_DOES_NOT_EXISTED: {
        type: "provider_skill_exception",
        message: "This skill doesn't exist in the provider's skill list.",
        codeNumber: 20401,
        statusCode: 404,
        description:
            "This error is used when a provider attempts to perform actions on a skill that does not exist in their skill list, resulting in a 404 Not Found status.",
    },

    YOU_DO_NOT_HAVE_ENOUGH_COINS_TO_MAKE_THE_TRANSACTION: {
        type: "coin_exception",
        message: "You don't have enough coins to make the transaction.",
        codeNumber: 20500,
        statusCode: 402,
        description:
            "This error occurs when a user tries to perform a transaction but does not have sufficient coins, resulting in a 402 Payment Required status.",
    },

    BUY_COIN_REQUEST_NOT_FOUND: {
        type: "buy_coin_request_exception",
        message: "Buy coin request not found.",
        codeNumber: 20600,
        statusCode: 404,
        description:
            "This error is used when a buy coin request cannot be found in the system, resulting in a 404 Not Found status.",
    },

    BUY_COIN_REQUEST_HAS_BEEN_PROCESSED: {
        type: "buy_coin_request_exception",
        message: "The request to buy coins has been processed.",
        codeNumber: 20601,
        statusCode: 422,
        description:
            "This error is used when a user attempts to process a buy coin request that has already been completed, resulting in a 422 Unprocessable Entity status.",
    },

    THIS_NOTICE_DOES_NOT_EXISTED: {
        type: "notice_exception",
        message: "This notice doesn't exist.",
        codeNumber: 20700,
        statusCode: 404,
        description:
            "This error is used when a notice does not exist in the system, resulting in a 404 Not Found status.",
    },

    THIS_BOOKING_HAS_BEEN_FEEDBACK: {
        type: "feedback_exception",
        message: "this booking has been feedback",
        codeNumber: 20800,
        statusCode: 400,
        description:
            "This error occurs when a user attempts to provide feedback for a booking that has already received feedback, resulting in a 400 Bad Request status.",
    },
};
