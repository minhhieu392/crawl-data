let selectProfileName = "/html/body/div[1]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div/div/div[1]/div[2]/div/div/div[2]/div/div/div[1]/div/div/div/div/span/h1";
let selectProfileEmail = "/html/body/div[1]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div/div/div[4]/div/div/div/div[1]/div/div/div/div[2]/div/div/div[1]/div[3]/div/div[2]/div/div/div/div/div[1]/span";
let selectProfilePhone = "/html/body/div[1]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div/div/div[4]/div/div/div/div[1]/div/div/div/div[2]/div/div/div[1]/div[2]/div/div[2]/div/div/div/div/div[1]/span"
let contact = {
    name: null,
    email: null,
    phone: null,
    // userLink,
  };

  function getElementByXpath(path) {
    return document.evaluate(
      path,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  }
  let name = getElementByXpath(selectProfileName);
  let email = getElementByXpath(selectProfileEmail);
  let phone = getElementByXpath(selectProfilePhone);
  if (
    (name && name.innerText) ||
    (email && email.innerText) ||
    (phone && phone.innerText)
  ) {
    contact = {
      name: name && name.innerText ? name.innerText : null,
      email: email && email.innerText ? email.innerText : null,
      phone: phone && phone.innerText ? phone.innerText : null,
      // userLink
    };
  }
    
    console.log({contact});
  