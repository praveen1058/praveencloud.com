export async function loadJSON(path, fallback = []) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  } catch {
    return fallback;
  }
}
