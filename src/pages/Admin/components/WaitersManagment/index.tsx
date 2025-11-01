import { JSX, useContext, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { NewWaiter, Waiter } from "src/types";
import {
  useAddWaiter,
  useDeleteWaiter,
  useGetWaitersByPage,
  useUpdateWaiter,
} from "src/api/waiters";
import { Plus, X } from "lucide-react";
import { Table } from "src/components/Table";
import { OverlayModal } from "src/components/OverlayModal";
import { isValidEmail } from "src/utils/isValidEmail";
import { isValidPhoneNumber } from "src/utils/isValidPhoneNumber";
import { GlobalContext } from "src/contexts/contexts";
import { FormInput } from "src/components/FormInput";
import { useSearchParams } from "react-router-dom";
import { Search } from "src/components/Search";
import { WAITERS_GET_QUERY } from "src/api/constants";
import { useQueryClient } from "@tanstack/react-query";

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

const EMPTY_WAITER_VALUES: NewWaiter = {
  name: "",
  surname: "",
  email: "",
  phone_number: "",
  address: "",
};

export const WaitersManagment = (): JSX.Element => {
  const { setAlertProps } = useContext(GlobalContext);

  const [searchParams] = useSearchParams();

  const queryClient = useQueryClient();

  const {
    data: waitersData,
    isLoading: isLoadingWaiters,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useGetWaitersByPage();

  const waiters = useMemo(() => {
    const pageIndex = waitersData?.pages.findIndex(
      (page) => page.currentPageNumber === Number(searchParams.get("page") ?? 1)
    );
    return waitersData?.pages[pageIndex ?? 0]?.pageData ?? [];
  }, [waitersData, searchParams]);

  const pageCount = waitersData?.pages[0]?.totalPages ?? 0;

  const { mutateAsync: addWaiter } = useAddWaiter();

  const { mutateAsync: updateWaiter } = useUpdateWaiter();

  const { mutateAsync: deleteWaiter } = useDeleteWaiter();

  const [shouldShowModal, setShouldShowModal] = useState(false);

  const [newWaiter, setNewWaiter] = useState<NewWaiter>(EMPTY_WAITER_VALUES);

  const [waiterToEdit, setWaiterToEdit] = useState<Waiter | null>(null);

  const [originalWaiterToEdit, setOriginalWaiterToEdit] =
    useState<Waiter | null>(null);

  // check if waiter has changed to avoid PUT request if nothing has changed
  const isChangedWaiter =
    JSON.stringify(originalWaiterToEdit) !== JSON.stringify(waiterToEdit);

  const searchQuery = searchParams.get("search") ?? "";

  useEffect(() => {
    queryClient.removeQueries({ queryKey: [WAITERS_GET_QUERY] });
    queryClient.invalidateQueries({ queryKey: [WAITERS_GET_QUERY] });
  }, [searchQuery, queryClient]);

  const allFieldsAreFilled = Object.values(
    waiterToEdit ? waiterToEdit : newWaiter
  ).every(Boolean);

  const closeModal = () => {
    setShouldShowModal(false);
    setNewWaiter(EMPTY_WAITER_VALUES);
    setWaiterToEdit(null);
    setOriginalWaiterToEdit(null);
  };

  const handleCreateAndUpdateWaiter = async () => {
    if (!allFieldsAreFilled || (waiterToEdit && !isChangedWaiter)) return;

    if (!isValidEmail(waiterToEdit ? waiterToEdit.email : newWaiter.email)) {
      setAlertProps({
        text: "Invalid email",
        type: "error",
        position: "top",
      });
      return;
    }

    if (
      !isValidPhoneNumber(
        waiterToEdit ? waiterToEdit.phone_number : newWaiter.phone_number
      )
    ) {
      setAlertProps({
        text: "Invalid phone number",
        type: "error",
        position: "top",
      });

      return;
    }

    if (waiterToEdit) await updateWaiter(waiterToEdit);
    else await addWaiter(newWaiter);

    closeModal();
  };

  const handleDeleteWaiter = async () => {
    if (!waiterToEdit) return;

    await deleteWaiter(waiterToEdit.id);

    closeModal();
  };

  return (
    <div className="w-full px-3 sm:px-4 lg:px-7 pt-3 sm:pt-4">
      <div className="flex justify-between items-center flex-row h-[65px]">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide">
            Waiters
          </h2>

          <Search />
        </div>

        <button
          onClick={() => setShouldShowModal(true)}
          className="rounded-md cursor-pointer transition-all duration-300 hover:scale-115 mb-3 sm:mb-4"
        >
          <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      <Table
        data={waiters}
        columns={waitersColumns}
        isLoading={
          isLoadingWaiters || isFetchingNextPage || isFetchingPreviousPage
        }
        getClickedRow={(waiter) => {
          setOriginalWaiterToEdit(waiter);
          setWaiterToEdit(waiter);
          setShouldShowModal(true);
        }}
        pageCount={pageCount}
        fetchNextPage={() => {
          const nextPageIndex =
            (waitersData?.pages.findIndex(
              (page) =>
                page.currentPageNumber === Number(searchParams.get("page") ?? 1)
            ) ?? 0) + 1;

          if (waitersData?.pages?.[nextPageIndex]?.pageData?.length) return;

          fetchNextPage();
        }}
        fetchPreviousPage={() => {
          const previousPageIndex =
            (waitersData?.pages.findIndex(
              (page) =>
                page.currentPageNumber === Number(searchParams.get("page") ?? 1)
            ) ?? 0) - 1;

          if (waitersData?.pages?.[previousPageIndex]?.pageData?.length) return;

          fetchPreviousPage();
        }}
      />

      {shouldShowModal && (
        <OverlayModal onClose={closeModal}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-4 sm:p-6 rounded-[0px] sm:rounded-lg cursor-default w-full h-full sm:w-[90%] sm:h-[90%] md:w-[75%] lg:w-[60%] xl:w-[50%] max-w-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold tracking-wide mb-4">
                {waiterToEdit ? "Update Waiter" : "Create Waiter"}
              </h2>

              <button
                className="cursor-pointer mb-4 transition-all duration-300 hover:scale-115"
                onClick={closeModal}
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>

            <form className="flex flex-col justify-between min-h-[calc(100%-4rem)]">
              <div className="flex flex-col gap-3 sm:gap-4">
                <FormInput
                  label="name"
                  placeholder="Enter name"
                  value={waiterToEdit ? waiterToEdit.name : newWaiter.name}
                  onChange={({ target: { value } }) =>
                    waiterToEdit
                      ? setWaiterToEdit({ ...waiterToEdit, name: value })
                      : setNewWaiter({ ...newWaiter, name: value })
                  }
                  type="text"
                />
                <FormInput
                  label="surname"
                  placeholder="Enter surname"
                  value={
                    waiterToEdit ? waiterToEdit.surname : newWaiter.surname
                  }
                  onChange={({ target: { value } }) =>
                    waiterToEdit
                      ? setWaiterToEdit({ ...waiterToEdit, surname: value })
                      : setNewWaiter({ ...newWaiter, surname: value })
                  }
                  type="text"
                />
                <FormInput
                  label="email"
                  placeholder="Eg example@example.com"
                  value={waiterToEdit ? waiterToEdit.email : newWaiter.email}
                  onChange={({ target: { value } }) =>
                    waiterToEdit
                      ? setWaiterToEdit({ ...waiterToEdit, email: value })
                      : setNewWaiter({ ...newWaiter, email: value })
                  }
                  type="email"
                />
                <FormInput
                  label="phone_number"
                  placeholder="Eg +1 800 000000"
                  value={
                    waiterToEdit
                      ? waiterToEdit.phone_number
                      : newWaiter.phone_number
                  }
                  onChange={({ target: { value } }) =>
                    waiterToEdit
                      ? setWaiterToEdit({
                          ...waiterToEdit,
                          phone_number: value,
                        })
                      : setNewWaiter({ ...newWaiter, phone_number: value })
                  }
                  type="text"
                />
                <FormInput
                  label="address"
                  placeholder="Eg 123 Main St, New York, USA"
                  value={
                    waiterToEdit ? waiterToEdit.address : newWaiter.address
                  }
                  onChange={({ target: { value } }) =>
                    waiterToEdit
                      ? setWaiterToEdit({ ...waiterToEdit, address: value })
                      : setNewWaiter({ ...newWaiter, address: value })
                  }
                  type="text"
                />
              </div>

              <div className="flex items-center gap-3 sm:gap-2 w-full flex-col mt-4">
                <div className="flex items-center justify-center flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-[80%]">
                  <button
                    className={`${
                      allFieldsAreFilled && isChangedWaiter
                        ? "bg-violet-500 cursor-pointer transition-all duration-300 hover:scale-105"
                        : "bg-gray-500/50 cursor-not-allowed"
                    } w-full text-white rounded-md p-2 sm:p-2.5 text-sm sm:text-base`}
                    type="button"
                    onClick={handleCreateAndUpdateWaiter}
                  >
                    {waiterToEdit ? "Update" : "Create"}
                  </button>

                  {!!waiterToEdit && (
                    <button
                      className={`cursor-pointer w-full bg-red-500 text-white rounded-md p-2 sm:p-2.5 transition-all duration-300 hover:scale-105 text-sm sm:text-base`}
                      type="button"
                      onClick={handleDeleteWaiter}
                    >
                      Delete
                    </button>
                  )}
                </div>

                <button
                  className="cursor-pointer w-full sm:w-[80%] bg-rose-500 text-white rounded-md p-2 sm:p-2.5 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  type="button"
                  onClick={closeModal}
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
