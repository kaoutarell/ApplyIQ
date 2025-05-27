"use client";

import { useState } from "react";
import Badge from "./Badge";

type SalaryData = {
  range?: string;
  breakdown?: Record<string, string>;
  location_impact?: string;
  source?: string | string[];
};

type SalaryModalProps = {
  skills: string[];
  onClose: () => void;
};

export default function SalaryModal({ skills, onClose }: SalaryModalProps) {
  const [location, setLocation] = useState("Remote");
  const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const estimateSalary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/estimate-salary`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ skills, location }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to estimate salary");
      }

      const data = await response.json();
      console.log("Received salary data:", data); // Debug log - ok
      setSalaryData(data);
    } catch (err) {
      console.error("Error fetching salary:", err); // Debug log - ok
      setError(
        err instanceof Error ? err.message : "Failed to estimate salary"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render source
  const renderSource = () => {
    if (!salaryData?.source) return null;

    if (Array.isArray(salaryData.source)) {
      return (
        <div className="text-sm text-gray-400 mt-2">
          Sources: {salaryData.source.join(", ")}
        </div>
      );
    }

    return (
      <div className="text-sm text-gray-400 mt-2">
        Source: {salaryData.source}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Salary Estimation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-700 text-white rounded p-2 w-full"
            >
              <option value="Remote">Remote</option>
              <option value="New York">New York</option>
              <option value="San Francisco">San Francisco</option>
              <option value="Chicago">Chicago</option>
              <option value="Austin">Austin</option>
              <option value="Florida">Florida</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Skills Being Evaluated
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <Badge key={i} text={skill} variant="purple" />
              ))}
            </div>
          </div>

          <button
            onClick={estimateSalary}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Calculating..." : "Estimate Salary Range"}
          </button>

          {error && (
            <div className="text-red-500 text-center p-2 rounded bg-red-900/50">
              {error}
            </div>
          )}

          {salaryData && (
            <div className="mt-6 space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Estimated Salary Range
                </h3>
                <div className="text-3xl font-bold text-green-400">
                  {salaryData.range || "Not available"}
                </div>
              </div>

              {salaryData.breakdown &&
                Object.keys(salaryData.breakdown).length > 0 && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Skill Impact
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(salaryData.breakdown).map(
                        ([skill, value]) => (
                          <div
                            key={skill}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-300">{skill}</span>
                            <span className="font-medium text-white">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {salaryData.location_impact && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Location Impact
                  </h3>
                  <p className="text-gray-300">{salaryData.location_impact}</p>
                </div>
              )}

              {renderSource()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
