'use-client';

import { Channel, ChannelType, Server } from '@prisma/client';
import { create } from 'zustand';

export type ModalType =
  | 'createServer'
  | 'editServer'
  | 'leaveServer'
  | 'deleteServer'
  | 'invite'
  | 'members'
  | 'createChannel'
  | 'deleteChannel'
  | 'editChannel'
  | 'messageFile'
  | 'deleteMessage'
  | 'leaveServer';

export const modalTypes = {
  createServer: 'createServer',
  editServer: 'editServer',
  deleteServer: 'deleteServer',
  invite: 'invite',
  members: 'members',
  createChannel: 'createChannel',
  deleteChannel: 'deleteChannel',
  editChannel: 'editChannel',
  messageFile: 'messageFile',
  deleteMessage: 'deleteMessage',
  leaveServer: 'leaveServer',
};

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: ChannelType;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type: type, isOpen: true, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
