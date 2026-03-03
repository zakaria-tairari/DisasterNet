import React, { useState, useEffect } from 'react'
import DashboardShell from '../components/DashboardShell'
import CreateUserForm from '../components/admin/CreateUserForm';
import AltButton from '../components/AltButton';
import { db } from "../firebase/config";
import { collection, getDocs } from 'firebase/firestore';
import Loading from '../components/Loading';
import PopupButton from '../components/PopupButton';

const ManageUsers = () => {
    const [userAccounts, setUserAccounts] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await getDocs(collection(db, "users"));
                setUserAccounts(snap.docs.map(doc => ({id: doc.id, ...doc.data()})));
            } catch (error) {
                console.error(error);
            } finally {
                setPageLoading(false);
            }
        }

        fetchData();
      }, []);

    if (pageLoading) return <Loading />

    
  return (
    <DashboardShell title="Manage user accounts">
        {/* Account management */}
      <section className="grid md:grid-cols-[1.4fr,1fr] gap-5 pt-2">
        <div className="rounded-xl border  border-slate-800  bg-slate-900/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Manage accounts
            </h2>
            <button className="text-[11px] text-emerald-300 hover:text-emerald-200">
              View all
            </button>
          </div>

          <div className="space-y-2">
            {userAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border  border-slate-800  bg-slate-900 px-3 py-2.5"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-100">
                    {account.displayName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {account.role} {account.region ? "• " + account.region : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <AltButton variant="info">Edit</AltButton>
                  <AltButton variant="danger">Delete</AltButton>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PopupButton buttonText="+ Add user">
          <CreateUserForm />
        </PopupButton>
      </section>
    </DashboardShell>
  )
}

export default ManageUsers