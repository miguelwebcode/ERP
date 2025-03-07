import { exec } from "child_process";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";

function runCommand(cmd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log(`Ejecutando: ${cmd}`);
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error ejecutando ${cmd}:`, stderr);
        return reject(error);
      }
      console.log(stdout);
      resolve();
    });
  });
}

async function main() {
  try {
    console.log("Iniciando backup de Firebase (Firestore y Auth)");

    // 1. Intenta eliminar la copia anterior en el bucket.
    //    Si falla porque el bucket no existe, se ignora el error.
    try {
      await runCommand("gcloud storage rm -r gs://erp-fire/backup-firebase");
    } catch (error) {
      console.warn(
        "No se pudo eliminar el bucket (probablemente no exista). Se continúa con el proceso."
      );
    }

    // 2. Exporta Firestore a una carpeta "firestore" dentro del backup
    await runCommand(
      "gcloud firestore export gs://erp-fire/backup-firebase/firestore_export"
    );

    // 3. Exporta Firebase Auth a un archivo local (auth_export.json)
    await runCommand(
      "firebase auth:export auth_export.json --format=json --project erp-fire"
    );

    // 4. Sube el archivo de Auth al bucket, dentro de una carpeta "auth_export"
    try {
      await runCommand(
        "gcloud storage cp auth_export.json gs://erp-fire/backup-firebase/auth_export/auth_export.json"
      );
      console.log("Archivo auth_export.json subido al bucket exitosamente.");

      // Eliminar el archivo localmente después de subirlo
      const authExportPath = path.resolve(__dirname, "../auth_export.json");

      await fsPromises.unlink(authExportPath);
      console.log("Archivo auth_export.json eliminado localmente.");
    } catch (error) {
      console.error("Error al subir o eliminar auth_export.json:", error);
    }

    // 5. Define la ruta local de destino. En este ejemplo, se usará ../../client/backup-firebase
    const clientBackupPath = path.resolve(__dirname, "../../client");

    const backupFirebasePath = path.resolve(
      __dirname,
      "../../client/backup-firebase"
    );

    if (fs.existsSync(backupFirebasePath)) {
      fs.rmSync(backupFirebasePath, { recursive: true, force: true });
    }

    // 6. Descarga el backup completo (Firestore y Auth) desde el bucket a la carpeta local
    await runCommand(
      `gcloud storage cp -r gs://erp-fire/backup-firebase ${clientBackupPath}`
    );

    // Eliminar la carpeta auth_export en la ruta especificada si existe
    const authExportToDeletePath = path.resolve(
      __dirname,
      "../../client/backup-firebase/auth_export"
    );
    if (fs.existsSync(authExportToDeletePath)) {
      fs.rmSync(authExportToDeletePath, { recursive: true, force: true });
    }

    // Enviar una copia de auth_export de backup-files a backup-firebase
    const authExportCopyPath = path.resolve(
      __dirname,
      "../../client/backup-files/auth_export"
    );
    await runCommand(`cp -r ${authExportCopyPath} ${backupFirebasePath}`);

    // Eliminar firebase-export metadata si existe y enviar una copia de backup-files
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

    console.log("Backup de Firebase completado exitosamente.");
  } catch (error) {
    console.error("Ocurrió un error durante el backup:", error);
  }
}

main();
