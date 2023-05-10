export const ERROR_MESSAGE = {
  // DEFUALT DATABASE
  RECORD_NOT_FOUND: {
    message: {
      vi: "Không tìm thấy bản ghi tương ứng.",
      en: "Record Not Found.",
    },
    code: 500,
  },

  // DEFUALT AUTH
  UNAUTHORIZED: {
    message: {
      vi: "Không được phép.",
      en: "Unauthorized.",
    },
    code: 401,
  },
  YOU_NOT_PERMISSIONS: {
    message: {
      vi: "Bạn không đủ quyền.",
      en: "You are not permissions.",
    },
    code: 401,
  },
  TOKEN_EXPIRED: {
    message: {
      vi: "Token hết hạn.",
      en: "Token Expried.",
    },
    code: 401,
  },
  BAD_TOKEN: {
    message: {
      vi: "Token không đúng.",
      en: "Bad Token.",
    },
    code: 401,
  },

  // DEFUALT ROUTER
  SORRY_SOMETHING_WENT_WRONG: {
    message: {
      vi: "Xin lỗi, có gì đó không đúng.",
      en: "Sorry! Something went wrong.",
    },
    code: 500,
  },
  THE_API_NOT_SUPPORTED: {
    message: {
      vi: "API không còn hổ trợ.",
      en: "The API is not supported.",
    },
    code: 500,
  },
  BAD_REQUEST: {
    message: {
      vi: "Yêu cầu sai.",
      en: "Bad Request.",
    },
    code: 400,
  },
  // Auth
  USERNAME_DOES_NOT_EXIST: {
    message: {
      vi: "Tên đăng nhập không tồn tài.",
      en: "Username does not exist.",
    },
    code: 404,
  },
  THIS_ACCOUNT_IS_APPLE: {
    message: {
      vi: "Tài khoản này được đăng nhập trước đó thông qua Apple.",
      en: "This account is an account logged in through APPLE.",
    },
    code: 400,
  },
  THIS_ACCOUNT_IS_PHONE: {
    message: {
      vi: "Tài khoản này được đăng nhập trước đó thông qua số điện thoại",
      en: "This account is an account logged in through PHONE.",
    },
    code: 400,
  },
  THIS_ACCOUNT_IS_NAVER: {
    message: {
      vi: "Tài khoản này được đăng nhập trước đó thông qua Naver.",
      en: "This account is an account logged in through NAVER.",
    },
    code: 400,
  },
  THIS_ACCOUNT_IS_KAKAOTALK: {
    message: {
      vi: "Tài khoản này được đăng nhập trước đó thông qua Kakaotalk.",
      en: "This account is an account logged in through KAKAOTALK.",
    },
    code: 400,
  },
  THIS_ACCOUNT_IS_GOOGLE: {
    message: {
      vi: "Tài khoản này được đăng nhập trước đó thông qua Google.",
      en: "This account is an account logged in through GOOGLE.",
    },
    code: 400,
  },
  THIS_ACCOUNT_IS_INAPP: {
    message: {
      vi: "Tài khoản này được đăng nhập trước đó bằng tên đăng nhập và mật khẩu.",
      en: "This account is an account logged in through username and password.",
    },
    code: 400,
  },
  USERNAME_ALREADY_REGISTERED: {
    message: {
      vi: "Tên đăng nhập này đã được đăng ký trước đó.",
      en: "Username already registered.",
    },
    code: 400,
  },
  PASSWORD_OR_USERNAME_INCORRECT: {
    message: {
      vi: "Mật khẩu hoặc tài khoản không đúng.",
      en: "Password or username incorrect.",
    },
    code: 400,
  },
  LOGIN_METHOD_NOT_SUPPORTED: {
    message: {
      vi: "Phương thức đăng nhập này không được hỗ trợ.",
      en: "This login method is not supported.",
    },
    code: 400,
  },

  // Skill
  THIS_SKILL_DOES_NOT_EXISTED: {
    message: {
      vi: "Kỹ năng này không hề tồn tại.",
      en: "This skill doesn't exist",
    },
    code: 400,
  },
  // Provider
  THIS_PROVIDER_DOES_NOT_EXISTED: {
    message: {
      vi: "Nhà cung cấp này không hề tồn tại.",
      en: "This provider doesn't exist",
    },
    code: 400,
  },
  // Provider Skill
  THIS_PROVIDER_SKILL_IS_EXISTED: {
    message: {
      vi: "Kỹ năng này đã tồn tại trong danh sách kỹ năng của nhà cung cấp dịch vụ.",
      en: "This skill already exists in the provider's skill list",
    },
    code: 400,
  },
};
