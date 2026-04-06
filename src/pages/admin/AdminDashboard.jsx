import React, { useState, useEffect, useMemo } from "react";
import MetricCard from "../../components/MetricCard";
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import ReportMap from "../../components/map/ReportMap";
import ReportsTable from "../../components/ReportsTable";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = () => {
      const q = query(
        collection(db, "reports"),
        where("status", "not-in", ["resolved"]),
        orderBy("createdAt", "desc"),
      );
      onSnapshot(
        q,
        (snap) => {
          setReports(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setPageLoading(false);
        },
        (error) => {
          console.error(error);
          setPageLoading(false);
        },
      );
    };

    return unsubscribe;
  }, []);

  const fetchData = async () => {
    try {
      const snap = await getDocs(collection(db, "users"));
      setUserAccounts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const moroccoRegions = [
    "casablanca",
    "rabat",
    "marrakech",
    "tangier",
    "oriental",
    "fes",
    "beni-mellal",
    "souss",
    "guelmim",
    "laayoune",
    "dakhla",
  ];

  const regionData = moroccoRegions.map((region) => ({
    region,
    count: reports.filter((r) =>
      r.region?.toLowerCase().includes(region.toLowerCase()),
    ).length,
  }));

  if (pageLoading) return <Loading />;

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
          National oversight dashboard
        </h1>
      </div>

      {/* Top stats */}
      <section className="grid md:grid-cols-3 gap-4">
        <MetricCard
          title="Active reports"
          value={
            reports.filter((report) => report.status !== "resolved").length
          }
          description="Across all regions in the last 24h."
        />
        <MetricCard
          title="Accounts"
          value={userAccounts.length}
          description="Admin, operator and field teams nationwide."
        />
      </section>

      {/* Analytics Charts */}
      <section className="grid gap-5 pt-2">
        <div className="bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Active Reports by Region
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={regionData}
                layout="horizontal"
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#334155"
                  opacity={0.2}
                />

                <XAxis
                  dataKey="region"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />

                <YAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />

                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#334155",
                    color: "#f8fafc",
                    borderRadius: "8px",
                  }}
                />

                <Bar
                  dataKey="count"
                  name="Active Cases"
                  fill="#00bd7e"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* National Map Overview */}
      <section className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
            National Live Map (All Regions)
          </h2>
          <Link
            to={"/admin/map"}
            className="text-xs text-emerald-600 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200 font-medium transition-colors"
          >
            Map view
          </Link>
        </div>
        <div className="h-170 w-full rounded-xl shadow-sm overflow-hidden">
          <ReportMap zoom={5} reports={reports} />
        </div>
      </section>

      {/* Reports table */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Latest report reports (all regions)
          </h2>
          <Link
            to={"/admin/reports"}
            className="text-xs text-emerald-600 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200 font-medium transition-colors"
          >
            View all
          </Link>
        </div>
        <ReportsTable reports={reports.slice(0, 10)} />
      </section>
    </>
  );
};

export default AdminDashboard;
