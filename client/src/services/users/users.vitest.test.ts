import { describe, it, expect, beforeEach } from "vitest";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import { getUsers, saveUserData } from "./users";
import { db } from "../../firebaseConfig";

// Configuración de Firebase para los tests

// connectFirestoreEmulator(db, "localhost", 8080);

describe("user tests", () => {
  beforeEach(async () => {
    // Limpiar la colección "users" antes de cada test
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    snapshot.forEach(async (doc) => await deleteDoc(doc.ref));
  });

  it("should save user data to firestore, and get the user data correctly", async () => {
    await saveUserData("123", {
      name: "Juan",
      role: "developer",
      email: "test@test.com",
    });
    const users = await getUsers();

    expect(users.length).toBe(1);
    expect(users[0]).toEqual({
      name: "Juan",
      role: "developer",
      email: "test@test.com",
    });
  });
});
