const { workerData, parentPort } = require("worker_threads");
const { addLogs } = require("../services/system.service");

const main = ({browser,page, userLink}) => {
    return new Promise(async(resolve, reject)=> {
        try {
            console.log('worker');
            if (!page) {
                page = await browser.newPage();
            }
            if (!userLink) { 
                return reject()
            }
            console.log({
                task:'getInfo'
            });
            page = await browser.newPage();
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
                  (name && name.innerText) ||
                  (email && email.innerText) ||
                  (phone && phone.innerText) || 
                  (description && description.innerText)
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
          // console.log({
          //   task: "then contactInfo",
          //   result,
          // });
          // await page.close();
          // console.log({ ...result });
          // return resolve(result);

          setTimeout(async () => {
            await page.close();
            // console.log({ ...result });
            // if (!fs.existsSync(path.resolve(process.cwd(),configs['STORAGE_FOLDER'],configs['FILE_DATA']))) {


            // }
            if (result && (result.email || result.phone)) {
                await addLogs({
                    filePath:path.resolve(process.cwd(),configs['STORAGE_FOLDER'],configs['FILE_DATA']),
                    logs: result
                })
            }
            return resolve(result);
          }, Number(configs["CONTACT_INFO_TIMEOUT"]));
        })
        .catch(async (e) => {
          console.log({ e });
          try {
            await page.close();
          } catch (e) {

          }
          return reject(e);
        });
        } catch(error) {
            return reject(error);
        }
    });
}

const { browser, userLink } = workerData;

main({ browser, userLink  })
  .then((result) => {
    parentPort.postMessage(result);
  })
  .catch((error) => {
    parentPort.postMessage(error);
});