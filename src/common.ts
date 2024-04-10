import { spawn } from 'child_process';
import path from 'path';
import * as vscode from 'vscode';


export var logger = vscode.window.createOutputChannel('logChannel');
export var PythonScriptPath = path.join(path.dirname(__dirname), 'edkrepoScripts/edkrepo/edkrepo_cli.py');

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
    const logger = vscode.window.createOutputChannel('logChannel');
    pythonProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
      logger.appendLine(`${data}`);
      // logger.show();
    });
   
    pythonProcess.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
   
    pythonProcess.on('close', (code) => {
      console.log(`Subprocess status：${code}`);
      logger.appendLine(`Subprocess status：${code}`);
    });
  }



export function runPythonScript(scriptPath: string, args: string[] = [], logger:vscode.OutputChannel) {
    return new Promise<string>((resolve, reject) => {
      logger.clear();
      const pythonProcess = spawn('python', [scriptPath, ...args]);
      let stdout = '';
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(data.toString());
        logger.appendLine(data.toString().replace(/\u001b[^m]*?m/g, ""));
        logger.show();
      });
   
      pythonProcess.stdout.on('end', () => {
        resolve(stdout);
      });
   
      pythonProcess.stderr.on('data', (data) => {
        console.log(data);
        logger.appendLine(data);
        reject(new Error(`Python error: ${data}`));
      });
   
      pythonProcess.on('error', reject);
      pythonProcess.on('close', (code) => {
        console.log(`Exit code: ${code}`);
        logger.appendLine(`Exit code: ${code}`);
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}`));
        }
      });
    });
  }
   