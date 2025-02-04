```javascript
// pages/about.js
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import { useEffect, useState } from 'react';

export async function getServerSideProps(context) {
  // Try to get session on server-side.  This may sometimes fail due to the reported issue.
  const session = await unstable_getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      initialSession: session // Pass it as initialSession
    }
  }
}

export default function About({ initialSession }) {
  const [session, setSession] = useState(initialSession);

  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      setSession(data.session);
    };

    if (!session) {
      fetchSession(); //Only Fetch if session is not populated from server-side.
    }
  }, []);

  return (
    <div>
      <h1>About Page</h1>
      {session ? <p>Logged in as {session.user.email}</p> : <p>Not logged in</p>}
    </div>
  );
}
```
```javascript
// pages/api/auth/session.js
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions);
  res.json({ session });
}
```