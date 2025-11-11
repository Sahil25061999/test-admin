"use client";

import { Table } from "antd";

import { useEffect, useState } from "react";
import { UpiUserSearch } from "../../../../components/index.component";
import { useToast } from "../../../../context/toast.context";
import { Modal } from "../../../../components/Modal/Modal";
import { useAuthAxios } from "../../../../hooks/useAuthAxios";

const columns = [
  {
    title: "Sr.No.",
    dataIndex: "id",
    key: "Sr.No.",
  },
  {
    title: "Upi/vpa",
    dataIndex: "upi_id",
    key: "Upi/vpa",
  },
  // {
  //   title: "Name",
  //   dataIndex: "name",
  //   key: "name",
  // },
  {
    title: "Unblock",
    dataIndex: "unblock",
    key: "Unblock",
    // render: item=>{
    //   return <Link href={`/users/${item.upi_number}`}><EyeIcon className="h-6 aspect-square"/></Link>
    // }
  },
];

export default function Page() {
  const [upi, setUpi] = useState("");
  const [isOpenBlockModal, setIsOpenBlockModal] = useState(false);
  const [isOpenUnblockModal, setIsOpenUnblockModal] = useState(false);

  const [unblockUpi, setUnblockUpi] = useState<string>("");
  const [data, setData] = useState([]);
  const { toast } = useToast();
  const apiInstance = useAuthAxios()

  const handleUnblockUpi = async () => {
    setIsOpenUnblockModal(() => false);
    try {
      const res = await apiInstance.delete(
        `admin/v1/upi/block?upi=${unblockUpi}`
      );
      if (res.data.success) {
        fetchBlockedUpiList();
      }
    } catch (e) {
      if (e?.response?.message) {
        toast({
          title: "Error",
          description: e.reponse.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    } finally {
      setUnblockUpi("");
    }
  };

  const blockUpi = async () => {
    setIsOpenBlockModal(() => false);
    try {
      const res = await apiInstance.post("admin/v1/upi/block", {
        upi: upi,
      });
      if (res.data.success) {
        fetchBlockedUpiList();
      }
    } catch (e) {
      if (e?.response?.data.error) {
        toast({
          title: "Error",
          description: e.response.data.error,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    } finally {
      setUpi("");
    }
  };

  const openConfirmationModal = async (e, cb) => {
    e?.preventDefault();
    // setUserDetails(upi);
    cb(() => true);
  };
  const handleSelect = (upi) => {
    setUnblockUpi(() => upi);
    openConfirmationModal(null, setIsOpenUnblockModal);
  };

  const closeModal = (cb) => {
    cb(() => false);
    setUpi("");
    setUnblockUpi("");
  };

  const fetchBlockedUpiList = async () => {
    try {
      const res = await apiInstance.get("admin/v1/upi/block");
      if (res.data.success) {
        setData(() => {
          return res?.data?.data.blocked_upis.map(
            (item: { upi_id: string }, index) => {
              return {
                key: index,
                ...item,
                unblock: (
                  <button
                    className=" border"
                    onClick={() => handleSelect(item.upi_id)}
                  >
                    Unblock
                  </button>
                ),
                // account_status: (
                //   <select
                //     value={item.account_status}
                //     style={{ background: "transparent" }}
                //     onChange={(e) => {
                //       handleSelect(e.target.value, item);
                //     }}
                //   >
                //     <option
                //       value={item.account_status}
                //       selected
                //       disabled
                //       hidden
                //     >
                //       {item.account_status}
                //     </option>
                //     {/* {item.status === "blocked" && ( */}
                //     <option className=" bg-black" value="active">Unblock</option>
                //     {/* )} */}
                //   </select>
                // ),
              };
            }
          );
        });
      }
    } catch (e) {
      if (e?.response?.message) {
        toast({
          title: "Error",
          description: e.reponse.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
  };

  useEffect(() => {
    fetchBlockedUpiList();
  }, []);

  return (
    <div>
      <UpiUserSearch
        placeholder={"Enter upi number"}
        input={upi}
        setInput={setUpi}
        handleSubmit={(e) => openConfirmationModal(e, setIsOpenBlockModal)}
      />
      <h1>Blocked Upis</h1>
      <section className="mt-4">
        <Table
          // className=""
          rootClassName={"table_paginator"}
          columns={columns}
          dataSource={data}
          // onChange={(pagination, filters) => {
          //   if (status.length == 0 && !filters?.Status) return;
          //   let existingStatus = status.sort();
          //   let newFilteredStatus = filters.Status?.sort();
          //   if (
          //     JSON.stringify(existingStatus) ===
          //     JSON.stringify(newFilteredStatus)
          //   )
          //     return;
          //   setStatus(() => (filters.Status ? filters.Status : []));
          //   console.log("page set");
          //   setCurrentPage(() => 1);
          //   setLimit(() => 10);
          // }}
          // pagination={{
          //   total: totalPages * limit,
          //   onChange(page, pageSize) {
          //     console.log("page set2");
          //     setCurrentPage(() => page);
          //     setLimit(() => pageSize);
          //   },
          // }}
        />
      </section>
      <Modal
        action={() => blockUpi()}
        question="Are you sure you want to block the user?"
        isOpen={isOpenBlockModal}
        closeModal={() => closeModal(setIsOpenBlockModal)}
      />
      <Modal
        action={() => handleUnblockUpi()}
        question="Are you sure you want to unblock the user?"
        isOpen={isOpenUnblockModal}
        closeModal={() => closeModal(setIsOpenUnblockModal)}
      />
    </div>
  );
}
