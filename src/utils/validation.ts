export const validateEmail = (email: string) => {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return re.test(email);
};

export const validateName = (name: string) => {
  const re = /^[a-zA-Z ]*$/;
  return re.test(name);
};
export const validatePassword = (password: string) => {
  const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  return re.test(password);
};
