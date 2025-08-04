import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from './firebase';

const DashboardView = ({ user }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setSessions([]);
            setLoading(false);
            return;
        }

        const sessionsRef = query(collection(db, 'sessions'), where('userId', '==', user.uid));
        const unsubscribe = onSnapshot(sessionsRef, (snapshot) => {
                const sessions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setSessions(sessions);

            });
        return unsubscribe;
    }, [user]);

    if (loading) {
        return (
            <div className="bg-gray-800 text-white shadow-2xl p-8 w-full max-w-4xl mx-auto rounded-2xl">
                <h2 className="text-3xl font-bold mb-6">My Dashboard</h2>
                <p>You have completed <strong>{sessions.length}</strong> focus sessions.</p>
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
                    <ul className="space-y-4">
                        {sessions.map(session => (
                            <li key={session.id} className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-semibold">{session.name}</h4>
                                        <p className="text-sm text-gray-400">{session.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-green-400">{session.duration} minutes</span>
                                        <span className="text-sm text-gray-400">{session.category}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <div>
                {sessions.map(session => (
                    <div key={session.id}>{session.name}</div>
                ))}
            </div>
        </div>
    );
};

export default DashboardView;