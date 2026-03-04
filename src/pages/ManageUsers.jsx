import React, { useState, useEffect } from 'react'
import DashboardShell from '../components/DashboardShell'
import CreateUserForm from '../components/admin/CreateUserForm';
import { db } from "../firebase/config";
import { collection, getDocs } from 'firebase/firestore';
import Loading from '../components/Loading';
import PopupButton from '../components/PopupButton';
import UsersTable from '../components/admin/UsersTable';

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
    <DashboardShell title="Manage user accounts">
        {/* Account management */}
      <section className="grid md:grid-cols-[1.4fr,1fr] gap-3 pt-2">
        <PopupButton buttonText="+ Add user">
          <CreateUserForm refresh={fetchData}/>
        </PopupButton>
        <UsersTable users={userAccounts} refresh={fetchData}/>
      </section>
    </DashboardShell>
  )
}

export default ManageUsers