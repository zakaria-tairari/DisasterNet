import React, { useState, useEffect, useContext } from 'react'
import CreateUserForm from '../../components/admin/CreateUserForm';
import { db } from "../../firebase/config";
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loading from '../../components/Loading';
import PopupButton from '../../components/PopupButton';
import UsersTable from '../../components/admin/UsersTable';
import { AuthContext } from '../../contexts/AuthContext';
import { AlertContext } from '../../contexts/AlertContext';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/config';
import { getFirebaseErrorMessage } from '../../lib/firebaseErrors';

const RegionTeams = () => {
    const [userAccounts, setUserAccounts] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
      const [displayName, setDisplayName] = useState("");
      const [teamType, setTeamType] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const { setAlert } = useContext(AlertContext);
      const { user } = useContext(AuthContext);

    const fetchData = async () => {
      const q = query(collection(db, "users"), where("region", "==", user.region), where("role", "==", "team"))
        try {
            const snap = await getDocs(q);
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

      const handleAddTeam = async (e) => {
          e.preventDefault();
      
          if (!displayName || !email || !password || !confirmPassword) {
            setAlert({ type: "error", message: "Missing fields." });
            return;
          }
      
          if (password !== confirmPassword) {
            setAlert({ type: "error", message: "Failed password confirmation." });
            return;
          }
      
          const createUser = httpsCallable(functions, "createUser");
          try {
            await createUser({
              displayName,
              email,
              password,
              role: "team",
              region: user.region,
              teamType,
            });
            setAlert({ type: "success", message: "Team created successfuly." });
            fetchData();
            setDisplayName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setTeamType("");
          } catch (error) {
            setAlert({ type: "error", message: getFirebaseErrorMessage(error.code) });
            console.log(error.code);
          }
        };

    if (pageLoading) return <Loading />

    
  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
            Manage Region Teams
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create, update, and manage access roles for region teams.
          </p>
        </div>
        <PopupButton buttonText="+ Add user">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 transition-colors">
        Create new region team account
      </h2>
      <form className="space-y-4" onSubmit={handleAddTeam}>
        <Input
          placeholder="Username"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
        <Input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Input
          placeholder="Confirm password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
          <select
          value={teamType}
          onChange={(e) => setTeamType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm text-slate-900 dark:text-slate-50"
        >
          <option disabled value="">
              Type of the field team
          </option>
          <option value="fire">Firefighting Unit</option>
          <option value="flood">Civil Protection Unit</option>
          <option value="medical">Medical Unit</option>
          <option value="traffic">Traffic Police Unit</option>
          <option value="infrastructure">Public Works Unit</option>
          <option value="other">General Response Unit</option>
        </select>
        <Button type="submit">Create Account</Button>
      </form>
        </PopupButton>
      </div>

      <section className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors">
        <UsersTable users={userAccounts} refresh={fetchData}/>
      </section>
    </>
  )
}

export default RegionTeams