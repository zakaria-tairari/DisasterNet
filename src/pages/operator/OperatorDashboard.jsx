import React, { useState, useEffect, useContext } from "react";
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
import { AuthContext } from "../../contexts/AuthContext";

const OperatorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = () => {
      const q = query(
        collection(db, "reports"),
        where("status", "not-in", ["resolved"]),
        where("region", "==", user.region),
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

  // Compute dummy chart data from reports for Recharts
  // TODO (Backend): Replace with aggregated analytics from Cloud Functions if dataset grows large.
  const chartData = [
    { name: "Mon", reports: 4, resolved: 2 },
    { name: "Tue", reports: 7, resolved: 5 },
    { name: "Wed", reports: 2, resolved: 6 },
    { name: "Thu", reports: 9, resolved: 4 },
    { name: "Fri", reports: 12, resolved: 8 },
    { name: "Sat", reports: 5, resolved: 7 },
    { name: "Sun", reports: 3, resolved: 3 },
  ];

  const regionData = [
    {
      region: "Casablanca",
      count: reports.filter((r) => r.region?.includes("casablanca")).length,
    },
    {
      region: "Rabat",
      count: reports.filter((r) => r.region?.includes("rabat")).length,
    },
    {
      region: "Marrakech",
      count: reports.filter((r) => r.region?.includes("marrakech")).length,
    },
    {
      region: "Tangier",
      count: reports.filter((r) => r.region?.includes("tangier")).length,
    },
  ];

  const mockNationalReports = [
    {
      id: "INC-2024-001",
      type: "Medical Emergency",
      position: [33.5731, -7.5898],
    }, // Casa
    { id: "INC-2024-002", type: "Fire Hazard", position: [34.0208, -6.8416] }, // Rabat
    {
      id: "INC-2024-003",
      type: "Structural Collapse",
      position: [31.6295, -8.036],
    }, // Marrakech
    { id: "INC-2024-004", type: "Flood Warning", position: [35.7595, -5.834] }, // Tangier
  ];

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
          title="Avg response time"
          value="12 min"
          description="Based on dispatched reports this week."
        />
        <MetricCard
          title="Accounts"
          value={userAccounts.length}
          description="Admin, operator and field teams nationwide."
        />
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

export default OperatorDashboard;
