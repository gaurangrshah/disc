'use client';

import { useEffect, useState } from 'react';

import {
  CreateServerModal,
  EditServerModal,
  LeaveServerModal,
  DeleteServerModal,
  InviteModal,
  MembersModal,
  CreateChannelModal,
  EditChannelModal,
  DeleteChannelModal,
  MessageFileModal,
  DeleteMessageModal,
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
      <EditServerModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <InviteModal />
      <MembersModal />
      <CreateChannelModal />
      <EditChannelModal />
      <DeleteChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
}
