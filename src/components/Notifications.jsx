import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/config";

export default function Notifications({ user }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Listen to all notifications
    const unsubscribe = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const newNotifs = snapshot.docs
        .map(doc => ({ id: doc.id, ref: doc.ref, ...doc.data() }))
        .filter(n => {
          if (n.readBy?.includes(user.uid)) return false; // skip if user already read
          
          if (n.targetRole === "operator") {
            // Show to admin + operators in the region
            return user.role === "admin" || (user.role === "operator" && n.targetRegion === user.region);
          } else if (n.targetRole === "team") {
            // Show only to the specific team
            return n.targetTeam?.id === user.uid;
          }
          return false;
        });

      setNotifications(newNotifs);
    });

    return () => unsubscribe();
  }, [user]);

  // Mark as read and remove from UI
  const handleMarkAsRead = async (notificationId) => {
    const notifRef = doc(db, "notifications", notificationId);
    await updateDoc(notifRef, {
      readBy: arrayUnion(user.uid),
    });
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  return (
    <div className="fixed bottom-10 right-5 flex flex-col gap-2 z-9999">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="p-4 rounded-lg shadow-lg min-w-70 max-w-sm flex flex-col animate-fade-in-out
                     bg-white text-slate-900 dark:bg-slate-800 dark:text-white"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-full
                            bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-bell"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
              </svg>
            </div>

            <div className="flex-1">
              <p className="font-semibold truncate">{notif.title}</p>
              <p className="text-sm truncate text-slate-600 dark:text-slate-300">{notif.message}</p>
              <button
                onClick={() => handleMarkAsRead(notif.id)}
                className="mt-2 text-sm font-medium text-emerald-600 hover:cursor-pointer dark:text-emerald-400 hover:underline transition"
              >
                Mark as read
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}