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
};

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
    errorEl.innerHTML = message;
    return false;
  }

  input.classList.add("correct");
  errorEl.textContent = "";
  return true;
}

/*
 * Age calculation (accurate)
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

  const numberCond = /\d/.test(passwordValue);
  const upperCond = /[A-Z]/.test(passwordValue);
  const specialCond = /[\W_]/.test(passwordValue);
  const lengthCond = passwordValue.length >= 8;

  const validPassword = numberCond && upperCond && specialCond && lengthCond;

  const passwordMessage = `
    Password requirements:
    <ul>
      <li>At least 1 uppercase letter</li>
      <li>At least 1 special character</li>
      <li>At least 1 number</li>
      <li>Minimum 8 characters long</li>
    </ul>
  `;

  ok =
    setValidation(
      fields.password,
      errors.password,
      validPassword,
      passwordMessage,
    ) && ok;

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
