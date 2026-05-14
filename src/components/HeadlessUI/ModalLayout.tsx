import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode } from 'react'

interface ModalLayoutProps {
  showModal: boolean
  toggleModal: () => void
  panelClassName?: string
  children: ReactNode
  placement?: string
  isStatic?: boolean
}

const ModalLayout = ({
  showModal,
  toggleModal,
  panelClassName,
  children,
  placement,
  isStatic,
}: ModalLayoutProps) => {
  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        static={isStatic ?? false}
        as="div"
        className="relative z-50"
        onClose={isStatic ? () => null : toggleModal}
      >
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Centered panel */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className={`flex min-h-full ${placement ?? 'justify-center items-center'} p-4`}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full max-w-lg md:max-w-3xl 
                  rounded-lg bg-white dark:bg-gray-900 
                  overflow-y-auto max-h-[90vh] 
                  shadow-lg transform transition-all ${panelClassName}`}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ModalLayout
