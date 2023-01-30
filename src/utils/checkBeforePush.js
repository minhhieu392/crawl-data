export default (
  checkUrlArray,
  checkUrlArrayAttributes,
  element,
  elementAttributes
) => {
  if (
    !checkUrlArray.find(
      (e) => e[checkUrlArrayAttributes] == element[elementAttributes]
    )
  ) {
    return true;
  } else {
    return false;
  }
};
