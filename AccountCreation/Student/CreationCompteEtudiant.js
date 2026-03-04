/*
 * ================================
 *  FORM VALIDATION — IMPROVED VERSION
 * ================================
 */

const form = document.querySelector("#Form");

/*
 * elements
 */
const fields = {
  firstName: document.querySelector("#firstName"),
  lastName: document.querySelector("#lastName"),
  tel: document.querySelector("#tel"),
  email: document.querySelector("#email"),
  password: document.querySelector("#password"),
  birthday: document.querySelector("#birthday"),
  password_requirements_liste: document.querySelector(
    "#password_requirements_list",
  ),
};

const password_requirements =
  fields.password_requirements_liste.querySelectorAll("li");

fields.password.addEventListener("input", () => {
  const passwordValue = fields.password.value;

  const lengthCond = passwordValue.length >= 8;
  const upperCond = /[A-Z]/.test(passwordValue);
  const specialCond = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
  const numberCond = /\d/.test(passwordValue);

  const conditions = [lengthCond, upperCond, specialCond, numberCond];

  password_requirements.forEach((el, index) => {
    el.classList.toggle("valid_requirement", conditions[index]);
    el.classList.toggle("invalid_requirement", !conditions[index]);
  });
});

const errors = {
  firstName: document.querySelector("#firstNameError"),
  lastName: document.querySelector("#lastNameError"),
  tel: document.querySelector("#telError"),
  email: document.querySelector("#emailError"),
  password: document.querySelector("#passwordError"),
  birthday: document.querySelector("#birthdayError"),
};

/*
 * Reset state when user edits input
 */
Object.values(fields).forEach((input) => {
  input.addEventListener("input", () => {
    input.classList.remove("correct", "error");

    const errorP = document.querySelector(`#${input.id}Error`);
    if (errorP) errorP.textContent = "";
  });
});

/*
 * Generic validation helper
 */
function setValidation(input, errorEl, condition, message) {
  if (!condition) {
    input.classList.add("error");
    errorEl.textContent = message;
    return false;
  }

  input.classList.add("correct");
  errorEl.textContent = "";
  return true;
}

/*
 * Age calculation
 */
function calculateAge(birthDate) {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

/*
 * Main validation
 */
function checkForm() {
  let ok = true;

  /*
   * First Name / Last Name
   * Supports French names
   */
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+([ -'][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;

  const firstNameValue = fields.firstName.value.trim();
  const lastNameValue = fields.lastName.value.trim();

  ok =
    setValidation(
      fields.firstName,
      errors.firstName,
      nameRegex.test(firstNameValue) && firstNameValue.length >= 3,
      "Should include only letters and be at least 3 letters long",
    ) && ok;

  ok =
    setValidation(
      fields.lastName,
      errors.lastName,
      nameRegex.test(lastNameValue) && lastNameValue.length >= 3,
      "Should include only letters and be at least 3 letters long",
    ) && ok;

  /*
   * ============
   * Telephone (French formats)
   * Accepts:
   * 06XXXXXXXX
   * +33 X XX XX XX XX
   * 0033XXXXXXXXX
   * ============
   */
  const telValue = fields.tel.value.trim();
  const telRegex = /^(\+33|0033|0)[1-9](?:[ .-]?\d{2}){4}$/;

  ok =
    setValidation(
      fields.tel,
      errors.tel,
      telRegex.test(telValue),
      "Phone number should follow the French format",
    ) && ok;

  /*
   * Email
   */
  const emailValue = fields.email.value.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  ok =
    setValidation(
      fields.email,
      errors.email,
      emailRegex.test(emailValue),
      "Invalid email address",
    ) && ok;

  /*
   * Password
   */
  const passwordValue = fields.password.value;

  const lengthCond = passwordValue.length >= 8;
  const upperCond = /[A-Z]/.test(passwordValue);
  const specialCond = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
  const numberCond = /\d/.test(passwordValue);

  const conditions = [lengthCond, upperCond, specialCond, numberCond];

  password_requirements.forEach((el, index) => {
    el.classList.toggle("valid_requirement", conditions[index]);
    el.classList.toggle("invalid_requirement", !conditions[index]);
  });

  const validPassword = numberCond && upperCond && specialCond && lengthCond;

  ok = setValidation(fields.password, errors.password, validPassword, "") && ok;

  /*
   * Birthday (16-120 years old)
   */
  const birthdayValue = fields.birthday.value.trim();
  const birthDate = new Date(birthdayValue);
  const isValidDate = !isNaN(birthDate.getTime());

  let birthdayValid = false;

  if (isValidDate) {
    const age = calculateAge(birthDate);
    birthdayValid = age >= 16 && age <= 120;
  }

  ok =
    setValidation(
      fields.birthday,
      errors.birthday,
      birthdayValid,
      "Age must be between 16 and 120 years",
    ) && ok;

  return ok;
}

/*
 * Prevent submit if invalid
 */
form.addEventListener("submit", (e) => {
  if (!checkForm()) {
    e.preventDefault();
  }
});
