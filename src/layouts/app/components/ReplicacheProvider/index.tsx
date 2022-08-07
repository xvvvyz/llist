import React, { ReactNode, useEffect, useState } from 'react';
import { Replicache } from 'replicache';
import { createClient } from '@supabase/supabase-js';
import ReplicacheContext from '../../../../context/replicache';
import generateId from '../../../../utilities/generate-id';
import mutations, { Mutations } from '../../../../mutations';
import { IdSize, LocalstorageKey } from '../../../../enums';

const subscribeToPokes = ({ onPoke, spaceId }: { onPoke: () => void; spaceId: string }) => {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const su = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const subscription = su.from(`space:id=eq.${spaceId}`).on('*', onPoke).subscribe();
    return () => subscription.unsubscribe();
  }

  const ev = new EventSource(`/api/replicache/poke-sse?spaceID=${spaceId}`);
  ev.onmessage = (e) => e.data === 'poke' && onPoke();
  return () => ev.close();
};

interface ReplicacheProviderProps {
  children: ReactNode;
}

const ReplicacheProvider = ({ children }: ReplicacheProviderProps) => {
  const [replicache, setReplicache] = useState<Replicache<Mutations> | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_REPLICACHE_LICENSE_KEY) return;
    let spaceId = localStorage.getItem(LocalstorageKey.SpaceId);

    if (!spaceId) {
      spaceId = generateId(IdSize.SpaceId);
      localStorage.setItem(LocalstorageKey.SpaceId, spaceId);
    }

    const r = new Replicache({
      licenseKey: process.env.NEXT_PUBLIC_REPLICACHE_LICENSE_KEY,
      mutators: mutations,
      name: spaceId,
      pullInterval: null,
      pullURL: `/api/replicache/pull?spaceID=${spaceId}`,
      pushURL: `/api/replicache/push?spaceID=${spaceId}`,
      schemaVersion: '1',
    });

    setReplicache(r);
    const closeSubscription = subscribeToPokes({ onPoke: () => r.pull(), spaceId });

    return () => {
      closeSubscription();
      void r.close();
    };
  }, []);

  return <ReplicacheContext.Provider value={replicache}>{children}</ReplicacheContext.Provider>;
};

export default ReplicacheProvider;
