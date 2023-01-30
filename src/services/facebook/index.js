const configs = require('../../configs');
const systemService = require('../system.service');
const { addLogs, loadLogs } = systemService;
const path = require('path');
const scrollAndGetMembers = async ({ browser, page, groupMemberLink }) => {
  return new Promise(async (_resolve, _reject) => {
    try {
      if (!page){
        page = await browser.newPage();
      }
      await page.goto(groupMemberLink, {
        waitUntil: "load",
        // Remove the timeout
        timeout: Number(configs["PAGE_GOTO_TIMEOUT"]),
      });
      await page.content();
      await page.waitForTimeout(5000);
      return await page
        .evaluate(
          async ({
            selectMemberLinkQuery,
            selectMemberDivTagsQuery,
            selectMemberTableQuery,
            scrollMaxHeight,
            distance,
            scrollTimeout,
          }) => {
            return new Promise(async (__resolve, __reject) => {
              try {
                let userLinks;
                let totalHeight = 0;
                let memberDivTags;
                let x1 = 0;
                let checked = false;
                const init = {
                  selectMemberLinkQuery,
                  selectMemberDivTagsQuery,
                  selectMemberTableQuery,
                  scrollMaxHeight,
                  distance,
                  scrollTimeout,
                };

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
                  return document.evaluate(
                    path,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                  ).singleNodeValue;
                }
                for (let j = 0; j < 30 && !checked; j++) {
                  const elm = getElementByXpath(
                    templateStr({
                      text: selectMemberDivTagsQuery,
                      data: {
                        x1: j,
                      },
                    })
                  );
                  console.log(elm);
                  if (
                    elm &&
                    elm.innerText &&
                    elm.innerText.match(/Mới vào nhóm|New to the group/i)
                  ) {
                    checked = true;
                    x1 = j;
                  }
                }
                console.log({ x1 });

                const getProfileLink = (count) => {
                  const links = [];
                  for (let i = 1; i <= count; i++) {
                    const link = getElementByXpath(
                      templateStr({
                        text: selectMemberLinkQuery,
                        data: { x2: i, x1: x1 },
                      })
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
                            text: selectMemberTableQuery,
                            data: {
                              x1: x1,
                            },
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
                        console.log({ userLinks });
                        return __resolve({
                          userLinks,
                        });
                      } else {
                        // console.log(".");
                      }
                    }, scrollTimeout);
                  }
                }, scrollTimeout);
              } catch (e) {
                return __reject(e);
              }
            });
          },
          {
            // add var
            scrollMaxHeight: Number(configs["SCROLL_MAX_HEIGHT"]),
            distance: Number(configs["SCROLL_DISTANCE"]),
            scrollTimeout: Number(configs["SCROLL_TIMEOUT"]),
            selectMemberDivTagsQuery: configs["SELECT_MEMBER_DIV_TAGS_QUERY"],
            selectMemberLinkQuery: configs["SELECT_MEMBER_LINK_QUERY"],
            selectMemberTableQuery: configs["SELECT_MEMBER_TABLE_QUERY"],
          }
        )
        .then(async (result) => {
          // await page.close();
          // console.log({
          //   task: "then result _resolve(result)",
          //   result,
          // });
          if (result && result.userLinks && Array.isArray(result.userLinks)) {
            result.userLinks = result.userLinks.map((link) => {
              const matchLink = link.match(/groups\/\d+\/user\/\d+/i);
              // console.log(matchLink);
              if (link && matchLink && matchLink[0]) {
                try {
                  link =
                    configs["ID_FACEBOOK_LINK"] + matchLink[0].split("/")[3];
                } catch (e) {
                  console.log({ e });
                }
              }
              return link;
            });
          }
          // console.log({ result });
          // await page.close();
          return _resolve(result);
        })
        .catch((e) => {
          return _reject(e);
        });
    } catch (e) {
      return _reject(e);
    }
  });
};

const scrollAndGetLinks = async ({ page }) => {
  return new Promise(async (_resolve, _reject) => {
    try {
      return await page
        .evaluate(
          async ({
            // add var
            selectGroupLinkQuery,
            selectGroupDivTagsQuery,
            scrollMaxHeight,
            distance,
            scrollTimeout,
          }) => {
            return new Promise(async (__resolve, __reject) => {
              try {
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
                    console.log({
                      task: "scrollAndGetLinks",
                      e,
                    });
                    return "";
                  }
                };
                let groupLinks;
                let totalHeight = 0;
                let groupDivTags;
                const getGroupLinks = (count) => {
                  const links = [];
                  for (let i = 1; i <= count; i++) {
                    const str = templateStr({
                      text: selectGroupLinkQuery,
                      data: { i: i },
                    })
                    const link = getElementByXpath(str);
                    console.log(str,link);
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
                        groupDivTags = getElementByXpath(
                          selectGroupDivTagsQuery
                        );

                        if (
                          groupDivTags &&
                          groupDivTags.children &&
                          groupDivTags.children.length
                        ) {
                          // console.log({count: groupDivTags.children.length - 1});
                          groupLinks = getGroupLinks(
                            groupDivTags.children.length - 1
                          );
                        }
                        // console.log({
                        //   groupDivTags,
                        // });
                        return __resolve({
                          groupLinks,
                        });
                      }
                    }, scrollTimeout);
                  }
                }, scrollTimeout);
              } catch (e) {
                console.log({
                  task: "scrollAndGetLink",
                  e,
                });
                return __reject(e);
              }
            });
          },
          {
            // add var
            selectGroupLinkQuery: configs["SELECT_GROUP_LINK_QUERY"],
            selectGroupDivTagsQuery: configs["SELECT_GROUP_DIV_TAGS_QUERY"],
            scrollMaxHeight: Number(configs["SCROLL_MAX_HEIGHT"]),
            distance: Number(configs["SCROLL_DISTANCE"]),
            scrollTimeout: Number(configs["SCROLL_TIMEOUT"]),
          }
        )
        .then((result) => {
          // console.log({
          //   task: "_resolve(result) scrollAndGetLinks",
          //   result,
          // });
          if (result && result.groupLinks && Array.isArray(result.groupLinks)) {
            result.groupLinks = result.groupLinks.map((groupLink) => {
              return groupLink + configs["GROUP_MEMBER_URL_PATH"];
            });
          }
          return _resolve(result);
        })
        .catch((e) => {
          console.log({
            task: "scrollAndGetLink",
            e,
          });
          return _reject(e);
        });
    } catch (e) {
      console.log({
        task: "scrollAndGetLink",
        e,
      });
      return _reject(e);
    }
  });
};


const contactInfo = async ({ browser,page, userLink }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!page) {
        page = await browser.newPage();
      }
      await page.goto(userLink, {
        waitUntil: "load",
        // Remove the timeout
        timeout: Number(configs["PAGE_GOTO_TIMEOUT"]),
      });
      await page.content();
      await page.waitForTimeout(3000);
      await page
        .evaluate(
          async ({
            selectProfileName,
            selectProfileEmail,
            selectProfilePhone,
            selectProfileDescription
          }) => {
            return new Promise((_resolve, _reject) => {
              try {
                let contact = {
                  name: null,
                  email: null,
                  phone: null,
                  description: null
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
                let description = getElementByXpath(selectProfileDescription);
                if (
                  ((name && name.innerText) ||
                  (email && email.innerText) ||
                  (phone && phone.innerText) ||
                  (description && description.innerText))
                ) {
                  contact = {
                    name: name && name.innerText ? name.innerText : null,
                    email: email && email.innerText ? email.innerText : null,
                    phone: phone && phone.innerText ? phone.innerText : null,
                    description: description && description.innerText ? description.innerText : null,
                    
                    // userLink
                  };
                }
                return _resolve(contact);
              } catch (_error) {
                console.log({ _error });
                return _reject(_error);
              }
            });
          },
          {
            selectProfileName: configs["SELECT_PROFILE_NAME"],
            selectProfileEmail: configs["SELECT_PROFILE_EMAIL"],
            selectProfilePhone: configs["SELECT_PROFILE_PHONE"],
            selectProfileDescription: configs["SELECT_PROFILE_DESCRIPTION"],
          }
        )
        .then(async (result) => {
          setTimeout(async () => {
            await page.close();
            if (result && (result.email || result.phone || result.description)) {
              result.link = userLink;
              await addLogs({
                filePath: path.resolve(
                  process.cwd(),
                  configs["STORAGE_FOLDER"],
                  configs["FILE_DATA"]
                ),
                logs: [result]
              });
            }
            return resolve(result);
          }, Number(configs["CONTACT_INFO_TIMEOUT"]));
        })
        .catch(async (e) => {
          console.log({ e });
          await page.close();
          return reject(e);
        });
    } catch (error) {
      return reject(error);
    }
  })
};

const isPublicGroup = async ({ page }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await page.content();
      await page
        .evaluate(
          async ({ isPublicQuery }) => {
            return new Promise((_resolve, _reject) => {
              try {
                setTimeout(() => {
                  function getElementByXpath(path) {
                    return document.evaluate(
                      path,
                      document,
                      null,
                      XPathResult.FIRST_ORDERED_NODE_TYPE,
                      null
                    ).singleNodeValue;
                  }
                  let check = false;
                  let isPublic = getElementByXpath(isPublicQuery);
                  // console.log({ isPublic });
                  if (
                    isPublic &&
                    isPublic.innerText &&
                    isPublic.innerText.match(/Nhóm công khai|Public group/i)
                  ) {
                    check = true;
                  }
                  // console.log({check, isPublic});
                  return _resolve(check);
                }, 3000);
              } catch (_error) {
                return _reject(false);
              }
            });
          },
          { isPublicQuery: configs["IS_PUBLIC_QUERY"] }
        )
        .then((result) => {
          // console.log({
          //   task: "page.evaluate",
          //   result,
          // });
          return resolve(result);
        });
    } catch (error) {
      return reject(error);
    }
  });
};

const openGroupLink = ({ browser, page, groupLink }) => {

  return new Promise(async (resolve, reject) => {
    try {
      if (!groupLink){
        return reject()
      }
      let isPublic = false;
      if (!page) {
        page = await browser.newPage();
      }
      await page.goto(groupLink, {
        waitUntil: "load",
        // Remove the timeout
        timeout: Number(configs["PAGE_GOTO_TIMEOUT"]),
      });
      await page.content();
      isPublic = await isPublicGroup({ page });
      if (!isPublic) {
        // console.log('!isPublic');
        // setTimeout(async() =>{
        //   await page.close();

        // },3000)
        return reject();

      } else {
        // console.log('isPublic');
        await scrollAndGetMembers({
          browser,
          page,
          groupMemberLink: groupLink,
        })
          .then(async (result) => {
            // console.log({
            //   task: "scrollAndGetMembers",
            //   result,
            // });
            const userLinks = result.userLinks;
            // console.log({
            //   task:'scrollAndGetMembers',
            //   userLinks
            // });
            setTimeout(async() => {
              return resolve({
                isPublic,
                userLinks
              });
            }, Number(configs["OPEN_GROUP_LINK_TIMEOUT"]));
          })
          .catch((e) => {
            console.log({ e });
          });
      }
    } catch (e) {
      console.log(e);
      return reject(e);
    }
  })
};

const login =  ({ browser, page }) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!page) {
          page = await browser.newPage();
        }
        await page.goto(configs["FACEBOOK_LINK"], {
          waitUntil: "load",
          // Remove the timeout
          timeout: Number(configs["PAGE_GOTO_TIMEOUT"]),
        });

        await page
          .evaluate(
            async ({
              email,
              password,
              selectLoginEmailQuery,
              selectLoginPasswordQuery,
              selectLoginButtonQuery,
            }) => {
              return new Promise((_resolve, _reject) => {
                try {
                  emailSelector = document.querySelector(selectLoginEmailQuery);
                  emailSelector.value = email;
                  passwordSelector = document.querySelector(
                    selectLoginPasswordQuery
                  );
                  passwordSelector.value = password;
                  loginButtonSelector = document.querySelector(
                    selectLoginButtonQuery
                  );
                  loginButtonSelector.click();
                  return _resolve();
                } catch (e) {
                  return _reject(e);
                }
              });
            },
            {
              email: configs["FACEBOOK_USERNAME"],
              password: configs["FACEBOOK_PASSWORD"],
              selectLoginEmailQuery: configs["SELECT_LOGIN_EMAIL_QUERY"],
              selectLoginPasswordQuery: configs["SELECT_LOGIN_PASSWORD_QUERY"],
              selectLoginButtonQuery: configs["SELECT_LOGIN_BUTTON_QUERY"],
            }
          )
          .then(async () => {
            setTimeout(async () => {
              await page.close();
              return resolve();
            }, Number(configs["LOGIN_TIMEOUT"]));
          })
          .catch((e) => {
            return reject(e);
          });
      } catch (e) {
        return reject(e);
      }
    });
}

const searchGroup = ({ browser, page, keyword }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!page) {
        page = await browser.newPage();
      }
      await page.setUserAgent(configs['PUPPETEER_USER_AGENT']);
      await page.goto(`${configs["SEARCH_FACEBOOK_LINK"]}${keyword}`, {
        waitUntil: "load",
        // Remove the timeout
        timeout: Number(configs["PAGE_GOTO_TIMEOUT"]),
      });

      await page.content();
      await scrollAndGetLinks({ page })
        .then(async (r) => {
          await page.close();
          return resolve(r);
        })
        .catch((e) => {
          return reject(e);
        });
    } catch (e) {
      console.log(e);
    }
  });
};

module.exports = {
  login,
  searchGroup,
  contactInfo,
  openGroupLink,
  isPublicGroup,
  scrollAndGetMembers
}



