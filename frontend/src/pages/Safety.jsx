import { useEffect, useState } from "react";
import config from "../config";

const fallbackTips = [
  "Keep an emergency kit ready with water, medicines, and flashlight.",
  "Charge phones and backup batteries before heavy weather alerts.",
  "Stay indoors and avoid coastal movement during landfall warnings.",
  "Follow local authority advisories for evacuation and shelter updates.",
];

function Safety() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSafetyTips() {
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/safety`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Safety API error: ${res.status}`);
        }

        const data = await res.json();
        if (Array.isArray(data.tips) && data.tips.length > 0) {
          setTips(data.tips);
          return;
        }

        setTips(fallbackTips);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching safety tips:", err);
        setError("Live tips are unavailable, showing essential preparedness guidance.");
        setTips(fallbackTips);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchSafetyTips();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Safety Guidelines</h1>
          <p className="mt-1 text-sm text-gray-600">
            Preparedness checklist for cyclone watches, warnings, and landfall.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
            Loading safety tips...
          </div>
        ) : (
          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-green-200 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-gray-800">{tip}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Safety;
