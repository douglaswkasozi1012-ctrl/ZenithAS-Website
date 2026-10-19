// Runs every time the site is rebuilt (i.e. every time you press Publish in the admin).
export default function () {
  const now = new Date();
  return {
    year: now.getFullYear(),
    date: now.toISOString().slice(0, 10),
  };
}
