const changeVowelsForRegex = (string) => {
  let regrexStr = string;

  if (regrexStr.includes("a")) {
    regrexStr = regrexStr.replace("a", "[aá]");
  } else {
    regrexStr = regrexStr.replace("á", "[aá]");
  }

  if (regrexStr.includes("e")) {
    regrexStr = regrexStr.replace("e", "[eé]");
  } else {
    regrexStr = regrexStr.replace("é", "[eé]");
  }

  if (regrexStr.includes("i")) {
    regrexStr = regrexStr.replace("i", "[ií]");
  } else {
    regrexStr = regrexStr.replace("í", "[ií]");
  }

  if (regrexStr.includes("o")) {
    regrexStr = regrexStr.replace("o", "[oó]");
  } else {
    regrexStr = regrexStr.replace("ó", "[oó]");
  }

  if (regrexStr.includes("u")) {
    regrexStr = regrexStr.replace("u", "[uú]");
  } else {
    regrexStr = regrexStr.replace("ú", "[uú]");
  }

  return regrexStr;
};

module.exports = {
  changeVowelsForRegex,
};
