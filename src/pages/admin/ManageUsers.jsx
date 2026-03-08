import React, { useState, useEffect } from 'react'
import CreateUserForm from '../../components/admin/CreateUserForm';
import { db } from "../../firebase/config";
import { collection, getDocs } from 'firebase/firestore';
import Loading from '../../components/Loading';
import PopupButton from '../../components/PopupButton';
import UsersTable from '../../components/admin/UsersTable';

const ManageUsers = () => {
    const [userAccounts, setUserAccounts] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

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

    useEffect(() => {
        fetchData();
      }, []);

    if (pageLoading) return <Loading />

    
  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
            Manage user accounts
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, update, and manage access roles for all users.
          </p>
        </div>
        <PopupButton buttonText="+ Add user">
          <CreateUserForm refresh={fetchData}/>
        </PopupButton>
      </div>

      <section className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
        <UsersTable users={userAccounts} refresh={fetchData}/>
      </section>
    </>
  )
}

export default ManageUsers