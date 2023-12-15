import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

import { Button } from "~/components/ui";
import { MuseClient } from "muse-js";
import { connectMuse } from "~/services/integrations/muse.service";

interface IBiometricsModalProps {
  isOpen: boolean;
  onCloseModal: () => void;
}

export const BiometricsModal: FC<IBiometricsModalProps> = ({ isOpen, onCloseModal }) => {
  const [museClient, setMuseClient] = useState<MuseClient>();

  const getMuseClient = () => {
    (async () => {
      console.log("connecting muse device");
      const muse = await connectMuse();
      setMuseClient(muse);
    })();
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="data-[state=open]:animate-overlayShow fixed inset-0 bg-slate-900/50"
          onPointerDown={onCloseModal}
        />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed left-[50%] top-[50%] z-30 h-auto max-h-[85vh] w-[450px] max-w-[90vw] translate-x-[-50%] translate-y-[-50%] overflow-auto rounded-[6px] bg-white p-8 focus:outline-none dark:bg-slate-800 md:w-[600px]">
          <Dialog.Title className="mb-1 w-10/12 font-body text-lg md:w-full md:text-2xl">
            Connect Your Muse Headset
          </Dialog.Title>
          <Dialog.Description className="mb-5 text-sm text-gray-700 dark:text-gray-300 md:text-base">
            Works with the Muse S and Muse 2 headbands.
          </Dialog.Description>

          <Dialog.Close
            className="absolute right-8 top-10 rounded-full  opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800"
            onClick={onCloseModal}
          >
            <X />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          <div className="mt-8 flex w-full flex-wrap items-center gap-4 py-6 md:flex-nowrap">
            {museClient ? (
              <>
                <p>{museClient.deviceName} is connected!</p>

                <Button type="submit" onClick={getMuseClient}>
                  Update Connection
                </Button>
              </>
            ) : (
              <Button type="submit" onClick={getMuseClient}>
                Connect Muse
              </Button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
