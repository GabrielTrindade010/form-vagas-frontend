export const maskCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .substring(0, 11) // Limite de 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskPhone = (value) => {
  return value
    .replace(/\D/g, '')
    .substring(0, 11) // Limite de 11 dígitos
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1');
};

export const maskCEP = (value) => {
  return value
    .replace(/\D/g, '')
    .substring(0, 8) // Limite de 8 dígitos
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export const maskPIS = (value) => {
  return value
    .replace(/\D/g, '')
    .substring(0, 11) // Limite de 11 dígitos
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{5})(\d)/, '$1.$2')
    .replace(/(\d{2})(\d)/, '$1-$2')
    .replace(/(-\d{1})\d+?$/, '$1');
};

export const maskRG = (value) => {
  // Formato comum: 00.000.000-0
  return value
    .replace(/\D/g, '')
    .substring(0, 9)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1})/, '$1-$2');
};

export const maskCNH = (value) => {
  // CNH tem 11 dígitos
  return value
    .replace(/\D/g, '')
    .substring(0, 11);
};
