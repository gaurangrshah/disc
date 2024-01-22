'use client';

import { useEffect, useState } from 'react';

import {
  CreateServerModal,
  InviteModal,
  EditServerModal,
  MembersModal,
  CreateChannelModal,
} from '../modals/';

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
    </>
  );
}
