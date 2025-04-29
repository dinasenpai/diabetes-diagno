const { spawn } = require("child_process");
const path = require("path");

function runPythonScript(scriptName) {
  return new Promise((resolve, reject) => {
    // Get absolute path to the script
    const scriptPath = path.join(__dirname, scriptName);
    let output = "";
    let errorOutput = "";

    const process = spawn("python", [scriptPath]);

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (error) => {
      errorOutput += error.toString();
      console.error("Python stderr:", error.toString());
    });

    process.on("close", (code) => {
      if (code !== 0) {
        return reject({
          message: `Python process exited with code ${code}`,
          error: errorOutput,
          details: output || "No output received"
        });
      }
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        reject({
          message: "Failed to parse Python output as JSON",
          error: err.message,
          output: output
        });
      }
    });

    process.on("error", (err) => {
      reject({
        message: "Failed to start Python process",
        error: err.message
      });
    });
  });
}

module.exports = runPythonScript;
