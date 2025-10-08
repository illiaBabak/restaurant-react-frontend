import { JSX, useContext, useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Waiter } from "src/types";
import {
  useAddWaiter,
  useDeleteWaiter,
  useGetWaiters,
  useUpdateWaiter,
} from "src/api/waiters";
import { Plus, X } from "lucide-react";
import { Table } from "src/components/Table";
import { OverlayModal } from "src/components/OverlayModal";
import { v4 as uuidv4 } from "uuid";
import { isValidEmail } from "src/utils/isValidEmail";
import { isValidPhoneNumber } from "src/utils/isValidPhoneNumber";
import { GlobalContext } from "src/root";
import { FormInput } from "src/components/FormInput";

const waitersColumns: ColumnDef<Waiter>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Surname",
    accessorKey: "surname",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Phone Number",
    accessorKey: "phone_number",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
];

export const WaitersManagment = (): JSX.Element => {
  const { setAlertProps } = useContext(GlobalContext);

  const { data: waiters, isLoading: isLoadingWaiters } = useGetWaiters();

  const { mutateAsync: addWaiter } = useAddWaiter();

  const { mutateAsync: updateWaiter } = useUpdateWaiter();

  const { mutateAsync: deleteWaiter } = useDeleteWaiter();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null);

  const [newWaiter, setNewWaiter] = useState<Waiter>({
    id: uuidv4(),
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    address: "",
  });

  useEffect(() => {
    if (selectedWaiter) {
      setNewWaiter(selectedWaiter);
      setShouldShowModal(true);
    }
  }, [selectedWaiter, setNewWaiter, setShouldShowModal]);

  useEffect(() => {
    if (shouldShowModal) return;

    setNewWaiter({
      id: uuidv4(),
      name: "",
      surname: "",
      email: "",
      phone_number: "",
      address: "",
    });

    setSelectedWaiter(null);
  }, [shouldShowModal, setNewWaiter]);

  const allFieldsAreFilled = Object.values(newWaiter).every(Boolean);

  const handleCreateWaiter = async () => {
    if (!allFieldsAreFilled) return;

    if (!isValidEmail(newWaiter.email)) {
      setAlertProps({
        text: "Invalid email",
        type: "error",
        position: "top",
      });
      return;
    }

    if (!isValidPhoneNumber(newWaiter.phone_number)) {
      setAlertProps({
        text: "Invalid phone number",
        type: "error",
        position: "top",
      });

      return;
    }

    if (selectedWaiter) {
      await updateWaiter(newWaiter);
    } else {
      await addWaiter(newWaiter);
    }

    setShouldShowModal(false);
  };

  const handleDeleteWaiter = async () => {
    if (!selectedWaiter) return;

    await deleteWaiter(selectedWaiter.id);

    setShouldShowModal(false);
    setSelectedWaiter(null);
  };

  return (
    <div className="w-full px-7 pt-4">
      <div className="flex justify-between items-center flex-row my-4">
        <h2 className="text-2xl font-bold tracking-wide mb-4">Waiters</h2>

        <button
          onClick={() => setShouldShowModal(true)}
          className="rounded-md cursor-pointer transition-all duration-300 hover:scale-115 mb-4"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      <Table
        data={waiters ?? []}
        columns={waitersColumns}
        isLoading={isLoadingWaiters}
        onRowClick={(waiter) => setSelectedWaiter(waiter)}
      />

      {shouldShowModal && (
        <OverlayModal onClose={() => setShouldShowModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 rounded-lg cursor-default w-[50%] h-[85%]"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold tracking-wide mb-4">
                {selectedWaiter ? "Update Waiter" : "Create Waiter"}
              </h2>

              <button
                className="cursor-pointer mb-4 transition-all duration-300 hover:scale-115"
                onClick={() => setShouldShowModal(false)}
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <form className="flex flex-col justify-between h-[90%]">
              <div className="flex flex-col gap-4">
                <FormInput
                  label="name"
                  placeholder="Enter name"
                  value={newWaiter.name}
                  onChange={({ target: { value } }) =>
                    setNewWaiter({ ...newWaiter, name: value })
                  }
                  type="text"
                />
                <FormInput
                  label="surname"
                  placeholder="Enter surname"
                  value={newWaiter.surname}
                  onChange={({ target: { value } }) =>
                    setNewWaiter({ ...newWaiter, surname: value })
                  }
                  type="text"
                />
                <FormInput
                  label="email"
                  placeholder="Eg example@example.com"
                  value={newWaiter.email}
                  onChange={({ target: { value } }) =>
                    setNewWaiter({ ...newWaiter, email: value })
                  }
                  type="email"
                />
                <FormInput
                  label="phone_number"
                  placeholder="Eg +1 800 000000"
                  value={newWaiter.phone_number}
                  onChange={({ target: { value } }) =>
                    setNewWaiter({ ...newWaiter, phone_number: value })
                  }
                  type="text"
                />
                <FormInput
                  label="address"
                  placeholder="Eg 123 Main St, New York, USA"
                  value={newWaiter.address}
                  onChange={({ target: { value } }) =>
                    setNewWaiter({ ...newWaiter, address: value })
                  }
                  type="text"
                />
              </div>

              <div className="flex items-center gap-2 w-full flex-col">
                <div className="flex items-center justify-center flex-row gap-4 w-[80%]">
                  <button
                    className={`${
                      allFieldsAreFilled
                        ? "bg-violet-500 cursor-pointer transition-all duration-300 hover:scale-105"
                        : "bg-gray-500/50 cursor-not-allowed"
                    } w-full text-white rounded-md p-2`}
                    type="button"
                    onClick={handleCreateWaiter}
                  >
                    {selectedWaiter ? "Update" : "Create"}
                  </button>

                  {!!selectedWaiter && (
                    <button
                      className={`cursor-pointer w-full bg-red-500 text-white rounded-md p-2 transition-all duration-300 hover:scale-105`}
                      type="button"
                      onClick={handleDeleteWaiter}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <button
                  className="cursor-pointer w-[80%] bg-rose-500 text-white rounded-md p-2 transition-all duration-300 hover:scale-105"
                  type="button"
                  onClick={() => setShouldShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </OverlayModal>
      )}
    </div>
  );
};
