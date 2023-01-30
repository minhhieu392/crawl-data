
let selectMemberLinkQuery =    '/html/body/div[1]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[4]/div/div/div/div/div/div/div/div/div/div/div[2]/div[{{x1}}]/div/div[2]/div/div[{{x2}}]/div/div/div[2]/div[1]/div/div/div[1]/span/span/div/a';
let selectMemberDivTagsQuery = "/html/body/div[1]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[4]/div/div/div/div/div/div/div/div/div/div/div[2]/div[{{x1}}]/div/div[2]/div";
let selectMemberTableQuery =   "/html/body/div[1]/div/div[1]/div[1]/div[3]/div/div/div[1]/div[1]/div[4]/div/div/div/div/div/div/div/div/div/div/div[2]/div[{{x1}}]"
let scrollMaxHeight = 5000;
let distance = 100;
let scrollTimeout = 200;

let userLinks;
let totalHeight = 0;
let memberDivTags;
let x1 = 0;
let checked = false;
// console.log({
//   selectMemberLinkQuery,
//   selectMemberDivTagsQuery,
//   scrollMaxHeight,
//   distance,
//   scrollTimeout,
// });
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
    console.log(e);
    return "";
  }
};
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
for (let j = 0; j < 20 && !checked; j++) {
  const elm = getElementByXpath(templateStr({
    text: selectMemberTableQuery,
    data: {
      x1: j
    }
  }));
  if (elm && elm.innerText && elm.innerText.match(/Mời vào nhóm|New to the group/i)){
    checked = true;
    x1 = j;
  }
}
console.log({x1});

const getProfileLink = (count) => {
  const links = [];
  for (let i = 1; i <= count; i++) {
    const link = getElementByXpath(
      templateStr({ text: selectMemberLinkQuery, data: { x2: i, x1: x1 } })
    );
    console.log({ link });
    if (link && link.href) {
      links.push(link.href);
    }
  }
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
        memberDivTags = getElementByXpath(
          templateStr({
            text: selectMemberDivTagsQuery,
            data: {
              x1: x1
            }
          })
        );
        if (
          memberDivTags &&
          memberDivTags.children &&
          memberDivTags.children.length
        ) {
          userLinks = getProfileLink(
            memberDivTags.children.length - 1
          );
          console.log({ memberDivTags });
        } else {
          // console.log(".");
        }
        console.log({userLinks});
        // return __resolve({
        //   userLinks,
        // });
      } else {
        // console.log(".");
      }
    }, scrollTimeout);
  }
}, scrollTimeout);