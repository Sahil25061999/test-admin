"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useToast } from "../../context/toast.context";

export function OfferModal({ display, toggleModal, fetchAllOffers }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const { toast } = useToast();
  const [termsConditions, setTermsConditions] = useState([]);
  const [termInput, setTermInput] = useState("");

  const handleOfferCreation = async (data) => {
    setLoading(true);
    try {
      let dateSeleted = new Date(data.expiry_date);
      let date =
        dateSeleted.getFullYear() +
        "-" +
        ("0" + (dateSeleted.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + dateSeleted.getDate()).slice(-2) +
        " " +
        ("0" + dateSeleted.getHours()).slice(-2) +
        ":" +
        ("0" + dateSeleted.getMinutes()).slice(-2) +
        ":" +
        ("0" + dateSeleted.getSeconds()).slice(-2);

      // Include the terms and conditions list in the submission
      const offerData = {
        ...data,
        expiry_date: date,
        terms_and_conditions: termsConditions,
        type: 'offer'
      };

      // console.log(offerData);
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(offerData),
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
        setTermsConditions([]);
        fetchAllOffers();
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
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    reset();
    setTermsConditions([]);
    toggleModal();
  };

  const addTermsCondition = () => {
    if (termInput.trim()) {
      setTermsConditions([...termsConditions, termInput.trim()]);
      setTermInput("");
    }
  };

  const removeTerm = (index) => {
    const updatedTerms = [...termsConditions];
    updatedTerms.splice(index, 1);
    setTermsConditions(updatedTerms);
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
      <div className="relative p-4 w-full max-w-xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Offer</h3>
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
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(handleOfferCreation)} className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
              <div className="">
                <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Code
                </label>
                <input
                  {...register("code", { required: true })}
                  type="text"
                  name="code"
                  id="code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />
              </div>
              <div className="">
                <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Description
                </label>
                <textarea
                  {...register("description", { required: true })}
                  name="description"
                  id="description"
                  rows={2}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write description here"
                ></textarea>
              </div>

              <div className="">
                <label
                  htmlFor="minPurchasePrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Minimum Purchase price
                </label>
                <input
                  {...register("minimum_value", {
                    required: "Minimum value is required",
                  })}
                  type="number"
                  name="minimum_value"
                  id="minPurchasePrice"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />
                {errors.minimum_value && <p>{errors.minimum_value.message}</p>}
              </div>
              <div className="">
                <label
                  htmlFor="maxPurchasePrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Maximum Purchase Price
                </label>
                <input
                  type="number"
                  {...register("maximum_value", { required: true })}
                  name="maximum_value"
                  id="maxPurchasePrice"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />
              </div>
              <div className="">
                <label
                  htmlFor="minPurchasePrice"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Threshold
                </label>
                <input
                  {...register("threshold", {
                    required: "Minimum value is required",
                  })}
                  type="number"
                  name="threshold"
                  id="threshold"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Threshold value"
                />
                {errors.threshold && <p>{errors.threshold.message}</p>}
              </div>
              <div className=" sm:col-span-1">
                <label htmlFor="value" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Offer Value
                </label>
                <input
                  {...register("value", { required: "Enter offer value" })}
                  type="number"
                  name="value"
                  id="value"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                />
                <input
                  {...register("is_percentage")}
                  name="is_percentage"
                  className="mr-2"
                  id="percentage"
                  type="checkbox"
                />
                <label htmlFor="percentage">Is percentage ?</label>
              </div>
              <div className=" sm:col-span-1">
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Expiry Date
                </label>
                <input
                  {...register("expiry_date", { required: true })}
                  name="expiry_date"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  type="date"
                />
              </div>
              <div className="">
                <label htmlFor="extraGold" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Extra gold
                </label>
                <input
                  {...register("extra_gold")}
                  defaultValue={0}
                  type="text"
                  name="extra_gold"
                  id="extraGold"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />
              </div>
              <div className=" flex gap-2">
                <input {...register("redeem_gold")} id="redeem_gold" name="redeem_gold" type="checkbox" />
                <label htmlFor="redeem_gold" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Is Gold Redemption Offer ?
                </label>
              </div>
              <div className="col-span-full">
                <label htmlFor="terms" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Terms and conditions
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={termInput}
                    onChange={(e) => setTermInput(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Add term or condition"
                  />
                  <button
                    type="button"
                    onClick={addTermsCondition}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-r-lg text-sm px-4 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
                {termsConditions.length > 0 && (
                  <ul className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                    {termsConditions.map((term, index) => (
                      <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900 dark:text-white">{term}</span>
                        <button
                          type="button"
                          onClick={() => removeTerm(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button
              disabled={loading}
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
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {loading ?"Loading" :" Create Offer"}
             
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
