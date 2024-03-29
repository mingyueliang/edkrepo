import { spawn } from 'child_process';

/**
 * Remove line breaks on both sides
 * @param str 
 * @returns 
 */
export function trimString(str: string) {
    return str.replace(/[\r\n]/g, "");
}


/**
 * Call python script
 * @param scriptPath python script path
 * @param args argument list
 */
export async function callPythonScript(scriptPath: string, args: string[]) {
    const pythonProcess = await spawn('python', [scriptPath, ...args]);
    pythonProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
   
    pythonProcess.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
   
    pythonProcess.on('close', (code) => {
      console.log(`Subprocess status：${code}`);
    });
  }



export function runPythonScript(scriptPath: string, args: string[] = []) {
    return new Promise<string>((resolve, reject) => {
      const pythonProcess = spawn('python', [scriptPath, ...args]);
      let stdout = '';
   
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
   
      pythonProcess.stdout.on('end', () => {
        resolve(stdout);
      });
   
      pythonProcess.stderr.on('data', (data) => {
        reject(new Error(`Python error: ${data}`));
      });
   
      pythonProcess.on('error', reject);
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}`));
        }
      });
    });
  }
   