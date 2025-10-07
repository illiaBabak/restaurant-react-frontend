export const isValidPhoneNumber = (phoneNumber: string): boolean =>
  /^[+]?\d{0,3}\W?[(]?\d{3}[)]?[-\s.]?\d{3}[-\s.]?\d{4,6}$/i.test(phoneNumber);
