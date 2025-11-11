"use client";
import { useForm } from "react-hook-form";
import { useToast } from "../../context/toast.context";

export function VoucherModal({ display, toggleModal, fetchAllVouchers }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { toast } = useToast();

  const handleVoucherCreation = async (data) => {
    // console.log(data);
    try {
      const voucherData = {
        ...data,
        type: 'voucher'
      };
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voucherData),
      });
      const responseData = await res.json();
      
      if (responseData.success) {
        toast({
          title: "Success",
          description: responseData.message,
          variant: "success",
        });
        toggleModal();
        reset();
        fetchAllVouchers();
      } else {
        toast({
          title: "Error",
          description: responseData.message,
        });
      }
    } catch (e) {
      // console.log(e);
      toast({
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  const openModal = () => {
    reset();
    toggleModal();
  };

  return (
    <div
      id="crud-modal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        display ? "flex" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-blur`}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Voucher</h3>
            <button
              onClick={openModal}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleVoucherCreation)} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Code
                </label>
                <input
                  {...register("voucher_code", { required: true })}
                  type="text"
                  name="voucher_code"
                  id="voucher_code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label htmlFor="gold_qty" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Gold Quantity
                </label>
                <input
                  {...register("gold_qty", {
                    required: "Enter Voucher gold quantity",
                  })}
                  type="text"
                  name="gold_qty"
                  id="gold_qty"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <svg
                className="me-1 -ms-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              Create Voucher
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
