const fs = require("fs");
const path = require("path");
const { getFormattedTime } = require("./dateConvert");

async function readLogFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

async function writeLogFile(filePath, data) {
  try {
    await fs.promises.writeFile(filePath, data, "utf-8");
  } catch (error) {
    throw new Error(`Error writing file: ${error.message}`);
  }
}

async function insertInLog(
  originalUrl,
  query,
  params,
  body,
  isError = false,
  message,
  errorPassed
) {
  try {
    let time = getFormattedTime();
    // console.log(req.query);
    // console.log(req.body);

    let filePath = path.join(__basedir, "server", "log.txt");
    // console.log(filePath);

    // file not exist
    if (!fs.existsSync(filePath)) {
      await fs.writeFile(filePath, "Welcome to log", (err) => {
        if (err) {
          console.error("Error creating  file:", err);
        } else {
          console.log("File created successfully!");
        }
      });
    }

    let fileData = await readLogFile(filePath);
    // console.log(fileData);

    // console.log("originalUrl ", originalUrl);
    if (isError) {
      fileData += `
${time}
Error
    Message: ${message}
    ${JSON.stringify(errorPassed)}`;
    } else {
      fileData += `

${time}
Endpoint: ${originalUrl}
Request
    Query:${JSON.stringify(query)}
    Params:${JSON.stringify(params)}
    Body:${JSON.stringify(body)}
    `;
    }

    await writeLogFile(filePath, fileData);
    return { success: true };
  } catch (error) {
    console.error("error ===> ", error.message);
    return { success: false };
  }
}

module.exports = { insertInLog };
