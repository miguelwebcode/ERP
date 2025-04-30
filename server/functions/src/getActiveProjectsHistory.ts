import * as functions from "firebase-functions/v1";
import { db } from "./firebaseConfig";
import { ActiveProjectsMonth, Project } from "./types";

export const getActiveProjectsHistory = functions
  .region("europe-west1")
  .https.onCall(async (_data, _context): Promise<ActiveProjectsMonth[]> => {
    // 1. Fetch all projects
    const snap = await db.collection("projects").get();
    const projects = snap.docs.map((d) => d.data() as Project);

    // 2. Generate last 12 months array
    const now = new Date();
    const months: Date[] = Array.from({ length: 12 })
      .map((_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return date;
      })
      .reverse();

    // 3. Helper to parse yyyy-mm-dd
    const parseDate = (s: string) => {
      const [y, m, d] = s.split("-").map(Number);
      return new Date(y, m - 1, d);
    };

    // 4. Helper to check active in month
    const isActiveInMonth = (
      project: Project,
      monthStart: Date,
      monthEnd: Date
    ) => {
      const projectStart = parseDate(project.startDate).getTime();
      const projectEnd = project.endDate
        ? parseDate(project.endDate).getTime()
        : Infinity;
      return (
        projectStart <= monthEnd.getTime() &&
        projectEnd >= monthStart.getTime() &&
        (project.state === "pending" ||
          project.state === "inProgress" ||
          project.state === "onHold")
      );
    };

    // 5. Calculate counts
    const history = months.map((m) => {
      const monthStart = new Date(m.getFullYear(), m.getMonth(), 1);
      const monthEnd = new Date(
        m.getFullYear(),
        m.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      const count = projects.filter((proj) =>
        isActiveInMonth(proj, monthStart, monthEnd)
      ).length;
      const monthStr = `${m.toLocaleString("en-US", {
        month: "short",
      })}${String(m.getFullYear()).slice(-2)}`;
      return { month: monthStr, activeCount: count };
    });

    return history;
  });
