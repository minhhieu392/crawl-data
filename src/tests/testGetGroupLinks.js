const selectGroupLinkQuery =    '//*[@id="mount_0_0"]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div/div[{{i}}]/div/div/div/div/div/div/div[2]/div/div[1]/span/span/div/a'
const selectGroupDivTagsQuery = '//*[@id="mount_0_0"]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[2]/div/div/div/div/div/div'
const scrollMaxHeight = 5000;
const distance = 100;
const scrollTimeout = 200;
console.log({
  selectGroupLinkQuery,
  selectGroupDivTagsQuery,
  scrollMaxHeight,
  distance,
  scrollTimeout,
});
function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}
const templateStr = ({ text, data }) => {
  try {
    text = text ? text.toString().trim() : "";
    if (text && typeof text === "string") {
      Object.keys(data).forEach((key) => {
        const re = new RegExp(`{{${key}}}`, "g");
        text = text.replace(re, data[key]);
      });
    }
    return text;
  } catch (e) {
    // console.log({
    //   task: "scrollAndGetLinks",
    //   e,
    // });
    return "";
  }
};
let groupLinks;
let totalHeight = 0;
let groupDivTags;
const getGroupLinks = (count) => {
  const links = [];
  for (let i = 1; i <= count; i++) {
    const link = getElementByXpath(
      templateStr({
        text: selectGroupLinkQuery,
        data: { i: i },
      })
    );
    // console.log(link);
    if (link && link.href) {
      links.push(link.href);
    }
  }
  console.log(links);
  return links;
};
const timer = setInterval(() => {
  let scrollHeight = document.documentElement.scrollHeight;
  window.scrollBy(0, distance);
  totalHeight += distance;
  if (
    totalHeight >= scrollHeight ||
    scrollHeight > scrollMaxHeight
  ) {
    setTimeout(() => {
      scrollHeight = document.documentElement.scrollHeight;
      if (
        totalHeight >= scrollHeight ||
        scrollHeight > scrollMaxHeight
      ) {
        clearInterval(timer);
        groupDivTags = getElementByXpath(
          selectGroupDivTagsQuery
        );

        if (
          groupDivTags &&
          groupDivTags.children &&
          groupDivTags.children.length
        ) {
          groupLinks = getGroupLinks(
            groupDivTags.children.length - 1
          );
        }
        // console.log({
        //   groupDivTags,
        // });
        return {
          groupLinks,
        }
      }
    }, scrollTimeout);
  }
}, scrollTimeout);
