import { exec } from "child_process"
import path from "path"

// console.log("Current working directory:", process.cwd());
const directoryPath = path.join("src", "server", "recommend-script")
const scriptPath = path.join(directoryPath, "event.py")
// console.log("scriptPath", scriptPath)

// Adjust the path as necessary where the Python executable is located
const pythonExecutablePath = path.join("venv", "Scripts", "python")
// console.log("pythonExecutablePath", pythonExecutablePath)

export async function recommendation(eventName: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // Execute the Python script
    // Must have Python installed on the machine
    exec(
      `${pythonExecutablePath} ${scriptPath} "${eventName}"`,
      (error, stdout: string, stderr: string) => {
        //
        if (error) {
          console.error(`Error executing script: ${error.message}`)
          reject([])
        }

        // Split the stdout into an array of event eventIds
        const eventIds = stdout
          .trim()
          .split(",")
          .map((id) => id.trim().replace(/^[\[\]'"\s]+|[\[\]'"\s]+$/g, "")) // Adjusted regex

        resolve(eventIds)

        if (stderr) {
          console.error("Script error:")
          console.error(stderr)
          reject([stderr])
        }
      }
    )
  })
}
