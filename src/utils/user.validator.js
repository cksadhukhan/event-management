class UserInputValidator {
  static validateRegisterDetails(userData) {
    const { name, password, email } = userData;

    if (!name) {
      return {
        status: false,
        message: "Please Provide Name",
      };
    }

    if (!email) {
      return {
        status: false,
        message: "Please Provide Valid Email",
      };
    }

    if (!password) {
      return {
        status: false,
        message: "Please Provide Passsword",
      };
    }

    return {
      status: true,
      message: "Details Validated",
    };
  }

  static validateLoginDetails(userData) {
    const { password, email } = userData;

    if (!email) {
      return {
        status: false,
        message: "Please Provide Valid Email",
      };
    }

    if (!password) {
      return {
        status: false,
        message: "Please Provide Passsword",
      };
    }

    return {
      status: true,
      message: "Details Validated",
    };
  }
}

module.exports = UserInputValidator;
