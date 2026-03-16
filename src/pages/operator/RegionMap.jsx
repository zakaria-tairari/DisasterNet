import React, { useContext, useEffect, useState } from 'react'
import ReportMap from '../../components/map/ReportMap'
import { db } from '../../firebase/config';
import { onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import Loading from '../../components/Loading';
import { AuthContext } from '../../contexts/AuthContext';

const RegionMap = () => {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    
  
    useEffect(() => {
        const unsubscribe = () => {
          const q = query(collection(db, "reports"), where("status", "not-in", ["resolved"]), where("region", "==", user.region), orderBy("createdAt", "desc"));
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

      if (pageLoading) return <Loading />;

  return (
    <div className="h-[calc(100vh-4rem)]">
        <ReportMap zoom={7} reports={reports}/>
    </div>
  )
}

export default RegionMap