import { exec } from "child_process";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

function runCommand(cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${cmd}`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ${cmd}:`, stderr);
        return reject(error);
      }
      console.log(stdout);
      resolve();
    });
  });
}

async function main() {
  try {
    console.log("Starting Firebase backup (Firestore and Auth)");

    // 1. Attempt to delete the previous copy in the bucket.
    //    If it fails because the bucket does not exist, the error is ignored.
    try {
      await runCommand("gcloud storage rm -r gs://erp-fire/backup-firebase");
    } catch (error) {
      console.warn(
        "Could not delete the bucket (probably does not exist). Continuing with the process."
      );
    }

    // 2. Export Firestore to a "firestore" folder within the backup
    await runCommand(
      "gcloud firestore export gs://erp-fire/backup-firebase/firestore_export"
    );

    // 3. Export Firebase Auth to a local file (auth_export.json)
    await runCommand(
      "firebase auth:export auth_export.json --format=json --project erp-fire"
    );

    // 4. Upload the Auth file to the bucket, inside an "auth_export" folder
    try {
      await runCommand(
        "gcloud storage cp auth_export.json gs://erp-fire/backup-firebase/auth_export/auth_export.json"
      );
      console.log("auth_export.json file successfully uploaded to the bucket.");

      // Delete the file locally after uploading
      const authExportPath = path.resolve(__dirname, "../auth_export.json");

      await fsPromises.unlink(authExportPath);
      console.log("auth_export.json file deleted locally.");
    } catch (error) {
      console.error("Error uploading or deleting auth_export.json:", error);
    }

    // 5. Define the local destination path. In this example, ../../client/backup-firebase will be used
    const clientBackupPath = path.resolve(__dirname, "../../client");

    const backupFirebasePath = path.resolve(
      __dirname,
      "../../client/backup-firebase"
    );

    if (fs.existsSync(backupFirebasePath)) {
      fs.rmSync(backupFirebasePath, { recursive: true, force: true });
    }

    // 6. Download the complete backup (Firestore and Auth) from the bucket to the local folder
    await runCommand(
      `gcloud storage cp -r gs://erp-fire/backup-firebase ${clientBackupPath}`
    );

    // Delete the auth_export folder in the specified path if it exists
    const authExportToDeletePath = path.resolve(
      __dirname,
      "../../client/backup-firebase/auth_export"
    );
    if (fs.existsSync(authExportToDeletePath)) {
      fs.rmSync(authExportToDeletePath, { recursive: true, force: true });
    }

    // Send a copy of auth_export from backup-files to backup-firebase
    const authExportCopyPath = path.resolve(
      __dirname,
      "../../client/backup-files/auth_export"
    );
    await runCommand(`cp -r ${authExportCopyPath} ${backupFirebasePath}`);

    // Delete firebase-export metadata if it exists and send a copy from backup-files
    const backupFirebaseMetadataToDeletePath = path.resolve(
      __dirname,
      "../../client/backup-firebase/firebase-export-metadata.json"
    );

    if (fs.existsSync(backupFirebaseMetadataToDeletePath)) {
      fs.rmSync(backupFirebaseMetadataToDeletePath);
    }

    const backupFilesMetadataPath = path.resolve(
      __dirname,
      "../../client/backup-files/firebase-export-metadata.json"
    );

    await runCommand(
      `cp ${backupFilesMetadataPath} ${backupFirebasePath}/firebase-export-metadata.json`
    );

    console.log("Firebase backup completed successfully.");
  } catch (error) {
    console.error("An error occurred during the backup:", error);
  }
}

main();
